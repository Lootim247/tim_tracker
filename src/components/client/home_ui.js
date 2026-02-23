import { useState, useContext } from "react";
import { LayoutContext, HomeContext } from "./contexts";
import { SignedImage } from "./ui";
import styles from '@/styles/Home.module.css'


// User list must have the following attributes per each user
    // id: users id (or email)
    // title: users selected title
    // picture: small picture (or placeholder)
export function UserSelector({maxItems}) {
    const homeContext = useContext(HomeContext);
    const layoutContext = useContext(LayoutContext)

    const user_list = layoutContext.friends?.accepted
    
    if (!user_list || user_list.length == 0) {
        return <div>No users</div>
    }
    const max_pos = Math.trunc(user_list.length / maxItems)

    function UserCard({user_obj}) {
        let style = styles.Tab
        if (homeContext.user.get == user_obj.friend_id) {
            style = styles.ActiveTab
        }
        return (
            <div 
            className={styles.UserCard}
            onClick={()=>homeContext.user.set(user_obj)}>
                <SignedImage owner={user_obj.friend_id} type={'profile-picture'} width={'50%'} height={'50%'}/>
                {user_obj.title}
            </div>
        )
    }

    const start = homeContext.barPos.get * maxItems
    const end = (user_list.length < start + maxItems? user_list.length : start + maxItems) + 1
    return (
        <div className={styles.CardList}>
            {homeContext.barPos.get != 0 && <p>{'<'}</p>}
            {user_list.slice(start, end).map(item => (
                <UserCard
                    key={item.friend_id} 
                    user_obj={item}
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
    const user_obj = homeContext.user.get

    // TODO: get all recent stories for this specific user. (cache?)
    // TODO: Get profile pictures and other items for the user
    // const [selectedStory, setSelectedStory] = useState(null)
    // const stories = [
    //     {id:1, title:'story'}, {id:2, title:'story2'}, {id:3, title:'story3'}
    // ]    
    if (!user_obj) return (<></>)

    
    return (
        <div className={styles.SideBarContent}>
            <div>{user_obj.title}</div>
            <SignedImage owner={user_obj.friend_id} type={'profile-picture'} width={100} height={100}/>
            <div>Description</div>
            <div>DATE SELECTOR?</div>
        </div>
    )
}