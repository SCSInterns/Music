import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent py-12 px-4 md:px-6 lg:px-8 border-t-2">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Testimonials
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                API Docs
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-4">Connect</h3>
          <div className="flex justify-center space-x-5">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; 2024 MusicVista. All rights reserved.</p>
      </div>
    </footer>
  );
}
