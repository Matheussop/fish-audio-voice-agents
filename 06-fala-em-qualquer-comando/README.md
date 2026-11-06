# 06. Qualquer comando falando

Não precisa ser agente. O `fala-cmd.js` embrulha qualquer comando e avisa pelo código de saída:

```bash
node codigo/fala-cmd.js npm test
```

- Passou: "[excited] Os testes passaram."
- Quebrou: "[sighing][tired] Os testes quebraram."

Ele reconhece `test` e `build` no comando e usa uma frase genérica pro resto. Com `FALA_RESUMO=1`, o Claude Haiku resume as últimas linhas da saída em uma frase.

## Atalho no Windows

Coloque a pasta `codigo/` no PATH. Aí basta:

```bash
fala npm run build
```

Próximo passo: [`07-clonar-sua-voz`](../07-clonar-sua-voz).
