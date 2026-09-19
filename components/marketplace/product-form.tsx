"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, X, Plus, Loader2 } from "lucide-react";

export interface ProductFormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  audience: "WOMEN" | "MEN" | "UNISEX";
  images: string[];
  ingredients: string[];
  benefits: string[];
  stock: string;
  sustainabilityScore: string;
  isExternal: boolean;
  sourceUrl: string;
  sourceName: string;
}

const emptyValues: ProductFormValues = {
  name: "",
  description: "",
  price: "",
  category: "",
  audience: "UNISEX",
  images: [],
  ingredients: [],
  benefits: [],
  stock: "10",
  sustainabilityScore: "",
  isExternal: false,
  sourceUrl: "",
  sourceName: "",
};

function TagListInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-textPrimary">{label}</label>
      <div className="mb-2 flex flex-wrap gap-2">
        {values.map((value, i) => (
          <span
            key={`${value}-${i}`}
            className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-sm text-primary-700"
          >
            {value}
            <button
              type="button"
              onClick={() => onChange(values.filter((_, idx) => idx !== i))}
              className="text-primary-400 hover:text-primary-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
        <button
          type="button"
          onClick={add}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface hover:border-primary-300"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ProductForm({
  initialValues,
  isAdmin,
  onSubmit,
}: {
  initialValues?: Partial<ProductFormValues>;
  isAdmin: boolean;
  onSubmit: (values: ProductFormValues) => Promise<{ ok: boolean; message?: string }>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>({ ...emptyValues, ...initialValues });
  const [imageUrlDraft, setImageUrlDraft] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await response.json().catch(() => ({}));
    setUploading(false);

    if (!response.ok) {
      toast.error(data.message ?? "Image upload failed");
      return;
    }

    set("images", [...values.images, data.url]);
  };

  const addImageUrl = () => {
    const trimmed = imageUrlDraft.trim();
    if (!trimmed) return;
    try {
      new URL(trimmed);
    } catch {
      toast.error("Please enter a valid image URL");
      return;
    }
    set("images", [...values.images, trimmed]);
    setImageUrlDraft("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (values.images.length === 0) {
      toast.error("Add at least one product image");
      return;
    }

    setSubmitting(true);
    const result = await onSubmit(values);
    setSubmitting(false);

    if (!result.ok) {
      toast.error(result.message ?? "Something went wrong");
      return;
    }

    toast.success("Product saved");
    router.push("/entrepreneur");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-textPrimary">Product Name</label>
        <input
          required
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Rosewater Glow Serum"
          className="h-12 w-full rounded-xl border border-border bg-surface px-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-textPrimary">Description</label>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="What makes this product special, who it's for, how to use it..."
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-textPrimary">Price (₹)</label>
          <input
            required
            type="number"
            min="1"
            step="0.01"
            value={values.price}
            onChange={(e) => set("price", e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-textPrimary">Stock</label>
          <input
            required
            type="number"
            min="0"
            value={values.stock}
            onChange={(e) => set("stock", e.target.value)}
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-textPrimary">Category</label>
          <input
            required
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Skincare"
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-textPrimary">Eco Score</label>
          <input
            type="number"
            min="0"
            max="100"
            value={values.sustainabilityScore}
            onChange={(e) => set("sustainabilityScore", e.target.value)}
            placeholder="0-100"
            className="h-12 w-full rounded-xl border border-border bg-surface px-4 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-textPrimary">Audience</label>
        <div className="flex gap-2">
          {(["WOMEN", "MEN", "UNISEX"] as const).map((aud) => (
            <button
              key={aud}
              type="button"
              onClick={() => set("audience", aud)}
              className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                values.audience === aud
                  ? "border-primary-600 bg-primary-600 text-white"
                  : "border-border bg-surface text-textSecondary hover:border-primary-300"
              }`}
            >
              {aud === "WOMEN" ? "For Her" : aud === "MEN" ? "For Him" : "For Everyone"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-textPrimary">Images</label>
        <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {values.images.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => set("images", values.images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 text-sm text-textSecondary hover:border-primary-300">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
          </label>
          <div className="flex flex-1 gap-2">
            <input
              value={imageUrlDraft}
              onChange={(e) => setImageUrlDraft(e.target.value)}
              placeholder="...or paste an image URL"
              className="h-11 flex-1 rounded-xl border border-border bg-surface px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
            <button
              type="button"
              onClick={addImageUrl}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface hover:border-primary-300"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <TagListInput
        label="Ingredients"
        values={values.ingredients}
        onChange={(v) => set("ingredients", v)}
        placeholder="e.g. Hyaluronic Acid"
      />

      <TagListInput
        label="Benefits"
        values={values.benefits}
        onChange={(v) => set("benefits", v)}
        placeholder="e.g. Deep hydration"
      />

      {isAdmin && (
        <div className="rounded-2xl border border-dashed border-primary-300 bg-primary-50/50 p-5">
          <label className="mb-3 flex items-center gap-2 text-sm font-medium text-primary-700">
            <input
              type="checkbox"
              checked={values.isExternal}
              onChange={(e) => set("isExternal", e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            External catalog product (links out, no checkout)
          </label>
          {values.isExternal && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-textPrimary">
                  Source URL
                </label>
                <input
                  value={values.sourceUrl}
                  onChange={(e) => set("sourceUrl", e.target.value)}
                  placeholder="https://..."
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-textPrimary">
                  Source Name
                </label>
                <input
                  value={values.sourceName}
                  onChange={(e) => set("sourceName", e.target.value)}
                  placeholder="e.g. Nykaa"
                  className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-textPrimary font-medium text-white transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
