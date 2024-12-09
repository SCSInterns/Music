import {
  Calendar,
  TrendingUp,
  CreditCard,
  Users,
  BookOpen,
  Headphones,
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Student Hub",
    description:
      "A comprehensive management tool for overseeing all student profiles and their statuses. Effortlessly track and organize student information, manage enrollments, and ensure smooth administrative workflows.",
  },
  {
    icon: CreditCard,
    title: "Pay Wise",
    description:
      "An integrated payment solution that leverages Razorpay's QR codes to facilitate easy and secure monthly fee collection. Simplifies payment processing and enhances financial management for academies.",
  },
  {
    icon: Calendar,
    title: "Class Flow",
    description:
      "A scheduling and batch management feature that allows you to create and assign batch timetables, ensuring efficient class organization and smooth coordination among instructors and students.",
  },
  {
    icon: BookOpen,
    title: "Website Pilot",
    description:
      "A no-code platform to build and manage a dynamic website for your academy. Customize your online presence without the need for coding knowledge, showcasing your services, faculty, and class schedules.",
  },
  {
    icon: Headphones,
    title: "Attendance Ease",
    description:
      "An innovative attendance system that uses QR codes for daily check-ins, simplifying the process of recording attendance and maintaining accurate attendance records for each student.",
  },
  {
    icon: Calendar,
    title: "White Labeling",
    description:
      "A powerful customization option that allows academies to use their own branded email IDs, personalized receipts, and payment reminders, creating a professional and cohesive experience for students and staff.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Powerful Features for Your Academy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 border"
            >
              <div className="flex items-center justify-center gap-3 w-full mb-4 ">
                <feature.icon className=" size-8 text-primary" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground text-justify line-clamp-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
