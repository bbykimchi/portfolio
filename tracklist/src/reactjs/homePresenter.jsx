import { NewReleasesView } from "../views/newReleasesView";
import { observer } from "mobx-react-lite";
import { NavBarView } from "../views/navbarView";
import { HomeView } from "../views/homeView";
import {MostPopularView} from "../views/mostPopularView"


const Home = observer(
    function HomeRender(props) {

        function handleResultClickACB(result) {
            props.model.setCurrentAlbumID(result.id)
        }

        if (!props.model.newReleasesPromiseState.promise) {
            props.model.generateNewReleases();
        }
        if (!props.model.mostPopularPromiseState.promise) {
            props.model.generateMostPopular();
        }

        const loadingStateNewReleases= props.model.newReleasesPromiseState.promise && !props.model.newReleasesPromiseState.data && !props.model.newReleasesPromiseState.error;
            const loadingStateMostPopular =
        props.model.mostPopularPromiseState.promise &&
        !props.model.mostPopularPromiseState.data &&
        !props.model.mostPopularPromiseState.error;

        if (loadingStateNewReleases || loadingStateMostPopular) {
            return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100" />;
        }
        if (props.model.newReleasesPromiseState.error) {
            return <div>{props.model.newReleasesPromiseState.error}</div>;
        }
        {
            if (props.model.mostPopularPromiseState.error) {
                return <div>Error: {props.model.mostPopularPromiseState.error}</div>;
            }
        }
        
    
        return(
                <div>
                    <div className="navbar-homepage">
                    <NavBarView/>
                    </div>
                <div className="Main-Content-homepage">
                <HomeView/>
                {props.model.mostPopularPromiseState.data && (
                    <MostPopularView mostPopular={props.model.mostPopularPromiseState.data} onResultClicked={ handleResultClickACB }/>
                )}
                </div>
                {props.model.newReleasesPromiseState.data && ( <NewReleasesView 
            newReleases={ props.model.newReleasesPromiseState.data.albums.items } onResultClicked={ handleResultClickACB }/>
                )}
            </div>

        ) 
    },
);

export { Home };