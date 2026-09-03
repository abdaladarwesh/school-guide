import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "MASARAK's AI Assistant completely changed my life. I uploaded my Mechatronics diploma project, and it matched me with a fully-funded internship in Germany. The tool even helped me translate my practical experience into a professional CV.",
    name: "Ahmed Hassan",
    school: "El-Sewedy Applied Technology School",
    role: "Intern at Siemens Germany",
    image: "https://i.pravatar.cc/150?u=ahmed"
  },
  {
    id: 2,
    quote: "I never thought my 3-year technical diploma would qualify me for a bachelor's degree in Italy. This platform guided me step-by-step on how to apply and prepare my portfolio.",
    name: "Fatma Ali",
    school: "Industrial Technical Institute",
    role: "Engineering Student at Politecnico di Torino",
    image: "https://i.pravatar.cc/150?u=fatma"
  },
  {
    id: 3,
    quote: "The language prep courses provided here were the missing piece. I improved my English significantly and secured a position in an international tech exchange program.",
    name: "Omar Tarek",
    school: "WE Applied Technology School",
    role: "Software Developer, Tech Exchange UK",
    image: "https://i.pravatar.cc/150?u=omar"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
            Success Stories
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Hear from technical education graduates who secured international scholarships and internships using MASARAK.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card rounded-3xl p-8 shadow-sm border border-border relative">
              <Quote className="absolute top-8 right-8 h-12 w-12 text-primary/10" />
              <div className="flex gap-4 items-center mb-6">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-16 h-16 rounded-full border-2 border-accent object-cover"
                />
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">{testimonial.school}</p>
                </div>
              </div>
              <p className="text-muted-foreground italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="pt-6 border-t border-border mt-auto">
                <p className="text-sm font-semibold text-primary">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
