var Promise = require('promise-simple');
var w2v = require( 'word2vec' );

function get_slangonym(f1, f2, word) {
    var d = Promise.defer();
    w2v.word2vec(f1, f2, {}, 
        function(err, result) {
            console.log(result)
            w2v.loadModel( './' + f2, function( error, model ) {
                var similar_words = model.mostSimilar(word, 20)
                console.log( similar_words );
            });
        }
    );
    
    return d;
}

get_slangonym("content.txt", "trump")