import { Navbar } from "@/components/layout/Navbar";
import { ScrollProgress } from "@/components/public/ScrollProgress";
import { PageEnter } from "@/components/public/PageEnter";
import { MainWrapper } from "@/components/layout/MainWrapper";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <MainWrapper>
        <PageEnter>{children}</PageEnter>
      </MainWrapper>
    </>
  );
}
