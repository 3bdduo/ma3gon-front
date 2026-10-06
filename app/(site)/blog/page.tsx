import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Loader } from "@/components/ui/Loader";
import BlogList from "./BlogList";

export const metadata: Metadata = { title: "المدونة" };

export default function BlogPage() {
  return (
    <div className="py-14 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="المدونة القرآنية"
          title="إشراقات تربوية وفوائد إيمانية"
          description="مقالات منهجية وخطط عملية تُعين الأسرة والحافظ على فهم كتاب الله وتثبيت حفظه وبناء شخصية قرآنية متكاملة"
        />
        <Suspense fallback={<Loader />}>
          <BlogList />
        </Suspense>
      </Container>
    </div>
  );
}
