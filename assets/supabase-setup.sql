-- 在 Supabase → SQL Editor 中整段执行

create table if not exists public.repayments (
  row_index integer primary key,
  period integer not null,
  pay_date text not null,
  total numeric not null,
  principal numeric not null,
  interest numeric not null,
  penalty numeric not null default 0,
  rate numeric null
);

create index if not exists repayments_period_idx on public.repayments (period);

alter table public.repayments enable row level security;

-- 个人自用：允许匿名密钥读写（不要把 anon key 公开到不可信场合）
drop policy if exists "repayments_anon_all" on public.repayments;
create policy "repayments_anon_all"
  on public.repayments
  for all
  to anon, authenticated
  using (true)
  with check (true);
