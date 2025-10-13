import { useRef, useState, useEffect } from "react";

const ITEM_WIDTH = 180;;

export function NewReleasesView(props) {

    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef();

    useEffect(function(){
        function autoScroll(){
            handleScroll(ITEM_WIDTH)
        }
        const intervalID = setInterval(autoScroll, 3000)
        return function cleanUp(){
            clearInterval(intervalID)
        }
    })

    function handleScroll(scrollAmount){
        const newScrollPosition = scrollPosition + scrollAmount;
        const maxScroll = containerRef.current.scrollWidth - containerRef.current.clientWidth;

        if (newScrollPosition > maxScroll) {
            setScrollPosition(0);
            containerRef.current.scrollLeft = 0;
        } else if (newScrollPosition < 0) {
            setScrollPosition(maxScroll);
            containerRef.current.scrollLeft = maxScroll;
        } else {
            setScrollPosition(newScrollPosition);
            containerRef.current.scrollLeft = newScrollPosition;
        }
    }
    function renderNewReleasesCB(album) {
        const artistName = album.artists[0]?.name;

        function resultsClickedACB() {
            props.onResultClicked(album);
            window.location.hash = "#/details";
        }

        return(
            <div key = {album.id} onClick = { resultsClickedACB }> {/*Här ska vi kommma till detailsview */}
             <div className= "resultcontainerV2">
             <img className= "imageStyle" src = {album.images[0].url} ></img>
             <div className="albumInfo2">
                    <div>{album.name}</div>
                    <div>{artistName}</div>
                </div>

            </div>
            </div>
        );
    }

    return(
        <div className="new-releases-container" style={{ display: "flex", justifyContent: "center", width: "100%", position:"relative"}}>
        <div style={{ textAlign: "center", marginBottom: "20px", position: "absolute",
                    width: "100%",
                    top: "130px",}}>
            <h2 className="new-releases-text">New Releases</h2>
        </div>
        <div style={{display:"flex", alignItems: "center", position: "relative", width: "900px"}}>
            <button onClick={()=> handleScroll(-ITEM_WIDTH)} className="scroll-button-left left-button" ></button>
            <div className="new-container">
                <div ref={containerRef} style={{width: "900px", overflowX: "scroll", scrollBehavior: "smooth", whiteSpace: "nowrap"}}>
                    <div className="content-box">
                        {props.newReleases.map(renderNewReleasesCB) }
                        </div>
                    </div>
                </div>
                <div style={{display:"flex", alignItems: "center"}}>
                   <button className = "scroll-button-right right-button" onClick={()=> handleScroll(ITEM_WIDTH) }></button>
                </div>
            </div>
        </div>
    );
}



