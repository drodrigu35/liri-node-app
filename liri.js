require('dotenv').config();

const Twitter = require('twitter');
var Spotify = require('node-spotify-api');
const keys = require("./keys");
const request = require('request');
const fs = require("fs");
const spotify= new Spotify(keys.spotify);

let getArtistName = (artist) => {
    return artist.name;
   };
   let getSpotify = (songName) => {
    if (songName === undefined) {
      songName = "The Sign";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      (err, data)=> {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
        let songs = data.tracks.items;
  
        for (let i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("Artist: " + songs[i].artists.map(getArtistName));
          console.log("Song Title: " + songs[i].name);
          console.log("Preview: " + songs[i].preview_url);
          console.log("Album: " + songs[i].album.name);
          console.log("*   *   *   *   *   *");
          fs.appendFile('log.txt', "\n" + "\n" + 'SPOTIFY THIS SONG: ' + i + "\n" + "Artist: " + songs[i].artists.map(getArtistName) + "\n" + "Song Title: " + songs[i].name + "\n" + "Preview: " + songs[i].preview_url + "\n" + "Album: " + songs[i].album.name +  "\n" + "Album: " + songs[i].album.name, (err) => {
            if (err) throw err;
          });
        }
      }
    );
  };
  let myTweets = ()=> {
   let client = new Twitter(keys.twitter);
  
    let params = {
      screen_name: "LevyTX"
    };
    client.get("statuses/user_timeline", params, (error, tweets, response) => {
      if (!error) {
        for (let i = 0; i < tweets.length; i++) {
          console.log(tweets[i].created_at);
          console.log("");
          console.log(tweets[i].text);
          fs.appendFile('log.txt', "\n" + "\n" + 'MY TWEETS: ' + "\n" + tweets[i].created_at + "\n" + tweets[i].text + "\n-----------", function (err) {
            if (err) throw err;
          });
        }
      }
    });
  };
  let movieThis = (movieName) => {
    if (movieName === undefined) {
      movieName = "Fanny and Alexander";
    }
  
    let movieData = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=full&tomatoes=true&apikey=37a295e6";
  
    request(movieData, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let jsonData = JSON.parse(body);
  
        console.log("\nTitle: " + jsonData.Title);
        console.log("\nYear: " + jsonData.Year);
        console.log("\nRated: " + jsonData.Rated);
        console.log("\nIMDB Rating: " + jsonData.imdbRating);
        console.log("\nCountry: " + jsonData.Country);
        console.log("\nLanguage: " + jsonData.Language);
        console.log("\nPlot: " + jsonData.Plot);
        console.log("\nActors: " + jsonData.Actors);
        console.log("\nRotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        fs.appendFile('log.txt', "\n" + "\n" + 'MOVIE THIS: ' + "\nTitle: " + jsonData.Title + "\nYear: " + jsonData.Year + "\nRated: " + jsonData.Rated + "\nIMDB Rating: " + jsonData.imdbRating + "\nCountry: " + jsonData.Country + "\nLanguage: " + jsonData.Language + "\nPlot: " + jsonData.Plot + "\nActors: " + jsonData.Actors + "\nRotten Tomatoes Rating: " + jsonData.Ratings[1].Value, (err) => {
          if (err) throw err;
        });
      }
    });
  };
  var doWhatItSays = function() {
    //node modul reads texts from random.tx 
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);
    //splits data into two arrays at the ","
      var dataArr = data.split(",");
      if (dataArr.length == 2) {
        pick(dataArr[0], dataArr[1]);
      }
      else if (dataArr.length == 1) {
        pick(dataArr[0]);
      }
    });
  };
  
  var pick = function(caseData, functionData) {
    switch (caseData) {
    case "my-tweets":
      myTweets();
      break;
    case "spotify-this-song":
      getSpotify(functionData);
      break;
    case "movie-this":
      movieThis(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
    }
  };
  
  var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  runThis(process.argv[2], process.argv[3]);

