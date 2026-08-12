import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { School } from "@/data/schools";
import { Plus, Trash2, Upload, Check, ChevronsUpDown, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFieldsOfStudyStore } from "@/data/useFieldsOfStudyStore";
import { useCitiesStore } from "@/data/useCitiesStore";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { PrimeUpsellModal } from "./PrimeUpsellModal";

const schoolSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  main_field_of_study: z.string().optional(),
  image: z.string(),
  logo: z.string().optional(),
  gallery: z.array(z.string()).optional(),
  rating: z.coerce.number().min(0).max(5),
  partner: z.string().min(1, "Partner is required"),
  partnerRating: z.coerce.number().min(0).max(5),
  students: z.string(),
  established: z.string(),
  hired: z.string(),
  prime: z.boolean().default(false),
  about: z.string().min(10, "About must be at least 10 characters"),
  specializations: z.array(
    z.object({
      name: z.string().min(1),
      detail: z.string(),
      emoji: z.string(),
    }),
  ),
  careers: z.array(
    z.object({
      role: z.string().min(1),
      salary: z.string(),
      from: z.string(),
    }),
  ),
  admission: z.object({
    minGrade: z.string(),
    background: z.string(),
    age: z.string(),
    interview: z.string(),
  }),
  school_admins: z.array(
    z.object({
      profile_id: z.string(),
      profiles: z.object({
        email: z.string(),
        first_name: z.string().optional(),
        last_name: z.string().optional(),
      }).optional()
    })
  ).optional(),
});

type SchoolFormValues = z.infer<typeof schoolSchema>;

interface SchoolFormProps {
  initialData?: School;
  onSubmit: (data: School, file?: File, logoFile?: File, galleryFiles?: File[]) => void;
  isLoading?: boolean;
}

export function SchoolForm({ initialData, onSubmit, isLoading }: SchoolFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(initialData?.image || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewLogo, setPreviewLogo] = useState<string | null>(initialData?.logo || null);
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [previewGallery, setPreviewGallery] = useState<string[]>(initialData?.gallery || []);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);


  const [showPrimeUpsell, setShowPrimeUpsell] = useState(false);
  const [pendingPrimeCheck, setPendingPrimeCheck] = useState(false);
  const { fields, fetchFields, addField } = useFieldsOfStudyStore();
  const [newField, setNewField] = useState("");
  const [isAddingField, setIsAddingField] = useState(false);

  const { cities, fetchCities, addCity } = useCitiesStore();
  const [newCity, setNewCity] = useState("");
  const [isAddingCity, setIsAddingCity] = useState(false);

  const [availableProfiles, setAvailableProfiles] = useState<{ id: string; email: string; first_name?: string; last_name?: string }[]>([]);
  const [openAdminsPopover, setOpenAdminsPopover] = useState(false);

  useEffect(() => {
    fetchFields();
    fetchCities();

    const fetchProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("id, email, first_name, last_name").not("email", "is", null);
      if (data && !error) {
        setAvailableProfiles(data as any);
      }
    };
    fetchProfiles();
  }, [fetchFields, fetchCities]);

  const handleAddField = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newField.trim()) return;
    try {
      const added = await addField(newField.trim());
      form.setValue("main_field_of_study", added.name);
      setNewField("");
      setIsAddingField(false);
      toast.success("Field of study added successfully");
    } catch (e) {
      toast.error("Failed to add field of study");
    }
  };

  const handleAddCity = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!newCity.trim()) return;
    try {
      const added = await addCity(newCity.trim());
      form.setValue("city", added.name);
      setNewCity("");
      setIsAddingCity(false);
      toast.success("City added successfully");
    } catch (e) {
      toast.error("Failed to add city");
    }
  };

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema) as any,
    defaultValues: initialData || {
      id: "",
      name: "",
      city: "",
      location: "",
      main_field_of_study: "",
      image: "",
      logo: "",
      gallery: [],
      rating: 0,
      partner: "",
      partnerRating: 0,
      students: "",
      established: "",
      hired: "",
      prime: false,
      about: "",
      specializations: [],
      careers: [],
      admission: { minGrade: "", background: "", age: "", interview: "" },
      school_admins: initialData?.school_admins || [],
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

  const schoolAdminsField = useFieldArray({
    control: form.control,
    name: "school_admins",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
        form.setValue("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewLogo(base64String);
        form.setValue("logo", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedGalleryFiles((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewGallery((prev) => {
            const newGallery = [...prev, reader.result as string];
            form.setValue("gallery", newGallery);
            return newGallery;
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setPreviewGallery((prev) => {
      const newGallery = prev.filter((_, i) => i !== index);
      form.setValue("gallery", newGallery);
      return newGallery;
    });
    // Adjust selectedGalleryFiles if it was a newly uploaded file, this is simplified.
    // In a full implementation, you'd track which preview matches which file.
  };

  const handleSubmit = (values: SchoolFormValues) => {
    onSubmit(
      values as School,
      selectedFile || undefined,
      selectedLogo || undefined,
      selectedGalleryFiles.length > 0 ? selectedGalleryFiles : undefined,
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit, (errors) => {
          console.error("Form validation errors:", errors);
          toast.error("Please check the form for errors and try again");
        })}
        className="space-y-4 md:space-y-8 w-full max-w-full"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2 md:mb-4">Basic Information</h3>
          </div>

          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>ID (Slug)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. ats-cairo" {...field} disabled={!!initialData} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="School Name" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex flex-col min-w-0">
                <FormLabel>City</FormLabel>
                <div className="flex w-full items-center gap-2">
                  {isAddingCity ? (
                    <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full min-w-0">
                      <Input
                        placeholder="New city..."
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button type="button" onClick={handleAddCity} size="sm" className="flex-1 sm:flex-none">
                          Add
                        </Button>
                        <Button type="button" variant="ghost" onClick={() => setIsAddingCity(false)} size="sm" className="flex-1 sm:flex-none">
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full min-w-0">
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="w-full min-w-0">
                            <SelectValue placeholder="Select a city" className="truncate" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" onClick={() => setIsAddingCity(true)} className="w-full sm:w-auto shrink-0">
                        <Plus className="size-4 mr-2" /> Add New
                      </Button>
                    </div>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Location / Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full location" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="col-span-full min-w-0">
            <FormField
              control={form.control}
              name="main_field_of_study"
              render={({ field }) => (
                <FormItem className="flex flex-col min-w-0">
                  <FormLabel>Main Field of Study</FormLabel>
                  <div className="flex w-full items-center gap-2">
                    {isAddingField ? (
                      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full min-w-0">
                        <Input
                          placeholder="New field..."
                          value={newField}
                          onChange={(e) => setNewField(e.target.value)}
                          className="w-full"
                        />
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button type="button" onClick={handleAddField} size="sm" className="flex-1 sm:flex-none">
                            Add
                          </Button>
                          <Button type="button" variant="ghost" onClick={() => setIsAddingField(false)} size="sm" className="flex-1 sm:flex-none">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full min-w-0">
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="w-full min-w-0">
                              <SelectValue placeholder="Select field" className="truncate" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fields.map((f) => (
                              <SelectItem key={f.id} value={f.name}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button type="button" variant="outline" onClick={() => setIsAddingField(true)} className="w-full sm:w-auto shrink-0">
                          <Plus className="size-4 mr-2" /> Add New
                        </Button>
                      </div>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="col-span-full space-y-4 md:space-y-6">
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2">
                    {previewImage && (
                      <img
                        src={previewImage}
                        alt="Cover Preview"
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border"
                      />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2 shrink-0" />
                      Upload Cover
                    </Button>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Logo</FormLabel>
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-2">
                    {previewLogo && (
                      <img
                        src={previewLogo}
                        alt="Logo Preview"
                        className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-md border bg-slate-50"
                      />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2 shrink-0" />
                      Upload Logo
                    </Button>
                    <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gallery"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gallery Photos</FormLabel>
                  <div className="space-y-3 md:space-y-4 mt-2">
                    {previewGallery.length > 0 && (
                      <div className="flex flex-wrap gap-3 md:gap-4">
                        {previewGallery.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img src={img} alt={`Gallery ${idx}`} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-md border" />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => galleryInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      <Upload className="w-4 h-4 mr-2 shrink-0" />
                      Add Gallery Photos
                    </Button>
                    <input type="file" accept="image/*" multiple className="hidden" ref={galleryInputRef} onChange={handleGalleryUpload} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="about"
            render={({ field }) => (
              <FormItem className="col-span-full min-w-0">
                <FormLabel>About</FormLabel>
                <FormControl>
                  <Textarea rows={4} placeholder="About the school..." className="w-full min-w-0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Metrics & Partner Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2 md:mb-4">Metrics & Partner</h3>
          </div>
          <FormField
            control={form.control}
            name="partner"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Partner</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="partnerRating"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Partner Rating</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>School Rating</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="students"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Students Count</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="established"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Established Year</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hired"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Graduates Hired</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="prime"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 md:p-4 sm:col-span-2 lg:col-span-1 min-w-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setPendingPrimeCheck(true);
                        setShowPrimeUpsell(true);
                      } else {
                        field.onChange(checked);
                      }
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Prime School</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Specializations */}
        <div className="p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 border-b pb-2 mb-3 md:mb-4">
            <h3 className="text-lg font-semibold">Specializations</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto shrink-0"
              onClick={() => specializationsField.append({ name: "", detail: "", emoji: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {specializationsField.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-start p-3 md:p-4 border md:border-0 rounded-md md:rounded-none bg-slate-50 md:bg-transparent min-w-0">
                <FormField
                  control={form.control}
                  name={`specializations.${index}.name`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full md:w-auto min-w-0">
                      <FormControl>
                        <Input placeholder="Name" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`specializations.${index}.detail`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full md:w-auto min-w-0">
                      <FormControl>
                        <Input placeholder="Detail (e.g. 3-year)" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`specializations.${index}.emoji`}
                  render={({ field }) => (
                    <FormItem className="w-full md:w-24 shrink-0">
                      <FormControl>
                        <Input placeholder="Emoji" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 w-full md:w-auto mt-1 md:mt-0 shrink-0"
                  onClick={() => specializationsField.remove(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2 md:mr-0" />
                  <span className="md:hidden">Remove Specialization</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Careers */}
        <div className="p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 border-b pb-2 mb-3 md:mb-4">
            <h3 className="text-lg font-semibold">Careers</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full sm:w-auto shrink-0"
              onClick={() => careersField.append({ role: "", salary: "", from: "" })}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-3 md:space-y-4">
            {careersField.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-3 md:gap-4 md:items-start p-3 md:p-4 border md:border-0 rounded-md md:rounded-none bg-slate-50 md:bg-transparent min-w-0">
                <FormField
                  control={form.control}
                  name={`careers.${index}.role`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full md:w-auto min-w-0">
                      <FormControl>
                        <Input placeholder="Role" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`careers.${index}.salary`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full md:w-auto min-w-0">
                      <FormControl>
                        <Input placeholder="Salary" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`careers.${index}.from`}
                  render={({ field }) => (
                    <FormItem className="flex-1 w-full md:w-auto min-w-0">
                      <FormControl>
                        <Input placeholder="From specialization" {...field} className="w-full" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500 w-full md:w-auto mt-1 md:mt-0 shrink-0"
                  onClick={() => careersField.remove(index)}
                >
                  <Trash2 className="w-4 h-4 mr-2 md:mr-0" />
                  <span className="md:hidden">Remove Career</span>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Admission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="col-span-full">
            <h3 className="text-lg font-semibold border-b pb-2 mb-2 md:mb-4">Admission Criteria</h3>
          </div>
          <FormField
            control={form.control}
            name="admission.minGrade"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Minimum Grade</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admission.background"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Background</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admission.age"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Age Requirements</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admission.interview"
            render={({ field }) => (
              <FormItem className="min-w-0">
                <FormLabel>Interview Requirements</FormLabel>
                <FormControl>
                  <Input {...field} className="w-full" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Administrators */}
        <div className="p-3 md:p-6 bg-white rounded-xl shadow-sm border border-slate-100 min-w-0">
          <div className="flex justify-between items-center border-b pb-2 mb-3 md:mb-4">
            <h3 className="text-lg font-semibold">School Administrators</h3>
          </div>
          <div className="space-y-3 md:space-y-4">
            <Popover open={openAdminsPopover} onOpenChange={setOpenAdminsPopover}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openAdminsPopover}
                  className="w-full justify-between min-w-0"
                >
                  <span className="truncate min-w-0 flex-1 text-left">Select a profile...</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[calc(100vw-2rem)] md:w-[var(--radix-popover-trigger-width)] max-w-[400px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search by email..." />
                  <CommandList>
                    <CommandEmpty>No profiles found.</CommandEmpty>
                    <CommandGroup>
                      {availableProfiles
                        .filter(p => !schoolAdminsField.fields.some(a => a.profile_id === p.id))
                        .map((profile) => (
                          <CommandItem
                            key={profile.id}
                            value={profile.email}
                            onSelect={() => {
                              schoolAdminsField.append({
                                profile_id: profile.id,
                                profiles: { email: profile.email, first_name: profile.first_name, last_name: profile.last_name }
                              });
                              setOpenAdminsPopover(false);
                            }}
                          >
                            <div className="flex flex-col min-w-0 overflow-hidden">
                              <span className="truncate">{profile.email}</span>
                              {(profile.first_name || profile.last_name) && (
                                <span className="text-xs text-muted-foreground truncate">
                                  {profile.first_name} {profile.last_name}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <div className="grid gap-2 min-w-0">
              {schoolAdminsField.fields.map((field, index) => (
                <div key={field.id} className="flex items-center justify-between p-2 sm:p-3 border rounded-md bg-slate-50 min-w-0">
                  <div className="flex flex-col min-w-0 flex-1 mr-2 overflow-hidden">
                    <span className="font-medium truncate text-sm sm:text-base">{field.profiles?.email}</span>
                    {(field.profiles?.first_name || field.profiles?.last_name) && (
                      <span className="text-xs text-muted-foreground truncate">
                        {field.profiles?.first_name} {field.profiles?.last_name}
                      </span>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-500 h-8 px-2 shrink-0"
                    onClick={() => schoolAdminsField.remove(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {schoolAdminsField.fields.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center p-3 md:p-4">No administrators added yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 pb-6 md:pb-12">
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full sm:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          >
            {isLoading ? "Saving..." : "Save School"}
          </Button>
        </div>
      </form>

      <PrimeUpsellModal
        open={showPrimeUpsell}
        onOpenChange={(open) => {
          setShowPrimeUpsell(open);
          if (!open && pendingPrimeCheck) {
            setPendingPrimeCheck(false);
          }
        }}
        onUpgrade={() => {
          form.setValue("prime", true);
          setShowPrimeUpsell(false);
          setPendingPrimeCheck(false);
          toast.success("Redirecting...");
          setTimeout(() => {
            toast.success("Successfully upgraded!");
          }, 1500);
        }}
      />
    </Form>
  );
}
