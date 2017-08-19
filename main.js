var tweet_processing = require('./tweet_processing')
var slangonym = require('./slangonym')
var crypto = require("crypto");
var Promise = require('promise-simple');

function slangonym_processing(keyword, location, radius, start_date="", end_date="") {
  var d = Promise.defer();
  var f1 = "processing/" + crypto.randomBytes(20).toString('hex') + ".txt";
  var f2 = "processing/" + crypto.randomBytes(20).toString('hex') + ".txt";
  tweet_processing.tweets_in_txt_file(keyword, f1, location, radius, start_date, end_date).then(function(result) {
    slangonym.get_slangonym(f1, f2, keyword).then(
      function(result) {
        d.resolve(result)
      }
    )
  });
  
  return d;
}

module.exports = {
  slangonym_processing: slangonym_processing
}
