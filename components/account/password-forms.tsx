"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      });
      setMessage(error ? error.message : "Password reset email sent if the account exists.");
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <h1 className="text-3xl font-black text-ink">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-slate">Enter your account email and we will send a secure reset link.</p>
      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-ink">Email</span>
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
      </label>
      {message ? <p className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand">{message}</p> : null}
      <Button type="submit" disabled={isPending} className="mt-6 w-full">{isPending ? "Sending..." : "Send Reset Link"}</Button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setMessage("Supabase is not configured yet.");
      return;
    }

    startTransition(async () => {
      const { error } = await supabase.auth.updateUser({ password });
      setMessage(error ? error.message : "Password updated. You can now continue to your account.");
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-line bg-white p-6 shadow-soft">
      <h1 className="text-3xl font-black text-ink">Choose a new password</h1>
      <label className="mt-6 block">
        <span className="mb-2 block text-sm font-bold text-ink">New password</span>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-line px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" />
      </label>
      {message ? <p className="mt-4 rounded-lg bg-brand-soft px-4 py-3 text-sm text-brand">{message}</p> : null}
      <Button type="submit" disabled={isPending} className="mt-6 w-full">{isPending ? "Updating..." : "Update Password"}</Button>
    </form>
  );
}
