import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/server/server_db";
import { s3Client } from "@/lib/server/s3_server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req) {
  try {
    const supabase = await createServerSupabase({ req, res: undefined });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { owner, type } = await req.json();
    if (!owner || !type) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // fetch S3 key from database
    const { data, error } = await supabase
      .from("bucket_data")
      .select("s3_key, bucket")
      .eq("owner_id", owner)
      .eq("type", type)
      .single();

    if (error || !data) {
        console.log('failed to find the data')
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // generate signed URL
    const command = new GetObjectCommand({ Bucket: data.bucket, Key: data.s3_key });
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("Error in get-image route:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
