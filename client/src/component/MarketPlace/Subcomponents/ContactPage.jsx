import { Card, CardContent, CardHeader, Typography } from "@mui/material";

import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <div className=" bg-gray-50" style={{ fontFamily: "roboto-slab" }}>
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <h2 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl text-black">
              Get In Touch
            </h2>
            <p className="text-muted-foreground">
              We&apos;d love to hear from you! Whether you have questions about{" "}
              <span className="text-red-500 font-medium">CinemaPro</span>, need
              support, or want to learn more about our services, our team is
              here to help.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <Typography className="flex items-center gap-2 text-[#1B5A7D]">
                  <MapPin className="h-5 w-5" />
                  Our Address
                </Typography>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  518-Solaris Business Hub,Opp. Parshwanath Jain mandir,
                  Bhuyangdev Cross Road, Ahmedabad, Gujarat-61
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography className="flex items-center gap-2 text-[#1B5A7D]">
                  <Phone className="h-5 w-5" />
                  Our Contact
                </Typography>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+91 8511245350</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Typography className="flex items-center gap-2 text-[#1B5A7D]">
                  <Mail className="h-5 w-5" />
                  Our Email
                </Typography>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">contact@cinemapro.in</p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <div className="w-full h-[400px] rounded-lg overflow-hidden border">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.3113590116736!2d72.53633777386713!3d23.05844831499117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e851a5d3e4e0f%3A0x249acb663e46af9b!2sSoftCoding%20Solutions!5e1!3m2!1sen!2sin!4v1735301958950!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
