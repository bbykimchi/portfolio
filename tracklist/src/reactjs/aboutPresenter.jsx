import { AboutView } from "../views/aboutView";
import { observer } from "mobx-react-lite";

const About = observer(
    function AboutRender(){
        return <AboutView/>
    }
);

export { About };