-- Execute no SQL Editor do Supabase uma vez, em um projeto novo.
-- Todas as tabelas têm RLS, isolando o acesso dos responsáveis por empresa.
create extension if not exists pgcrypto;

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.forms (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  slug text not null unique,
  title text not null,
  brand_name text not null,
  description text not null default '',
  theme text not null default 'caramelo' check (theme in ('caramelo','verde','azul','rosa')),
  fields jsonb not null default '[]'::jsonb check (jsonb_typeof(fields) = 'array'),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  privacy_accepted boolean not null check (privacy_accepted = true),
  marketing_opt_in boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists businesses_owner_idx on public.businesses(owner_id);
create index if not exists forms_business_idx on public.forms(business_id);
create index if not exists submissions_form_created_idx on public.submissions(form_id, created_at desc);

alter table public.businesses enable row level security;
alter table public.forms enable row level security;
alter table public.submissions enable row level security;

-- Explicita permissões. Sem escrita anônima direta: o POST público passa pela API validada.
revoke all on public.businesses from anon, authenticated;
revoke all on public.forms from anon, authenticated;
revoke all on public.submissions from anon, authenticated;
grant select, insert, update, delete on public.businesses to authenticated;
grant select, insert, update, delete on public.forms to authenticated;
grant select on public.forms to anon;
grant select, delete on public.submissions to authenticated;

create policy "dono_ve_empresas" on public.businesses for select to authenticated
  using (owner_id = (select auth.uid()));
create policy "dono_cria_empresas" on public.businesses for insert to authenticated
  with check (owner_id = (select auth.uid()));
create policy "dono_edita_empresas" on public.businesses for update to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy "dono_apaga_empresas" on public.businesses for delete to authenticated
  using (owner_id = (select auth.uid()));

-- O conteúdo de formulários publicados é público, não suas respostas.
create policy "publico_ve_formularios_publicados" on public.forms for select to anon, authenticated
  using (published = true);
create policy "dono_ve_formularios" on public.forms for select to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));
create policy "dono_cria_formularios" on public.forms for insert to authenticated
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));
create policy "dono_edita_formularios" on public.forms for update to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));
create policy "dono_apaga_formularios" on public.forms for delete to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.owner_id = (select auth.uid())));

create policy "dono_ve_respostas" on public.submissions for select to authenticated
  using (exists (
    select 1 from public.forms f join public.businesses b on b.id = f.business_id
    where f.id = form_id and b.owner_id = (select auth.uid())
  ));
create policy "dono_apaga_respostas" on public.submissions for delete to authenticated
  using (exists (
    select 1 from public.forms f join public.businesses b on b.id = f.business_id
    where f.id = form_id and b.owner_id = (select auth.uid())
  ));

-- As inserções públicas de respostas são feitas exclusivamente pela API do servidor,
-- com SUPABASE_SERVICE_ROLE_KEY e validações estritas; NUNCA expor essa chave no navegador.
