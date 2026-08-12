-- Backfill emails for existing profiles from auth.users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and p.email is null;
