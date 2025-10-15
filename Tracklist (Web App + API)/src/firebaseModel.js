import {firebaseConfig} from "/src/firebaseConfig.js";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, } from "firebase/database"
import { model } from "./TrackListModel";
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, onAuthStateChanged, signOut} from "firebase/auth";
import { getAlbumDetails, getRecordsDetails } from "./trackListSource";

const app= initializeApp(firebaseConfig);
const db= getDatabase(app);
const auth = getAuth(app);

const PATH="tracklist/";
const rf = ref(db, PATH);

const SEARCH_PATH="nametoid/"
const USER_PATH="users/"


const provider = new GoogleAuthProvider();

function modelToPersistence(model){
    function transformerRecordsCB(record) { return record.id };
    return {
            recordsId: model.myRecords.map(transformerRecordsCB).sort(),
            reviews: model.myReviews,
            curReviewText: model.reviewText,
            ratings: model.myRatings,     
            albumRatings: model.averageRatings,
            curAlbumId: model.currentAlbumID,
            curAlbumRating: model.myRatings[model.currentAlbumID],
            userName: model.user.displayName,
            userImage: model.user.photoURL,
            artists: model.sortedArtists,
            friends: model.friends
    };
}

function persistenceToModel(dataFromPersistance, model){
    dataFromPersistance = dataFromPersistance || [];
    model.myRatings = dataFromPersistance.ratings || {}; 
    model.myReviews = dataFromPersistance.reviews || [];
    model.getReviewTextForAlbum(dataFromPersistance.curAlbumId|| null);
    model.averageRatings = dataFromPersistance.albumRatings || {};
    model.setCurrentAlbumID(dataFromPersistance.curAlbumId || null);
    model.myRatings[model.currentAlbumID] = dataFromPersistance.curAlbumRating || {};
    model.otherUserID = null;
    model.friends = dataFromPersistance.friends || [];
    model.sortedArtists = dataFromPersistance.artists || [];

    function saveRecordToModelCB(myRecords) {
        return model.myRecords = myRecords;
    }

    return !dataFromPersistance.recordsId ? [] : getRecordsDetails(dataFromPersistance.recordsId).then(saveRecordToModelCB);
}

function usersPersistanceToModel(dataFromPersistance, model) {
    dataFromPersistance = dataFromPersistance || [];
    model.allUsers = dataFromPersistance.allUsers || [];
}

function userReadFromFirebase(model) {
    model.ready=false;
        

    function modelReadyACB() { model.ready=true };
    function getUsersACB(dataFromPersistance) { return usersPersistanceToModel(dataFromPersistance.val(), model) }

    return get(ref(db, USER_PATH)).then(getUsersACB).then(modelReadyACB)
}

function saveToFirebase(model){
    if (model.ready && model.user) {
        const userId = model.user.uid;
        const name = model.user.displayName.toLowerCase();

        set(ref(db, PATH + userId), modelToPersistence(model));
        set(ref(db, SEARCH_PATH + name), userId);
        set(ref(db, USER_PATH), {allUsers : model.allUsers});
    }  
}
function readFromFirebase(model){
    if (model.user === null) {
        model.myRecords = [],
        model.myReviews = [],
        model.reviewText = "",
        model.myRatings = {},
        model.averageRatings = {},
        model.myRatings[model.currentAlbumID] = {},
        model.currentAlbumID = null,
        model.otherUserID = null,
        model.friends = []
        model.sortedArtists = []
    }

    else { 
        model.ready=false;
        const userId = model.user.uid;

        function modelReadyACB() { model.ready=true };
        function convertBackACB(dataFromPersistance) { return persistenceToModel(dataFromPersistance.val(), model) };
        
        return get(ref(db, PATH + userId)).then(convertBackACB).then(modelReadyACB)
    }
};

function socialPersistanceToModel(dataFromPersistance, model) {
    dataFromPersistance = dataFromPersistance || [];
    model.otherUser.name = dataFromPersistance.userName || null;
    model.otherUser.image = dataFromPersistance.userImage || "";
    model.otherUser.ratings = dataFromPersistance.ratings || {}; 
    model.otherUser.reviews = dataFromPersistance.reviews || [];
    model.otherUser.averageRatings = dataFromPersistance.albumRatings || {};

    function saveRecordToModelCB(myRecords) {
        return model.otherUser.records = myRecords;
    }

    return !dataFromPersistance.recordsId ? [] : getRecordsDetails(dataFromPersistance.recordsId).then(saveRecordToModelCB);
};

async function socialReadFromFirebase(model, userId) {
    model.ready=false;

    function modelReadyACB() { model.ready=true };
    function convertBackACB(dataFromPersistance) { return socialPersistanceToModel(dataFromPersistance.val(), model) };
    
    return get(ref(db, PATH + userId)).then(convertBackACB).then(modelReadyACB)
};

function searchPersistanceToModel(dataFromPersistance, model) {
    model.otherUserID = dataFromPersistance || "";
}

async function getUserIdFromName(model, name) {
    model.ready=false;

    function modelReadyACB() { model.ready=true };
    function convertBackACB(dataFromPersistance) { return searchPersistanceToModel(dataFromPersistance.val(), model) };

    return get(ref(db, SEARCH_PATH + name)).then(convertBackACB).then(modelReadyACB)
}

function connectToFirebase(model, watchFunction){

    function loginOrOutACB(user) {
        model.user = user; 
        readFromFirebase(model);
        
    }

    saveToFirebase(model)
    userReadFromFirebase(model);
    onAuthStateChanged(auth, loginOrOutACB);

    function checkModelACB(){
        return [model.myRecords, model.myRatings, model.myRatings[model.currentAlbumID], model.averageRatings, model.myReviews, 
        model.reviewText, model.currentAlbumID, model.otherUser, model.allUsers, model.friends, model.currentAlbumID, model.sortedArtists]
    };

    function saveModelACB(){
        saveToFirebase(model);
    };
    return watchFunction(checkModelACB, saveModelACB)

};

export { connectToFirebase, modelToPersistence, persistenceToModel, saveToFirebase, readFromFirebase, auth, provider, socialReadFromFirebase, getUserIdFromName }

