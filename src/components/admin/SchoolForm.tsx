import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { School } from '@/data/schools';
import { Plus, Trash2, Upload } from 'lucide-react';
import { useState, useRef } from 'react';

const schoolSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  city: z.string().min(1, 'City is required'),
  location: z.string().min(1, 'Location is required'),
  image: z.string(),
  rating: z.coerce.number().min(0).max(5),
  partner: z.string().min(1, 'Partner is required'),
  partnerRating: z.coerce.number().min(0).max(5),
  students: z.string(),
  established: z.string(),
  hired: z.string(),
  prime: z.boolean().default(false),
  about: z.string().min(10, 'About must be at least 10 characters'),
  specializations: z.array(z.object({
    name: z.string().min(1),
    detail: z.string(),
    emoji: z.string(),
  })),
  careers: z.array(z.object({
    role: z.string().min(1),
    salary: z.string(),
    from: z.string(),
  })),
  admission: z.object({
    minGrade: z.string(),
    background: z.string(),
    age: z.string(),
    interview: z.string(),
  })
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData?: School;
  onSubmit: (data: School) => void;
  isLoading?: boolean;
}

export function SchoolForm({ initialData, onSubmit, isLoading }: SchoolFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema) as any,
    defaultValues: initialData || {
      id: '',
      name: '',
      city: '',
      location: '',
      image: '',
      rating: 0,
      partner: '',
      partnerRating: 0,
      students: '',
      established: '',
      hired: '',
      prime: false,
      about: '',
      specializations: [],
      careers: [],
      admission: { minGrade: '', background: '', age: '', interview: '' },
    },
  });

  const specializationsField = useFieldArray({
    control: form.control,
    name: "specializations",
  });

  const careersField = useFieldArray({
    control: form.control,
    name: "careers",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue('image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (values: SchoolFormValues) => {
    onSubmit(values as School);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Basic Information</h3>
          </div>
          
          <FormField control={form.control} name="id" render={({ field }) => (
            <FormItem>
              <FormLabel>ID (Slug)</FormLabel>
              <FormControl><Input placeholder="e.g. ats-cairo" {...field} disabled={!!initialData} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input placeholder="School Name" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="city" render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl><Input placeholder="City" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location / Address</FormLabel>
              <FormControl><Input placeholder="Full location" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          
          <div className="col-span-full">
            <FormField control={form.control} name="image" render={({ field }) => (
              <FormItem>
                <FormLabel>School Image</FormLabel>
                <div className="flex items-center gap-4 mt-2">
                  {previewImage && (
                    <img src={previewImage} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />
                  )}
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                </div>
                <FormMessage />
              </FormItem>
            )} />
          </div>

          <FormField control={form.control} name="about" render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>About</FormLabel>
              <FormControl><Textarea rows={4} placeholder="About the school..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Metrics & Partner Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Metrics & Partner</h3>
          </div>
          <FormField control={form.control} name="partner" render={({ field }) => (
            <FormItem><FormLabel>Partner</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="partnerRating" render={({ field }) => (
            <FormItem><FormLabel>Partner Rating</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="rating" render={({ field }) => (
            <FormItem><FormLabel>School Rating</FormLabel><FormControl><Input type="number" step="0.1" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="students" render={({ field }) => (
            <FormItem><FormLabel>Students Count</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="established" render={({ field }) => (
            <FormItem><FormLabel>Established Year</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="hired" render={({ field }) => (
            <FormItem><FormLabel>Graduates Hired</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="prime" render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Prime School</FormLabel>
              </div>
            </FormItem>
          )} />
        </div>

        {/* Specializations */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold">Specializations</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => specializationsField.append({ name: '', detail: '', emoji: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {specializationsField.fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <FormField control={form.control} name={`specializations.${index}.name`} render={({ field }) => (
                  <FormItem className="flex-1"><FormControl><Input placeholder="Name" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`specializations.${index}.detail`} render={({ field }) => (
                  <FormItem className="flex-1"><FormControl><Input placeholder="Detail (e.g. 3-year program)" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`specializations.${index}.emoji`} render={({ field }) => (
                  <FormItem className="w-24"><FormControl><Input placeholder="Emoji" {...field} /></FormControl></FormItem>
                )} />
                <Button type="button" variant="ghost" className="text-red-500 mt-8" onClick={() => specializationsField.remove(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Careers */}
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-semibold">Careers</h3>
            <Button type="button" variant="outline" size="sm" onClick={() => careersField.append({ role: '', salary: '', from: '' })}>
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {careersField.fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <FormField control={form.control} name={`careers.${index}.role`} render={({ field }) => (
                  <FormItem className="flex-1"><FormControl><Input placeholder="Role" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`careers.${index}.salary`} render={({ field }) => (
                  <FormItem className="flex-1"><FormControl><Input placeholder="Salary" {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name={`careers.${index}.from`} render={({ field }) => (
                  <FormItem className="flex-1"><FormControl><Input placeholder="From specialization" {...field} /></FormControl></FormItem>
                )} />
                <Button type="button" variant="ghost" className="text-red-500 mt-8" onClick={() => careersField.remove(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Admission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-sm border border-slate-100">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-4">Admission Criteria</h3>
          </div>
          <FormField control={form.control} name="admission.minGrade" render={({ field }) => (
            <FormItem><FormLabel>Minimum Grade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="admission.background" render={({ field }) => (
            <FormItem><FormLabel>Background</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="admission.age" render={({ field }) => (
            <FormItem><FormLabel>Age Requirements</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="admission.interview" render={({ field }) => (
            <FormItem><FormLabel>Interview Requirements</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="flex justify-end gap-4 pb-12">
          <Button type="submit" disabled={isLoading} size="lg" className="px-8 bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? 'Saving...' : 'Save School'}
          </Button>
        </div>

      </form>
    </Form>
  );
}
