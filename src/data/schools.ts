import newCairo from "@/assets/school-new-cairo.jpg";
import alexandria from "@/assets/school-alexandria.jpg";
import giza from "@/assets/school-giza.jpg";

export type School = {
  id: string;
  name: string;
  city: string;
  location: string;
  image: string;
  rating: number;
  partner: string;
  partnerRating: number;
  students: string;
  established: string;
  hired: string;
  prime: boolean;
  about: string;
  specializations: { name: string; detail: string; emoji: string }[];
  careers: { role: string; salary: string; from: string }[];
  admission: { minGrade: string; background: string; age: string; interview: string };
  logo?: string;
  gallery?: string[];
  main_field_of_study?: string;
};

export const schools: School[] = [
  {
    id: "ats-new-cairo",
    name: "ATS New Cairo",
    city: "Cairo",
    location: "New Cairo, Cairo Governorate",
    image: newCairo,
    rating: 4.8,
    partner: "Valeo Egypt",
    partnerRating: 4.9,
    students: "420+",
    established: "2019",
    hired: "310",
    prime: true,
    about:
      "ATS New Cairo is a flagship Applied Technology School focused on software, data and cloud engineering. Students split their week between classroom learning and paid on-site training at partner facilities, graduating with a dual Egyptian–German certification.",
    specializations: [
      { name: "Software Engineering", detail: "3-year program • Dual certification", emoji: "💻" },
      { name: "AI & Data Science", detail: "3-year program • Dual certification", emoji: "🤖" },
      { name: "Cybersecurity", detail: "3-year program • Industry certificate", emoji: "🛡️" },
      { name: "Cloud Computing", detail: "3-year program • AWS pathway", emoji: "☁️" },
    ],
    careers: [
      { role: "Software Developer", salary: "EGP 14k – 26k / mo", from: "Software Engineering" },
      { role: "Data Analyst", salary: "EGP 12k – 22k / mo", from: "AI & Data Science" },
      { role: "Cloud Engineer", salary: "EGP 16k – 30k / mo", from: "Cloud Computing" },
      { role: "SOC Analyst", salary: "EGP 13k – 24k / mo", from: "Cybersecurity" },
    ],
    admission: {
      minGrade: "85% in preparatory certificate",
      background: "STEM / science track preferred",
      age: "15 – 18 years old",
      interview: "Personal interview + aptitude test required",
    },
  },
  {
    id: "ats-alexandria",
    name: "ATS Alexandria Industrial",
    city: "Alexandria",
    location: "Smouha, Alexandria",
    image: alexandria,
    rating: 4.6,
    partner: "Schneider Electric",
    partnerRating: 4.7,
    students: "380+",
    established: "2018",
    hired: "265",
    prime: true,
    about:
      "A mechatronics-first school built inside a working industrial district. Workshops are equipped by partner factories, and every student completes two rotations on a real production line.",
    specializations: [
      { name: "Mechatronics", detail: "3-year program • Dual certification", emoji: "⚙️" },
      { name: "Industrial Automation", detail: "3-year program • PLC certification", emoji: "🏭" },
      { name: "Electrical Maintenance", detail: "3-year program • Field training", emoji: "🔌" },
    ],
    careers: [
      {
        role: "Automation Technician",
        salary: "EGP 11k – 20k / mo",
        from: "Industrial Automation",
      },
      { role: "Mechatronics Engineer Asst.", salary: "EGP 12k – 22k / mo", from: "Mechatronics" },
      {
        role: "Maintenance Specialist",
        salary: "EGP 10k – 18k / mo",
        from: "Electrical Maintenance",
      },
    ],
    admission: {
      minGrade: "80% in preparatory certificate",
      background: "Any track • strong maths",
      age: "15 – 18 years old",
      interview: "Workshop practical assessment required",
    },
  },
  {
    id: "ats-giza",
    name: "ATS Giza Digital",
    city: "Giza",
    location: "6th of October, Giza",
    image: giza,
    rating: 4.5,
    partner: "Orange Egypt",
    partnerRating: 4.5,
    students: "295+",
    established: "2021",
    hired: "150",
    prime: false,
    about:
      "Digital-services focused school with a strong network and customer-technology curriculum, run alongside a telecom partner's regional operations centre.",
    specializations: [
      { name: "Network Engineering", detail: "3-year program • CCNA pathway", emoji: "🌐" },
      { name: "Digital Media Production", detail: "3-year program • Studio training", emoji: "🎬" },
      { name: "IT Support", detail: "3-year program • Dual certification", emoji: "🧰" },
    ],
    careers: [
      { role: "Network Technician", salary: "EGP 11k – 19k / mo", from: "Network Engineering" },
      { role: "Content Producer", salary: "EGP 9k – 17k / mo", from: "Digital Media Production" },
      { role: "IT Support Engineer", salary: "EGP 10k – 18k / mo", from: "IT Support" },
    ],
    admission: {
      minGrade: "78% in preparatory certificate",
      background: "Any track",
      age: "15 – 18 years old",
      interview: "Interview required",
    },
  },
  {
    id: "ats-assiut",
    name: "ATS Assiut Agritech",
    city: "Assiut",
    location: "Assiut Industrial Zone",
    image: newCairo,
    rating: 4.4,
    partner: "Nestlé Egypt",
    partnerRating: 4.4,
    students: "210+",
    established: "2022",
    hired: "95",
    prime: false,
    about:
      "Upper Egypt's applied school for food technology and agritech, pairing lab work with placements across the region's processing plants.",
    specializations: [
      { name: "Food Technology", detail: "3-year program • Dual certification", emoji: "🧪" },
      { name: "Agritech Systems", detail: "3-year program • Field certification", emoji: "🌱" },
    ],
    careers: [
      { role: "Quality Lab Technician", salary: "EGP 9k – 16k / mo", from: "Food Technology" },
      { role: "Agritech Operator", salary: "EGP 8k – 15k / mo", from: "Agritech Systems" },
    ],
    admission: {
      minGrade: "75% in preparatory certificate",
      background: "Science track preferred",
      age: "15 – 18 years old",
      interview: "Interview required",
    },
  },
];

export const cities = ["All", "Cairo", "Alexandria", "Giza", "Assiut"];

export const getSchool = (id: string) => schools.find((s) => s.id === id);
