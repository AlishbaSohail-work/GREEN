-- GREEN database. Supabase > SQL Editor > paste all > Run.
create table profiles(id uuid primary key references auth.users on delete cascade, data jsonb not null, updated_at timestamptz default now());
create table farms(id uuid primary key references auth.users on delete cascade, data jsonb not null, updated_at timestamptz default now());
create table bookings(id text primary key, user_id uuid not null references auth.users on delete cascade, data jsonb not null, created_at timestamptz default now());
create table providers(id bigserial primary key, type text not null check (type in ('m','w','t')), name text not null, name_ur text, rate numeric not null, note text, lat double precision, lon double precision, phone text, verified boolean default false, active boolean default true);
create table mandi_prices(mandi text not null, crop text not null, price_per_kg numeric not null, price_date date not null, source text, primary key (mandi, crop, price_date));
alter table profiles enable row level security; alter table farms enable row level security; alter table bookings enable row level security;
alter table providers enable row level security; alter table mandi_prices enable row level security;
create policy "own profile" on profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own farm" on farms for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own bookings" on bookings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "read providers" on providers for select using (active);
create policy "read prices" on mandi_prices for select using (true);
-- crop ids used by the app: wheat rice bajra cotton moong sarson maize barseem. mandi = exact name shown in the app, e.g. 'Rawalpindi Mandi'
-- example (replace with a real, sourced price): insert into mandi_prices values ('Rawalpindi Mandi','moong',0,'2026-11-14','your source');
-- example provider: insert into providers(type,name,rate,lat,lon,phone,verified) values ('m','Your Tractor Service',1200,33.60,73.05,'+92300XXXXXXX',true);
