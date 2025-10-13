import { resolvePromise } from "../../resolvePromise";

export function SocialSearchResultsView(props) {

        function renderUserCB(model) {
            function handleUserSelectACB() {
                props.onUserSelect(model.otherUser.name.toLowerCase());
                window.location.hash = "#/user";
            }

            if (model.ready) { 
                return(
                <div key={ model.otherUserID } onClick={ handleUserSelectACB }>
                    <div className="passion-one-bold"> {model.otherUser.name} </div>
                    <img src={ model.otherUser.image } height="150"/>
                </div> )}
        }

    return(
        <div>
            { props.users.map(renderUserCB) }
        </div>
    )
}