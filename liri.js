// require statements for node packages
require('dotenv').config();
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");


// Importing the keys.js with env package grabbing actual keys from the .env file
var keys = require("./keys.js");

// Grab the command from the passed arguments
var command = process.argv[2];

// Any additional arguments become the argument array
var argAry = process.argv.slice(3);

// Function to pull my last 20 tweets and display them with their creation date
function myTweets() {

    // Setting up twitter package as per docs
    var client = new Twitter({
        consumer_key: keys.twitter.consumer_key,
        consumer_secret: keys.twitter.consumer_secret,
        access_token_key: keys.twitter.access_token_key,
        access_token_secret: keys.twitter.access_token_secret
    });

    // Specifying my twitter name and the amount of most recent tweets we want returned
    var params = {
        screen_name: 'Ron39443053',
        count: 20
    };

    // Making the call to twitter via the package
    client.get('statuses/user_timeline', params, function (error, tweets, response) {

        // if no error, display the 20 most recent tweets & creation date - or less tweets if there aren't 20
        if (!error) {
            for (var key in tweets) {
                console.log("\n" + tweets[key].text);
                console.log(tweets[key].created_at);
            }
        }
        // if an error returns, log it to the console
        else {
            console.log("Something went wrong, you got this error: " + error);
        }
    });

}

// Function for spotify, will return various info about the song name you provide, or some info on a default song

function spotifyThis() {

    // Setting up spotify package as per docs
    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });

    // Note: for spotify query %22 = " and %20 = + , and the values are interchangable in the code, it interprets it the same in the end

    // Grabbing the text after the spotify-this-song for the songname
    var songAry = argAry;
    // Creating a variable for the songname & variable for word seperator
    var songName = "";
    var sepVar = "";
    // Converting the song array into songname string
    for (var key in songAry) {
        songName = (songName + sepVar + songAry[key]);
        sepVar = "%20";
    }
    // Inserting the default song if the user doesn't enter one
    if (songName == "") {
        songName = '"The%20Sign"';
    }

    // Making the call to spotify via the package
    spotify.search({ type: 'track', query: songName, limit: 1 }, function (err, data) {

        // Another format to console out the error if one occurs
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // consoling out the requested data
        console.log("\n");
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Song's name: " + data.tracks.items[0].name);
        console.log("Preview link: " + data.tracks.items[0].preview_url);
        console.log("Album name: " + data.tracks.items[0].album.name)


    });

}


// Function for IMDB, will return various info about the movie you provide, or some info on a default movie

function movieThis() {

    // Grabbing the text after the movie-this for the moviename
    var movieAry = argAry;
    // Creating a variable for the songname & variable for word seperator
    var movieName = "";
    var sepVar = "";
    // Converting the song array into songname string
    for (var key in movieAry) {
        movieName = (movieName + sepVar + movieAry[key]);
        sepVar = "+";
    }

    // Inserting the default song if the user doesn't enter one
    if (movieName == "") {
        movieName = "Mr.+Nobody";
    }

    // Setting up IMDB query
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    // Hitting IMDB via request package
    request(queryUrl, function (error, response, body) {

        // Error handling
        if (error) {
            console.log('error:', error); // Print the error if one occurred
            return;
        }

        // If the request is successful
        if (!error && response.statusCode === 200) {

            // Displaying the requested data
            console.log("\n");
            console.log("The movie's title: " + JSON.parse(body).Title);
            console.log("The movie's release year: " + JSON.parse(body).Year);
            console.log("The movie's IMBD rating: " + JSON.parse(body).imdbRating);
            // console.log("The movie's Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("The country(s) the movie was produced in: " + JSON.parse(body).Country);
            console.log("The movie's language(s): " + JSON.parse(body).Language);
            console.log("The movie's plot: " + JSON.parse(body).Plot);
            console.log("The movie's Actor(s): " + JSON.parse(body).Actors);

        }

    });

}

// Function to read the random file and do what it says
function doWhat() {

    // Using fs package to read the Random.txt file
    fs.readFile("./random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        };

        // Split the contents into an array delimited by the ,
        var fileAry = data.split(",");

        // grab the command from the file
        command = fileAry[0];

        // grab any arguments from the file
        argAry = fileAry.slice(1);

        switch (command) {

            case "my-tweets":
                myTweets();
                break;

            case "spotify-this-song":
                spotifyThis();
                break;

            case "movie-this":
                movieThis();
                break;

            default:
                console.log("invalid command");

        }

    });

}


// Switch statement to process the incoming commands
switch (command) {

    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhat();
        break;

    default:
        console.log("invalid command");

}

