import { getProducts } from "@/actions/products";
import ProductCard from "@/components/store/ProductCard";
import type { Product } from "@/lib/schema";

export const dynamic = "force-dynamic";

export default async function StorePage() {
  const allProducts = await getProducts();
  const drinks = allProducts.filter((p) => p.category === "drink");
  const snacks = allProducts.filter((p) => p.category === "snack");

  return (
    <div className="min-h-screen" style={{ background: "var(--color-espresso)" }}>
      {/* Hero */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-20"
      >
        {/* Background radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(200,135,42,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Decorative rings */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(200,135,42,0.06)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ border: "1px solid rgba(200,135,42,0.08)" }}
        />

        <div className="relative z-10 max-w-4xl">
          <p
            className="animate-fade-up delay-100 text-xs tracking-[0.35em] uppercase mb-6 font-medium"
            style={{ color: "var(--color-amber)" }}
          >
            Artisan Coffee & Provisions
          </p>
          <h1
            className="animate-fade-up delay-200 font-display text-6xl md:text-8xl leading-none mb-6"
            style={{ color: "var(--color-cream)" }}
          >
            Crafted with
            <br />
            <span
              className="italic"
              style={{ color: "var(--color-amber)" }}
            >
              intention.
            </span>
          </h1>
          <p
            className="animate-fade-up delay-300 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
          >
            Every cup sourced from single-origin farms. Every bite made from
            scratch. This is coffee worth slowing down for.
          </p>
          <a
            href="#menu"
            className="animate-fade-up delay-400 inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm transition-all duration-200 hover:gap-3"
            style={{
              background: "var(--color-amber)",
              color: "var(--color-espresso)",
            }}
          >
            Browse the Menu
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 5v14M5 12l7 7 7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-fade-up delay-700 absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "var(--color-cream-dark)", opacity: 0.3 }}
        >
          <div className="w-px h-12 shimmer" style={{ background: "var(--color-amber)" }} />
        </div>
      </section>

      {/* Menu section */}
      <section id="menu" className="px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Drinks */}
          <div id="drinks" className="mb-20">
            <div className="flex items-center gap-6 mb-10">
              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase font-medium mb-1"
                  style={{ color: "var(--color-amber)" }}
                >
                  — Section 01
                </p>
                <h2
                  className="font-display text-4xl md:text-5xl"
                  style={{ color: "var(--color-cream)" }}
                >
                  Drinks
                </h2>
              </div>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to right, rgba(200,135,42,0.3), transparent)",
                }}
              />
            </div>

            {drinks.length === 0 ? (
              <p style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}>
                No drinks available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {drinks.map((product: Product, i: number) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>

          {/* Snacks */}
          <div id="snacks">
            <div className="flex items-center gap-6 mb-10">
              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase font-medium mb-1"
                  style={{ color: "var(--color-amber)" }}
                >
                  — Section 02
                </p>
                <h2
                  className="font-display text-4xl md:text-5xl"
                  style={{ color: "var(--color-cream)" }}
                >
                  Snacks
                </h2>
              </div>
              <div
                className="flex-1 h-px"
                style={{
                  background:
                    "linear-gradient(to right, rgba(200,135,42,0.3), transparent)",
                }}
              />
            </div>

            {snacks.length === 0 ? (
              <p style={{ color: "var(--color-cream-dark)", opacity: 0.5 }}>
                No snacks available.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {snacks.map((product: Product, i: number) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="px-6 md:px-12 py-10"
        style={{
          borderTop: "1px solid rgba(200,135,42,0.1)",
          color: "var(--color-cream-dark)",
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg" style={{ color: "var(--color-cream)" }}>
            Brewhaus
          </p>
          <p className="text-xs opacity-40 tracking-widest uppercase">
            © 2026 · Artisan Coffee & Provisions
          </p>
          <a
            href="/admin/login"
            className="text-xs opacity-30 hover:opacity-60 transition-opacity tracking-widest uppercase"
          >
            Staff Login
          </a>
        </div>
      </footer>
    </div>
  );
}
