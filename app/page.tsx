import { prisma } from "@/lib/prisma";
import Hero from "./components/landing/Hero";
import Footer from "./components/layout/Footer";

export default async function Home() {
  const heroContent = await prisma.heroContent.findFirst();

  return (
    <div className="flex flex-col gap-0 h-full">
      <Hero content={heroContent} />
      <Footer />
    </div>
  );
}
