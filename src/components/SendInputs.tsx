"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

const fieldClass =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100 outline-none";

/** Wraps send fields so browsers do not treat them as login forms. */
export function AntiAutofillForm({ children }: { children: ReactNode }) {
  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={(e) => e.preventDefault()}
      className="space-y-5"
      data-form-type="other"
      data-lpignore="true"
      data-1p-ignore="true"
    >
      {children}
    </form>
  );
}

const ignoreAttrs = {
  autoCorrect: "off" as const,
  autoCapitalize: "off" as const,
  spellCheck: false,
  "data-lpignore": "true",
  "data-1p-ignore": "true",
  "data-bwignore": "true",
  "data-form-type": "other",
};

export function SenderAddressInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...ignoreAttrs}
      {...props}
      type="text"
      name="chain-sender-address"
      autoComplete="off"
      inputMode="text"
      className={`${fieldClass} focus:border-sky-500 ${props.className ?? ""}`}
    />
  );
}

/** Masked like a password field but not type=password (avoids login autofill). */
export function SigningKeyInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...ignoreAttrs}
      {...props}
      type="text"
      name="chain-signing-key"
      autoComplete="new-password"
      inputMode="text"
      className={`${fieldClass} focus:border-amber-500/80 ${props.className ?? ""}`}
    />
  );
}

export function RecipientAddressInput(
  props: InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...ignoreAttrs}
      {...props}
      type="text"
      name="chain-recipient-address"
      autoComplete="off"
      inputMode="text"
      className={`${fieldClass} focus:border-emerald-500/80 ${props.className ?? ""}`}
    />
  );
}

export function AmountInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...ignoreAttrs}
      {...props}
      type="text"
      name="chain-transfer-amount"
      autoComplete="off"
      inputMode="decimal"
      className={`flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none focus:border-sky-500 ${props.className ?? ""}`}
    />
  );
}
