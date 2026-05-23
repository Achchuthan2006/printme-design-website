"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FeedbackMessage, Field, Input } from "@/components/ui/form-controls";
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
    <form onSubmit={submit} className="surface-card p-6">
      <p className="editorial-kicker">Account recovery</p>
      <h1 className="display-title mt-3 text-[2.2rem] font-black leading-[0.96]">Reset your password</h1>
      <p className="mt-2 text-sm leading-6 text-slate">Enter your account email and we will send a secure reset link.</p>
      <Field label="Email" className="mt-6">
        <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </Field>
      {message ? <FeedbackMessage className="mt-4">{message}</FeedbackMessage> : null}
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
    <form onSubmit={submit} className="surface-card p-6">
      <p className="editorial-kicker">Security update</p>
      <h1 className="display-title mt-3 text-[2.2rem] font-black leading-[0.96]">Choose a new password</h1>
      <Field label="New password" className="mt-6">
        <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
      </Field>
      {message ? <FeedbackMessage className="mt-4">{message}</FeedbackMessage> : null}
      <Button type="submit" disabled={isPending} className="mt-6 w-full">{isPending ? "Updating..." : "Update Password"}</Button>
    </form>
  );
}
