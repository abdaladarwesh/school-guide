-- Add subscription columns to profiles table
alter table public.profiles
add column is_subscribed boolean not null default false,
add column tier text not null default 'none' check (tier in ('none', 'plus', 'max'));

-- Update handle_new_user to also set these explicitly (optional but good practice)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, is_subscribed, tier)
  values (new.id, 'student', false, 'none');
  return new;
end;
$$;
