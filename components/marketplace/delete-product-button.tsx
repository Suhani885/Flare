"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setDeleting(true);
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    setDeleting(false);

    if (!response.ok) {
      toast.error("Could not delete this product");
      return;
    }

    toast.success("Product deleted");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      disabled={deleting}
      className={`flex h-10 items-center justify-center gap-1.5 rounded-full border px-3 text-sm transition-all disabled:opacity-60 ${
        confirming
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-border text-textSecondary hover:border-red-300 hover:text-red-600"
      }`}
    >
      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      {confirming ? "Confirm?" : ""}
    </button>
  );
}
