# Atualização: logo oficial + contato via WhatsApp

Esta atualização do **Mimo Data** adiciona:

1. **Logo oficial enviada pelo grupo** no site e no painel.
2. **Somente o “M” da logo** nos formulários públicos.
3. **Contato final via WhatsApp** ao concluir um formulário publicado.
4. **Campo de WhatsApp da empresa** no cadastro e na edição da empresa.

## Se você já tinha um banco Supabase configurado

Execute este SQL no **Supabase SQL Editor**:

Arquivo:

`supabase/migrations/20261106_add_business_whatsapp.sql`

Ele adiciona a coluna `whatsapp` à tabela `businesses` sem apagar os dados existentes.

## Como testar

1. Acesse o painel.
2. Entre em uma empresa e confirme o número de WhatsApp.
3. Publique um formulário.
4. Abra o formulário público.
5. Envie uma resposta.
6. Após finalizar, o sistema abrirá o link `wa.me` da empresa em uma nova aba.

## Observação importante

Para o QR Code e o link do WhatsApp funcionarem em celulares de outras pessoas, o teste ideal deve ser feito no domínio publicado na **Vercel**.
