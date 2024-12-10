import { Button } from "@mui/material";

export default function CtaSection() {
  return (
    <section className="py-24 px-4 md:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Orchestrate Your Success?
        </h2>
        <p className="text-xl mb-8">
          Join thousands of music academies already using MusicVista to
          streamline their operations and enhance their students' learning
          experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            variant="contained"
            className="text-primary"
            sx={{
              backgroundColor: "#0d1b2a",
              ":hover": { backgroundColor: "#ffff", color: "#0d1b2a" },
            }}
          >
            <a href="/academyregform" target="blank">
              Start Free Trial
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            <a href="#demo">Book Demo</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
