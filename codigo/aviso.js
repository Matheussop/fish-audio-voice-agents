import { appendFileSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { falar } from './fala.js'
import { resumir } from './resumo.js'

const { origem, tipo, texto, sessao, cwd, app } = JSON.parse(process.argv[2])

// a voz fica num lugar só, ../voz.env (FISH_VOICE e, opcional, FISH_VOICE_CODEX), e vale para Claude e Codex.
// Ela manda sobre o .env (que é o do Hermes) e sobre o ambiente do hook
try {
  for (const linha of readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), '../voz.env'), 'utf8').split('\n')) {
    const [, chave, valor] = linha.match(/^\s*(FISH_VOICE(?:_CODEX)?)\s*=\s*([^\s#]+)/) ?? []
    if (chave) process.env[chave] = valor
  }
} catch {}

// o aviso roda desanexado e sem saída; o log mostra quando uma fala falhou
const LOG = path.join(os.homedir(), 'Library/Logs/fish-audio-voice-agents.log')
function registrar(linha) {
  try {
    appendFileSync(LOG, `${new Date().toISOString()} ${linha}\n`)
  } catch {}
}

// voz silenciada: o arquivo existe e guarda até quando (ms desde 1970); vazio ou 0 = até reativar.
// O menu do voice-companion liga e desliga; funciona mesmo com o app fechado.
const SILENCIO = path.join(os.homedir(), '.local/share/fish-audio-voice-agents/silenciado')
function silenciado() {
  try {
    const ate = Number(readFileSync(SILENCIO, 'utf8').trim())
    return !ate || Date.now() < ate
  } catch {
    return false
  }
}

// avisa o voice-companion (~/Documents/Projetos/voice-companion), se estiver aberto; só localhost
function companheiro(rota, dados) {
  return fetch(`http://127.0.0.1:47321/${rota}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
    signal: AbortSignal.timeout(500),
  }).catch(() => {})
}

function primeiraFrase(texto) {
  const limpo = texto.replace(/[`*#>_]/g, '').replace(/\s+/g, ' ').trim()
  const frase = limpo.match(/^.{1,200}?[.!?](\s|$)/)?.[0] ?? limpo.slice(0, 200)
  return frase.trim()
}

const fixas = {
  permissao: '[whispering] Preciso da sua permissão pra continuar.',
  esperando: '[calm] Tô esperando você.',
}

const frase =
  process.env.FALA_RESUMO === '1'
    ? resumir(texto, tipo === 'fim' ? 'o agente terminou a tarefa' : 'o agente precisa de permissão')
    : (fixas[tipo] ?? primeiraFrase(texto))

const voz = origem === 'codex' ? process.env.FISH_VOICE_CODEX || process.env.FISH_VOICE : process.env.FISH_VOICE
await companheiro('aviso', { origem, tipo, frase, sessao, cwd, app })
try {
  if (silenciado()) registrar(`silenciado ${origem} ${tipo}: ${frase.slice(0, 80)}`)
  else {
    await falar(frase, voz)
    registrar(`ok ${origem} ${tipo}: ${frase.slice(0, 80)}`)
  }
} catch (erro) {
  registrar(`ERRO ${origem} ${tipo}: ${erro.message}`)
} finally {
  await companheiro('fala-fim', { sessao })
}
