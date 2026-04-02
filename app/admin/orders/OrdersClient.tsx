"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/actions/orders";
import type { Order } from "@/lib/schema";
import { ShoppingCart, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  initialOrders: Order[];
}

const statusOptions = ["pending", "completed", "cancelled"] as const;

type Status = (typeof statusOptions)[number];

const statusStyle: Record<Status, { bg: string; color: string }> = {
  pending: { bg: "rgba(200,135,42,0.12)", color: "var(--color-amber)" },
  completed: { bg: "rgba(110,198,160,0.12)", color: "#6ec6a0" },
  cancelled: { bg: "rgba(220,80,60,0.12)", color: "#e87060" },
};

export default function OrdersClient({ initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      String(o.id).includes(search);
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  function handleStatusChange(orderId: number, newStatus: Status) {
    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      router.refresh();
    });
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <p
          className="text-xs tracking-[0.3em] uppercase font-medium mb-2"
          style={{ color: "var(--color-amber)" }}
        >
          — Transactions
        </p>
        <h1
          className="font-display text-4xl"
          style={{ color: "var(--color-cream)" }}
        >
          Orders
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}
          />
          <input
            type="text"
            placeholder="Search orders..."
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

        <div className="flex gap-2">
          {(["all", ...statusOptions] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-4 py-2 rounded-xl text-xs font-medium capitalize cursor-pointer transition-all"
              style={
                filter === s
                  ? {
                      background: "var(--color-amber)",
                      color: "var(--color-espresso)",
                    }
                  : {
                      background: "var(--color-espresso-light)",
                      color: "var(--color-cream-dark)",
                      border: "1px solid rgba(200,135,42,0.12)",
                      opacity: 0.7,
                    }
              }
            >
              {s}
            </button>
          ))}
        </div>
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
            <ShoppingCart
              size={32}
              style={{ color: "var(--color-amber)", opacity: 0.3 }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}
            >
              {search || filter !== "all"
                ? "No orders match your filters."
                : "No orders yet."}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(200,135,42,0.08)" }}>
                {["Order", "Customer", "Date", "Total", "Status", "Actions"].map(
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
              {filtered.map((order, i) => (
                <tr
                  key={order.id}
                  style={{
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid rgba(200,135,42,0.05)"
                        : "none",
                  }}
                >
                  <td className="px-5 py-4">
                    <span
                      className="font-mono text-sm"
                      style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
                    >
                      #{String(order.id).padStart(4, "0")}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "var(--color-cream)" }}
                      >
                        {order.customerName}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}
                      >
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="font-display font-semibold"
                      style={{ color: "var(--color-cream)" }}
                    >
                      ${order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                      style={statusStyle[order.status as Status]}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative inline-block">
                      <select
                        value={order.status}
                        disabled={isPending}
                        onChange={(e) =>
                          handleStatusChange(
                            order.id,
                            e.target.value as Status
                          )
                        }
                        className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium cursor-pointer outline-none transition-colors disabled:opacity-50"
                        style={{
                          background: "rgba(200,135,42,0.08)",
                          color: "var(--color-amber)",
                          border: "1px solid rgba(200,135,42,0.2)",
                        }}
                      >
                        {statusOptions.map((s) => (
                          <option
                            key={s}
                            value={s}
                            style={{
                              background: "var(--color-espresso-mid)",
                              color: "var(--color-cream)",
                            }}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={11}
                        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "var(--color-amber)" }}
                      />
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
        {filtered.length} order{filtered.length !== 1 ? "s" : ""}
        {search || filter !== "all" ? " shown" : " total"}
      </p>
    </div>
  );
}
