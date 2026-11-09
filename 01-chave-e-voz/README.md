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
3. Cole em `FISH_VOICE=` no `voz.env`, na raiz do repositório (crie o arquivo se não existir):

```
FISH_VOICE=id-da-voz
# FISH_VOICE_CODEX=id-de-outra-voz
```

Se quiser outra voz pro Codex, coloque em `FISH_VOICE_CODEX=`. Sem ela, o Codex usa a mesma do Claude Code.

O `voz.env` é o lugar único da voz dos hooks: o `aviso.js` lê o arquivo a cada aviso e ele manda sobre o `.env` e sobre um `FISH_VOICE` passado no comando do hook. Trocar a voz vale no próximo aviso, sem reabrir as sessões. O `FISH_VOICE` do `.env` continua valendo para quem chama o `fala.js` direto. O `voz.env` fica fora do Git.

Próximo passo: [`02-primeira-fala`](../02-primeira-fala).
