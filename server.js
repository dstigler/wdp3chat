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

//var apiRouter = require("./api");
//app.use("/api", apiRouter);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.route('/')
    .get(function(req, res) {
        var token = req.cookies.auth;
        if (token) {
            jwt.verify(token, app.get('superSecret'), function(err, token_data) {
              if (err) {
                res.redirect('/login');
              } else {
                // if everything is good, save to request for use in other routes
                req.user_data = token_data;
                redirect('/chat');
              }
            });
        }else{
            res.redirect('/login');
        }

    });
    app.route('/login')
        .get(function(req, res){
            res.sendFile(path.join(__dirname, 'views/login.html' ));
        })
        .put(function(req, res){
            // find the user
            console.log('PUT: ' + req.body.username);

            User.findOne({name: req.body.username}, function(err, user) {

              if (err) {
                  //user not found
                  return res.sent(401);
              }

              if (!user) {
                //incorrect username
                return res.sendStatus(401);
                //res.json({ success: false, message: 'Authentication failed. User not found.' });
              }
              if (user.password != req.body.password) {
                //incorrect password
                return res.sendStatus(401);
                // check if password matches
                //  res.json({ success: false, message: 'Authentication failed. Wrong password.' });
              }
              //res.sendStatus(200);
                  // if user is found and password is right
                  // create a token
              var token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: '1440m' // expires in 24 hours
              });
              console.log(token);
              //var decoded = jwt.decode(token);
              //console.log(decoded);

            res.cookie('auth',token);
            res.send({message: 'ok'});
            //res.send(req.body);
          });


        })
        .post(function(req, res){
            console.log('POST: ' + req.body.username);
            User.findOne({'name': req.body.username}, function(err, user) {
                if (err) throw err;

                var newUser = new User({
                  name: req.body.username,
                  email: req.body.email,
                  password: req.body.password,
                  admin: false
                });

                if (user) {
                    res.json({ success: false, message: 'Authentication failed. User already exists.' });
                } else {
                    newUser.save(function(err) {
                      if (err) throw err;

                      res.json({ success: true, message: 'User saved successfully' });
                    });
                }
            });

        });
//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
