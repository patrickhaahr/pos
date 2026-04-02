"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { ShoppingBag } from "lucide-react";

export default function Header() {
  const { totalItems, dispatch } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5">
      {/* Blurred backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,15,10,0.95) 0%, rgba(26,15,10,0) 100%)",
          backdropFilter: "none",
        }}
      />

      <Link href="/" className="group flex items-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "var(--color-amber)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 8h1a4 4 0 010 8h-1" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round"/>
            <path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round"/>
            <line x1="6" y1="1" x2="6" y2="4" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round"/>
            <line x1="10" y1="1" x2="10" y2="4" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round"/>
            <line x1="14" y1="1" x2="14" y2="4" stroke="#1a0f0a" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span
          className="font-display text-xl tracking-wide"
          style={{ color: "var(--color-cream)" }}
        >
          Brewhaus
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8">
        <Link
          href="/"
          className="underline-slide text-sm tracking-widest uppercase"
          style={{ color: "var(--color-cream-dark)", letterSpacing: "0.12em" }}
        >
          Menu
        </Link>
        <Link
          href="/#drinks"
          className="underline-slide text-sm tracking-widest uppercase"
          style={{ color: "var(--color-cream-dark)", letterSpacing: "0.12em" }}
        >
          Drinks
        </Link>
        <Link
          href="/#snacks"
          className="underline-slide text-sm tracking-widest uppercase"
          style={{ color: "var(--color-cream-dark)", letterSpacing: "0.12em" }}
        >
          Snacks
        </Link>
      </nav>

      <button
        onClick={() => dispatch({ type: "OPEN_CART" })}
        className="relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
        style={{
          background: "var(--color-espresso-mid)",
          border: "1px solid rgba(200,135,42,0.3)",
          color: "var(--color-cream)",
        }}
      >
        <ShoppingBag size={16} style={{ color: "var(--color-amber)" }} />
        <span className="text-sm font-medium">Cart</span>
        {totalItems > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold pulse-glow"
            style={{
              background: "var(--color-amber)",
              color: "var(--color-espresso)",
            }}
          >
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}
