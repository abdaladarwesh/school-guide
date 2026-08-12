-- Add email column to profiles
alter table public.profiles
add column if not exists email text;

-- Update the handle_new_user trigger to include email
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, email)
  values (new.id, 'student', new.email);
  return new;
end;
$$;

-- Create school_admins junction table
create table if not exists public.school_admins (
  id uuid default gen_random_uuid() primary key,
  school_id text not null,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(school_id, profile_id)
);

-- Set up RLS for school_admins
alter table public.school_admins enable row level security;

create policy "School admins are viewable by everyone."
  on public.school_admins for select
  using ( true );

create policy "Only global admins can insert school admins."
  on public.school_admins for insert
  with check ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only global admins can update school admins."
  on public.school_admins for update
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Only global admins can delete school admins."
  on public.school_admins for delete
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
