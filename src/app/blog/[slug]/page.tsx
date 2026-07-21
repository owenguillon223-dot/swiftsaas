import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getAllPostsMeta, getPostBySlug } from "@/lib/blog";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllPostsMeta().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            SwiftSaaS
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/blog" className="font-medium text-primary">
              Blog
            </Link>
            <Link href="/login" className="text-muted-foreground hover:text-foreground">
              Connexion
            </Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
          ← Tous les articles
        </Link>
        <p className="mt-6 text-xs text-muted-foreground">
          {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(post.date))}
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{post.title}</h1>
        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    </main>
  );
}
