# Acompanhamento Pedagógico

Aplicativo para o professor registrar observações, notas e frequência, consultar por turma, aluno e período, e pedir ao Gemini uma leitura para revisar. A IA não grava nada sozinha e não altera nota nem frequência.

## O que permanece local

Não há login, banco compartilhado nem backup. Observações, notas, frequência, provas e pendências ficam no `localStorage` do navegador, na chave `acompanhamento-pedagogico-v1`. Trocar de navegador, aparelho ou limpar os dados do site apaga essa cópia. Não existe sincronização.

A sala inicial (7º A e 8º B, com alunos como Alice Moreira) é fictícia e marcada como demonstração. Um aluno incluído por você fica marcado como registro deste aparelho. O assistente recusa um pedido que misture os dois. Restaurar o exemplo recria só a sala fictícia e mantém alunos, observações, notas e frequência incluídos por você. Uma edição feita num aluno da demonstração volta ao exemplo.

Quem já usava o aplicativo continua com os registros: a abertura completa a origem que faltava, sem descartar o que estava salvo.

Isto não está pronto para dados reais de alunos num endereço público. A checagem de mesma origem impede um site vizinho de chamar o servidor, mas não identifica o professor e não substitui autenticação. Qualquer pessoa que abra o aplicativo neste navegador vê os registros. Uma etapa futura, ainda não implementada, precisa trazer login, autorização, banco e backup antes de uso institucional.

## Assistente e Gemini

As chamadas saem só do servidor, com o SDK `@google/genai`. O navegador envia o recorte do período, já separado por origem. Antes do pedido, o nome completo e cada parte com mais de duas letras são trocados por `[[A1]]`, sem diferenciar maiúsculas. Ids internos, como `att-alice-...`, não são enviados: a evidência citada usa `e1`, `e2` e só volta se o modelo repetir um desses ids. Registros fora do período pedido não entram no dossiê. Na organização, só o texto digitado é enviado.

O mascaramento não cobre apelido, erro de digitação, iniciais, nome de outra pessoa escrito no mesmo texto, nem palavra de uma ou duas letras. Turma e componente seguem por extenso.

O servidor não guarda o dossiê. Há um limite de 8 análises a cada 10 minutos por IP confiável (`x-real-ip`) e um teto de 40 na mesma janela para o processo. O contador fica na memória da instância: outro processo, um novo deploy ou uma instância fria começa do zero. Por isso o limite não é uma trava global e não é controle de acesso. O cabeçalho `x-forwarded-for` enviado pelo cliente não escolhe o endereço. O tempo máximo de uma chamada é 20 segundos.

Texto inválido, chave ausente, chave recusada, cota esgotada, tempo esgotado ou período sem registros devolve uma mensagem curta. A chave e o corpo do provedor não entram nessa mensagem. Sem `GEMINI_API_KEY`, nada é inventado no lugar da resposta.

Ações:

- Organizar observação: uma frase ou transcrição vira um texto objetivo, com categorias sugeridas.
- Gerar parecer: leitura individual do período, só se houver observação, nota ou frequência.
- Analisar evolução: compara o período escolhido com o anterior. Se um deles estiver vazio, isso é dito e nada é inventado.
- Sugerir intervenções: ideias práticas para o professor decidir. Não são decisão automática.

Fatos de média e frequência são calculados aqui. A leitura do modelo aparece separada e pode, ainda assim, escrever um número que não está nos fatos: o professor confere os dois. Só o botão "Salvar como observação" grava, e grava só o texto editado. Nota e frequência não são alteradas.

O modelo padrão é o alias `gemini-flash-latest`, substituível por `GEMINI_MODEL`. O formato pedido é JSON Schema via `responseJsonSchema` (`type`, `properties`, `required`, `additionalProperties`, `enum`). A documentação pública de modelos cita esse alias; a página específica do alias não existe e, neste ambiente, não houve chamada real para confirmar se o alias responde e aceita o esquema.

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

`GEMINI_MODEL` é opcional. Não use prefixo `VITE_`: isso publicaria o valor no navegador.

Na Vercel, em Project Settings → Environment Variables, crie `GEMINI_API_KEY` e, se quiser outro modelo, `GEMINI_MODEL`. Faça um novo deploy depois de salvar. O limite de uso da chave continua por instância.

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

O Google recebe o dossiê mascarado: turma, componente, período, fatos já calculados, evidências do período e, na organização, o texto digitado. Não recebe a chave de volta. A política e a retenção do provedor estão em [Gemini API terms](https://ai.google.dev/gemini-api/terms) e [Google Privacy Policy](https://policies.google.com/privacy). Este projeto não mantém cópia desse pedido no servidor.

## Limites

O modelo pode errar mesmo com o dossiê restrito. A leitura não é parecer oficial, diagnóstico nem causa. Se o período não tiver registros, a análise para e diz o que falta. Sem login e sem cópia fora do navegador, o aplicativo não serve para guarda institucional de dados reais.
