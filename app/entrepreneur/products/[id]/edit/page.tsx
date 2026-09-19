"use client";

import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ProductForm, type ProductFormValues } from "@/components/marketplace/product-form";
import { paiseToRupees } from "@/lib/price-format";
import { Loader2 } from "lucide-react";

interface RawProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  audience: "WOMEN" | "MEN" | "UNISEX";
  images: string[];
  ingredients: string[];
  benefits: string[];
  stock: number;
  sustainabilityScore: number | null;
  isExternal: boolean;
  sourceUrl: string | null;
  sourceName: string | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [product, setProduct] = useState<RawProduct | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        setProduct(await res.json());
      })
      .catch(() => setNotFound(true));
  }, [id]);

  const handleSubmit = async (values: ProductFormValues) => {
    const response = await fetch(`/api/products/${id}`, {
      method: "PATCH",
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

  if (notFound) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <p className="text-textSecondary">
          Product not found, or you don&apos;t have permission to edit it.
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex justify-center px-6 py-32">
        <Loader2 className="h-6 w-6 animate-spin text-textMuted" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-24 md:px-12 md:py-32">
      <h1 className="mb-2 font-serif text-3xl font-light text-textPrimary md:text-4xl">
        Edit <span className="italic text-primary-600">Product</span>
      </h1>
      <p className="mb-10 text-textSecondary">
        Editing an already-approved listing sends it back for re-review.
      </p>
      <ProductForm
        isAdmin={isAdmin}
        initialValues={{
          name: product.name,
          description: product.description,
          price: String(paiseToRupees(product.price)),
          category: product.category,
          audience: product.audience,
          images: product.images,
          ingredients: product.ingredients,
          benefits: product.benefits,
          stock: String(product.stock),
          sustainabilityScore: product.sustainabilityScore ? String(product.sustainabilityScore) : "",
          isExternal: product.isExternal,
          sourceUrl: product.sourceUrl ?? "",
          sourceName: product.sourceName ?? "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
