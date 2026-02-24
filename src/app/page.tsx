import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ZakatCalculator } from "@/components/calculator/ZakatCalculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ZakatCalculator />
      </main>
      <Footer />
    </div>
  );
}
