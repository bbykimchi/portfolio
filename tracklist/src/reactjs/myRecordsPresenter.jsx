import { observer } from "mobx-react-lite";
import { MyRecordsView } from "../views/myRecordsView";

const MyRecords = observer(
    function recordsPresenter(props){
        function whenResultClickedACB(album) {
            if (album && album.id) {
            props.model.setCurrentAlbumID(album.id);
            }
        }

        function whenRemoveClickedACB(){
            props.model.getSortedArtistsByFreq()
        }
        
        function renderMyRecords() {
            if (!props.model.myRecords || props.model.myRecords.length === 0) {
                return <div class = "errorMessageStyle">Get to reviewing!</div>;
        }

        return <MyRecordsView model={ props.model } onAlbumSelect={ whenResultClickedACB } onRemove={ whenRemoveClickedACB }/>
        
    }
    return renderMyRecords();
        
    }
);

export {MyRecords};
