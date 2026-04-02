"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import { LayoutDashboard, Package, ShoppingCart, LogOut, Coffee } from "lucide-react";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: Package, label: "Products" },
  { href: "/admin/orders", icon: ShoppingCart, label: "Orders" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed top-0 left-0 bottom-0 z-40 flex flex-col w-64 px-4 py-6"
      style={{
        background: "var(--color-espresso-light)",
        borderRight: "1px solid rgba(200,135,42,0.1)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-amber)" }}
        >
          <Coffee size={18} style={{ color: "var(--color-espresso)" }} />
        </div>
        <div>
          <p
            className="font-display text-base leading-tight"
            style={{ color: "var(--color-cream)" }}
          >
            Brewhaus
          </p>
          <p
            className="text-xs opacity-50"
            style={{ color: "var(--color-cream-dark)", letterSpacing: "0.08em" }}
          >
            Admin
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={
                active
                  ? {
                      background: "rgba(200,135,42,0.15)",
                      color: "var(--color-amber)",
                    }
                  : {
                      color: "var(--color-cream-dark)",
                      opacity: 0.6,
                    }
              }
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        className="my-4 h-px"
        style={{ background: "rgba(200,135,42,0.08)" }}
      />

      {/* Back to store */}
      <Link
        href="/"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 mb-2"
        style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}
      >
        <Coffee size={16} />
        View Store
      </Link>

      {/* Logout */}
      <form action={logout}>
        <button
          type="submit"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </form>
    </aside>
  );
}
