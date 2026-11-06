# Atualização: QR Code para compartilhar formulários

Este pacote parte da versão do Mimo Data que funciona em **Node.js 20.18**, com Next.js 15 e Tailwind 3. A atualização não exige mudanças nas tabelas do Supabase.

## Novidades

1. O **painel de cada formulário publicado** exibe a seção **Compartilhar por QR Code**.
2. QR Code exclusivo por formulário, levando diretamente ao link `/f/slug`.
3. Botões **Baixar PNG**, **Copiar link** e **Abrir**.
4. Formulários em rascunho mostram um aviso para publicar antes de compartilhar.
5. A demonstração da Senhora Cookies em `/demo` inclui um QR de exemplo na aba **Painel da empresa**.
6. O QR é gerado no navegador por `qrcode.react@4.2.0`, sem enviar o link a serviços de geração externos.

## Como instalar sem perder a configuração que já funciona

### Opção A: pacote de atualização (mais seguro para o seu projeto atual)

1. **Faça backup da sua pasta** e, se usa Git, faça um commit antes de atualizar.
2. Pare o Next.js no terminal com `Ctrl+C`.
3. O QR Code já faz parte do pacote `mimo-data-completo.zip`. Para usar o projeto completo, extraia o arquivo. Se estiver aplicando somente a renomeação, o pacote `mimo-data-atualizacao-marca.zip` contém apenas arquivos de marca, não a implementação integral do QR Code.
4. Seu arquivo `.env.local` será preservado: ele **não é incluído no ZIP de atualização**.
5. No terminal da pasta do projeto, rode:

   ```powershell
   npm install
   npm run check
   npm run dev
   ```

6. Acesse `/dashboard`, abra uma empresa e um formulário existente, **publique e salve**. A seção de compartilhamento aparecerá acima do editor. Teste o PNG e o botão de copiar.
7. Para mandar as alterações à Vercel, faça `git add .`, `git commit -m "Adiciona QR Code aos formularios"` e `git push` no seu repositório já conectado. Teste o QR no domínio público após o deploy.

### Opção B: projeto completo

Se estiver começando do zero, extraia `mimo-data-completo.zip` e siga o README. Se já tem Supabase funcionando, mantenha o **seu próprio** `.env.local`, sem compartilhar as chaves.

## Muito importante: endereço do QR

- No computador, `http://localhost:3000` funciona só localmente. QR com endereço `localhost` **não abre no celular de outra pessoa**.
- Para uso real, **entre no painel pelo endereço público da Vercel** (ex.: `https://seusistema.vercel.app`), abra o formulário publicado e **gere/baixe o QR nesse endereço**.
- O QR incorpora o URL completo, incluindo o domínio. Se trocar de domínio depois, gere/imprima novos QR Codes ou configure redirecionamento do domínio antigo.
- O QR de `/demo` é só demonstrativo e não salva respostas no Supabase.

## Quais arquivos foram alterados

- `package.json`: adiciona `qrcode.react@4.2.0`.
- `components/ShareQRCode.tsx`: novo componente de QR Code e exportação PNG.
- `app/dashboard/formularios/[id]/page.tsx`: painel para compartilhar formulários publicados.
- `components/FormEditor.tsx`: atalho para seção do QR Code.
- `components/DemoExperience.tsx`: QR para a demonstração da Senhora Cookies.
- `README.md`: instruções da funcionalidade.
- `ATUALIZACAO_QRCODE.md`: este documento.

## Verificações

- Código de TypeScript/TSX passou por checagem de sintaxe (30 arquivos).
- Não foi possível baixar dependências do npm no ambiente em que o pacote foi preparado, então ainda é necessário executar `npm install`, `npm run check` e `npm run build` na sua máquina antes do deploy.
- Não existe mudança de schema SQL, API de respostas, autenticação ou variáveis de ambiente.
