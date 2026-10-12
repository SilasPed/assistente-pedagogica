# Acompanhamento Pedagógico

Aplicativo para o professor registrar observações, notas e frequência, consultar por turma, aluno e período, e pedir ao Gemini uma leitura para revisar. Os registros ficam neste aparelho. A IA não grava nada sozinha.

## O que permanece local

Não há login nem banco compartilhado. Observações, notas, frequência, provas e pendências ficam no `localStorage` do navegador, na chave `acompanhamento-pedagogico-v1`.

A sala inicial (7º A e 8º B) é fictícia e marcada como demonstração. Um aluno incluído por você fica marcado como registro deste aparelho. O assistente recusa um pedido que misture os dois. Restaurar o exemplo apaga o que está neste aparelho e recria só a sala fictícia.

Quem já usava o aplicativo continua com os registros: a abertura completa a origem que faltava, sem descartar o que estava salvo.

## Assistente e Gemini

As chamadas saem só do servidor, com o SDK `@google/genai`. O navegador envia o recorte já filtrado da turma e do aluno. Antes do pedido, o nome é trocado por `[[A1]]` e volta só na resposta mostrada ao professor.

O servidor não guarda o dossiê. Há um limite de 8 análises a cada 10 minutos por endereço e um tempo máximo de 20 segundos. Texto inválido, chave ausente, chave recusada, cota esgotada ou período sem registros devolve uma mensagem curta. A chave e o corpo do provedor não entram nessa mensagem.

Ações:

- Organizar observação: uma frase ou transcrição vira um texto objetivo, com categorias sugeridas.
- Gerar parecer: leitura individual do período, só se houver observação, nota ou frequência.
- Analisar evolução: compara o período escolhido com o anterior. Se um deles estiver vazio, isso é dito e nada é inventado.
- Sugerir intervenções: ideias práticas para o professor decidir. Não são decisão automática.

Fatos de média e frequência são calculados aqui. A leitura do modelo aparece separada. O professor edita o rascunho e só então salva uma observação ou exporta um `.txt`. Nota e frequência não são alteradas pelo assistente.

Sem `GEMINI_API_KEY`, o botão informa que o assistente não está configurado. Não há texto fixo no lugar da resposta do modelo.

## Configuração

```bash
npm install
cp .env.example .env
```

No `.env` local, que não deve ser commitado:

```
GEMINI_API_KEY=sua-chave
GEMINI_MODEL=gemini-flash-latest
```

`GEMINI_MODEL` é opcional. O padrão é `gemini-flash-latest`. Não use prefixo `VITE_`: isso publicaria o valor no navegador.

Na Vercel, em Project Settings → Environment Variables, crie `GEMINI_API_KEY` e, se quiser outro modelo, `GEMINI_MODEL`. Faça um novo deploy depois de salvar.

## Executar

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

O desenvolvimento escuta em `http://127.0.0.1:8080`.

## Privacidade

O Google recebe o dossiê mascarado: turma, componente, período, fatos já calculados, evidências e, na organização, o texto digitado. Não recebe a chave de volta, nem credenciais. A política e a retenção do provedor estão em [Gemini API terms](https://ai.google.dev/gemini-api/terms) e [Google Privacy Policy](https://policies.google.com/privacy). Este projeto não mantém cópia desse pedido no servidor.

Isto não é um sistema de vários professores. Enquanto não houver login, não coloque dados reais de estudantes em um endereço público: qualquer pessoa com o aparelho vê o que está no navegador, e o endpoint do assistente atende a mesma origem do aplicativo.

## Limites

O modelo pode errar mesmo com o dossiê restrito. A leitura não é parecer oficial, diagnóstico nem causa. Se o período não tiver registros, a análise para e diz o que falta.
