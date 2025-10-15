import { Search } from "./searchPresenter";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "./homePresenter";
import { Details } from "./detailsPresenter";
import { MyRecords } from "./myRecordsPresenter";
import { Account } from "./accountPresenter";
import { Sidebar } from "./sidebarPresenter";
import { observer } from "mobx-react-lite";
import { About } from "./aboutPresenter";
import { Contact } from "./contactPresenter";
import { Login } from "./loginPresenter";
import { Social } from "./socialPresenter";
import { OtherUser } from "./otherUserPresenter";

const ReactRoot = observer(
    function ReactRoot(props) {
        const router= createHashRouter([
            {
                path: "/",
                element: <Home model={props.model}/>
            },
            {
                path: "/home",
                element: <Home model={props.model}/>
            },
            {
                path: "/search",
                element: <Search model={props.model}/>
            },
            {
                path: "/details",
                element: <Details model={props.model}/>
            },
            {
                path: "/myrecords",
                element: <MyRecords model={props.model}/>
            },
            {
                path: "/account",
                element: <Account model={props.model}/>
            },
            {
                path: "/about",
                element: <About model={props.model}/>
            },
            {
                path: "/contact",
                element: <Contact model={props.model}/>
            },
            {
                path: "/social",
                element: <Social model={props.model}/>
            },
            {
                path: "/user",
                element: <OtherUser model={props.model}/>
            },

        ]);
        if (!props.model.ready) {
            return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100" />;
        }

        if (props.model.user === undefined) {
            return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100" />;
        }

        if (props.model.user === null) {
            return(
                <div>
                    <Login model={ props.model }/>
                </div>
            )
        }
         else {
            if (props.model.userType === "google") {
            props.model.addToUsers(props.model.user.displayName);   
            } 
            return(
                <div>
                    <Sidebar model={ props.model }/>
                    <RouterProvider router={ router }/>
                </div>
            )
        }
    }
)

export { ReactRoot };