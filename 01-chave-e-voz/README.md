# 01. Chave da API e voz

No vídeo: **2:12** (chave) e **3:15** (voz).

## Chave

1. Entre em [fish.audio/app/api-keys](https://fish.audio/app/api-keys?fpr=wl1ol9) e crie uma chave.
2. Copie `codigo/.env.example` pra `codigo/.env`.
3. Cole a chave em `FISH_API_KEY=`.

Não deixe essa chave vazar: não commite o `.env` (ele já está no `.gitignore`) e não mostre a chave em gravação.

## Voz

1. Procure uma voz na biblioteca da [Fish Audio](https://fish.audio/?fpr=wl1ol9). Dá pra filtrar por idioma.
2. Abra a voz e copie o ID dela (o código no fim da URL).
3. Cole em `FISH_VOICE=` no `.env`.

Se quiser outra voz pro Codex, coloque em `FISH_VOICE_CODEX=`. Sem ela, o Codex usa a mesma do Claude Code.

Próximo passo: [`02-primeira-fala`](../02-primeira-fala).
