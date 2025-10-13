


// SearchFormView skapar sökfältet, formuläret med maträtttyperna och sökknappen!
export function SearchFormView(props){
    // fires custom event asykronisk call back för att bestämma typen
    function handleTextSearch(evt){
        props.onSearch(evt.target.value) // anropar parent handler
    }
    // fires custom event asykronisk call back för när sök knappen trycks
    function onSearchClickACB(){
        console.log("search button has been clicked")
        if (!props.text || props.text.trim()=== ""){
            console.log("empty search")
            return;
        }
        props.SearchbuttonClicked() // anropar parent handler
    }
    // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
    // ACB function 
    function handleKeyPressACB(event){
        if(event.key === "Enter"){
            event.preventDefault();
            console.log("enter key pressed")
            if (!props.text || props.text.trim()=== ""){
                console.log("empty search")
                return;
            }
            props.SearchbuttonClicked()
        }
    }

    return(
        <div className="searchBarWrapper">
        <div className= "searchBar">
            {/*input value. (ska vara text)*/}
            <input value={(props.text || "")} placeholder= "Title, Artist, Track, Genre..." onChange= {handleTextSearch} onKeyDown={handleKeyPressACB}/>
   
            {/*button click. (sök knappen trycks)*/}
            <button className="searchButton" onClick={onSearchClickACB}><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
        </div>
    )
}