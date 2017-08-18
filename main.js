// var http = require("http")

// http.createServer(function (request, response) {
	
// 	response.writeHead(200, {'Content-Type': 'text/plain'});

// 	response.end('Hello World\n');
// }).listen(8081);

// console.log('Server running at http://127.0.0.1:8081/');
var Twitter = require('twitter');
var NodeGeocoder = require('node-geocoder');
var Promise = require('promise-simple');
var keys = require('./apiKeys')
var fs = require('fs')


var options = {
  provider: 'google',
 
  // Optional depending on the providers 
  httpAdapter: 'https', // Default 
  apiKey: keys.google_key, // for Mapquest, OpenCage, Google Premier 
  formatter: null         // 'gpx', 'string', ... 
};

var client = new Twitter({
  consumer_key: keys.consumer_key,
  consumer_secret: keys.consumer_secret,
  access_token_key: keys.access_token_key,
  access_token_secret: keys.access_token_secret
});

var geocoder = NodeGeocoder(options);

function get_location(location){
  var d = Promise.defer();
  geocoder.geocode(location)
  .then(function(res) {
    // console.log(res);
    d.resolve(res)
  })
  .catch(function(err) {
    d.reject(err)
  });
  return d;
}
  

function get_tweets(keyword, location, radius, start_date="", end_date="") {
  var d = Promise.defer();
  get_location(location).then(function(result){
      var lat = result[0].latitude;
      var lon = result[0].longitude;
      var location_query = lat + "," + lon + "," + radius + "km"
      var q_query = keyword; 
      if(start_date) {
        q_query += "since:" + start_date; 
      }
      if(end_date) {
        q_query += "until:" + start_date; 
      }
      client.get('search/tweets', {q: q_query, geocode: location_query, count: 100}, function(error, tweets, response) {
        var tweet_text = tweets.statuses.map(function(tweet) {
            return tweet.text
              .replace(/^(?=.*[A-Z0-9])[\w.,!"'\/$ ]+$/i, '')
              .toLowerCase()
     
        }).join("\n");
        // console.log(tweet_text)
        d.resolve(tweet_text);
      })
      .catch(function(err) {
        d.reject(err);
      });
  })
  // .catch(function(err) {
  //   d.reject(err);
  // });
  return d;
}

// get_location('wqerjoqrwekqlwkj').then(function(result){
//   console.log(result.length)
// });
function tweets_in_txt_file(keyword, filename, location, radius, start_date="", end_date="") {
  get_tweets(keyword, location, radius, start_date, end_date)
  .then(
    function(result){
      fs.truncate(filename, 0, function() {
        fs.writeFile(filename, result, function (err) {
            if (err) {
                return console.log("Error writing file: " + err);
            }
        });
      });
    });
}


// get_tweets("trump", "New York, NY", "10")
// .then(
//   function(result){
//     console.log(result)
//   }
// );
tweets_in_txt_file("trump", "content.txt", "New York, NY", "2")