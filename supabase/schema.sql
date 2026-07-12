create type estado_lote as enum ('disponible', 'vendido', 'reservado', 'no_disponible');
create type tipo_pago as enum ('contado', 'credito', 'ambos');
create type tipo_via as enum ('calle', 'avenida', 'entrada', 'pasaje');

create table lotes (
  id uuid primary key default gen_random_uuid(),
  numero text not null,
  manzana text,
  estado estado_lote not null default 'disponible',
  tipo_pago tipo_pago not null default 'ambos',
  precio_contado numeric,
  precio_credito numeric,
  frente_m numeric,
  fondo_m numeric,
  lateral_izq_m numeric,
  lateral_der_m numeric,
  area_m2 numeric,
  calle_frontal text,
  colindancia_n text,
  colindancia_s text,
  colindancia_e text,
  colindancia_o text,
  enganche_min numeric,
  plazo_meses integer,
  notas text,
  geometria jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table calles (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ancho_m numeric,
  tipo tipo_via not null default 'calle',
  geometria jsonb not null default '{}'::jsonb
);

create table compradores (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  nombre text not null,
  telefono text,
  correo text,
  tipo_pago tipo_pago,
  monto_pagado numeric,
  enganche numeric,
  plazo_meses integer,
  fecha_venta date,
  notas text,
  created_at timestamptz default now()
);

create table historial_lotes (
  id uuid primary key default gen_random_uuid(),
  lote_id uuid references lotes(id) on delete cascade,
  campo text not null,
  valor_anterior text,
  valor_nuevo text,
  admin_email text,
  fecha timestamptz default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger lotes_updated_at
  before update on lotes
  for each row execute function set_updated_at();

alter table lotes enable row level security;
alter table calles enable row level security;
alter table compradores enable row level security;
alter table historial_lotes enable row level security;

create policy "lotes lectura publica" on lotes for select using (true);
create policy "calles lectura publica" on calles for select using (true);
create policy "lotes escritura admin" on lotes for all using (auth.role() = 'authenticated');
create policy "calles escritura admin" on calles for all using (auth.role() = 'authenticated');
create policy "compradores solo admin" on compradores for all using (auth.role() = 'authenticated');
create policy "historial solo admin" on historial_lotes for all using (auth.role() = 'authenticated');

insert into calles (nombre, ancho_m, tipo, geometria) values
('Calle Principal', 8, 'calle',   '{"x": 20, "y": 330, "width": 960, "height": 50, "orientacion": "h"}'),
('Avenida Central', 10, 'avenida','{"x": 470, "y": 20, "width": 60, "height": 660, "orientacion": "v"}'),
('Entrada Norte', 12, 'entrada',  '{"x": 470, "y": 0, "width": 60, "height": 20, "orientacion": "v"}');

insert into lotes (numero, manzana, estado, tipo_pago, precio_contado, precio_credito, frente_m, fondo_m, area_m2, calle_frontal, enganche_min, plazo_meses, geometria) values
('A-01','A','disponible','ambos',   9000, 10800, 12, 18, 216, 'Calle Norte', 1500, 36, '{"x":40,"y":40,"width":90,"height":140}'),
('A-02','A','vendido',   'contado', 8500, null,  10, 18, 180, 'Calle Norte', null, null, '{"x":130,"y":40,"width":80,"height":140}'),
('A-03','A','disponible','ambos',  10500, 12600, 13, 18, 234, 'Calle Norte', 1800, 36, '{"x":210,"y":40,"width":100,"height":140}'),
('A-04','A','reservado', 'credito', 8500, 10200, 10, 18, 180, 'Calle Norte', 1500, 24, '{"x":310,"y":40,"width":80,"height":140}'),
('A-05','A','disponible','ambos',   8500, 10200, 10, 18, 180, 'Calle Norte', 1500, 36, '{"x":390,"y":40,"width":80,"height":140}'),
('A-06','A','disponible','ambos',  11000, 13200, 14, 18, 252, 'Calle Principal', 2000, 36, '{"x":40,"y":180,"width":110,"height":140}'),
('A-07','A','vendido',   'credito', 9500, 11400, 12, 18, 216, 'Calle Principal', null, null, '{"x":150,"y":180,"width":90,"height":140}'),
('A-08','A','disponible','ambos',  11000, 13200, 14, 18, 252, 'Calle Principal', 2000, 36, '{"x":240,"y":180,"width":110,"height":140}'),
('A-09','A','disponible','contado',12000, null,  15, 18, 270, 'Calle Principal', null, null, '{"x":350,"y":180,"width":120,"height":140}'),
('B-01','B','disponible','ambos',  10000, 12000, 13, 18, 234, 'Calle Norte', 1800, 36, '{"x":530,"y":40,"width":100,"height":140}'),
('B-02','B','reservado', 'ambos',   9200, 11000, 11, 18, 198, 'Calle Norte', 1600, 36, '{"x":630,"y":40,"width":90,"height":140}'),
('B-03','B','disponible','ambos',  10800, 13000, 14, 18, 252, 'Calle Norte', 1900, 36, '{"x":720,"y":40,"width":110,"height":140}'),
('B-04','B','vendido',   'contado',13000, null,  16, 18, 288, 'Calle Norte esquina', null, null, '{"x":830,"y":40,"width":130,"height":140}'),
('B-05','B','disponible','ambos',  11800, 14200, 15, 18, 270, 'Calle Principal', 2100, 36, '{"x":530,"y":180,"width":120,"height":140}'),
('B-06','B','disponible','ambos',  10000, 12000, 13, 18, 234, 'Calle Principal', 1800, 36, '{"x":650,"y":180,"width":100,"height":140}'),
('B-07','B','vendido',   'credito',10000, 12000, 13, 18, 234, 'Calle Principal', null, null, '{"x":750,"y":180,"width":100,"height":140}'),
('B-08','B','disponible','ambos',  11000, 13200, 14, 18, 252, 'Calle Principal esquina', 2000, 36, '{"x":850,"y":180,"width":110,"height":140}'),
('C-01','C','disponible','ambos',   9800, 11800, 12, 17, 204, 'Calle Principal', 1700, 36, '{"x":40,"y":390,"width":100,"height":130}'),
('C-02','C','disponible','ambos',   9000, 10800, 11, 17, 187, 'Calle Principal', 1600, 36, '{"x":140,"y":390,"width":90,"height":130}'),
('C-03','C','reservado', 'credito',10500, 12600, 13, 17, 221, 'Calle Principal', 1800, 24, '{"x":230,"y":390,"width":110,"height":130}'),
('C-04','C','disponible','ambos',  12500, 15000, 16, 17, 272, 'Calle Principal esquina', 2200, 36, '{"x":340,"y":390,"width":130,"height":130}'),
('C-05','C','disponible','ambos',  13500, 16200, 17, 17, 289, 'Calle Sur', 2400, 36, '{"x":40,"y":520,"width":140,"height":140}'),
('C-06','C','vendido',   'contado',12800, null,  16, 17, 272, 'Calle Sur', null, null, '{"x":180,"y":520,"width":130,"height":140}'),
('C-07','C','disponible','ambos',  15000, 18000, 19, 17, 323, 'Calle Sur esquina', 2600, 48, '{"x":310,"y":520,"width":160,"height":140}'),
('D-01','D','disponible','ambos',  10800, 13000, 13, 17, 221, 'Calle Principal', 1900, 36, '{"x":530,"y":390,"width":110,"height":130}');

insert into lotes (numero, manzana, estado, tipo_pago, area_m2, notas, geometria) values
('PARQUE','D','no_disponible','contado', 950, 'Área verde común del desarrollo', '{"x":680,"y":520,"width":280,"height":140}');
