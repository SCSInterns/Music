import {
  Music,
  Users2,
  Calendar,
  CreditCard,
  Clipboard,
  Mail,
} from "lucide-react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";

export default function FeaturesSection() {
  const features = [
    {
      icon: Music,
      title: "Academy Listings",
      description:
        "Discover a variety of music academies from all over. Browse, compare, and choose the academy that aligns with your passion and goals. Enroll in your desired courses directly through the platform.",
    },
    {
      icon: Users2,
      title: "Student Enrollment",
      description:
        "Easily enroll in music courses of your choice. Track your progress, communicate with instructors, and manage your learning journey all within the platform.",
    },
    {
      icon: Calendar,
      title: "Timetable Management",
      description:
        "View class schedules, select the batches that suit your time, and never miss a session. Stay updated with any changes to your course timetable directly on the platform.",
    },
    {
      icon: CreditCard,
      title: "Fee Management",
      description:
        "Manage your tuition fees effortlessly. The platform provides a clear view of your fees, payment history, and upcoming due dates. Make payments securely and on time.",
    },
    {
      icon: Clipboard,
      title: "Attendance Management",
      description:
        "Track your attendance with ease. The platform allows both students and academies to monitor class participation and ensure a smooth learning experience.",
    },
    {
      icon: Mail,
      title: "Email Updates",
      description:
        "Stay informed with automatic email notifications. Receive updates about course changes, fee reminders, events, and other important information related to your academy and courses.",
    },
  ];
  return (
    <section
      className="py-20 px-4 md:px-6 lg:px-8"
      id="features"
      style={{ fontFamily: "roboto-slab" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Powerful Features of MusicVista
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg transition-transform hover:scale-105 duration-300 border"
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center justify-center gap-3 w-full mb-4 min-h-[50px]">
                <feature.icon className="w-12 h-12 text-[#1B5875]" />
                <Typography variant="h6" className="text-xl font-semibold">
                  {feature.title}
                </Typography>
              </div>
              <Typography
                variant="body2"
                className="text-muted-foreground text-justify line-clamp-6"
              >
                {feature.description}
              </Typography>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
