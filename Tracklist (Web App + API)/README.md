# Tracklist: React + Spotify Web API

> This is a snapshot to demonstrate how the app is built, taken from local at 2025-10-13. No changes have been made to the original code since the snapshot was taken. The live app is already deployed.

## Live Demo
- **URL:** https://tracklist-841a6.web.app
- **Stack:** React (CRA), Spotify Web API (Authorization Code - demo setup for coursework)

## Architecture
```
React (CRA) → Spotify Accounts (authorize) → Callback (/callback)
                  │
                  └── Spotify Web API (search, playlists)
State: localStorage (draft playlist), in-memory client state (React)
```

## Key Features
We integrated Spotify’s public API to provide access to a large and dynamic music library, which powers the app’s core features:

- Home Page: Displays new releases and top tracks to help users stay up-to-date with current music trends.
- Search Page: Allows users to search albums by name, artist, genre, or track title.
- Album Details Page: Shows detailed tracklists where users can rate individual songs and write album reviews.
- My Records Page: Displays albums a user has saved, reviewed, or rated.
- Social Page: Lets users view their friends’ ratings and reviews, and add new connections.
- Account Page: Highlights a user’s top-rated albums and artists.

## Notable Implementation Details
- **Auth:** Authorization Code with PKCE (verifier in localStorage; challenge via SHA-256)
- **Data fetching:** `fetch` wrappers with minimal error handling
- **Utilities:** helpers for de-duplication, pagination, and sorting
- **Testing:** a few focused tests for pure utilities (see `tests/utils`)

## Project Structure
All relevant source files are located in `/src`.

- `/reactjs` - Contains presenters, ReactRoot, and index files  
- `/views` — Contains all view components  
- `apiConfig.js` and `trackListSource.js` — Handle API access  
- `TrackListModel.js` — Contains the model logic  
- `style.css` — Handles styling  
- `resolvePromise.js` — Handles promise resolution

## Local Run
The app is deployed; running locally is **optional**. If you want to reproduce:
1. Create `.env.local` with:
   ```
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
   REACT_APP_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
   REACT_APP_SPOTIFY_SCOPES=playlist-modify-public playlist-modify-private user-read-email
   ```
   > This project previously used a demo Authorization Code setup during the course. For this showcase, no secrets are provided. To run locally, use your own Spotify app credentials and a secure token exchange (server-side) or migrate to PKCE.

2. Install & start:
   ```bash
   npm ci
   npm start
   ```

## Testing
```bash
npm test
```
- Utility tests live in `tests`.

### My Role 
I was responsible for:    
- Firebase deployment and configuration  
- API setup and integration  
- Backend logic and data handling for all views and presenters except the homepage 

I did not participate in the visual or stylistic design of the application.

### Code Contributions  
- Views and Presenters for: Account, Search, Details, Login, myRecords, otherUser and Social
- In `/src/reactjs`: `index.jsx` and `ReactRoot.jsx`
- `trackListSource.js` and `trackListModel.js`
- `firebaseModel.js` and `firebaseConfig.js` (with another team member)
