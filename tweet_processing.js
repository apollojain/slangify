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

function string_to_date(date) {
  return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
}

function dt_array(start_date, end_date) {
  Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
  }

  var s_d = new Date(start_date);
  var e_d = new Date(end_date);
  
  if(isNaN(e_d)) {
    e_d = new Date()
    
  }
  if(isNaN(s_d)) {
    s_d = new Date()
    s_d = s_d.addDays(-365)
  }
  var array = [string_to_date(s_d)]
  while(s_d < e_d) {
    s_d = s_d.addDays(5)
    array.push(string_to_date(s_d))
  }
  return array;
}

function get_tweets(keyword, location, radius, start_date="", end_date="") {
  var d = Promise.defer();
  get_location(location).then(function(result){
      var lat = result[0].latitude;
      var lon = result[0].longitude;
      var location_query = lat + "," + lon + "," + radius + "km"
      var q_query = keyword; 
      if(start_date) {
        q_query += " since:" + start_date; 
      }
      if(end_date) {
        q_query += " until:" + end_date; 
      }
      console.log(q_query)
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

function get_tweets_by_day(keyword, location, radius, start_date, end_date) {
  var d = Promise.defer();
  console.log('do we get here')
  var date_array = dt_array(start_date, end_date)
  for(i = 0; i < date_array.length - 1; i++) {
    var d1 = date_array[i]; 
    var d2 = date_array[i + 1];
    get_tweets(keyword, location, radius, d1, d2)
    .then(
      function(result){
        if(d.state_ == 'unresolved') {
          d.resolve(result)
        } else {
          d.resolve(d.result_ + "\n" + result)
        }
        // console.log(d1)
        // console.log(d2)
        console.log(result)
      }
    );
  }
  return d;
}
function tweets_in_txt_file(keyword, filename, location, radius, start_date="", end_date="") {
  var d = Promise.defer();
  get_tweets_by_day(keyword, location, radius, start_date, end_date)
  .then(
    function(result){
      fs.truncate(filename, 0, function() {
        fs.writeFile(filename, result, function (err) {
            
            if (err) {
              d.reject(err)
                return console.log("Error writing file: " + err);
            } else {
              d.resolve(filename)
            }
        });
      });
    });
  return d;
}

module.exports = {
    tweets_in_txt_file: tweets_in_txt_file
}


get_tweets("Trump", "New York", "100").then(
  function(result) {
    console.log(result)
  }
)