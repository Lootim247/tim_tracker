"use client";

import { useEffect, useState } from "react";
import { db_client } from "@/lib/client/client_db";

export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const { data } = db_client.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return <p>Verifying recovery link...</p>;
  }

  const handleReset = async () => {
    const { error } = await db_client.auth.updateUser({ password });
    if (!error) {
      alert("Password updated!");
    }
  };

  return (
    <>
      <h1>You can reset your password now</h1>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset password</button>
    </>
  );
}
