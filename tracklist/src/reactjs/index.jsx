import {createRoot} from "react-dom/client";
import { observable } from "mobx";
import { ReactRoot } from "./ReactRoot";
import { model } from "../TrackListModel";

const reactiveModel = observable(model);



createRoot(document.getElementById('root'))
    .render(<ReactRoot model={ reactiveModel }/>);
    <div id="root"></div>

import { reaction } from "mobx";
import { connectToFirebase } from "../firebaseModel";
connectToFirebase(reactiveModel, reaction);