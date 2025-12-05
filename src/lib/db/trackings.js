export async function getTrackingsByTimeUID(DB_client, timestamp1, timestamp2, id) {
    console.log("starting queries")
    const { data, error } = await DB_client
        .from("trackings")
        .select("created_at, longitude, latitude")
        .eq("user_id", id)
        .lte("created_at", timestamp2)
        .gte("created_at", timestamp1)
        .order("created_at", { ascending: true });
    if (error) throw error
    return data
}