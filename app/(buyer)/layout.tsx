import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-24">{children}</main>
      <Footer />
    </>
  );
}
