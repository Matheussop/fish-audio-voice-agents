# 04. Codex

O mesmo `hook.js` serve pro Codex, pelo `notify`.

1. Copie a linha de [`config.toml`](config.toml) pro seu `~/.codex/config.toml`.
2. Troque o caminho pelo caminho deste repositório.

O `notify` do Codex só dispara no fim do turno. Por isso o aviso de permissão por voz é só no Claude Code.

## Com o Computer Use do Codex instalado (macOS)

O Codex aceita um comando só em `notify`, e o Computer Use ocupa esse lugar com o cliente dele, passando o notify anterior em `--previous-notify`. Para ter os dois, aponte o `--previous-notify` para o [`codigo/codex_notify.py`](../codigo/codex_notify.py), que chama o hook de voz e o cliente do Computer Use:

```toml
notify = ["/Users/<você>/.codex/computer-use/Codex Computer Use.app/Contents/SharedSupport/SkyComputerUseClient.app/Contents/MacOS/SkyComputerUseClient", "turn-ended", "--previous-notify", "[\"/usr/bin/python3\",\"/caminho/para/fish-audio-voice-agents/codigo/codex_notify.py\"]"]
```

Sem o Computer Use, o `codex_notify.py` também funciona sozinho no `notify`.

## Conversas internas

O Codex abre conversas internas (título da sessão, sugestões, exclusões) e o `notify` dispara para elas também. A resposta delas é só um objeto JSON, como `{"title": ...}` ou `{"exclude": []}`, e o `hook.js` ignora esse tipo de resposta.

## Hooks do Codex (opcional, para o voice-companion)

Para o [voice-companion](../README.md#voice-companion) saber quando você respondeu, o mesmo `hook.js` entra em `UserPromptSubmit` e `SessionEnd` no `~/.codex/hooks.json`:

```json
{ "hooks": [{ "type": "command", "command": "node /caminho/para/fish-audio-voice-agents/codigo/hook.js codex", "timeout": 5 }] }
```

Os hooks novos precisam ser aprovados no próprio Codex.

Próximo passo: [`05-agente-escolhe-a-emocao`](../05-agente-escolhe-a-emocao).
