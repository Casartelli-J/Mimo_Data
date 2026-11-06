# Mimo Data — aplicação da nova identidade visual

Esta atualização renomeia a identidade anterior para **Mimo Data** nas telas, títulos, metadados, demonstração offline, README e nome do pacote npm. **O QR Code, as rotas públicas (`/f/[slug]`), a API e as tabelas do Supabase não foram alterados.** O projeto continua usando Next.js 15, Tailwind 3 e Node.js 20.18 ou superior.

## Instalação recomendada — já tenho o projeto funcionando

1. Pare o servidor (`Ctrl + C`) e salve uma cópia da pasta atual e do arquivo `.env.local` em local seguro.
2. Baixe e extraia **`mimo-data-atualizacao-marca.zip`**. O ZIP contém caminhos como `components/Header.tsx` e `app/layout.tsx`: **copie o conteúdo para a raiz da pasta do projeto** (onde fica `package.json`), aceitando substituir os arquivos que coincidirem.
3. Mantenha **seu arquivo `.env.local`**. Não envie esse arquivo ao GitHub, não recrie o Supabase e não execute o SQL novamente.
4. Se quiser, renomeie a pasta local para `mimo-data`. Isso não muda automaticamente o nome do repositório GitHub nem do projeto Vercel.
5. Abra a pasta no VS Code e execute:

```powershell
npm install
npm run check
npm run build
npm run dev
```

6. Confira a marca Mimo Data em `/`, `/login`, `/demo`, nos formulários públicos, no rodapé e em `visualizacao_rapida.html`.

## Instalação alternativa — pacote completo

Extraia **`mimo-data-completo.zip`** e abra a pasta `mimo-data`. Se já utilizava Supabase, copie o seu `.env.local` anterior. Se você fez alterações próprias no código, **não sobrescreva sem comparar**. O ZIP não contém credenciais, `node_modules` ou dados do banco.

## Publicar atualização na Vercel

Depois dos testes locais, na pasta que estiver conectada ao GitHub:

```bash
git status
git add .
git commit -m "Renomeia marca para Mimo Data"
git push
```

A Vercel deverá gerar novo deploy se o repositório estiver conectado. **Trocar os textos no código não renomeia o domínio** (`*.vercel.app`), o projeto Vercel ou o repositório. Essas mudanças, se desejadas, devem ser feitas separadamente nos respectivos painéis.

**Atenção aos QR Codes:** enquanto o domínio público permanecer o mesmo, os QR Codes já impressos continuam apontando ao mesmo endereço. Se trocar o domínio, gere novos QR Codes ou configure redirecionamento do domínio antigo. Ajuste também as URLs de redirecionamento em **Supabase → Authentication → URL Configuration**.

## Verificações

- Identidade visual: **Mimo Data** em todas as telas.
- Nome técnico do pacote npm: `mimo-data` (sem espaços, exigência do npm).
- QR Code, API, Supabase e formulários: sem mudanças funcionais.
- JavaScript/TypeScript: teste com `npm run check` e `npm run build` na sua máquina antes do deploy.
