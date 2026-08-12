-- Add foreign key constraint to school_admins linking it to schools
alter table public.school_admins
add constraint school_admins_school_id_fkey
foreign key (school_id)
references public.schools(id) on delete cascade;
