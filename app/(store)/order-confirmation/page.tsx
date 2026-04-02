import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--color-espresso)" }}
    >
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,135,42,0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-md animate-fade-up">
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
          style={{
            background: "rgba(200,135,42,0.1)",
            border: "1px solid rgba(200,135,42,0.3)",
          }}
        >
          <CheckCircle
            size={36}
            style={{ color: "var(--color-amber)" }}
          />
        </div>

        <p
          className="text-xs tracking-[0.3em] uppercase font-medium mb-3"
          style={{ color: "var(--color-amber)" }}
        >
          Order Confirmed
        </p>

        <h1
          className="font-display text-5xl mb-4"
          style={{ color: "var(--color-cream)" }}
        >
          Thank you!
        </h1>

        <p
          className="text-base leading-relaxed mb-3"
          style={{ color: "var(--color-cream-dark)", opacity: 0.7 }}
        >
          Your order has been received and is being prepared with care.
        </p>

        {orderId && (
          <p
            className="text-sm mb-10 px-4 py-2 rounded-full inline-block"
            style={{
              background: "rgba(200,135,42,0.1)",
              color: "var(--color-amber)",
              border: "1px solid rgba(200,135,42,0.2)",
            }}
          >
            Order #{orderId.padStart(4, "0")}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: "var(--color-amber)",
              color: "var(--color-espresso)",
            }}
          >
            Order Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: "var(--color-espresso-light)",
              color: "var(--color-cream)",
              border: "1px solid rgba(200,135,42,0.2)",
            }}
          >
            <ArrowLeft size={14} /> Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}
