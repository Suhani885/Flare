"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";

export function ProductApprovalActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVED" | "REJECTED" | null>(null);

  const setStatus = async (status: "APPROVED" | "REJECTED") => {
    setLoading(status);
    const response = await fetch(`/api/products/${productId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(null);

    if (!response.ok) {
      toast.error("Could not update product status");
      return;
    }

    toast.success(status === "APPROVED" ? "Product approved" : "Product rejected");
    router.refresh();
  };

  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={() => setStatus("APPROVED")}
        disabled={loading !== null}
        className="flex h-10 items-center gap-1.5 rounded-full bg-secondary-600 px-4 text-sm font-medium text-white transition-all hover:bg-secondary-700 disabled:opacity-60"
      >
        {loading === "APPROVED" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
        Approve
      </button>
      <button
        onClick={() => setStatus("REJECTED")}
        disabled={loading !== null}
        className="flex h-10 items-center gap-1.5 rounded-full border border-border px-4 text-sm font-medium text-textSecondary transition-all hover:border-red-300 hover:text-red-600 disabled:opacity-60"
      >
        {loading === "REJECTED" ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        Reject
      </button>
    </div>
  );
}
