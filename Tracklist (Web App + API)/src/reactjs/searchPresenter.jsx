import { observer } from "mobx-react-lite";
import { SearchFormView } from "../views/searchFormView";
import { SearchResultsView } from "../views/searchResultsView";



const Search = observer(
    function SearchRender(props){
        // parent handler till decideTypeACB som tar en sträng och sätter den till en query (hanterar sökfrågan)
        function DecidingQueryACB(query){
                props.model.setSearchQuery(query);
        }
        // parent handler till onSearchClickACB som tar ett objekt och startar en sökning till api:n med searchDishes. (hanterar klick)
        function ClickingSearchButtonACB(){
                props.model.doSearch(props.model.searchQuery);
        }

        // renderar sök resultatet
        function renderSearchResults(searchResultsPromiseState){
            // konstanter för förenkling
            const {promise, data, error} = searchResultsPromiseState
            // call back för när resultaten blir klickade på
            function whenResultClickedCB(result){
                props.model.setCurrentAlbumID(result.id)

            }

            function addToMyrecordsClicked(result){
                props.model.addToMyRecords(result)
                props.model.getSortedArtistsByFreq()
            }
            
            // Conditional rendering
            if(!promise){
                return <div></div>
            }
            if(promise && !data && !error){
                return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100"/>
            }
            // om det finns data rendera searchResultsView
            if(data){
                return <SearchResultsView model={props.model} searchResults = {data.albums.items} ResultClicked = {whenResultClickedCB} addToMyRecords = {addToMyrecordsClicked}/>
            }
            if(error){
                return <div>Error: {error} </div>;
            }
            return <div>no data</div>
        }
        
    
        // pass props to searchFormView
    return<div className="searchLayout">
            <SearchFormView
            text = {props.model.searchQuery}
            onSearch = {DecidingQueryACB}
            SearchbuttonClicked ={ClickingSearchButtonACB}
            /> 
            <div className="passion-one-bold">Explore albums and tracks worth talking about.</div>
            {renderSearchResults(props.model.searchResultsPromiseState)}
            </div>
    }
)

export {Search};