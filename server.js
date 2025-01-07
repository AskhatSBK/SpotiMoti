// Import modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');

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

app.post('/find',(req, res)=>{
    const name = req.body.name;

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, inintial-scale=1.0">
            <title>Result</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        
        </html>
        
        `);
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