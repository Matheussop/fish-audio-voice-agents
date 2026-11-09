import { spawn } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// se o hook quebrar antes de chamar o aviso, fica registrado no mesmo log do aviso.js
process.on('uncaughtException', (erro) => {
  try {
    appendFileSync(path.join(os.homedir(), 'Library/Logs/fish-audio-voice-agents.log'), `${new Date().toISOString()} ERRO hook: ${erro.message}\n`)
  } catch {}
  process.exit(0)
})

if (process.env.FALA_DENTRO) process.exit(0)
// no Alethe o plugin de voz já fala o fim de cada vez; FALA_HOOKS_NO_ALETHE=1 liga os hooks mesmo assim
if (process.env.ALETHE_PLANNER && process.env.FALA_HOOKS_NO_ALETHE !== '1') process.exit(0)

const pasta = path.dirname(fileURLToPath(import.meta.url))
const origem = process.argv[2] ?? 'claude'
// o notify do Codex manda o JSON como argumento; os hooks (Claude Code e hooks.json do Codex) mandam pelo stdin
const evento = process.argv[3] ? JSON.parse(process.argv[3]) : JSON.parse(readFileSync(0, 'utf8'))

// o Codex abre conversas internas (título da sessão, sugestões, exclusões) e o notify dispara para elas também,
// com uma resposta só em JSON, como {"title":"..."} ou {"exclude":[]}: não é um aviso para você
if (origem === 'codex' && ehConversaInterna(evento['last-assistant-message'])) process.exit(0)

function ehConversaInterna(texto) {
  try {
    const dado = JSON.parse(texto ?? '')
    return typeof dado === 'object' && dado !== null
  } catch {
    return false
  }
}

// app que roda a sessão, para o voice-companion saber se você está nele e para onde levar no clique.
// O macOS passa __CFBundleIdentifier aos processos abertos por um app (Warp, Claude desktop);
// o Codex desktop (ChatGPT.app) não passa, mas marca o ambiente com CODEX_INTERNAL_ORIGINATOR_OVERRIDE
function appDeOrigem() {
  if (process.env.CODEX_INTERNAL_ORIGINATOR_OVERRIDE === 'Codex' || process.env.CODEX_APP_RUNTIME_CLI_PATH) return 'com.openai.codex'
  return process.env.__CFBundleIdentifier ?? ''
}

// você respondeu pelo terminal (ou a sessão acabou): o voice-companion tira a sessão da fila, sem fala
if (['UserPromptSubmit', 'SessionEnd'].includes(evento.hook_event_name)) {
  appendFileSync(path.join(os.homedir(), 'Library/Logs/fish-audio-voice-agents.log'), `${new Date().toISOString()} respondeu ${evento.hook_event_name} ${evento.session_id}\n`)
  await fetch('http://127.0.0.1:47321/respondeu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessao: evento.session_id }),
    signal: AbortSignal.timeout(300),
  }).catch(() => {})
  process.exit(0)
}

function ultimaRespostaDoClaude(transcript) {
  if (!transcript || !existsSync(transcript)) return ''
  const linhas = readFileSync(transcript, 'utf8').trim().split('\n').reverse()
  for (const linha of linhas) {
    const item = JSON.parse(linha)
    if (item.type !== 'assistant') continue
    const texto = item.message.content.filter((parte) => parte.type === 'text').map((parte) => parte.text).join(' ')
    if (texto) return texto
  }
  return ''
}

const aviso = {
  ...(origem === 'codex'
    ? { origem, tipo: 'fim', texto: evento['last-assistant-message'] ?? '' }
    : evento.hook_event_name === 'Notification'
      ? { origem, tipo: evento.notification_type === 'idle_prompt' ? 'esperando' : 'permissao', texto: evento.message ?? '' }
      : { origem, tipo: 'fim', texto: evento.last_assistant_message ?? ultimaRespostaDoClaude(evento.transcript_path) }),
  // para o voice-companion saber a qual sessão responder
  sessao: origem === 'codex' ? evento['thread-id'] : evento.session_id,
  cwd: evento.cwd,
  app: appDeOrigem(),
}

// o hook roda síncrono, então a fala sai em outro processo e o agente segue na hora
spawn(process.execPath, [path.join(pasta, 'aviso.js'), JSON.stringify(aviso)], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
}).unref()
