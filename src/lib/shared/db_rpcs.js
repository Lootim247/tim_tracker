export async function getTrackingsByTimeUID(DB_client, timestamp1, timestamp2, user_id) {
    const { data, error } = await DB_client
        .from("trackings")
        .select("created_at, longitude, latitude")
        .eq("user_id", user_id)
        .lte("created_at", timestamp2)
        .gte("created_at", timestamp1)
        .order("created_at", { ascending: true });
    if (error) throw error
    return data
}

export async function getTrackingsByTimeUID1(DB_client, timestamp1, timestamp2) {
    const { data, error } = await DB_client.rpc("get_trackings_by_time", {
        start_time: timestamp1,
        end_time: timestamp2
    })
    if (error) throw error
    return data
}


export async function getRelatedUsers(DB_client) {
    const { data, error } = await DB_client.rpc("get_related_users", {});
    if (error) throw error;
    return data;
}

export async function getRelatedStories(DB_client) {
    const {data, error} = await DB_client.rpc("get_related_stories", {});
    console.log(data)
    console.log(error)
    if (error) throw error
    return data
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

export async function signup_rpc(DB_client, email, title) {
    const { data, error } = await DB_client.rpc('signup', {
        user_email: email,
        user_title: title
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

export async function UpdateSharing(DB_client, friend_id, newValue) {
    const { data, error } = await DB_client.rpc('update_sharing', {
        friend_id : friend_id,
        new_value : newValue
    })
    if (error) throw error;
    return data;
}


// A batched update sharing (returns sharing updates)
export async function UpdateSharingBatch(DB_client, payload) {
    let fail_arr = [];
    for (const { friend_id, status } of payload) {
        console.log(friend_id, status);
        const { data, error } = await DB_client.rpc('update_sharing', {
            friend_id : friend_id,
            new_value : status
        })
        if (error) throw error;
        if (data !== 'success') fail_arr.append(friend_id);
    }

    return fail_arr;
}

export async function UpdateStoryGroup(DB_client, story_id, update_id, action) {
    if (action != 'remove' || action != 'add') {
        throw new Error('Action prompt is not remove or add')
    }
    
    if (action == "remove") {
        const { data, error } = await DB_client
        .from('user_story')
        .delete()
        .eq("user_id", update_id) 
        .eq("story_id", story_id)
    } else if (action == "add") {
        const { data, error } = await DB_client
        .from('user_story')
        .insert([
            {user_id : update_id, story_id : story_id}
        ])
        .select()
    }
    
}

export async function CreateStory(DB_client, title, users) {
    const { data, error } = await DB_client.rpc('create_story', {
        title : title
    })

    if (error) throw error;

    const json_users = [];
    const story_id = data;
    users.forEach(id => {
        json_users.push({'user_id' : id, 'story_id': story_id})
    });

    console.log(json_users)

    const { res } = await DB_client
        .from('user_story')
        .insert(json_users)
    
    console.log(res)
}