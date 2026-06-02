"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { CheckboxTile, FeedbackMessage, Field, Input } from "@/components/ui/form-controls";
import { Icon } from "@/components/ui/icon";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { sanitizeInternalRedirect } from "@/lib/security";
import { useAuth } from "@/components/account/auth-provider";

type AuthMode = "login" | "signup";

function validatePassword(password: string) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return "Use at least one letter and one number.";
  return "";
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const params = useSearchParams();
  const { user, configured } = useAuth();
  const redirect = sanitizeInternalRedirect(params.get("redirect"), "/account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(mode === "login");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "default" | "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (configured && user) {
      router.replace(redirect);
    }
  }, [configured, redirect, router, user]);

  const passwordHint = useMemo(() => {
    if (!password) return "Use at least 8 characters with a letter and number.";
    const error = validatePassword(password);
    return error || "Password strength looks good.";
  }, [password]);

  function clearFieldError(field: string) {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const nextErrors: Record<string, string> = {};
    if (!email.trim()) nextErrors.email = "Enter your account email.";
    if (!password) nextErrors.password = mode === "login" ? "Enter your password." : "Create a password.";
    if (mode === "signup" && !fullName.trim()) nextErrors.fullName = "Enter your name.";
    if (mode === "signup") {
      const passwordError = validatePassword(password);
      if (passwordError) nextErrors.password = passwordError;
      if (!agreeToTerms) nextErrors.agreeToTerms = "Please agree to the Terms and Privacy Policy.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setMessage({ tone: "error", text: "Please fix the highlighted fields so we can continue securely." });
      return;
    }

    if (!supabase) {
      setMessage({ tone: "error", text: "Supabase is not configured yet. Add the auth environment variables to enable customer accounts." });
      return;
    }

    startTransition(async () => {
      const normalizedEmail = email.trim().toLowerCase();
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email: normalizedEmail, password })
          : await supabase.auth.signUp({
              email: normalizedEmail,
              password,
              options: {
                data: { full_name: fullName.trim() },
                emailRedirectTo: `${window.location.origin}/account`,
              },
            });

      if (result.error) {
        setMessage({ tone: "error", text: result.error.message });
        return;
      }

      const accessToken = result.data.session?.access_token;
      if (accessToken) {
        await fetch("/api/account/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
          }),
        }).catch(() => undefined);
      }

      if (mode === "signup") {
        setMessage({
          tone: "success",
          text: "Account created. If email confirmation is enabled, check your inbox. If not, you can continue straight into your PrintMe account.",
        });
        if (result.data.session) {
          router.push(redirect);
        }
        return;
      }

      router.push(redirect);
    });
  }

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="editorial-kicker">PrintMe account</p>
          <h2 className="display-title mt-3 text-[2.1rem] font-semibold leading-[0.92]">
            {mode === "login" ? "Sign in to your customer portal" : "Create your PrintMe account"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate">
            {mode === "login"
              ? "Access quotes, orders, uploads, addresses, and repeat-order tools from one secure account."
              : "Start with the essentials only, then manage orders, quotes, uploads, addresses, and future reorders from your dashboard."}
          </p>
        </div>
        <div className="hidden rounded-[1.2rem] border border-white/80 bg-white/84 px-4 py-3 text-right text-xs leading-5 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:block">
          <p className="font-black text-ink">Secure access</p>
          <p className="mt-1">Customer data stays tied to the right account.</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
        {mode === "signup" ? (
          <Field label="Full name" hint="Used for account identity, quotes, and order follow-up." error={fieldErrors.fullName}>
            <Input
              value={fullName}
              onChange={(event) => {
                setFullName(event.target.value);
                clearFieldError("fullName");
              }}
              required
              autoComplete="name"
              aria-invalid={Boolean(fieldErrors.fullName)}
            />
          </Field>
        ) : null}

        <Field label="Email" hint="Use the email tied to your PrintMe account." error={fieldErrors.email}>
          <Input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFieldError("email");
            }}
            required
            autoComplete="email"
            aria-invalid={Boolean(fieldErrors.email)}
          />
        </Field>

        <Field label="Password" hint={passwordHint} error={fieldErrors.password}>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                clearFieldError("password");
              }}
              required
              minLength={8}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              aria-invalid={Boolean(fieldErrors.password)}
              className="pr-14"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </Field>

        {mode === "signup" ? (
          <div className="space-y-2">
            <CheckboxTile
              checked={agreeToTerms}
              onChange={(event) => {
                setAgreeToTerms(event.target.checked);
                clearFieldError("agreeToTerms");
              }}
              className={fieldErrors.agreeToTerms ? "border-brand/35" : undefined}
            >
              <span>
                I agree to the <Link href="/terms" className="font-black text-brand hover:text-brand-dark">Terms</Link> and <Link href="/privacy" className="font-black text-brand hover:text-brand-dark">Privacy Policy</Link>.
              </span>
            </CheckboxTile>
            {fieldErrors.agreeToTerms ? <p className="text-sm text-brand">{fieldErrors.agreeToTerms}</p> : null}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs leading-5 text-slate">Sign in to continue to your quotes, orders, and saved files.</span>
            <Link href="/account/forgot-password" className="text-sm font-black text-brand hover:text-brand-dark">
              Forgot password?
            </Link>
          </div>
        )}

        {message ? <FeedbackMessage tone={message.tone === "error" ? "error" : message.tone === "success" ? "success" : "default"}>{message.text}</FeedbackMessage> : null}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Please wait..." : mode === "login" ? "Sign In Securely" : "Create My Account"}
        </Button>
      </form>

      <div className="mt-6 grid gap-3 rounded-[1.4rem] border border-white/80 bg-white/82 p-4 text-sm leading-6 text-slate shadow-[inset_0_1px_0_rgba(255,255,255,0.92)]">
        <div className="flex items-start gap-3">
          <Icon name="check" className="mt-1 h-4 w-4 shrink-0 text-brand" />
          <p>{mode === "login" ? "Need a new account? Create one in under a minute with only your name, email, and password." : "Already have an account? Sign in to reconnect with your existing orders, quotes, and files."}</p>
        </div>
        <Link href={mode === "login" ? `/account/create?redirect=${encodeURIComponent(redirect)}` : `/account/login?redirect=${encodeURIComponent(redirect)}`} className="font-black text-brand hover:text-brand-dark">
          {mode === "login" ? "Create Account" : "Sign In Instead"}
        </Link>
      </div>
    </div>
  );
}
