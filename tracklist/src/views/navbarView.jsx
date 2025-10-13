function NavBarView(){
    function handleAboutClickACB(){
        window.location.hash="#/about"
    }
    function handleContactClickACB(){
        window.location.hash="#/contact"
    }
    return(
        <div className= "homeView">
            <img src="/images/logowhite.png" className="logo-img"/>
            { <ul className= "navMenu">
                <li className="icon-image" onClick={handleAboutClickACB}>About</li>
                <li className="icon-image" onClick={handleContactClickACB}>Contact</li>
            </ul> }
        </div>
        
    )
}
export {NavBarView}