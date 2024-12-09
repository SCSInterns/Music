import Header from "./SubComponents/Header";
import Hero from "./SubComponents/Hero";
import Features from "./SubComponents/Features";
import Stats from "./SubComponents/Stats";
import Testimonials from "./SubComponents/Testinomials";
import Pricing from "./SubComponents/Pricing";
import About from "./SubComponents/About";
import CtaSection from "./SubComponents/Cta";
import Footer from "./SubComponents/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
        <Testimonials />
        <Pricing />
        <About />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
