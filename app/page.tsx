import Hero from "./components/landing/Hero";
import Footer from "./components/layout/Footer";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 h-full">
      <Hero />
      <Footer />
    </div>
  );
}
