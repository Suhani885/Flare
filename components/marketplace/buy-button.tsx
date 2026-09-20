"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function BuyButton({
  purpose,
  productId,
  label,
  className,
}: {
  purpose: "product" | "subscription";
  productId?: string;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    const createRes = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purpose, productId }),
    });
    const order = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      toast.error(order.message ?? "Could not start checkout.");
      setLoading(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Flare",
      description: purpose === "subscription" ? "Premium subscription" : "Product purchase",
      order_id: order.razorpayOrderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ purpose, recordId: order.recordId, ...response }),
        });
        setLoading(false);
        if (!verifyRes.ok) {
          toast.error("Payment verification failed.");
          return;
        }
        toast.success(purpose === "subscription" ? "You're Premium now!" : "Purchase complete!");
        router.refresh();
      },
      modal: { ondismiss: () => setLoading(false) },
    });
    razorpay.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button
        onClick={pay}
        disabled={loading}
        className={
          className ??
          "inline-flex h-14 items-center justify-center gap-2 rounded-full bg-textPrimary px-10 font-medium text-white transition-all hover:scale-[1.02] disabled:opacity-60"
        }
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {label}
      </button>
    </>
  );
}
