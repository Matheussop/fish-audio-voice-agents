import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

process.loadEnvFile(path.join(path.dirname(fileURLToPath(import.meta.url)), '.env'))

const [arquivo, nome = 'Minha voz'] = process.argv.slice(2)
const formulario = new FormData()
formulario.append('type', 'tts')
formulario.append('title', nome)
formulario.append('train_mode', 'fast')
formulario.append('visibility', 'private')
formulario.append('voices', new Blob([readFileSync(arquivo)]), path.basename(arquivo))

const resposta = await fetch('https://api.fish.audio/model', {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.FISH_API_KEY}` },
  body: formulario,
})
if (!resposta.ok) throw new Error(`Fish Audio respondeu ${resposta.status}: ${await resposta.text()}`)

const modelo = await resposta.json()
console.log(`ID da voz: ${modelo._id}`)
