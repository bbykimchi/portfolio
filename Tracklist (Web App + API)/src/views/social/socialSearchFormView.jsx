export function SocialSearchFormView(props){
    
    function handleTextSearch(evt){
        props.onSearch(evt.target.value) 
    }
   
    function onSearchClickACB(){
        if (!props.text || props.text.trim()=== ""){
            return;
        }
        props.SearchbuttonClicked() 
    }

    function handleKeyPressACB(event){
        if(event.key === "Enter"){
            event.preventDefault();
            if (!props.text || props.text.trim()=== ""){
                return;
            }
            props.SearchbuttonClicked()
        }
    }

    return(
        <div className="searchBarWrapper">
        <div className= "searchBar">
            <input value={(props.text || "")} placeholder= "Find your friends..." onChange= {handleTextSearch} onKeyDown={handleKeyPressACB}/>
            <button className="searchButton" onClick={onSearchClickACB}><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        </div>
    )
}