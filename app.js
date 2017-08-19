var express = require('express');
var exphbs  = require('express-handlebars');
var main = require('./main')

var app = express();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('index')
});
app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    var keyword = req.query.keyword;
    var address = req.query.address;
    var radius = req.query.radius.toString();
    var start_date = req.query.start_date; 
    var end_date = req.query.end_date;
    var data = {
        keyword:keyword,
        address:address, 
        radius:radius, 
        start_date:start_date,
        end_date:end_date
    };
    main.slangonym_processing(keyword, address, radius, start_date, end_date).then(
        function(result) {
            res.render('result', {data: data, slangonym: result});
            // console.log(result)
        }
    )
    
});

app.listen(3000);