# 02. A primeira fala

No vídeo: **4:14** (primeira fala) e **5:38** (emotion tags).

Dentro de `codigo/`:

```bash
node fala.js "Bom dia, mundo!"
```

O `fala.js` chama a API com o modelo `s2.1-pro-free` e toca o áudio pelo `ffplay` enquanto ele ainda está chegando. No terminal aparece quanto tempo levou até o primeiro pedaço de áudio.

## Emoção

Coloque a tag em inglês entre colchetes, no começo ou no meio da frase:

```bash
node fala.js "[excited] Os testes passaram de primeira! [sighing] Só que o build quebrou."
```

Funcionam bem: `[excited]`, `[calm]`, `[sighing]`, `[whispering]`, `[laughing]`, `[tired]`. Em português a tag funciona pior, então deixe ela em inglês mesmo com a frase em português.

Próximo passo: [`03-hook-claude-code`](../03-hook-claude-code).
