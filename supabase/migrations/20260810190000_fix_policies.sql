-- Add anon policies for school-images bucket so unauthenticated users can upload during development
CREATE POLICY "Anon users can upload images" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'school-images');
CREATE POLICY "Anon users can update images" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'school-images');
CREATE POLICY "Anon users can delete images" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'school-images');

-- Add INSERT, UPDATE, DELETE policies for public.schools table
CREATE POLICY "Allow public insert on schools" ON public.schools FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public update on schools" ON public.schools FOR UPDATE TO public USING (true);
CREATE POLICY "Allow public delete on schools" ON public.schools FOR DELETE TO public USING (true);
