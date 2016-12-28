var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res){
    res.send('Hello! The API is at http://127.0.0.1:' + port + '/api');
});

//API ROUTES


//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
