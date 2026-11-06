# 09. Quatro agentes, quatro vozes

No vídeo: **13:14** (quatro agentes falando) e **15:00** (respondendo por voz).

Aqui cada terminal é um agente dono de uma parte do projeto, cada um com a sua voz. Eles rodam lado a lado no [Alethe](https://github.com/Kc1t/alethe-agents), um app open source pra rodar agentes, que lê em voz alta a primeira frase de cada resposta e mostra quem está falando.

No vídeo o projeto é o [CanIRunAI](https://canirunai.kc1t.com). Os papéis em [`projeto/`](projeto) citam os arquivos dele: troque pelos caminhos do seu projeto.

## Os quatro terminais

| Terminal | CLI | Dono de | Voz usada no vídeo |
|---|---|---|---|
| Front | Claude Code | páginas, componentes, estilos, textos | `14caf3213e5a48148059562e7c2f9316` |
| Dados | Codex | dados, cálculo, tipos | `282a4701347a4639a7d945d05f6782ed` |
| Testes | Claude Code | testes e a suíte | `7f32055203e843e5be0943fb5e488a16` |
| Build | Codex | typecheck, lint e build | `1d8cb595b6284ff7aa7e8fec7b93249d` |

## Montar no seu projeto

1. Copie o conteúdo de [`projeto/`](projeto) pra raiz do seu projeto:
   - `.claude/agents/` com o Front e o Testes pro Claude Code;
   - `.claude/skills/` e `.agents/skills/` com o papel de cada um (o Claude Code lê a primeira, o Codex lê a segunda).
2. Troque `<seu nome>` pelo seu nome e os caminhos de arquivo pelos do seu projeto.
3. Abra os quatro terminais na pasta do projeto:
   - Front: `claude --agent front`
   - Testes: `claude --agent testes`
   - Dados: `codex` e comece o prompt com `$dados`
   - Build: `codex` e comece o prompt com `$build`
4. No Alethe, em Preferências, Integrações, Voz dos agentes: cole a chave da Fish Audio e escolha a voz de cada terminal.

Sem o Alethe, dá pra ter o mesmo efeito com o hook da pasta [`03`](../03-hook-claude-code), mudando a voz por projeto no `.env`.

## Os prompts do vídeo

```
/front Os aria-label de src/components/hardware-bar.tsx estão fixos em inglês. Passe todos para next-intl, com chaves novas nos dois arquivos de messages/, e confirme com tsc.
```

```
$dados Em src/lib/compatibility.ts, getDetailedCompatibility usa números soltos. Troque por constantes nomeadas no topo do arquivo, sem mudar nenhum resultado, e confirme com os testes.
```

```
/testes calculateScore, de src/lib/compatibility.ts, não tem teste nenhum. Crie src/lib/compatibility.test.ts cobrindo os casos principais e rode a suíte inteira.
```

```
$build Rode typecheck, lint e npm run build, nessa ordem, e me diga o resultado de cada um. Só corrija o que bloquear o build.
```

Dispare o Build por último, pra ele pegar o código já editado pelos outros.

## Respondendo por voz

No Alethe, com Responder por voz ligado, quando o agente termina de falar abre um balão que fica ouvindo por alguns segundos. O que você fala ali o app digita e envia naquele terminal. Deixe a sala em silêncio, porque o microfone manda qualquer som que pegar.

A resposta por voz digita texto, então não serve pra menu de permissão. Permissão é pelo teclado.

Próximo passo: [`10-cuidados`](../10-cuidados).
