import { END_POINT, CLIENT_ID, CLIENT_SECRET, ALBUMS_ENDPOINT } from "./apiConfig";

async function _getToken(){
    const options = {
        method: "POST",
        headers: {
                "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET
    };

    const response = await fetch(END_POINT, options);
    const data = await response.json()
    return data.access_token;
}

// getting new releases for home page
export async function getNewReleases() {
    const NEW_RELEASES_ENDPOINT = "https://api.spotify.com/v1/browse/new-releases"

    const options = {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + await _getToken()}
    }

    const response = await fetch(NEW_RELEASES_ENDPOINT, options);
    const data = await response.json();
    return data;
}
// getting most popular for home page
export async function getmostpopularReleases() {
    const ALBUM_ENDPOINT = "https://api.spotify.com/v1/albums";

    const options = {
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + await _getToken() }

    };

    console.log("Token:", await _getToken());

    const albumIds = [
        "0hvT3yIEysuuvkK73vgdcW",
        "2lIZef4lzdvZkiiCzvPKj7",
        "4iqbFIdGOTzXeDtt9owjQn",
        "7aJuG4TFXa2hmE4z1yxc3n",
        "6BzxX6zkDsYKFJ04ziU5xQ"
    ];

    const albumPromises = albumIds.map(async (id) => {
        const response = await fetch(`${ALBUM_ENDPOINT}/${id}`, options);
        if (!response.ok) {
            throw new Error(`Failed to retrieve the album with ID: ${id}`);
        }
        return response.json();
        
    });


    const albums = await Promise.all(albumPromises);
    return albums;
}



export async function searchAlbums(searchQuery) {
    const SEARCH_ENDPOINT = "https://api.spotify.com/v1/search"

    const options = {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + await _getToken()}
    }


    const response = await fetch(SEARCH_ENDPOINT + "?q=" + searchQuery + "&type=album", options);
    const data = await response.json();
    return data;
}

// getting details of several albums
export async function getRecordsDetails(ids_array) {
    
    const options = {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + await _getToken()}
    }

    const END_POINT = ALBUMS_ENDPOINT + "?ids=" + ids_array;

    const paramsObj = { ids : ids_array.join(",") };

    const response = await fetch(END_POINT, options);
    const data = await response.json();

    return data.albums;
}

// getting details of one album
export async function getAlbumDetails(id){
    const options = {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + await _getToken()}
    }

    const response = await fetch(ALBUMS_ENDPOINT + "/" + id, options);
    const data = await response.json();
    return data;
}

export async function getCategories() {
    const CATEGORIES_ENDPOINT = "https://api.spotify.com/v1/browse/categories"

    const options = {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + await _getToken()}
    }
    const response = await fetch(CATEGORIES_ENDPOINT, options);
    const data = await response.json();
    return data;
}