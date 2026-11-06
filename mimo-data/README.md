> **Atualização importante:** esta versão usa a logo oficial do Mimo Data e inclui contato final via **WhatsApp**. Se você já tinha um banco Supabase configurado antes desta versão, execute também o arquivo `supabase/migrations/20261106_add_business_whatsapp.sql`.

# Mimo Data — Hackathon UniSenac 2026

Plataforma multissetorial de **formulários personalizáveis** para micro e pequenos negócios, com exemplo da **Senhora Cookies**. Identidade do produto: **Mimo Data**.

## COMPATIBILIDADE COM NODE.JS 20.18

Esta edição corrige o erro `require() of ES Module ... magic-string ... @tailwindcss/node`, que vinha da instalação do Tailwind 4, e também troca Next.js 16 por Next.js 15 para usar a integração de middleware tradicional. **Seu Windows pode continuar com Node.js 20.18.0; não precisa atualizar o Node.**

### O que mudou no código

- Tailwind CSS 4 → **3.4.17**; retirado `@tailwindcss/postcss`.
- `@import "tailwindcss"` → `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;`.
- Configuração do PostCSS atualizada e novo `tailwind.config.cjs` para manter classes de estilo (incluindo espaçamentos da versão 4).
- Next.js 16 → **15.5.29**, com correções de segurança disponíveis na linha 15.5.
- `proxy.ts` → `middleware.ts`, compatível com Next.js 15.
- `package.json` agora aceita explicitamente Node.js **>= 20.18.0**.

### Procedimento no Windows / VS Code

**Para migrar uma instalação existente:** faça backup da pasta que funciona hoje e de seu `.env.local`. Extraia `mimo-data-completo.zip`, abra a pasta `mimo-data` e copie **somente o seu `.env.local`** para ela. Se tiver código personalizado, compare e mescle as alterações antes de substituir arquivos. O banco Supabase e as URLs dos formulários existentes permanecem os mesmos; **não execute o SQL novamente**. Para uma atualização menor, use `mimo-data-atualizacao-marca.zip`, aplicando os arquivos diretamente à raiz do projeto atual.

Abra a nova pasta no VS Code, vá a **Terminal → Novo Terminal** (PowerShell) e execute:

```powershell
node -v
# Deve aparecer v20.18.0 (ou outra versão compatível)
npm install
npm run dev
```

Acesse `http://localhost:3000/login` e `http://localhost:3000/demo`.

**Se preferir atualizar os arquivos na pasta antiga:** feche o servidor (`Ctrl+C`), copie os arquivos do ZIP sobre a pasta antiga, apague o `proxy.ts` antigo, e limpe as dependências da instalação anterior antes de reinstalar:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force proxy.ts -ErrorAction SilentlyContinue
npm install
npm run dev
```

**Diagnóstico:** se o erro mencionar novamente `@tailwindcss/node`, o projeto ainda está usando dependências do Tailwind 4; confirme que `package.json` diz `"tailwindcss": "3.4.17"`, que **não há** `@tailwindcss/postcss` e que as dependências foram reinstaladas. Confira também a versão com `node -v`.

> Testes: os arquivos foram inspecionados e as configurações revisadas, mas não foi possível baixar dependências npm neste ambiente. Não foi realizado um `npm run build` com Node 20.18 ou teste online no Supabase/Vercel. Teste localmente antes de publicar.

---

## O que está implementado

- Página inicial responsiva e demonstração interativa em `/demo`, que **não exige Supabase**.
- Arquivo `visualizacao_rapida.html` para abrir com dois cliques, sem Node.js ou internet (somente simulação local).
- Cadastro/login de responsáveis com **Supabase Auth** (e-mail e senha).
- Vários negócios por conta; cada negócio cria seus próprios formulários.
- Editor de formulários com perguntas de **texto**, **telefone** e **seleção**, campos obrigatórios e temas de cores.
- Fluxo **rascunho → publicado** e link público `/f/slug-do-formulario`.
- **QR Code exclusivo para cada formulário publicado**, gerado no painel, com botões para baixar imagem PNG e copiar o link. A demonstração da Senhora Cookies também exibe um QR de exemplo.
- API própria (Next.js Route Handlers / Vercel Functions) para gravar respostas, criar empresas, criar/editar formulários, listar formulários e excluir respostas.
- Painel privado de respostas e exportação de até 200 respostas por formulário em CSV.
- Modelo PostgreSQL com **Row Level Security (RLS)** que restringe dados de empresas e respostas ao respectivo proprietário.
- Checkbox separado para consentimento opcional de marketing.

> **O modo `/demo` é uma simulação no navegador:** começa com 3 respostas fictícias; outras respostas são guardadas apenas no estado da página, sem persistência. Para gravar dados de verdade, configure Supabase e crie a empresa/formulário autenticado.

## Tecnologias

Next.js 15.5.29 (App Router), React 19, TypeScript, Tailwind CSS 3.4.17, Supabase (Auth + PostgreSQL/RLS), Zod, Vercel Functions e `qrcode.react` 4.2.0.

## 1. Requisitos

- Node.js **20.18.0 ou superior**. Esta versão foi adaptada especificamente para Node.js 20.18, sem exigir Node 22/24. Para publicar, configure na Vercel uma versão suportada por ela.
- Conta Supabase e projeto PostgreSQL criado.
- Conta Vercel para hospedagem.

## 2. Supabase — preparar o banco

1. Crie um projeto no [Supabase](https://supabase.com/).
2. Abra **SQL Editor** e execute o conteúdo completo de `supabase/schema.sql`.
3. Em **Authentication → Providers → Email**, habilite o provedor de e-mail. Decida se haverá confirmação por e-mail. Se estiver habilitada, configure um servidor de e-mail adequado para uso real.
4. Em **Authentication → URL Configuration**, defina **Site URL** como seu domínio publicado (ou `http://localhost:3000` no desenvolvimento) e adicione as URLs de redirecionamento `http://localhost:3000/auth/callback` e `https://SEU-DOMINIO.vercel.app/auth/callback`.
5. Acesse **Project Settings → API / Connect** e copie **Project URL**, **publishable key** (`sb_publishable_...`, ou a chave pública `anon` legada, quando aplicável) e uma chave **secret/service_role**. **A chave secreta é privilegiada e nunca deve aparecer no frontend ou em repositórios.**

## 3. Executar localmente

```bash
npm install
# No Windows (PowerShell), para criar o arquivo de configuração:
Copy-Item .env.example .env.local
```

No Linux/macOS, use `cp .env.example .env.local` em vez de `Copy-Item`. **Se você já tem um `.env.local` configurado, não o substitua.**

Edite `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_SUA_CHAVE
SUPABASE_SERVICE_ROLE_KEY=SUA_CHAVE_PRIVILEGIADA_APENAS_NO_SERVIDOR
```

Inicie:

```bash
npm run dev
```

Abra `http://localhost:3000`. Para uma prévia imediata sem instalar dependências, abra `visualizacao_rapida.html` no navegador; ela não usa a API nem salva dados no Supabase.

- `http://localhost:3000/demo` — simulação sem conexão com banco.
- `http://localhost:3000/login` — cadastro/login verdadeiro.
- `http://localhost:3000/dashboard` — painel autenticado para criar empresas.

### Fluxo de teste com banco real

1. Cadastre-se/entre em `/login` (confirme o e-mail se necessário).
2. Crie o negócio **Senhora Cookies** em `/dashboard`.
3. Crie um formulário em `/dashboard/empresa/ID`. O sistema sugere campos de nome, sobrenome, telefone e sabor quando o nome da empresa contém *cookie*.
4. Abra o formulário criado; marque **Publicar formulário** e **Salvar alterações**.
5. Na página do formulário publicado, encontre o painel **Compartilhar por QR Code**: baixe o PNG, copie o link e abra o QR a partir de um segundo aparelho (use a versão publicada, pois `localhost` só funciona no próprio computador).
6. Clique em **Abrir**, preencha o formulário público e envie.
7. Volte ao painel do formulário e veja a resposta; experimente **Exportar CSV**.
8. Cadastre um segundo negócio para verificar que os formulários e respostas ficam separados.

## NOVO: Compartilhamento de formulários por QR Code

- No painel de cada formulário, **publique e salve** o formulário. O QR Code é exibido automaticamente em **Compartilhar por QR Code**. Enquanto estiver como rascunho, o QR não aparece.
- Clique em **Baixar PNG** para imprimir/colocar em embalagens, ou em **Copiar link** para compartilhar digitalmente.
- O QR aponta para a URL pública exata do formulário e é criado inteiramente no navegador com `qrcode.react`; não utiliza serviço externo de QR nem exige novas tabelas no Supabase.
- **Importante:** o QR sempre usa o endereço em que o painel está aberto. `http://localhost:3000` não funciona em outros dispositivos; faça login pelo domínio definitivo do site na **Vercel** e baixe o código por lá.
- Se você **trocar o domínio** depois de imprimir os códigos, gere novos QR Codes no novo domínio ou configure redirecionamento do domínio anterior. Um PNG antigo não muda sozinho.
- Em `/demo`, a área "Painel da empresa" exibe um QR ilustrativo que aponta para `/demo` (não registra dados reais).

### Instalação sobre uma versão já funcionando

Faça backup do projeto e do `.env.local`. Use o pacote completo `mimo-data-completo.zip` para nova instalação ou `mimo-data-atualizacao-marca.zip` para aplicar somente a troca de marca no projeto que já funciona. **Não substitua seu `.env.local`, não execute o SQL outra vez e não apague os dados do Supabase.** Consulte `RENOMEACAO_MIMO_DATA.md` para detalhes.

No terminal, dentro da pasta correta:

```bash
npm install
npm run check
npm run dev
```

**Se já publicou na Vercel:** envie as mudanças para o mesmo repositório GitHub e aguarde o deploy. Nenhuma variável nova é necessária. Teste usando o link público depois da publicação.

## 4. Publicar na Vercel

1. Suba **somente o código** para um repositório GitHub (sem `.env.local`).
2. Na [Vercel](https://vercel.com/), importe o repositório.
3. Framework: **Next.js** (detectado automaticamente); build: `npm run build`.
4. Configure as **três variáveis de ambiente** acima em **Project Settings → Environment Variables**, incluindo produção (e preview, se necessário). A terceira é secreta, nunca use `NEXT_PUBLIC_` nela.
5. Faça o deploy e configure a URL de retorno no painel de autenticação do Supabase, como descrito na etapa 2.
6. Teste primeiro em domínio de preview com um projeto de teste; então publique.

A Vercel hospedará páginas e a API própria. O Supabase hospeda Auth e PostgreSQL separadamente. **Deploy automático em sua conta não foi realizado** neste pacote, pois as credenciais pessoais não estão disponíveis.

## 5. Endpoints principais

| Método | Endpoint | Autorização | Descrição |
|---|---|---|---|
| GET | `/api/health` | Pública | Status/configuração |
| POST | `/api/empresas` | Conta autenticada | Cadastrar empresa |
| GET | `/api/formularios?empresa=UUID` | Conta autenticada / RLS | Listar formulários acessíveis |
| POST | `/api/formularios` | Proprietário | Criar formulário como rascunho |
| PATCH | `/api/formularios/UUID` | Proprietário | Editar e publicar/despublicar formulário |
| POST | `/api/respostas` | Pública, validação no servidor | Salvar resposta de formulário publicado |
| DELETE | `/api/respostas/UUID` | Proprietário | Excluir resposta |

Exemplo de payload enviado pelo formulário público:

```json
{
  "form_id": "UUID_DO_FORMULARIO",
  "answers": {
    "nome": "Ana",
    "sobrenome": "Silva",
    "telefone": "(51) 99999-9999",
    "sabor": "Chocolate"
  },
  "privacy_accepted": true,
  "marketing_opt_in": false,
  "website": ""
}
```

Na publicação, as perguntas são configuráveis (a chave de cada pergunta fica registrada na configuração `fields`).

## 6. Segurança e LGPD: antes de utilizar comercialmente

Este código é um **MVP para hackathon**, não um sistema auditado para produção. Para operar com clientes reais:

- **Implemente rate limiting compartilhado, CAPTCHA/Turnstile e monitoramento** nas rotas públicas; o honeypot e as validações existentes são proteção inicial, não substituem controles antiabuso.
- Tenha uma **Política de Privacidade própria por empresa** (finalidade, contato do responsável, retenção, base legal, eliminação, direitos dos titulares). Personalize os avisos genéricos do formulário; o checkbox incluído não substitui a análise jurídica da LGPD.
- Proteja a chave secreta do Supabase, reveja logs, faça backups, valide as configurações de autenticação e teste as políticas RLS.
- Defina limitação e exclusão de dados e revisão periódica de acesso. Existe exclusão manual de respostas, mas ainda não há um fluxo automatizado de solicitações dos titulares.
- **Evite comercializar no plano Hobby da Vercel** sem consultar seus termos; confirme limites, custos e requisitos atuais.
- A listagem do painel foi limitada às **200 respostas mais recentes**; implemente paginação para maior volume.
- Não foi criada nenhuma funcionalidade de envio automático de WhatsApp, campanha de anúncios, pagamento ou análise com IA — isso seria uma segunda fase.

## 7. Estrutura resumida

```text
app/
  page.tsx                     página inicial
  demo/page.tsx                demonstração sem banco
  login/page.tsx               autenticação
  dashboard/...                gestão das empresas e formulários
  f/[slug]/page.tsx            formulário público
  api/...                      endpoints da API própria
  auth/callback/route.ts       confirmação de e-mail
components/                    componentes de interface
lib/supabase/                  clientes público, sessão e admin
lib/schemas.ts                 validação de dados
supabase/schema.sql            tabelas, índices e políticas RLS
middleware.ts                  atualização de sessão SSR
```

## 8. Validação

É possível analisar o código e testar o modo demonstrativo. Para compilar e validar integralmente as integrações é necessário executar `npm install` e configurar o Supabase. O pacote foi gerado sem acesso ao registro do npm neste ambiente e, portanto, **a compilação e o deploy reais não puderam ser confirmados aqui**.

## Documentação de referência

- [Supabase — auth com SSR e Next.js](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs)
- [Supabase — Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Vercel — ambientes e variáveis](https://vercel.com/docs/deployments/environments)
