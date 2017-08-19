var express = require('express');
var exphbs  = require('express-handlebars');

var app = express();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('index')
});
app.get('/process_get', function (req, res) {
    // Prepare output in JSON format
    var data = {
        keyword:req.query.keyword,
        address:req.query.address, 
        radius:req.query.radius, 
        start_date:req.query.start_date,
        end_date:req.query.end_date
    };
    res.render('result', {data: data});
});

app.listen(3000);