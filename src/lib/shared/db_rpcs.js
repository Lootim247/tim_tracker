export async function getTrackingsByTimeUID(DB_client, timestamp1, timestamp2, user_id) {
    const { data, error } = await DB_client
        .from("trackings")
        .select("created_at, longitude, latitude")
        .eq("user_id", user_id)
        .lte("created_at", timestamp2)
        .gte("created_at", timestamp1)
        .order("created_at", { ascending: true });
    console.log("in trackings")
    console.log(user_id)
    console.log(data)
    console.log("after trackings")
    if (error) throw error
    return data
}

export async function getRelatedUsers(DB_client, user_id) {
    const { data, error } = await DB_client.rpc("get_related_users", {
        user_id: user_id        
    });
    if (error) throw error;
    return data;
}

export async function addFriendEmail(DB_client, user_id, friend_email) {
    const { data, error } = await DB_client.rpc('add_friend_by_email', {
        p_user_id: user_id,
        p_friend_email: friend_email
    });
    console.log(data)
    console.log(error)
    if (error) throw error
    return data
}

export async function signup_rpc(DB_client, email) {
    const { data, error } = await DB_client.rpc('signup', {
        user_email: email
    });
    if (error) throw error

    if (data == "success") {
        return true;
    }

    return false;
}

export async function AuthenticateKey(DB_client, email, hash) {
    const { data, error } = await DB_client.rpc('getUserFromKey', {
        user_email: email,
        user_hash : hash
    });
    if (error) throw error;
    return data;
}