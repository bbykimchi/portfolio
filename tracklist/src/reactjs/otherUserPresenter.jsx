import { SocialSearchFormView } from "../views/social/socialSearchFormView";
import { SocialSearchResultsView } from "../views/social/socialSearchResultsView";
import { OtherUserView } from "../views/social/otherUserView";
import { SocialView } from "../views/social/socialView";
import { observer } from "mobx-react-lite";

const OtherUser = observer(
    function OtherUserRender(props){

        function onAlbumSelectCB(album) {
            props.model.setCurrentAlbumID(album.id);
        }

        function addOrRemoveFriendACB() {
            props.model.addOrRemoveFriends(props.model.otherUser)
            console.log(props.model.friends)
        }

        if (!props.model.ready) {
            return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100"/>
        }

        else {
            return <OtherUserView model={props.model} onAddOrRemoveFriend={addOrRemoveFriendACB} onAlbumSelect={ onAlbumSelectCB } otherUser = {props.model.otherUser}/>
        }
    })

export { OtherUser };