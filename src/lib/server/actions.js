"use server"
import "server-only"
import { createServerSupabase } from "./server_db";
import { newAPIkey } from "../shared/APIkey";
import { getAuthenticatedUser } from "./auth";
import { PutObjectCommand } from "@aws-sdk/client-s3"
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

export async function putImage(formData) {
  const type = formData.get('type')
  const bucket = formData.get('bucket')
  const file = formData.get('file')
  const supabase = await createServerSupabase()
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.rpc("put_image", {
    type: type,
    bucket: bucket
  });

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: data + '.jpg',
    Body: buffer
  });

  try {
    const response = await s3Client.send(command);
  } catch (e) {
    console.log(data);
    const { error } = await supabase
      .from("bucket_data")
      .delete()
      .eq('id', data)
    if (error) throw error;
    
    throw e;
  }

  if (error || !data) {
    throw new Error("Failed to add")
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
