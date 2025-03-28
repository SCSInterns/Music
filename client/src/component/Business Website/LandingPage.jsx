import Header from "./SubComponents/Header";
import Hero from "./SubComponents/Hero";
import Features from "./SubComponents/Features";
import Stats from "./SubComponents/Stats";
import Testimonials from "./SubComponents/Testinomials";
import Pricing from "./SubComponents/Pricing";
import About from "./SubComponents/About";
import CtaSection from "./SubComponents/Cta";
import Footer from "./SubComponents/Footer";
import Demo from "./SubComponents/Demo";
import Signup from "../Business Website/GoogleSignup/Signup";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="#features">
          <Features />
        </section>
        <section id="stats">
          <Stats />
        </section>
        <section id="testimonials">
          <Testimonials />
        </section>
        <section id="pricing">
          <Pricing />
        </section>
        <section id="cta">
          <CtaSection />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="demo">
          <Demo />
        </section>
      </main>
      <Footer />
    </div>
  );
}
