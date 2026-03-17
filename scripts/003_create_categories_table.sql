-- ============================================================
-- Supabase 'categories' table for O&O dynamic catalog
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

create table if not exists categories (
  id          text primary key,
  name        text not null,
  description text
);

-- Enable Row-Level Security (read-only for anon)
alter table categories enable row level security;

create policy "Allow public read access on categories"
  on categories
  for select
  using (true);
