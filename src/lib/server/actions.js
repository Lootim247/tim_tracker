"use server"
import "server-only"
import { createServerSupabase } from "./server_db";
import { newAPIkey } from "../shared/APIkey";
import { getAuthenticatedUser } from "./auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./s3_server";
// server action
export async function newAPIkeyAction() {
    try {  
        const user = await getAuthenticatedUser();
        if (!user) throw new Error("No user signed in");

        const server_db = await createServerSupabase();

        const result = await newAPIkey(user.id, server_db);
        return result;
    } catch (err) {
        console.error("newAPIkeyAction error:", err);
        throw err;
    }
}


export async function getImage(owner_id, type) {
  const supabase = await createServerSupabase()

  const { data, error } = await supabase
    .from("bucket_data")
    .select("s3_key, bucket")
    .eq("owner_id", owner_id)
    .eq("type", type)
    .single()

  if (error || !data) {
    throw new Error("Unauthorized")
  }

  const command = new GetObjectCommand({
    Bucket: data.bucket,
    Key: data.s3_key,
    ResponseCacheControl: "public, max-age=31536000, immutable",
  })

  return await getSignedUrl(s3Client, command, {
    expiresIn: 60, // seconds
  })
}
