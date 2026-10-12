# Acompanhamento Pedagógico

Aplicativo para o professor entrar na própria conta, registrar observações, notas e frequência, consultar por turma, aluno e período, exportar um parecer individual em Word e pedir ao Gemini uma leitura para revisar. A IA não grava nada sozinha e não altera nota nem frequência.

## Versão de teste

A faixa fixa no topo diz que esta publicação é de teste e não deve receber aluno real. O servidor recusa gravar registro de origem local: só a sala fictícia é aceita. Incluir aluno, importar a cópia antiga do navegador e restaurar um JSON estão desligados. Criar a conta e gerar o parecer de um aluno da sala fictícia continuam disponíveis.

## O que já estava no código

`better-auth`, `pg` e `kysely` já vinham instalados. Não foi adicionado Supabase nem um segundo login.

Até esta etapa a autenticação estava desligada: `.grok/app-env.json` tinha `VITE_AUTH_ENABLED` igual a `false` e `deploy.database` igual a `false`. Sem a chave `false`, o Better Auth que já existia em `src/lib/auth` passa a valer. `kysely` continua só como adaptador dessa sessão. Os registros da sala usam o SQL de `src/lib/db.ts` (`pg` quando existe `DATABASE_URL`, PGLite em memória quando não existe).

## Conta e banco

O professor entra com e-mail e senha (mínimo de 8 caracteres) ou com Google e X, os métodos já ligados pelo Better Auth. Cada chamada que lê ou grava a sala exige sessão. O `user_id` vem dessa sessão, nunca de um campo enviado pelo navegador.

Há duas tabelas próprias, além do esquema do Better Auth:

- `ped_workspace`: um JSON com turmas, alunos, observações, notas, frequência, provas e pendências daquele professor.
- `teacher_profile`: nome e local usados no parecer. Começam vazios. O aplicativo não inventa cidade.

A sala fictícia só entra se o professor tocar em “Carregar sala fictícia” ou em “Restaurar exemplo”. O exemplo continua marcado como demonstração. Aluno incluído pelo professor fica como registro da conta.

Se este navegador ainda tiver a chave antiga `acompanhamento-pedagogico-v1`, aparece um aviso. A cópia só substitui a conta se o professor confirmar. Depois de gravar, a chave é apagada. “Agora não” deixa a chave onde está.

Trocar de professor limpa a tela antes de abrir a outra conta. Um teste automatizado grava dois professores num Postgres embutido e confere que um não lê o documento do outro. Isso não exercita o Neon de produção.

Na pré-visualização o banco é PGLite em memória: reiniciar o processo apaga contas e registros. No endereço publicado, `DATABASE_URL` aponta para o Postgres (Neon) injetado na publicação. Não houve teste de backup pontual desse Postgres, nem de restauração. A cópia JSON em Turmas é um arquivo que o professor baixa e guarda. Não é backup do servidor.

O parecer em Word também é um arquivo local. A pré-visualização é editável. Baixar não altera as observações salvas.

## Parecer em Word

Em Consultar, com um aluno escolhido, “Parecer em Word” monta o documento a partir das observações, notas e frequência daquele período. O cabeçalho é `ESCOLA CIDADÃ INTEGRAL TÉCNICA ERENICE CAVALCANTE FIDELES`. O quadro traz estudante, turma, componente, professor e período.

As seções saem só do que está registrado:

- participação → aspectos comunicativos
- comportamento → aspectos emocionais e comportamentais
- evolução → avanços observados
- observação geral → observação geral
- dificuldades com leitura, escrita ou concentração → o item correspondente
- outras dificuldades → outros registros
- causa só se o texto tiver “porque”, “devido”, “motivo” ou “causa”
- intervenção e estratégia só se o texto nomear isso

Sem registro, a seção fica `Não observado no período`. Média e frequência são contas feitas aqui, em separado, e não são tratadas como causa. Texto fora do período não entra. Nome e local do professor ficam em branco até alguém preencher. A data é a data do documento.

## Assistente e Gemini

As chamadas saem só do servidor, com o SDK `@google/genai`, e agora exigem a sessão do professor. O navegador envia o recorte do período, já separado por origem. Antes do pedido, o nome completo e cada parte com mais de duas letras são trocados por `[[A1]]`, sem diferenciar maiúsculas. Ids internos não são enviados: a evidência citada usa `e1`, `e2`. Registros fora do período pedido não entram no dossiê. Na organização, só o texto digitado é enviado.

O mascaramento não cobre apelido, erro de digitação, iniciais, nome de outra pessoa escrito no mesmo texto, nem palavra de uma ou duas letras. Turma e componente seguem por extenso.

O servidor não guarda o dossiê do Gemini. Há um limite de 8 análises a cada 10 minutos por IP confiável (`x-real-ip`) e um teto de 40 na mesma janela para o processo. O contador fica na memória da instância: outro processo começa do zero. Não é trava global nem controle de acesso. O tempo máximo de uma chamada é 45 segundos. A função na Vercel fica com 60 segundos para essa espera caber.

Texto inválido, chave ausente, chave recusada, cota esgotada, tempo esgotado ou período sem registros devolve uma mensagem curta. A chave e o corpo do provedor não entram nessa mensagem. Sem `GEMINI_API_KEY`, nada é inventado no lugar da resposta.

Ações: organizar observação, gerar parecer para revisar, analisar evolução, sugerir intervenções. Fatos de média e frequência são calculados aqui. A leitura do modelo pode, ainda assim, escrever um número que não está nos fatos. Só “Salvar como observação” grava, e grava só o texto editado.

O primeiro modelo é `gemini-2.5-flash`, com raciocínio desligado (`thinkingBudget` 0) e até 8192 tokens de saída. Se esse id responder 404, 400 ou texto vazio, a mesma análise tenta `gemini-flash-latest` com nível de raciocínio baixo. O alias sozinho, com teto de 1200 tokens e 20 segundos, estourava o tempo na organização e devolvia texto vazio no parecer e na evolução, porque o raciocínio padrão consumia a saída. Outro nome em `GEMINI_MODEL` é respeitado, sem essa troca.

## Configuração

Não commite um `.env` com segredo.

Gemini, só no servidor (sem prefixo `VITE_`):

```
GEMINI_API_KEY=sua-chave
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL` é opcional. Na Vercel, em Project Settings → Environment Variables, crie `GEMINI_API_KEY` e, se quiser, `GEMINI_MODEL`, e publique de novo.

Banco e sessão no endereço publicado: a plataforma injeta `DATABASE_URL` e os segredos do Better Auth quando o banco da publicação está ligado. Não copie esses valores para o frontend. Não há variável `VITE_` de autenticação para ligar: a ausência de `VITE_AUTH_ENABLED=false` é o que liga o login.

Na pré-visualização incorporada, o cookie pode não permanecer. Google ou X abrem o fluxo que guarda a sessão. E-mail e senha funcionam melhor quando o aplicativo é a janela principal, não um quadro embutido. Isso não foi revalidado com um navegador externo nesta entrega.

## Executar

```bash
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

## Privacidade

O Google recebe o dossiê mascarado quando o professor pede uma leitura: turma, componente, período, fatos já calculados, evidências do período e, na organização, o texto digitado. A política do provedor está em [Gemini API terms](https://ai.google.dev/gemini-api/terms) e [Google Privacy Policy](https://policies.google.com/privacy). Este projeto não guarda cópia desse pedido.

Os registros da sala ficam no Postgres da conta. Quem não entrou não recebe o JSON. Isso não substitui política da escola, termo de uso nem backup testado.

## Limites

O modelo pode errar. A leitura da IA e o Word editado pelo professor não são diagnóstico. Sem registro, o texto diz o que falta.

O teste de isolamento usa Postgres embutido no processo do teste. Não foi testado backup nem restauração do Neon. A pré-visualização perde o banco ao reiniciar. O limite do Gemini continua por instância. A chave Gemini não foi chamada de verdade aqui.
