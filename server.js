var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser')
app.use(cookieParser())

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.set("views", "./views")
app.use(express.static("public"));

var apiRouter = require("./api");
app.use("/api", apiRouter);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));



//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
