"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

export default function ParrainageLinkCopy({ lien }: { lien: string }) {
  const [copie, setCopie] = useState(false);

  async function copier() {
    await navigator.clipboard.writeText(lien);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={lien}
        onFocus={(e) => e.currentTarget.select()}
        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground"
      />
      <Button type="button" variant="outline" onClick={copier}>
        {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copie ? "Copié" : "Copier"}
      </Button>
    </div>
  );
}
