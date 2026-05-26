"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input } from "@/components/ui/form-controls";
import { getSupabaseBrowserClient } from "@/lib/supabase";

function validatePassword(password: string) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return "Use at least one letter and one number.";
  return "";
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ tone: "default" | "success" | "error"; text: string } | null>(null);
  const [fieldError, setFieldError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!email.trim()) {
      setFieldError("Enter the account email you used with PrintMe.");
      setMessage({ tone: "error", text: "Please enter your account email first." });
      return;
    }

    setFieldError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage({ tone: "error", text: "Supabase is not configured yet." });
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      setMessage({
        tone: error ? "error" : "success",
        text: error ? error.message : "If that account exists, a secure password reset link is on its way to the inbox.",
      });
    });
  }

  return (
    <form onSubmit={submit} className="surface-card p-6 sm:p-8" noValidate>
      <p className="editorial-kicker">Account recovery</p>
      <h2 className="display-title mt-3 text-[2.05rem] font-semibold leading-[0.92]">Reset your password</h2>
      <p className="mt-3 text-sm leading-7 text-slate">Enter your account email and we will send a secure reset link so you can get back into your quotes, orders, files, and account portal.</p>
      <Field label="Email" hint="Use the same email tied to your PrintMe account." error={fieldError} className="mt-6">
        <Input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldError("");
          }}
          autoComplete="email"
          aria-invalid={Boolean(fieldError)}
        />
      </Field>
      {message ? <FeedbackMessage tone={message.tone === "error" ? "error" : message.tone === "success" ? "success" : "default"} className="mt-4">{message.text}</FeedbackMessage> : null}
      <Button type="submit" disabled={isPending} className="mt-6 w-full">{isPending ? "Sending..." : "Send Reset Link"}</Button>
      <div className="mt-5 text-sm leading-6 text-slate">
        <p>Remembered your password? <Link href="/account/login" className="font-black text-brand hover:text-brand-dark">Sign in here</Link>.</p>
      </div>
    </form>
  );
}

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ tone: "default" | "success" | "error"; text: string } | null>(null);
  const [fieldError, setFieldError] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFieldError(passwordError);
      setMessage({ tone: "error", text: "Please choose a stronger password before continuing." });
      return;
    }

    setFieldError("");
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage({ tone: "error", text: "Supabase is not configured yet." });
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setMessage({ tone: "error", text: error.message });
        return;
      }

      setMessage({ tone: "success", text: "Password updated successfully. You can now continue into your PrintMe account." });
      window.setTimeout(() => router.push("/account/login"), 900);
    });
  }

  return (
    <form onSubmit={submit} className="surface-card p-6 sm:p-8" noValidate>
      <p className="editorial-kicker">Security update</p>
      <h2 className="display-title mt-3 text-[2.05rem] font-semibold leading-[0.92]">Choose a new password</h2>
      <p className="mt-3 text-sm leading-7 text-slate">Use a fresh password with at least 8 characters, including a letter and number, so your account stays secure.</p>
      <Field label="New password" hint={password ? validatePassword(password) || "Password strength looks good." : "Use at least 8 characters with a letter and number."} error={fieldError} className="mt-6">
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldError("");
            }}
            autoComplete="new-password"
            className="pr-14"
            aria-invalid={Boolean(fieldError)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-slate transition hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/25"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </Field>
      {message ? <FeedbackMessage tone={message.tone === "error" ? "error" : message.tone === "success" ? "success" : "default"} className="mt-4">{message.text}</FeedbackMessage> : null}
      <Button type="submit" disabled={isPending} className="mt-6 w-full">{isPending ? "Updating..." : "Update Password"}</Button>
      <div className="mt-5 text-sm leading-6 text-slate">
        <p>After reset, you will be redirected to sign in again so your secure session starts cleanly.</p>
      </div>
    </form>
  );
}
