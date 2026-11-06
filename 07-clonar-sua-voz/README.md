# 07. Clonar a sua voz

No vídeo: **10:06**.

## Pelo site

1. Entre em [fish.audio/app/voice-cloning](https://fish.audio/app/voice-cloning?fpr=wl1ol9).
2. Grave ou suba de 10 segundos a 1 minuto da sua voz, num lugar silencioso.
3. Crie a voz e copie o ID dela pro `FISH_VOICE` do `.env`.

No plano grátis a voz clonada precisa ser pública.

## Pela API

```bash
cd codigo
node clonar.js minha-voz.m4a "Minha voz"
```

O script cria a voz como privada e imprime o ID. Criar voz pela API pede crédito na conta.

Próximo passo: [`08-mcp`](../08-mcp).
