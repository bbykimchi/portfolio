export function MostPopularView(props) {
    function renderMostPopularCB(album) {
		const artistName = album.artists[0]?.name;
		
		function resultsClickedACB() {
            props.onResultClicked(album);
            window.location.hash = "#/details";
        }

        return (

            <div key={album.id} onClick={ resultsClickedACB } className="card">
                <img className="imageStyle-carousel" src={album.images[0].url} alt={album.name} />
                <div className="album-info">{album.name}</div>
				<div className="album-info">{artistName}</div>
            </div>
        );
    }

    return (
		<div className="carousel-container">
			<h2 className="most-popular-text">Most Popular</h2>
			<div className="carousel">
            	{props.mostPopular.slice(0, 5).map(renderMostPopularCB)}
			</div>
		</div>

    );
}