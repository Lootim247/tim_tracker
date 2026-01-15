"use client";

import { useActionState } from "react";
import { newAPIkeyAction } from "@/lib/server/actions";
import { logout } from "@/lib/client/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  /*
  * TODO:
  * This page needs data deletion permissions, the user should be able to 
  * delete any tracking at any time.
  */


  const router = useRouter()
  const [state, formAction] = useActionState(newAPIkeyAction, null);

  console.log(state)
  return (
    <div>
      <form action={formAction}>
        <button type="submit">Generate New Key</button>

        {state?.apiKey && (
          <p>
            <strong>New API Key:</strong> {state.apiKey}
          </p>
        )}

        {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
      </form>


      <button
        onClick={async () => {
                    try {
                    console.log("starting logout")
                    await logout();
                    router.push('/enter')
                    router.refresh()
                    } catch (err) {
                    console.error("Logout failed:", err);
                    }
                }}>Log Out</button>
    </div>
  );
}
