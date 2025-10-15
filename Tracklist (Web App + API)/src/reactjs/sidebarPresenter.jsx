import { SideBarView } from "../views/sidebarView";
import { observer } from "mobx-react-lite";

const Sidebar = observer(
    function SidebarRender(){
        return <SideBarView/>
    }
);

export { Sidebar };
