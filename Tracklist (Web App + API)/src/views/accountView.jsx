

export function AccountView(props) {


    if (props.model.userType == "guest") {
        return (
            <div className="center-container">
                <div className="account-bold">Guest User</div>
                <div className="account-bold">Login with Google to save your ratings and records</div>
                <div>
                    <button onClick={ signOutEventACB } className="google-button">Back to login page</button>
                </div>
            </div>
        )
    }

        function signOutEventACB(){
            props.onSignOut()
        }

        function ratedAlbumsCB(album){
            const rating = props.avgRate[album.id]
            return(
                <div>
                 <span style={{ marginRight: "10px" }}>  { album.name } </span> 
                    { rating !== undefined ? rating : "Unrated" }
                    <i class="fa-solid fa-star"></i>
                </div>
            )
        }

    
        function sortedAlbumsCB(album1, album2) {
            const rating1 = props.avgRate[album1.id] || 0; // Default to 0 if no rating
            const rating2 = props.avgRate[album2.id] || 0;
            
            return rating2 - rating1; // Descending order (highest rating first)
        }
        
        function sortedArtistsCB(artist) {
            return (
                <div key={artist.artist}>
                    <span>{artist.artist}: {artist.count} album(s)</span>
                </div>
            );
        }

        return (
            <div className="center-container">
                <img
                    className="imageStyle"
                    src={props.model.user.photoURL}
                    height="150"
                />
                <div className="logoStyle">{props.model.user.displayName}</div>
                <div className="account-bold"> Email: {props.model.user.email}</div>
                <div className="flex-container">
                    <div className="top-albums">
                        <div className="account-bold">Highest Rated Albums:</div>
                        <div className="passion-one-bold">
                            {props.myRecords
                                .sort(sortedAlbumsCB)
                                .map(ratedAlbumsCB)
                                .slice(0, 5)}
                        </div>
                    </div>
                    <div className="top-artists">
                        <div className="account-bold">Most Featured Artists:</div>
                        <div className="passion-one-bold">
                            {props.artistFreq
                                .map(sortedArtistsCB)
                                .slice(0, 5)}
                        </div>
                    </div>
                </div>
                <div>
                    <button onClick={signOutEventACB} className="google-button">
                        Sign Out
                    </button>
                </div>
            </div>
        );
    
}