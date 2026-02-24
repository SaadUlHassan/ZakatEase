import { Header } from "@/components/layout/Header";
import { InspirationBanner } from "@/components/layout/InspirationBanner";
import { Footer } from "@/components/layout/Footer";
import { ZakatCalculator } from "@/components/calculator/ZakatCalculator";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <InspirationBanner />
      <main className="flex-1">
        <ZakatCalculator />
      </main>
      <Footer />
    </div>
  );
}
