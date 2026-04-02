"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/actions/products";
import type { Product } from "@/lib/schema";
import { X, Loader2 } from "lucide-react";

interface Props {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const isEdit = !!product;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      price: parseFloat(fd.get("price") as string),
      category: fd.get("category") as "drink" | "snack",
      imageUrl: fd.get("imageUrl") as string,
      inStock: fd.get("inStock") === "true",
    };

    startTransition(async () => {
      let result;
      if (isEdit && product) {
        result = await updateProduct(product.id, data);
      } else {
        result = await createProduct(data);
      }
      if (result?.error) {
        setError(result.error);
      } else {
        onClose();
      }
    });
  }

  const inputStyle = {
    background: "var(--color-espresso-mid)",
    border: "1px solid rgba(200,135,42,0.2)",
    color: "var(--color-cream)",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0"
        style={{ background: "rgba(26,15,10,0.8)", backdropFilter: "blur(4px)" }}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl p-7 animate-fade-up max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--color-espresso-light)",
          border: "1px solid rgba(200,135,42,0.15)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6)",
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-display text-2xl"
            style={{ color: "var(--color-cream)" }}
          >
            {isEdit ? "Edit Product" : "New Product"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{
              background: "rgba(200,135,42,0.1)",
              color: "var(--color-cream-dark)",
            }}
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={product?.name ?? ""}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,135,42,0.6)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,135,42,0.2)")
                }
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product?.price ?? ""}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,135,42,0.6)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(200,135,42,0.2)")
                }
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Category
              </label>
              <select
                name="category"
                required
                defaultValue={product?.category ?? "drink"}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
                style={inputStyle}
              >
                <option value="drink">Drink</option>
                <option value="snack">Snack</option>
              </select>
            </div>
          </div>

          <div>
            <label
              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
              style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
            >
              Description
            </label>
            <textarea
              name="description"
              required
              rows={3}
              defaultValue={product?.description ?? ""}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(200,135,42,0.6)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(200,135,42,0.2)")
              }
            />
          </div>

          <div>
            <label
              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
              style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
            >
              Image URL
            </label>
            <input
              name="imageUrl"
              type="url"
              required
              defaultValue={product?.imageUrl ?? ""}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={inputStyle}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "rgba(200,135,42,0.6)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(200,135,42,0.2)")
              }
            />
          </div>

          <div>
            <label
              className="block text-xs tracking-widest uppercase mb-1.5 font-medium"
              style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
            >
              Stock Status
            </label>
            <select
              name="inStock"
              defaultValue={product?.inStock !== false ? "true" : "false"}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none cursor-pointer"
              style={inputStyle}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>

          {error && (
            <p
              className="text-sm px-4 py-2.5 rounded-lg"
              style={{
                background: "rgba(220,80,60,0.1)",
                color: "#e87060",
                border: "1px solid rgba(220,80,60,0.2)",
              }}
            >
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
              style={{
                background: "rgba(200,135,42,0.06)",
                color: "var(--color-cream-dark)",
                border: "1px solid rgba(200,135,42,0.12)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all disabled:opacity-60"
              style={{
                background: "var(--color-amber)",
                color: "var(--color-espresso)",
              }}
            >
              {isPending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : null}
              {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
