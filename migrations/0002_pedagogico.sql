-- Registros pedagógicos de um professor. user_id vem só da sessão, nunca do cliente.
create table if not exists ped_workspace (
  user_id text primary key,
  data text not null,
  updated_at timestamptz not null default now()
);

create table if not exists teacher_profile (
  user_id text primary key,
  display_name text not null default '',
  place text not null default '',
  updated_at timestamptz not null default now()
);
