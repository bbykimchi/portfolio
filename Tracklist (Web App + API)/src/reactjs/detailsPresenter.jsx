import { DetailsView } from "../views/detailsView";
import { observer } from "mobx-react-lite";

const Details = observer(
    function DetailsRender(props) {

        function handleReviewACB(reviewText) {
            props.model.addToReviews(props.model.currentAlbumPromiseState.data, reviewText)
            props.model.addToMyRecords(props.model.currentAlbumPromiseState.data)
            props.model.getSortedArtistsByFreq()
        }
        
        function handleRatingACB(track, rating) {
            const albumID = props.model.currentAlbumPromiseState.data.id;
        
            props.model.addToRatings(track, rating, albumID);
        
            props.model.addToMyRecords(props.model.currentAlbumPromiseState.data);

            props.model.getSortedArtistsByFreq()
        
            console.log("Album ID:", albumID);
            console.log("Track:", track, "Rating:", rating);
        }
        
        if (!props.model.currentAlbumPromiseState.promise) {
            return <div className="menu-item">No data available</div>;
        }
        if (props.model.currentAlbumPromiseState.promise && !props.model.currentAlbumPromiseState.data && !props.model.currentAlbumPromiseState.error) {
            return <img src="https://img1.picmix.com/output/stamp/normal/7/2/4/7/2647427_19293.gif" height="100" />;
        }
        if (props.model.currentAlbumPromiseState.error) {
            return <div>{props.model.currentAlbumPromiseState.error}</div>;
        }
        if (props.model.currentAlbumPromiseState.data) {

            const currentRatings = props.model.myRatings[props.model.currentAlbumPromiseState.data.id] || {};


            return <DetailsView 
            albumData={ props.model.currentAlbumPromiseState.data }
            onRating = { handleRatingACB }
            onReview = { handleReviewACB }
            ratings = { currentRatings }
            reviewText = { props.model.getReviewTextForAlbum(props.model.currentAlbumPromiseState.data.id) }
            />
        }
        
    },
);

export { Details };

