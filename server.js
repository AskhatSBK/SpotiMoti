// Import modules
require('dotenv').config();
console.log(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);

const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');

// Initialize app
const app = express();
const PORT = 3000;

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  
  // Get Spotify access token
spotifyApi.clientCredentialsGrant().then(
    (data) => {
        spotifyApi.setAccessToken(data.body['access_token']);
    },
    (err) => {
        console.error('Error retrieving access token', err);
    }
);

// Middleware setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/',(req, res)=>{
    res.sendFile(__dirname+'/views/index.html');
});

app.post('/find', async (req, res)=>{
    const name = req.body.name;
    let html = `
    <h1>Result of search ${name}<h1>
    <ol>
    `;

    const data = await spotifyApi.searchTracks(name);
    const tracks = data.body.tracks.items;

    tracks.forEach((track) => {
    // const artistName = track.artists.map((artist) => artist.name).join(', ');
    const artistsURL = track.artists.map((artist) => `<a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a>`).join(', ');
    const trackURL = track.external_urls.spotify;
    const trackName = track.name;
    const trackPop = track.popularity;
    const imageURL = track.album.images[1].url;
    
    console.log("Name: "+trackName+"  Popularity: "+trackPop)
    
    html += `
    <li>
        <a href="${trackURL}" target="_blank">${trackName}</a>
        ${artistsURL}
        <img src="${imageURL}" alt="${trackName}">
        <p></p>
    </li>
    `
    });

    html += '</ol><a href="/">Go back</a>';


    res.send(html);
});

// Display the following details for each song:
// ▪ Song Name
// ▪ Artist(s)
// ▪ Album Name
// ▪ Link to listen to the song on Spotify.
// o Display the results dynamically on the same page. -->
// <!-- <body>
    
// </body>


app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});