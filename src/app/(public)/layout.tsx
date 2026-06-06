import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/public/ScrollProgress";
import { PageEnter } from "@/components/public/PageEnter";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-14">
        <PageEnter>{children}</PageEnter>
      </main>
    </>
  );
}
