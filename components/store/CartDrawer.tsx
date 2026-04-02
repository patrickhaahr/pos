"use client";

import { useCart } from "./CartContext";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function CartDrawer() {
  const { state, dispatch, totalItems, totalPrice } = useCart();

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dispatch({ type: "CLOSE_CART" });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  // Lock body scroll when open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state.isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => dispatch({ type: "CLOSE_CART" })}
        className="fixed inset-0 z-50 transition-all duration-300"
        style={{
          background: "rgba(26,15,10,0.7)",
          backdropFilter: "blur(4px)",
          opacity: state.isOpen ? 1 : 0,
          pointerEvents: state.isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md transition-transform duration-500"
        style={{
          background: "var(--color-espresso-light)",
          borderLeft: "1px solid rgba(200,135,42,0.15)",
          transform: state.isOpen ? "translateX(0)" : "translateX(100%)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(200,135,42,0.1)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} style={{ color: "var(--color-amber)" }} />
            <h2
              className="font-display text-xl"
              style={{ color: "var(--color-cream)" }}
            >
              Your Order
            </h2>
            {totalItems > 0 && (
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "var(--color-amber)",
                  color: "var(--color-espresso)",
                }}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: "CLOSE_CART" })}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{
              background: "rgba(200,135,42,0.1)",
              color: "var(--color-cream-dark)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(200,135,42,0.08)" }}
              >
                <ShoppingBag
                  size={28}
                  style={{ color: "var(--color-amber)", opacity: 0.5 }}
                />
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Your cart is empty.
                <br />
                Add something delicious.
              </p>
            </div>
          ) : (
            state.items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 rounded-xl p-3"
                style={{
                  background: "rgba(200,135,42,0.05)",
                  border: "1px solid rgba(200,135,42,0.08)",
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-display text-sm font-medium truncate"
                    style={{ color: "var(--color-cream)" }}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--color-amber)" }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QTY",
                          payload: {
                            productId: item.productId,
                            quantity: item.quantity - 1,
                          },
                        })
                      }
                      className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                      style={{
                        background: "rgba(200,135,42,0.15)",
                        color: "var(--color-amber)",
                      }}
                    >
                      <Minus size={10} />
                    </button>
                    <span
                      className="text-sm font-medium w-5 text-center"
                      style={{ color: "var(--color-cream)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: "UPDATE_QTY",
                          payload: {
                            productId: item.productId,
                            quantity: item.quantity + 1,
                          },
                        })
                      }
                      className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                      style={{
                        background: "rgba(200,135,42,0.15)",
                        color: "var(--color-amber)",
                      }}
                    >
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      payload: item.productId,
                    })
                  }
                  className="self-start mt-1 cursor-pointer transition-opacity opacity-40 hover:opacity-100"
                  style={{ color: "var(--color-cream-dark)" }}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div
            className="px-6 py-5 space-y-4"
            style={{ borderTop: "1px solid rgba(200,135,42,0.1)" }}
          >
            <div className="flex justify-between items-center">
              <span
                className="text-sm"
                style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
              >
                Subtotal
              </span>
              <span
                className="font-display text-xl font-semibold"
                style={{ color: "var(--color-cream)" }}
              >
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200"
              style={{
                background: "var(--color-amber)",
                color: "var(--color-espresso)",
              }}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
