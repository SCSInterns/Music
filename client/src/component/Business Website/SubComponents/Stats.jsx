import { Users, Music, School, Award } from "lucide-react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  { icon: Users, value: 10000, label: "Students Managed", suffix: "+" },
  { icon: Music, value: 50000, label: "Lessons Scheduled", suffix: "+" },
  { icon: School, value: 500, label: "Music Schools", suffix: "+" },
  { icon: Award, value: 98, label: "Customer Satisfaction", suffix: "%" },
];

export default function Stats() {
  const { ref, inView } = useInView({
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              <stat.icon className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">
                {inView && (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix} />
                )}
              </h3>
              <p className="text-lg opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
