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

// o Codex abre uma conversa interna para dar título à sessão e o notify dispara para ela também,
// com a resposta {"title":"..."}: não é um aviso para você
if (origem === 'codex' && ehTituloInterno(evento['last-assistant-message'])) process.exit(0)

function ehTituloInterno(texto) {
  try {
    const dado = JSON.parse(texto ?? '')
    return typeof dado === 'object' && dado !== null && 'title' in dado
  } catch {
    return false
  }
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
}

// o hook roda síncrono, então a fala sai em outro processo e o agente segue na hora
spawn(process.execPath, [path.join(pasta, 'aviso.js'), JSON.stringify(aviso)], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
}).unref()
