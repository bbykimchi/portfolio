import { useState } from "react";
import React from 'react';

export function DetailsView(props) {
    const [isReviewBoxVisible, setReviewBoxVisible] = useState(false);
    const [reviewText, setReviewText] = useState(props.reviewText || "");

   
   

    function trackRenderingCB(track) {
        return (
            <div key={track.id} className="track-item">
                <span>{ track.track_number }.</span>
                <span className="track-name">{track.name}</span>
                <span className="track-duration">{Math.floor(track.duration_ms / 60000)}:{Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, "0")}</span>
                {starRendering(track)}
            </div>
        );
    }

    function artistRenderingCB(artist) {
        return (
            <div key={artist.id}>
                <span>{artist.name}</span>
            </div>
        )
    }


    function starRendering(track) {
        
        function ratingCB(_, index) {
            const rating = 5 - index;
            console.log("props.ratings[track.id]",props.ratings[track.id])
            const isChecked = props.ratings && props.ratings[track.id] === rating;
            return (
                <React.Fragment key={rating}>
                    <input
                        type="radio"
                        name={`rate-${track.id}`}
                        id={`rate-${track.id}-${rating}`}
                        checked = {isChecked}
                        onChange={() => handleRatingChange(track, rating)}
                    />
                    <label htmlFor={`rate-${track.id}-${rating}`} className="fa-solid fa-star"></label>
                </React.Fragment>
            );
        }

        return (
            <div className="starContainer">
                <div className="starWidget">{[...Array(5)].map(ratingCB)}</div>
            </div>
        );
    }

    function handleRatingChange(track, rating) {

        props.onRating(track, rating); // Update the model through props
    }

    function reviewButtonEventACB() {
        setReviewBoxVisible(!isReviewBoxVisible);
    }

    function handleReviewChange(event) {
        setReviewText(event.target.value);
    }

    function handleReviewSubmit() {
        props.onReview(reviewText);
        setReviewBoxVisible(false);
    }

    console.log(props.reviewText)

    function displayReview() {
        if (!props.reviewText) {
            return (
                <div>
                    <div className="write-review" onClick={reviewButtonEventACB}>
                        <div className="add-review-text">Add a Review</div>
                            <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                        {isReviewBoxVisible && (
                            <div className="review-box">
                                <textarea
                                    value={reviewText}
                                    onChange={handleReviewChange}
                                    placeholder={ props.reviewText || "Write your review here..."} 
                                    className="review-textarea"
                                />
                                <button onClick={handleReviewSubmit} className="review-submit-button">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                            )}      
                </div>
        )} else {
            return(
                <div>
                    <div className="review-text">"{ props.reviewText }"</div>
                    <div className="write-review" onClick={reviewButtonEventACB}>
                        <div className="add-review-text">Edit Review</div>
                            <i class="fa-solid fa-pen-to-square"></i>
                        </div>
                        {isReviewBoxVisible && (
                            <div className="review-box">
                                <textarea
                                    value={reviewText}
                                    onChange={handleReviewChange}
                                    placeholder={ props.reviewText || "Write your review here..."} 
                                    className="review-textarea"
                                />
                                <button onClick={handleReviewSubmit} className="review-submit-button">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        )}      
                </div>
            )}
    }

    return (
        <div className="detailsview-layout">
            

                {/* Left Section: Album Information */}
                <div className="details-content">
                    <div>
                    <h1 className="album-title">{ props.albumData.name}</h1>
                    </div>

                    <img src={props.albumData.images[1].url} alt="Album cover" className="album-cover" />

                    <span className="album-info">{ props.albumData.artists.map(artistRenderingCB)}</span>
                    <span className="album-info">{ props.albumData.release_date }</span>

                    { displayReview() }
                    
                </div>

            



            <div>
            

            {/* Right Section: Track List */}
             <div className="track-list">
             {props.albumData.tracks.items.map(trackRenderingCB)}
            </div>

            </div>
            
            <a className="back-button" href="javascript:window.history.back();"><i class="fa-solid fa-xmark"></i></a>
            </div>
        
    );
}
