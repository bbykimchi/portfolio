import { AccountView } from "../views/accountView";
import { observer } from "mobx-react-lite";
import { getAuth, signOut } from "firebase/auth";
import { provider } from "../firebaseModel";
import { signInWithPopup } from "firebase/auth";

const auth = getAuth();


const Account = observer(
    function AccountRender(props) {
        function handleSignOutACB(){
            signOut(auth).then(() => {
                // Sign-out successful.
              }).catch((error) => {
                // An error happened.
              });
        }
        return <AccountView 
          model = { props.model } 
          onSignOut = { handleSignOutACB } 
          artistFreq={props.model.sortedArtists} 
          avgRate = {props.model.averageRatings} 
          myRecords = { props.model.myRecords }
        />
    }

)

export {Account};
