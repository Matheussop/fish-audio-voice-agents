# Fish Audio Voice Agents

Agentes de terminal com voz, usando a API da Fish Audio.

Tudo o que aparece no vídeo **"Dei voz pros meus agentes"** do canal [Kauã Miguel - Dev](https://www.youtube.com/@kc_1t), organizado na ordem do vídeo pra você montar o seu. No fim, o Claude Code, o Codex ou qualquer agente de terminal te chama em voz alta quando termina, quando quebra e quando precisa de você.

A voz vem da API da [Fish Audio](https://fish.audio/?fpr=wl1ol9), com o modelo **S2.1 Pro**, que está de graça na API até o fim de novembro de 2026.

## Mapa do vídeo

| Minuto | Capítulo | Pasta |
|---|---|---|
| 2:12 e 3:15 | Criando a chave da API e escolhendo a voz | [`01-chave-e-voz`](01-chave-e-voz) |
| 4:14 e 5:38 | A primeira fala pela API e as emotion tags | [`02-primeira-fala`](02-primeira-fala) |
| 6:34 | Hook do Claude Code falando | [`03-hook-claude-code`](03-hook-claude-code) |
| 6:34 | O mesmo hook no Codex | [`04-codex`](04-codex) |
| 9:12 | O agente escolhe a própria emoção | [`05-agente-escolhe-a-emocao`](05-agente-escolhe-a-emocao) |
| extra | Qualquer comando avisando se passou ou quebrou | [`06-fala-em-qualquer-comando`](06-fala-em-qualquer-comando) |
| 10:06 | Clonando a sua voz | [`07-clonar-sua-voz`](07-clonar-sua-voz) |
| 12:08 | MCP da Fish Audio no Claude Code | [`08-mcp`](08-mcp) |
| 13:14 e 15:00 | Quatro agentes falando e respondendo por voz no Alethe | [`09-quatro-agentes`](09-quatro-agentes) |
| 17:25 e 18:24 | Pontos de atenção, Drama 3 e preço | [`10-cuidados`](10-cuidados) |

Todo o código fica em [`codigo/`](codigo). As pastas numeradas explicam cada passo e guardam a configuração daquele passo.

## O que tem em `codigo/`

| Arquivo | O que faz |
|---|---|
| `fala.js` | Manda um texto pra API da Fish Audio e toca o áudio enquanto ele chega |
| `hook.js` | Hook do Claude Code e do Codex: pega a última resposta do agente e manda falar |
| `aviso.js` | Escolhe a frase (resposta, pedido de permissão ou "tô esperando você") e a voz de cada agente |
| `resumo.js` | Opcional: resume a resposta com o Claude Haiku antes de falar (`FALA_RESUMO=1`) |
| `fala-cmd.js` e `fala.cmd` | Roda qualquer comando e avisa em voz alta se passou ou quebrou (`fala npm test`) |
| `clonar.js` | Cria uma voz clonada pela API a partir de um áudio seu |
| `.env.example` | Modelo do `.env` com a chave e as vozes |

## Requisitos

- [Node.js](https://nodejs.org) 22 ou mais novo
- [FFmpeg](https://ffmpeg.org) no PATH (o `ffplay` toca o áudio)
- Uma conta na [Fish Audio](https://fish.audio/?fpr=wl1ol9)

## Começo rápido

```bash
git clone https://github.com/Kc1t/fish-audio-voice-agents
cd fish-audio-voice-agents/codigo
cp .env.example .env
# cole a sua chave em FISH_API_KEY no .env
node fala.js "Terminei a tarefa, pode conferir."
```

Se ouviu a voz, siga pra [`03-hook-claude-code`](03-hook-claude-code).
