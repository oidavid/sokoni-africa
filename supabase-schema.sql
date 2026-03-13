-- Sokoni Africa — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor

-- ─── Merchants (store owners) ──────────────────────────────────────
create table merchants (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique,
  phone text unique not null,           -- Nigerian number e.g. +2348012345678
  business_name text not null,
  slug text unique not null,            -- URL slug e.g. "mama-grace-fabrics"
  category text,                        -- fashion, food, electronics, etc.
  location text,                        -- Lagos, Abuja, etc.
  whatsapp_number text,
  description text,
  language text default 'pid',          -- 'en' or 'pid' (Pidgin)
  is_active boolean default true,
  plan text default 'free'              -- 'free', 'managed_setup', 'managed_monthly'
);

-- ─── Products ──────────────────────────────────────────────────────
create table products (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  merchant_id uuid references merchants(id) on delete cascade,
  name text not null,
  description text,
  price integer not null,               -- Price in kobo (₦100 = 10000 kobo) for precision
  price_display text,                   -- "₦8,500" pre-formatted
  image_url text,
  category text,
  in_stock boolean default true,
  sort_order integer default 0,
  ai_generated_description boolean default false
);

-- ─── Orders ────────────────────────────────────────────────────────
create table orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  merchant_id uuid references merchants(id),
  order_number text unique not null,    -- e.g. "ORD-0047"
  customer_name text,
  customer_phone text not null,         -- WhatsApp number
  customer_address text,
  items jsonb not null,                 -- [{ product_id, name, price, qty }]
  subtotal integer not null,            -- in kobo
  payment_method text default 'tbd',   -- bank_transfer, opay, palmpay, cod
  payment_status text default 'pending', -- pending, paid, cod
  status text default 'new',            -- new, confirmed, ready, dispatched, delivered, cancelled
  notes text,
  source text default 'whatsapp'        -- whatsapp, web
);

-- ─── Managed Service Enquiries ─────────────────────────────────────
create table managed_enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  business_type text,
  location text,
  plan text not null,                   -- 'setup' (₦25k) or 'monthly' (₦15k/mo)
  status text default 'new',            -- new, contacted, converted, lost
  notes text
);

-- ─── Row Level Security ────────────────────────────────────────────
alter table merchants enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Merchants can only see their own data
create policy "merchants_own_data" on merchants for all using (phone = current_user);
create policy "products_own_data" on products for all using (
  merchant_id = (select id from merchants where phone = current_user)
);
create policy "orders_own_data" on orders for all using (
  merchant_id = (select id from merchants where phone = current_user)
);

-- Public can read products and merchant info (for storefront)
create policy "public_read_products" on products for select using (true);
create policy "public_read_merchants" on merchants for select using (is_active = true);

-- ─── Indexes ───────────────────────────────────────────────────────
create index on merchants(slug);
create index on products(merchant_id);
create index on products(merchant_id, in_stock);
create index on orders(merchant_id, created_at desc);
create index on orders(customer_phone);
