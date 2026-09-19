"use client";

import { useSession } from "next-auth/react";
import { ProductForm, type ProductFormValues } from "@/components/marketplace/product-form";

export default function NewProductPage() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const handleSubmit = async (values: ProductFormValues) => {
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        price: Number(values.price),
        stock: Number(values.stock),
        sustainabilityScore: values.sustainabilityScore
          ? Number(values.sustainabilityScore)
          : null,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, message: data.message };
    return { ok: true };
  };

  return (
    <div className="container mx-auto max-w-2xl px-6 py-24 md:px-12 md:py-32">
      <h1 className="mb-2 font-serif text-3xl font-light text-textPrimary md:text-4xl">
        Add a <span className="italic text-primary-600">Product</span>
      </h1>
      <p className="mb-10 text-textSecondary">
        New listings are reviewed by an admin before they appear in the marketplace.
      </p>
      <ProductForm isAdmin={isAdmin} onSubmit={handleSubmit} />
    </div>
  );
}
