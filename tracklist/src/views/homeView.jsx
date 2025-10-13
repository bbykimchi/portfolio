function HomeView(){

    function handleSearchPageACB() {
        window.location.hash="#/search"
    }

    return(
        <div className="homapage-text-container">
            <div className="homepage-wrapper">
            <h1 className="Title-homepage">The Music Enthusiast's
                 </h1>
                 <h2 className="Title-homepage2">Best Friend
                 <span className="Title-homepage">.</span>
                 </h2>
            <p className="description-homepage">
            Tracklist is your ultimate music companion, letting you rate, review, and share your favorite tracks and albums with friends. Discover new music, build a collection, and join a community that lives and breathes music.
            </p>
            <button className="start-button" onClick={handleSearchPageACB}>Get Started!</button>
            </div>
        </div>

    )
}
export {HomeView}