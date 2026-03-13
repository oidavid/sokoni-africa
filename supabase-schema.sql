-- Sokoni Africa — Supabase Database Schema v2
-- Run this in: Supabase Dashboard → SQL Editor

-- ─── Merchants (store owners) ──────────────────────────────────────
create table if not exists merchants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique,
  phone text unique not null,
  business_name text not null,
  slug text unique not null,
  category text,
  location text,
  address text,
  whatsapp_number text,
  description text,
  language text default 'pid',
  is_active boolean default true,
  plan text default 'free',
  logo_url text,
  theme_color text default '#1A7A4A'
);

-- ─── Products ──────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  merchant_id uuid references merchants(id) on delete cascade,
  name text not null,
  description text,
  price integer not null,
  price_display text,
  image_url text,
  category text,
  in_stock boolean default true,
  sort_order integer default 0,
  ai_generated_description boolean default false
);

-- ─── Orders ────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  merchant_id uuid references merchants(id),
  order_number text unique not null,
  customer_name text,
  customer_phone text not null,
  customer_address text,
  items jsonb not null,
  subtotal integer not null,
  payment_method text default 'tbd',
  payment_status text default 'pending',
  status text default 'new',
  notes text,
  source text default 'whatsapp'
);

-- ─── Managed Service Enquiries ─────────────────────────────────────
create table if not exists managed_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  business_type text,
  location text,
  plan text not null,
  status text default 'new',
  notes text
);

-- ─── Row Level Security ────────────────────────────────────────────
alter table merchants enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Public can read active merchants and products (for storefronts)
drop policy if exists "public_read_merchants" on merchants;
drop policy if exists "public_read_products" on products;
create policy "public_read_merchants" on merchants for select using (is_active = true);
create policy "public_read_products" on products for select using (true);

-- Anyone can insert a new merchant (sign up)
drop policy if exists "public_insert_merchants" on merchants;
create policy "public_insert_merchants" on merchants for insert with check (true);

-- Anyone can insert products (for now — auth added later)
drop policy if exists "public_insert_products" on products;
create policy "public_insert_products" on products for insert with check (true);

-- Anyone can insert orders
drop policy if exists "public_insert_orders" on orders;
create policy "public_insert_orders" on orders for insert with check (true);

-- ─── Indexes ───────────────────────────────────────────────────────
create index if not exists idx_merchants_slug on merchants(slug);
create index if not exists idx_products_merchant on products(merchant_id);
create index if not exists idx_orders_merchant on orders(merchant_id, created_at desc);
