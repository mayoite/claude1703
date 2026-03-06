import { VisualIVR } from "@/components/support/VisualIVR";
import { Hero } from "@/components/home/Hero";

export default function SupportPage() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-white">
      <Hero
        variant="small"
        title="Support Center"
        subtitle="How can we help you today? Navigate our visual menu to find the right contact."
        showButton={false}
        backgroundImage="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200"
      />
      <section className="container px-6 2xl:px-0 py-12 md:py-20">
        <VisualIVR />
      </section>
    </section>
  );
}

