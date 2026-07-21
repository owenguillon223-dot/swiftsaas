import Link from "next/link";
import { Sparkles } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            SwiftSaaS
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="hover:underline">Tableau de bord</Link>
            <Link href="/dashboard/agent" className="hover:underline">Agent IA</Link>
            <Link href="/dashboard/billing" className="hover:underline">Facturation</Link>
            <Link href="/dashboard/settings" className="hover:underline">Paramètres</Link>
            <span className="text-muted-foreground">{session?.user?.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Déconnexion
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
