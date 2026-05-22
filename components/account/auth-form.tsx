"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function AuthForm() {
  const router = useRouter();
  const params = useSearchParams();
  const initialMode = params.get("mode") === "signup" ? "signup" : "login";
  const redirect = params.get("redirect") ?? "/account";
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const supabase = getSupabaseBrowserClient();

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("Supabase is not configured yet. Add Supabase environment variables to enable authentication.");
      return;
    }

    startTransition(async () => {
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { full_name: fullName },
                emailRedirectTo: `${window.location.origin}/account`,
              },
            });

      if (result.error) {
        setMessage(result.error.message);
        return;
      }

      if (mode === "signup") {
        setMessage("Account created. Please check your email if confirmation is enabled.");
      } else {
        router.push(redirect);
      }
    });
  }

  return (
    <div className="rounded-2xl border border-line/90 bg-white p-6 shadow-soft">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-brand">PrintMe account</p>
      <h1 className="mt-2 text-3xl font-black text-ink">{mode === "login" ? "Get back to your print jobs" : "Create your PrintMe account"}</h1>
      <p className="mt-2 text-sm leading-6 text-slate">
        Keep quotes, orders, artwork files, invoices, and future reorders easier to manage.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink">Full name</span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required={mode === "signup"}
              autoComplete="name"
              className="premium-input w-full"
            />
          </label>
        ) : null}
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            className="premium-input w-full"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="premium-input w-full"
          />
        </label>
        {message ? <p className="rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand">{message}</p> : null}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Please wait..." : mode === "login" ? "Sign In Securely" : "Create My Account"}
        </Button>
      </form>
      <div className="mt-5 flex flex-col gap-3 text-center text-sm">
        <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-bold text-brand transition hover:text-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25">
          {mode === "login" ? "Create an account for faster reorders" : "Already have an account? Sign in"}
        </button>
        <a href="/account/forgot-password" className="font-bold text-slate transition hover:text-brand">Forgot password?</a>
      </div>
    </div>
  );
}
