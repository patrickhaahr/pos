"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/actions/products";
import ProductModal from "@/components/admin/ProductModal";
import type { Product } from "@/lib/schema";
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  initialProducts: Product[];
}

export default function ProductsClient({ initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  function handleDelete(id: number) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeletingId(null);
      router.refresh();
    });
  }

  function handleModalClose() {
    setShowCreate(false);
    setEditProduct(null);
    router.refresh();
    // Re-fetch products after modal close
    fetch("/admin/products/api")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }

  return (
    <>
      {(showCreate || editProduct) && (
        <ProductModal
          product={editProduct}
          onClose={handleModalClose}
        />
      )}

      <div className="max-w-6xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase font-medium mb-2"
              style={{ color: "var(--color-amber)" }}
            >
              — Inventory
            </p>
            <h1
              className="font-display text-4xl"
              style={{ color: "var(--color-cream)" }}
            >
              Products
            </h1>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 mt-2"
            style={{
              background: "var(--color-amber)",
              color: "var(--color-espresso)",
            }}
          >
            <Plus size={16} />
            New Product
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}
          />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--color-espresso-light)",
              border: "1px solid rgba(200,135,42,0.15)",
              color: "var(--color-cream)",
            }}
          />
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--color-espresso-light)",
            border: "1px solid rgba(200,135,42,0.1)",
          }}
        >
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Package
                size={32}
                style={{ color: "var(--color-amber)", opacity: 0.3 }}
              />
              <p
                className="text-sm"
                style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}
              >
                {search ? "No products match your search." : "No products yet."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr
                  style={{ borderBottom: "1px solid rgba(200,135,42,0.08)" }}
                >
                  {["Product", "Category", "Price", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-4 text-left text-xs tracking-widest uppercase font-medium"
                        style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className="transition-colors"
                    style={{
                      borderBottom:
                        i < filtered.length - 1
                          ? "1px solid rgba(200,135,42,0.05)"
                          : "none",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "rgba(200,135,42,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--color-cream)" }}
                        >
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                        style={{
                          background:
                            product.category === "drink"
                              ? "rgba(122,171,223,0.12)"
                              : "rgba(200,135,42,0.12)",
                          color:
                            product.category === "drink"
                              ? "#7aabdf"
                              : "var(--color-amber)",
                        }}
                      >
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="font-display font-semibold"
                        style={{ color: "var(--color-cream)" }}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={
                          product.inStock
                            ? {
                                background: "rgba(110,198,160,0.12)",
                                color: "#6ec6a0",
                              }
                            : {
                                background: "rgba(220,80,60,0.12)",
                                color: "#e87060",
                              }
                        }
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditProduct(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                          style={{
                            background: "rgba(200,135,42,0.08)",
                            color: "var(--color-amber)",
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id || isPending}
                          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                          style={{
                            background: "rgba(220,80,60,0.08)",
                            color: "#e87060",
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p
          className="text-xs mt-4 opacity-40"
          style={{ color: "var(--color-cream-dark)" }}
        >
          {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          {search ? ` matching "${search}"` : " total"}
        </p>
      </div>
    </>
  );
}
