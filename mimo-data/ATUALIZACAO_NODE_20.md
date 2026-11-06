# Atualização do Mimo Data para Node.js 20.18

Este pacote é uma adaptação do projeto anterior. Você **não precisa atualizar o Node.js do computador**.

## Mudanças
- Next.js **15.5.29** (antes 16).
- Tailwind CSS **3.4.17** (antes 4); configuração CSS/PostCSS modificada.
- Renomeado `proxy.ts` para `middleware.ts`.
- As páginas, o Supabase, os formulários, o painel e a API foram mantidos.

## Como substituir a versão antiga no Windows

1. Pare o servidor (`Ctrl+C` no terminal do VS Code).
2. Renomeie a pasta atual de `mimo-data` para `mimo-data-backup`.
3. Extraia o novo ZIP na mesma pasta; abra `mimo-data` no VS Code.
4. Se já havia configurado o Supabase, copie apenas o `.env.local` da pasta de backup para a pasta nova.
5. No novo terminal, execute:

```powershell
node -v
npm install
npm run dev
```

6. Abra `http://localhost:3000/login` e `http://localhost:3000/demo`.

Não precisa recriar o banco do Supabase nem executar `schema.sql` novamente.

## Caso continue dando erro

No novo diretório, pare o servidor e execute:

```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm run dev
```

Se ainda ocorrer erro, envie a saída de `node -v`, `npm -v` e as primeiras linhas do erro exibido no terminal.

**Observação:** o pacote foi ajustado para compatibilidade declarada com Node 20.18, mas a instalação e compilação completas não puderam ser executadas neste ambiente sem acesso ao registro npm.
