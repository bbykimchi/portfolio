import { resolvePromise } from "./resolvePromise";
import { getNewReleases, getAlbumDetails, searchAlbums, getmostpopularReleases, getCategories } from "./trackListSource";
import { getUserIdFromName, socialReadFromFirebase } from "./firebaseModel";



const model = {

    myRecords: [],
    myRatings: {},
    myReviews: [],
    reviewText: "",
    userType: null,
    user: null,
    friends: [],
    friendsPromiseState: {},
    allUsers: [],
    searchedUsers: null,
    socialSearchResults: {},
    otherUser: {},
    otherUserID: "",
    searchedUsersPromiseState: {},
    averageRatings: {},
    sortedArtists: [],


    currentAlbumID: null,
    currentAlbumPromiseState: {},
    searchQuery: "",
    socialQuery: "",
    searchResultsPromiseState: {},
    newReleasesPromiseState: {},
    mostPopularPromiseState: {},



    setGuestUser() {
        this.userType = "guest";
    },

    setGoogleUser() {
        this.userType = "google";
    },

    addToUsers(username) {
        function alreadyAddedCB(existingUser) {
            return(existingUser === lowerCase);
        }

        const lowerCase = username.toLowerCase()
        const isAlreadyAdded = this.allUsers.some(alreadyAddedCB)

        if(!isAlreadyAdded && lowerCase != undefined){
        this.allUsers = [...this.allUsers, lowerCase]
        }
    },

    addOrRemoveFriends(user) {
        function alreadyAddedCB(existingUser) {
            return(existingUser === lowerCase);
        }

        function removeCB(existingUser) {
            return (existingUser !== lowerCase)
        }

        const lowerCase = user.name.toLowerCase()
        const existingFriendIndex = this.friends.findIndex(alreadyAddedCB)

        if (existingFriendIndex !== -1) {
            this.friends = this.friends.filter(removeCB);
        } else {
            this.friends = [...this.friends, lowerCase];
        }
        console.log(this.friends)
    },

    setCurrentAlbumID(id) {
        if (id != this.currentAlbumID && id) {
            resolvePromise(getAlbumDetails(id), this.currentAlbumPromiseState);
        }
        this.currentAlbumID = id;
    },

    setSearchQuery(query) {
        this.searchQuery = query;
    },

    doSearch(params) {
        resolvePromise(searchAlbums(params), this.searchResultsPromiseState);
    },

    setSocialQuery(query) {
        this.socialQuery = query;
    },

    doSocialSearch(params) {
    function checkUsersCB(username) {
        return (username.startsWith(lowerCase))
    } 
    const lowerCase = params.toLowerCase();
    this.searchedUsers = this.allUsers.filter(checkUsersCB);
    },

    async getOtherUser(username) {
        await getUserIdFromName(this, username);
        await socialReadFromFirebase(this, this.otherUserID)

    },

    getMultipleUsers(user_array, promiseState) {
        async function fetchAllUsers(user_array) {
            async function getUserCB(username) {
                const userModel = {
                    otherUserID: "",
                    otherUser: {},
                    ready: false
                }

                await getUserIdFromName(userModel, username);
                await socialReadFromFirebase(userModel, userModel.otherUserID);
                userModel.ready=true;
                return userModel;
            }

            const userModels = await Promise.all(user_array.map(getUserCB));
            return userModels;
        }

        resolvePromise(fetchAllUsers(user_array), promiseState);

    },

    clearSearchedUsers() {
        this.searchedUsersPromiseState = {};
    },

    generateNewReleases() {
        resolvePromise(getNewReleases(), this.newReleasesPromiseState);
    },

    generateMostPopular(){
        resolvePromise(getmostpopularReleases() ,this.mostPopularPromiseState)
    },

    addToMyRecords(album) {

        function alreadyAddedCB(existingAlbum) {
            return(existingAlbum.id === album.id);
        }
        
        const isAlreadyAdded = this.myRecords.some(alreadyAddedCB)

        if(!isAlreadyAdded){
        this.myRecords = [...this.myRecords, album]
        }
    },

    addToRatings(track, rating, albumID) {

        if (!this.myRatings[albumID]) {
    
            this.myRatings[albumID] = {};
        }
     
        this.myRatings[albumID] = {
            ...this.myRatings[albumID], // Preserve existing ratings
            [track.id]: rating, // Add or update this track's rating
        };
    
        console.log("Updated ratings:", this.myRatings);

        console.log("ratingings in album", Object.values(this.myRatings[albumID]))

        this.calculateAndStoreAverageRating(albumID)
    },
    
    calculateAndStoreAverageRating(albumID) {
        const ratings = this.myRatings[albumID];

        if (!ratings) {
            this.averageRatings[albumID] = 0;
            return;
        }

        const totalRatings = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
        const numberOfRatings = Object.keys(ratings).length;

        this.averageRatings[albumID] = numberOfRatings > 0 ? (totalRatings / numberOfRatings).toFixed(1) : 0;
        console.log("här är average",this.averageRatings[albumID])
    },



    addToReviews(album, review) {
        function findReviewCB(review){
            return(review.albumID === album.id);
        }
        const existingReviewIndex = this.myReviews.findIndex(findReviewCB);

        if (existingReviewIndex !== -1) {
            this.myReviews[existingReviewIndex].myReview = review;
        }
        else {
            this.myReviews = [...this.myReviews, { albumID: album.id, myReview: review }];
        }
    },

    getReviewTextForAlbum(albumID) {
        const review = this.myReviews.find(review => review.albumID === albumID);
        review ? this.reviewText = review.myReview  : this.reviewText = ""
        return this.reviewText
    },

    calculateFreqByArtist() {
        this.featuredArtists = {};
    
        this.myRecords.forEach(record => {
            if (record.artists && record.artists.length > 0) {
                record.artists.forEach(artist => {
                    const artistName = artist.name;
                    if (this.featuredArtists[artistName]) {
                        this.featuredArtists[artistName] += 1;
                    } else {
                        this.featuredArtists[artistName] = 1;
                    }
                });
            }
        });
    },

    getSortedArtistsByFreq() {
        this.calculateFreqByArtist();
    
        this.sortedArtists = Object.keys(this.featuredArtists)
            .sort((a, b) => this.featuredArtists[b] - this.featuredArtists[a]).map(artist => ({
            artist: artist,
            count: this.featuredArtists[artist]
        }));
    },

    removeFromMyRecords(albumToRemove) {
        function shouldWeKeepAlbumCB(album){
            return (album.id !== albumToRemove.id);
        }
        this.myRecords= this.myRecords.filter(shouldWeKeepAlbumCB);
    }
};

export { model };