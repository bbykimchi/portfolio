import { SocialSearchFormView } from "../views/social/socialSearchFormView";
import { SocialSearchResultsView } from "../views/social/socialSearchResultsView";
import { observer } from "mobx-react-lite";
import { SocialView } from "../views/social/socialView";
import { useEffect } from "react";

const Social = observer(
    function SocialRender(props){
        function DecidingQueryACB(query){
            props.model.setSocialQuery(query);
        }

        function ClickingSearchButtonACB(){
            props.model.doSocialSearch(props.model.socialQuery);
            props.model.getMultipleUsers(props.model.searchedUsers, props.model.searchedUsersPromiseState);
        }

        function selectUserACB(data) {
            props.model.clearSearchedUsers();
            props.model.getOtherUser(data);
        }

        useEffect(() => {
            props.model.getMultipleUsers(props.model.friends, props.model.friendsPromiseState);
        }, [props.model.friends]);

        function showUsers(promiseState) {
            const {promise, data, error} = promiseState;
            
            if(!promise){
            }
            if(promise && !data && !error){
                return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100"/>
            }
            if(data){
                if (promiseState == props.model.friendsPromiseState) {
                    return <SocialView model={props.model} users = {data} onUserSelect={ selectUserACB }/> //lägg till back to social som clearar search
                } else {
                    if (data.length === 0) {
                        return(<div>
                            <div className="passion-one-bold">There are no users matching your search</div>
                        </div>)
                    } else {
                        return <SocialSearchResultsView model={props.model} users = {data} onUserSelect={ selectUserACB }/>
                    }
                }
            }
            if(error){
                return <div>Error: {error} </div>;
            }
        }
        if( props.model.userType === "guest" ){
            return(
                <div className="center-container"> 
                 <span className="passion-one-bold"> 
                Login to interact with other users
                 </span>
                </div>
            )
        }

        return(
            <div className="searchLayout">
                <SocialSearchFormView
                text = {props.model.socialQuery}
                onSearch = {DecidingQueryACB}
                SearchbuttonClicked ={ClickingSearchButtonACB}/>
                { showUsers(props.model.searchedUsersPromiseState) }
                { showUsers(props.model.friendsPromiseState) }
            </div>
        )
    }
);

export { Social };
