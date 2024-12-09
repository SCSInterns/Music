import { Users, Music, School, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "10,000+", label: "Students Managed" },
  { icon: Music, value: "50,000+", label: "Lessons Scheduled" },
  { icon: School, value: "500+", label: "Music Schools" },
  { icon: Award, value: "98%", label: "Customer Satisfaction" },
];

export default function Stats() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
              <p className="text-lg opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
