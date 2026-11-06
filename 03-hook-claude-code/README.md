# 03. Hook do Claude Code

No vídeo: **6:34**.

O Claude Code roda um comando seu em certos eventos. Aqui entram dois:

- `Stop`: o agente terminou. O `hook.js` pega a última resposta e fala a primeira frase.
- `Notification`: o agente precisa de você. Ele fala "Preciso da sua permissão pra continuar" sussurrando, ou "Tô esperando você" quando ficou parado.

## Ligar

1. Copie o conteúdo de [`settings.json`](settings.json) pro `.claude/settings.json` do seu projeto (ou pro `~/.claude/settings.json`, pra valer em todos).
2. Troque `C:/caminho/para/fish-audio-voice-agents` pelo caminho onde você clonou este repositório.
3. Abra o Claude Code e peça qualquer coisa. Quando ele terminar, você ouve.

## Como funciona

- O hook roda de forma síncrona, então o `hook.js` solta a fala num processo separado e sai na hora. O agente não fica esperando o áudio.
- Com `FALA_RESUMO=1` no `.env`, o `resumo.js` resume a resposta com o Claude Haiku (`claude -p --model haiku`) antes de falar, sem disparar o hook de novo.
- Falar toda resposta vira barulho rápido. A pasta [`05-agente-escolhe-a-emocao`](../05-agente-escolhe-a-emocao) faz o agente abrir a resposta com uma frase curta, que é a que vai pra voz.

Próximo passo: [`04-codex`](../04-codex).
