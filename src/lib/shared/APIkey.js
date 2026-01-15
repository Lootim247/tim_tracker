import crypto from "crypto";

// function to make it easily copyable
export function generateApiKey(prefix = "tt", length = 20, chunkSize = 4) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";

  for (let i = 0; i < length; i++) {
    const randIndex = crypto.randomInt(0, chars.length);
    key += chars[randIndex];
  }

  const dashed = key.match(new RegExp(`.{1,${chunkSize}}`, "g")).join("-");
  return `${prefix}-${dashed}`;
}


export function hashApiKey(apiKey) {
  return crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");
}

export async function newAPIkey(user_id, db) {
  console.log(user_id)
    if (!user_id) throw new Error("No user signed in")
    const key = generateApiKey();

    // store hashed key in database
    const hashed = hashApiKey(key)

    const { data, error } = await db
        .from("users")
        .update({hashed_api_insert_key : hashed})
        .eq("id", user_id)
        .select("id")
        .single()
        
    if (error) throw error;
    return { apiKey: key };
}