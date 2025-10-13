import { useState } from "react";

export function OtherUserView(props) {
    function renderUserRecordsCB(album) {
        function handleSelectACB() {
            props.onAlbumSelect(album);
            window.location.hash = "#/details"
        }

        function getReview() {
            function findReviewCB(review) {
                return album.id == review.albumID;
            }
            return (!props.otherUser.reviews.find(findReviewCB) ? null : props.otherUser.reviews.find(findReviewCB).myReview);
        }

        function getRating() {
            const averageRating = props.otherUser.averageRatings[album.id];
            return averageRating
        }

        return (

            <div key={album.id}  className="resultItem">
                <div className="alignCentralos">
                  <div className="passion-one-bold">{album.name}</div>
                  <div className="passion-one-bold">{album.artists[0].name || "Ingen data"}</div>

                </div>

                <div className="containerForCard"  onClick={handleSelectACB}>

                    <div className="infoCard">
                        <div className="frontCard">
                            <img className="imageStyle" src={album.images[1].url} />
                        </div>
                        <div className="backCard">

        

                            <div className="rating-backside">
                            <i class="fa-solid fa-star"></i>
                            { getRating() }
                            </div>


                            <div className="reviewBackside">
                            <div className="purple-text">{ props.otherUser.name }'s Review:</div>
                            "{ getReview() }"
                            </div>

                            <div className="rate-text">
                                <span> Click to rate & review this album</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    function goBackACB() {
        window.location.hash = "#/social"
    }


    function FriendButton() {
        function addOrRemoveFriendACB() {
            props.onAddOrRemoveFriend();
            setIsFriend(!isFriend);
        }

        function checkFriendCB(existingFriend) {
            return (existingFriend == lowerCase);
        }
        
        const lowerCase = props.otherUser.name.toLowerCase()
        const [isFriend, setIsFriend] = useState(props.model.friends.some(checkFriendCB));

        return !isFriend ? 
        (<button className="menu-item-small" onClick={addOrRemoveFriendACB}>
            <i class="fa-solid fa-user-plus"></i> Add Friend
        </button>) :
        (<button className="menu-item-small" onClick={addOrRemoveFriendACB}>
            <i class="fa-solid fa-user-minus"></i> Remove Friend
        </button>);
    }

    function ratedAlbumsCB(album){
        return(
            <div>
             <span style={{ marginRight: "10px" }}>  { album.name } </span> 
                { props.otherUser.averageRatings[album.id] || "Unrated"}
                <i class="fa-solid fa-star"></i>
            </div>
        )
    }

    function sortedAlbumsCB(album1, album2) {
        const rating1 = props.otherUser.averageRatings[album1.id] || 0; // Default to 0 if no rating
        const rating2 = props.otherUser.averageRatings[album2.id] || 0;
        
        return rating2 - rating1; // Descending order (highest rating first)
    }

    function displayUserDetails() {
        return (
            <div>
                <div><button className="menu-item-small" onClick={ goBackACB }> Back to Social</button></div>
                <span>
                    <img className="imageStyle" src={props.otherUser.image} height="200"/> 
                    <div className="passion-one-bold">{props.otherUser.name}</div>
                    { FriendButton() }
                </span>
            </div>
        )
    }

    if (props.otherUserID == "" || !props.otherUser.name) {
        return(
            <div>
                <div><button className="menu-item" onClick={ goBackACB }> Back to Social</button></div>
                <div className="logoStyle">Error loading user</div>
            </div>
        )
    }

    if (!props.otherUser.records) {
        return(
            <div>
                { displayUserDetails() }
                <div className="passion-one-bold">This user has not added any records</div>
            </div>
        )
    }

    return(
        <div>
            { displayUserDetails() }
            <div className="account-bold">Highest Rated Albums:</div>
            <div className="passion-one-bold">{ props.otherUser.records.sort(sortedAlbumsCB).map(ratedAlbumsCB).slice(0, 3) } </div>
            <div className="logoStyle"> {props.otherUser.name }'s Records</div>
            <div className="resultRow">
            { props.otherUser.records.map(renderUserRecordsCB) }
            </div>
        </div>
    )
}
