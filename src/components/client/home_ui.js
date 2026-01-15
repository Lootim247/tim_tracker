import { useState, useContext } from "react";
import { LayoutContext, HomeContext } from "./contexts";
import styles from '@/styles/Home.module.css'


// User list must have the following attributes per each user
    // id: users id (or email)
    // title: users selected title
    // picture: small picture (or placeholder)
export function UserSelector({maxItems}) {
    const homeContext = useContext(HomeContext);
    const layoutContext = useContext(LayoutContext)

    const user_list = layoutContext.friends.accepted
    
    if (!user_list || user_list.length == 0) {
        return <div>No users</div>
    }
    const max_pos = Math.trunc(user_list.length / maxItems)

    function UserCard({UserId, name}) {
        let style = styles.Tab
        if (homeContext.user.get == UserId) {
            style = styles.ActiveTab
        }
        return (
            <div onClick={()=>homeContext.user.set(UserId)}>
                {UserId}
            </div>
        )
    }

    const start = homeContext.barPos.get * maxItems
    const end = (user_list.length < start + maxItems? user_list.length : start + maxItems) + 1
    return (
        <div>
            {homeContext.barPos.get != 0 && <p>{'<'}</p>}
            {user_list.slice(start, end).map(item => (
                <UserCard
                    key={item.friend_id} 
                    UserId={item.friend_id}
                    name={'tbd'}
                    />
            ))}
            {homeContext.barPos.get != max_pos && max_pos > 0 &&
            <p>{'>'}</p>}
        </div>
    );
}

export function SideBar() {
    const homeContext = useContext(HomeContext)
    const layoutContext = useContext(LayoutContext)
    const friend = layoutContext.friends.accepted.find((x)=> x == homeContext.user.get)

    // TODO: get all recent stories for this specific user. (cache?)
    // TODO: Get profile pictures and other items for the user
    const [selectedStory, setSelectedStory] = useState(null)
    const stories = [
        {id:1, title:'story'}, {id:2, title:'story2'}, {id:3, title:'story3'}
    ]
    
    return (
        <div>
            <div>Title</div>
            <div>Profile Pic</div>
            <div>Available Stories</div>
            {stories.map(story => (
                <div key={story.id}>{story.title}</div>
            ))}
            {selectedStory && <div>Story!</div>}
        </div>
    )
}