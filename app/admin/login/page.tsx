"use client";

import { useState, useTransition } from "react";
import { login } from "@/actions/auth";
import { Coffee, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await login(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-espresso)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(200,135,42,0.08) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-sm animate-fade-up"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "var(--color-amber)",
            }}
          >
            <Coffee size={24} style={{ color: "var(--color-espresso)" }} />
          </div>
          <p
            className="font-display text-3xl mb-1"
            style={{ color: "var(--color-cream)" }}
          >
            Brewhaus
          </p>
          <p
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: "var(--color-amber)", opacity: 0.8 }}
          >
            Staff Portal
          </p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: "var(--color-espresso-light)",
            border: "1px solid rgba(200,135,42,0.15)",
          }}
        >
          <h1
            className="font-display text-2xl mb-6"
            style={{ color: "var(--color-cream)" }}
          >
            Sign In
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs tracking-widest uppercase mb-2 font-medium"
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Username
              </label>
              <input
                name="username"
                type="text"
                required
                defaultValue=""
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200"
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
                style={{ color: "var(--color-cream-dark)", opacity: 0.6 }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  required
                  defaultValue=""
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{
                    background: "var(--color-espresso-mid)",
                    border: "1px solid rgba(200,135,42,0.2)",
                    color: "var(--color-cream)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(200,135,42,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(200,135,42,0.2)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer opacity-40 hover:opacity-70 transition-opacity"
                  style={{ color: "var(--color-cream-dark)" }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p
                className="text-sm px-4 py-2.5 rounded-lg"
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
              disabled={isPending}
              className="w-full py-3.5 rounded-xl font-semibold text-sm mt-2 transition-all duration-200 cursor-pointer disabled:opacity-60"
              style={{
                background: "var(--color-amber)",
                color: "var(--color-espresso)",
              }}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p
          className="text-xs text-center mt-6 opacity-30"
          style={{ color: "var(--color-cream-dark)" }}
        >
          Demo credentials: admin / admin
        </p>
      </div>
    </div>
  );
}
