-- Execute este SQL se você já criou o banco em uma versão anterior do Mimo Data.
-- Ele adiciona o WhatsApp da empresa sem apagar dados existentes.

alter table public.businesses
  add column if not exists whatsapp text;

alter table public.businesses
  drop constraint if exists businesses_whatsapp_check;

alter table public.businesses
  add constraint businesses_whatsapp_check
  check (whatsapp is null or whatsapp ~ '^[+0-9() .-]{10,25}$');
