"use client";

import { useActionState } from "react";
import { newAPIkeyAction } from "@/lib/server/actions";

export default function SettingsPage() {
  const [state, formAction] = useActionState(newAPIkeyAction, null);

  console.log(state)
  return (
    <form action={formAction}>
      <button type="submit">Generate New Key</button>

      {state?.apiKey && (
        <p>
          <strong>New API Key:</strong> {state.apiKey}
        </p>
      )}

      {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
    </form>
  );
}
