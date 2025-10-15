import { ContactView } from "../views/contactView";
import { observer } from "mobx-react-lite";

const Contact = observer(
    function ContactRender(){
        return <ContactView/>
    }
);

export { Contact };