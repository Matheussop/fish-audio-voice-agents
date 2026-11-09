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
| `codex_notify.py` | Notify do Codex que chama o hook de voz e preserva o notify do Computer Use ([`04-codex`](04-codex)) |
| `.env.example` | Modelo do `.env` com a chave e as vozes (o `voz.env` manda sobre elas nos hooks) |

Fora de `codigo/`, na raiz, ficam dois arquivos locais que não vão para o Git: `voz.env`, com a voz dos hooks ([`01-chave-e-voz`](01-chave-e-voz)), e `silenciado`, criado quando a voz está silenciada.

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

## Voice-companion

Este fork também avisa o [voice-companion](https://github.com/Matheussop/voice-companion), um robô flutuante para macOS que mostra os avisos e leva você à sessão que espera resposta. Ele é opcional: com o app fechado, os avisos só falham em silêncio e a voz segue normal.

- O `aviso.js` manda a frase, a sessão, a pasta e o **app de origem** para `127.0.0.1:47321`. O `hook.js` descobre o app pelo `__CFBundleIdentifier` que o macOS passa aos processos (Warp, Claude desktop); o Codex desktop, dentro do app do ChatGPT, não passa essa variável e é reconhecido por `CODEX_INTERNAL_ORIGINATOR_OVERRIDE=Codex`.
- Em `UserPromptSubmit` e `SessionEnd`, o `hook.js` avisa que você respondeu, sem falar. No Claude Code, ele entra nesses dois eventos do `settings.json`; no Codex, no `hooks.json` ([`04-codex`](04-codex)).
- Se o arquivo `silenciado` existir na raiz, o `aviso.js` não fala. O conteúdo é até quando, em milissegundos desde 1970; vazio ou `0` vale até apagar o arquivo. O menu do voice-companion cria e apaga esse arquivo.
- Todo aviso e toda resposta detectada ficam em `~/Library/Logs/fish-audio-voice-agents.log`.

O chat normal do app do ChatGPT não tem hooks, então só as conversas do Codex dentro dele avisam.
