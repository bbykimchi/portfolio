
export function MyRecordsView(props) {

    function renderRecordsCB(album) {
        function detailsClickedACB(){
            props.onAlbumSelect(album); // anropar parent handler
            window.location.hash = "#/details";
        }

        function getReview() {
            function findReviewCB(review) {
                return album.id == review.albumID;
            }
            return (!props.model.myReviews.find(findReviewCB) ? null : props.model.myReviews.find(findReviewCB).myReview);
        }
        function removeReviewCB(event){
            event.stopPropagation();
            props.model.removeFromMyRecords(album)
            props.onRemove()

        }

        function getRating() {
            const averageRating = props.model.averageRatings[album.id];
            return averageRating
        }

        return (

            <div key={album.id}  className="resultItem">
                <div className="alignCentralos">
                  <div className="passion-one-bold">{album.name}</div>
                  <div className="passion-one-bold">{album.artists[0].name || "Ingen data"}</div>

                </div>

                <div className="containerForCard"  onClick={detailsClickedACB}>

                    <div className="infoCard">
                        <div className="frontCard">
                            <img className="imageStyle" src={album.images[1].url} />
                        </div>
                        <div className="backCard">

                        <div className="infobutton">
                        <i class="fa-solid fa-circle-info"></i>
                        </div>
                        
                        
                        <div className="removeButton">
                        <i class="fa-solid fa-trash " onClick={removeReviewCB}></i>
                        </div>

                            <div className="rating-backside">
                            <i class="fa-solid fa-star"></i>
                            { getRating() }
                            </div>


                            <div className="reviewBackside">
                            <div className="purple-text">My Review:</div>
                            "{ getReview() }"
                            </div>

                        </div>
                    </div>
                </div>
              </div>
        );
    };
    
    return (
        <div>
        <div className="logoStyle">My Records</div>
        <div className="resultRow">
            { props.model.myRecords.map(renderRecordsCB) }
        </div>
        </div>
    );
}






