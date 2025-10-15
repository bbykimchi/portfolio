import { signInWithPopup } from "firebase/auth";
import { LoginView } from "../views/loginView"
import { observer } from "mobx-react-lite";
import { auth, saveToFirebase } from "../firebaseModel";
import { provider } from "../firebaseModel";
import { signInAnonymously } from "firebase/auth";


const Login = observer(
    function LoginRender(props){
        function googleLoginRedirect() {
            props.model.setGoogleUser()
            signInWithPopup(auth, provider);
        }

        function guestLogin() {
            signInAnonymously(auth).then(() => {}).catch((error) => {const errorCode = error.code; const errorMessage = error.message;});
            props.model.setGuestUser()
        }

        return(
            <LoginView model = { props.model } onGoogleLogin={ googleLoginRedirect } onGuestLogin={ guestLogin }/>
        )
    })

export { Login };