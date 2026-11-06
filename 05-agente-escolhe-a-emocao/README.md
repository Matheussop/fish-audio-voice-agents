# 05. O agente escolhe a própria emoção

No vídeo: **9:12**.

Sem regra, o agente responde com parágrafos que não fazem sentido em voz alta. Com estas regras, toda resposta começa com uma tag de emoção e uma frase curta, e é só essa frase que vai pra voz:

```
[excited] Ei, Kauã, os rótulos das barras já estão traduzidos e o tsc passou limpo.
[sighing] Ei, Kauã, um teste tá quebrando, aquele da demo. Quer que eu apague?
```

1. Copie [`CLAUDE.md`](CLAUDE.md) (Claude Code) ou [`AGENTS.md`](AGENTS.md) (Codex, OpenCode e outros) pra raiz do seu projeto. Se o projeto já tem um, cole o conteúdo no fim dele.
2. Troque `<seu nome>` pelo seu nome.

Quem decide se a frase sai `[excited]`, `[calm]`, `[sighing]` ou `[whispering]` é o próprio agente, pelo resultado do que ele fez.

Próximo passo: [`06-fala-em-qualquer-comando`](../06-fala-em-qualquer-comando).
