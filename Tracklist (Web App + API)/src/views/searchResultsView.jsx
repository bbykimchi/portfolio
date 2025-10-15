import { useState } from "react";
import "/src/style.css"


// SearchResultsView skapar sökresultatet med bilder, och titel
export function SearchResultsView(props){
    return(
        // för att placera resultatet rätt
        <div className="resultRow" >
            {/*mappar över alla sökresultat och renderar dom med call backen */}
            {props.searchResults.map(resultsViewCB)}
        </div>
    );

    // call back  för renderings resultatet
    function resultsViewCB(album) {
        // fires custom event när bilderna eller titeln klickas

        function resultsClickedACB(){


            props.ResultClicked(album); // anropar parent handler
            window.location.hash = "#/details";

        }

        function getReview() {
            function findReviewCB(review) {
                return album.id == review.albumID;
            }
            return (!props.model.myReviews.find(findReviewCB) ? null : props.model.myReviews.find(findReviewCB).myReview);
        }

        function getRating() {
            const averageRating = props.model.averageRatings[album.id];
            return averageRating
        }

        function generateBackcard() {
            function findInRecords(existing) {
                return album.id == existing.id;
            }

            function removeReviewCB(event){
                event.stopPropagation();
                props.model.removeFromMyRecords(album);
                setIsAdded(!isAdded);
            }

            function backCardButtonClickACB(event){
                event.stopPropagation();
                props.addToMyRecords(album);
                setIsAdded(!isAdded);
            }

            const [isAdded, setIsAdded] = useState(props.model.myRecords.find(findInRecords));

            return (!isAdded ?
                (<div>
                    <div className="purple-text">You have not listened to this album yet</div>
                    <div className="infobutton">
                    <i class="fa-solid fa-circle-info"></i>
                    </div>
                    <button className="add-backside" onClick={ backCardButtonClickACB }>
                    <i class="fa-solid fa-square-plus"></i>
                    </button>
                </div>) :
                (<div>
                    <div className="infobutton">
                    <i class="fa-solid fa-circle-info"></i>
                    </div>
                    <button className="removeButton">
                    <i class="fa-solid fa-trash" onClick={ removeReviewCB }></i>
                    </button>
                        <div className="rating-backside">
                        <i class="fa-solid fa-star"></i>
                        { getRating() }
                        </div>
                        <div className="reviewBackside">
                        <div className="purple-text">My Review:</div>
                        "{ getReview() }"
                        </div>
                    </div>
                )
            );          
        }
  
         
        // renderar sök resultaten med hjälp av nyckel, funktionerna och array rendering
        return (
            <div key={album.id} className="resultItem">
              
                  <div className="passion-one-bold">{album.name}</div>
                  <div className="passion-one-bold">{album.artists[0].name || "Ingen data"}</div>
                    <div className="containerForCard" onClick={resultsClickedACB}>
                        <div className="infoCard">
                            <div className="frontCard">
                                <img className="imageStyle" src={album.images[1].url} />
                            </div>
                            <div className="backCard">
                                { generateBackcard() }
                            </div>
                        </div>
                    </div>
                    </div>  

            );
            
    }
}






