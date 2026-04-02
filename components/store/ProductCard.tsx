"use client";

import { useCart } from "./CartContext";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/schema";

interface Props {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: Props) {
  const { dispatch, state } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const inCart = state.items.find((i) => i.productId === product.id);

  function handleAdd() {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
      },
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  const delayClass = [
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
    "delay-600",
    "delay-700",
    "delay-800",
  ][index % 8];

  return (
    <div
      className={`card-lift animate-fade-up ${delayClass} group relative rounded-2xl overflow-hidden flex flex-col`}
      style={{
        background: "var(--color-espresso-light)",
        border: "1px solid rgba(200,135,42,0.12)",
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(26,15,10,0.8) 0%, transparent 50%)",
          }}
        />
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider"
          style={{
            background: "rgba(26,15,10,0.75)",
            color: "var(--color-amber)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(200,135,42,0.3)",
            letterSpacing: "0.1em",
          }}
        >
          {product.category}
        </div>
        {/* Out of stock */}
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(26,15,10,0.7)",
              color: "var(--color-cream-dark)",
            }}
          >
            Sold Out
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-display text-lg leading-tight"
            style={{ color: "var(--color-cream)" }}
          >
            {product.name}
          </h3>
          <span
            className="font-display text-xl font-semibold shrink-0"
            style={{ color: "var(--color-amber)" }}
          >
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p
          className="text-sm leading-relaxed flex-1"
          style={{ color: "var(--color-cream-dark)", opacity: 0.75 }}
        >
          {product.description}
        </p>

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={
            justAdded
              ? {
                  background: "rgba(200,135,42,0.15)",
                  color: "var(--color-amber)",
                  border: "1px solid rgba(200,135,42,0.4)",
                }
              : {
                  background: inCart
                    ? "rgba(200,135,42,0.1)"
                    : "var(--color-amber)",
                  color: inCart ? "var(--color-amber)" : "var(--color-espresso)",
                  border: inCart
                    ? "1px solid rgba(200,135,42,0.4)"
                    : "1px solid transparent",
                }
          }
        >
          {justAdded ? (
            <>
              <Check size={15} />
              Added!
            </>
          ) : inCart ? (
            <>
              <Plus size={15} />
              Add Another
            </>
          ) : (
            <>
              <Plus size={15} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
