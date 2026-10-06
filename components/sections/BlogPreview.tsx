import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookText } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { blogApi } from "@/lib/resources";
import { DEFAULT_BLOG_POSTS } from "@/lib/curated-quran";

export async function BlogPreview() {
  const posts = await blogApi.list().catch(() => []);
  const displayPosts = Array.isArray(posts) && posts.length > 0 ? posts : DEFAULT_BLOG_POSTS;
  const latest = displayPosts.slice(0, 3);

  return (
    <section className="cv-auto py-16 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="إشراقات تربوية"
          title="زادُ القلوب ومقالاتُ الوعي القرآني"
          description="توجيهات إيمانية وخطط عملية تُعين الأسرة والحافظ على استدامة بركة الوحي وتثبيت المحفوظ"
        />

        {latest.length === 0 ? (
          <p className="text-center text-ink-mute mt-10">سيتم نشر المقالات قريبًا بإذن الله</p>
        ) : (
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {latest.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.1} className={`h-full ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
                <Link href={`/blog/${post.slug}`} className="group card-interactive h-full flex flex-col overflow-hidden !rounded-2xl border border-line hover:border-brand/40">
                  <div className="relative h-44 sm:h-48 bg-brand-soft overflow-hidden">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-400 group-hover:scale-110"
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-brand-ink/50 bg-gradient-to-br from-brand-soft to-surface-2">
                        <BookText size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Badge>{post.category}</Badge>
                      <h3 className="font-extrabold text-ink text-lg mt-3 leading-snug group-hover:text-brand-ink transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && <p className="text-sm text-ink-soft mt-2.5 line-clamp-2 leading-relaxed">{post.excerpt}</p>}
                    </div>
                    <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center justify-between text-xs font-bold text-brand-ink">
                      <span>قراءة المقال كاملاً</span>
                      <ArrowLeft size={14} className="group-hover:translate-x-[-3px] transition-transform" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal className="mt-12 text-center">
          <ButtonLink href="/blog" variant="outline">
            <ArrowLeft size={18} />
            تصفّح جميع المقالات
          </ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
