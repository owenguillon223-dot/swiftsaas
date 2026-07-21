import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides et retours d'expérience sur la construction d'un SaaS IA facturé à l'usage : Stripe, Next.js, agents.",
};

export default function BlogIndexPage() {
  const posts = getAllPostsMeta();

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

      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">Blog</h1>
        <p className="mt-3 text-muted-foreground">
          Guides et retours d&apos;expérience sur la construction d&apos;un SaaS IA facturé à l&apos;usage.
        </p>

        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block rounded-lg border border-input p-6 transition-colors hover:border-primary/40 hover:bg-primary/[0.02]"
            >
              <p className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(post.date))}
              </p>
              <h2 className="mt-1 text-xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-muted-foreground">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
