export function SocialView(props){

    function renderUserCB(model) {
        function handleUserSelectACB() {
            props.onUserSelect(model.otherUser.name.toLowerCase());
            window.location.hash = "#/user";
        }

        if (model.ready) { 
            return(
            <div key={ model.otherUserID } onClick={ handleUserSelectACB }>
                <div className="containerForCard">
                    <div className="passion-one-bold"> {model.otherUser.name} </div>
                    <img className="imageStyle" src={ model.otherUser.image } height="150"/>
                </div>
            </div> )
            }
        }

    if (props.users.length == 0) {
        return(
                <div className="passion-one-bold">Add friends to get started</div>
        )} else {
        return(
            <div>
                <div className="logoStyle">Your Friends</div>
                <div className="resultRow">
                    { props.users.map(renderUserCB) }
                </div>
            </div>
        )
    }
}