var w2v = require( 'word2vec' );
var Promise = require('promise-simple');

function get_slangonym(f1, f2, word) {
    var d = Promise.defer();
    w2v.word2vec(f1, f2, {}, 
        function(err, result) {
            w2v.loadModel( './' + f2, function( error, model ) {
                var similar_words = [];
                if(model.getVector(word)) {
                    similar_words = model.mostSimilar(word, 20)
                    .map(
                        function(obj) {
                            if(obj && obj.hasOwnProperty("word")) {
                                
                                return obj.word
                            }
                            
                        }
                    )
                }
                d.resolve(similar_words)
                // return similar_words;
            });
        }
    );
    return d;
}

module.exports = {
    get_slangonym: get_slangonym
}

get_slangonym("content.txt", "idk.txt", "dasflksa").then(
    function(result) {
        console.log(result)
    }
)