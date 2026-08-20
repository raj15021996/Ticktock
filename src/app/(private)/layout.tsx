import Footer from "@/components/hoc/layout/Footer";
import Header from "@/components/hoc/layout/Header";
import Loading from "@/components/ui/loading";
import { Suspense } from "react";

interface PrivateLayoutProps {
  readonly children: React.ReactNode;
}

const PrivateLayout: React.FC<PrivateLayoutProps> = async ({ children }) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex min-h-screen flex-col bg-[#f5f6f8]">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </Suspense>
  );
};

export default PrivateLayout;
