import { getProducts } from "@/actions/products";
import { getOrders } from "@/actions/orders";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders] = await Promise.all([getProducts(), getOrders()]);

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inStockProducts = products.filter((p) => p.inStock).length;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      change: `${orders.length} orders`,
      color: "var(--color-amber)",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      change: `${pendingOrders} pending`,
      color: "#6ec6a0",
    },
    {
      label: "Products",
      value: products.length.toString(),
      icon: Package,
      change: `${inStockProducts} in stock`,
      color: "#7aabdf",
    },
    {
      label: "Avg. Order",
      value:
        orders.length > 0
          ? `$${(totalRevenue / orders.length).toFixed(2)}`
          : "$0.00",
      icon: TrendingUp,
      change: "per customer",
      color: "#c08adf",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <AdminShell>
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs tracking-[0.3em] uppercase font-medium mb-2"
            style={{ color: "var(--color-amber)" }}
          >
            — Overview
          </p>
          <h1
            className="font-display text-4xl"
            style={{ color: "var(--color-cream)" }}
          >
            Dashboard
          </h1>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map(({ label, value, icon: Icon, change, color }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{
                background: "var(--color-espresso-light)",
                border: "1px solid rgba(200,135,42,0.1)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <p
                  className="text-xs tracking-wider uppercase font-medium"
                  style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
                >
                  {label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}18` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <p
                className="font-display text-3xl font-semibold mb-1"
                style={{ color: "var(--color-cream)" }}
              >
                {value}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}
              >
                {change}
              </p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "var(--color-espresso-light)",
              border: "1px solid rgba(200,135,42,0.1)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="font-display text-xl"
                style={{ color: "var(--color-cream)" }}
              >
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="text-xs tracking-widest uppercase font-medium transition-opacity hover:opacity-80"
                style={{ color: "var(--color-amber)" }}
              >
                View All →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p
                className="text-sm py-8 text-center"
                style={{ color: "var(--color-cream-dark)", opacity: 0.4 }}
              >
                No orders yet.
              </p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl"
                    style={{ background: "rgba(200,135,42,0.04)" }}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="text-xs font-mono opacity-50"
                        style={{ color: "var(--color-cream-dark)" }}
                      >
                        #{String(order.id).padStart(4, "0")}
                      </span>
                      <div>
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--color-cream)" }}
                        >
                          {order.customerName}
                        </p>
                        <p
                          className="text-xs"
                          style={{
                            color: "var(--color-cream-dark)",
                            opacity: 0.5,
                          }}
                        >
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className="font-display font-semibold"
                        style={{ color: "var(--color-amber)" }}
                      >
                        ${order.total.toFixed(2)}
                      </span>
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={
                          order.status === "completed"
                            ? {
                                background: "rgba(110,198,160,0.12)",
                                color: "#6ec6a0",
                              }
                            : order.status === "cancelled"
                            ? {
                                background: "rgba(220,80,60,0.12)",
                                color: "#e87060",
                              }
                            : {
                                background: "rgba(200,135,42,0.12)",
                                color: "var(--color-amber)",
                              }
                        }
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--color-espresso-light)",
              border: "1px solid rgba(200,135,42,0.1)",
            }}
          >
            <h2
              className="font-display text-xl mb-6"
              style={{ color: "var(--color-cream)" }}
            >
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin/products"
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: "rgba(200,135,42,0.08)",
                  color: "var(--color-amber)",
                  border: "1px solid rgba(200,135,42,0.15)",
                }}
              >
                <Package size={16} />
                Manage Products
              </Link>
              <Link
                href="/admin/orders"
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: "rgba(110,198,160,0.08)",
                  color: "#6ec6a0",
                  border: "1px solid rgba(110,198,160,0.15)",
                }}
              >
                <ShoppingCart size={16} />
                View Orders
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: "rgba(122,171,223,0.08)",
                  color: "#7aabdf",
                  border: "1px solid rgba(122,171,223,0.15)",
                }}
              >
                <TrendingUp size={16} />
                Open Storefront
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
