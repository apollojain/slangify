var tweet_processing = require('./tweet_processing')
var slangonym = require('./slangonym')
var crypto = require("crypto");

function slangonym_processing(keyword, location, radius, start_date="", end_date="") {
  var f1 = crypto.randomBytes(20).toString('hex');
  var f2 = crypto.randomBytes(20).toString('hex');
  tweet_processing.tweets_in_txt_file(keyword, f1, location, radius, start_date, end_date)
  slangonym.get_slangonym(f1, f2, keyword).then(
    function(result) {
      console.log(result)
    }
  )
}
slangonym_processing("trump", "content.txt", "idk.txt", "New York, NY", "2")