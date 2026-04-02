"use client";

import { useCart } from "@/components/store/CartContext";
import { createOrder } from "@/actions/orders";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lock, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { state, totalPrice, dispatch } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.items.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const result = await createOrder(
        form.name,
        form.email,
        state.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))
      );
      if (result.success) {
        dispatch({ type: "CLEAR" });
        router.push(`/order-confirmation?orderId=${result.orderId}`);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6"
        style={{ background: "var(--color-espresso)" }}
      >
        <h2
          className="font-display text-3xl"
          style={{ color: "var(--color-cream)" }}
        >
          Your cart is empty
        </h2>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm"
          style={{ color: "var(--color-amber)" }}
        >
          <ArrowLeft size={14} /> Back to menu
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-6 md:px-12"
      style={{ background: "var(--color-espresso)" }}
    >
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-10 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: "var(--color-cream-dark)" }}
        >
          <ArrowLeft size={14} /> Back to menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order form */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase font-medium mb-2"
              style={{ color: "var(--color-amber)" }}
            >
              — Complete Your Order
            </p>
            <h1
              className="font-display text-4xl mb-8"
              style={{ color: "var(--color-cream)" }}
            >
              Checkout
            </h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs tracking-widest uppercase mb-2 font-medium"
                  style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 placeholder-opacity-30"
                  style={{
                    background: "var(--color-espresso-mid)",
                    border: "1px solid rgba(200,135,42,0.2)",
                    color: "var(--color-cream)",
                  }}
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
                  className="block text-xs tracking-widest uppercase mb-2 font-medium"
                  style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="jane@example.com"
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--color-espresso-mid)",
                    border: "1px solid rgba(200,135,42,0.2)",
                    color: "var(--color-cream)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(200,135,42,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(200,135,42,0.2)")
                  }
                />
              </div>

              {error && (
                <p
                  className="text-sm px-4 py-3 rounded-lg"
                  style={{
                    background: "rgba(220,80,60,0.1)",
                    color: "#e87060",
                    border: "1px solid rgba(220,80,60,0.2)",
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-sm mt-2 transition-all duration-200 cursor-pointer disabled:opacity-60"
                style={{
                  background: "var(--color-amber)",
                  color: "var(--color-espresso)",
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Lock size={16} />
                )}
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <p
                className="text-xs text-center opacity-50"
                style={{ color: "var(--color-cream-dark)" }}
              >
                This is a demo order — no real payment required.
              </p>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase font-medium mb-2"
              style={{ color: "var(--color-amber)" }}
            >
              — Order Summary
            </p>
            <h2
              className="font-display text-2xl mb-6"
              style={{ color: "var(--color-cream)" }}
            >
              {state.items.length} item{state.items.length !== 1 ? "s" : ""}
            </h2>

            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "var(--color-espresso-light)",
                border: "1px solid rgba(200,135,42,0.1)",
              }}
            >
              <div className="p-5 space-y-4">
                {state.items.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-cream)" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
                      >
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p
                      className="font-display font-semibold"
                      style={{ color: "var(--color-amber)" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div
                className="px-5 py-4 flex justify-between items-center"
                style={{ borderTop: "1px solid rgba(200,135,42,0.1)" }}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--color-cream-dark)" }}
                >
                  Total
                </span>
                <span
                  className="font-display text-2xl font-semibold"
                  style={{ color: "var(--color-cream)" }}
                >
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
