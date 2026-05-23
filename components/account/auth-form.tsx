"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input } from "@/components/ui/form-controls";
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
    <div className="surface-card p-6">
      <p className="editorial-kicker">PrintMe account</p>
      <h1 className="display-title mt-3 text-[2.3rem] font-black leading-[0.96]">{mode === "login" ? "Get back to your print jobs" : "Create your PrintMe account"}</h1>
      <p className="mt-2 text-sm leading-6 text-slate">
        Keep quotes, orders, artwork files, invoices, and future reorders easier to manage.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === "signup" ? (
          <Field label="Full name">
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required={mode === "signup"}
              autoComplete="name"
            />
          </Field>
        ) : null}
        <Field label="Email">
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </Field>
        {message ? <FeedbackMessage>{message}</FeedbackMessage> : null}
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
