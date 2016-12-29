var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');

var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.set("views", "./views")
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

app.get('/', function(req, res){
    res.send('Hello! The API is at http://127.0.0.1:' + port + '/api');
});

//API ROUTES
/*
app.get('/login', function(req, res){
    var data = fs.readFileSync('./login/login.html').toString();
    res.send(data);
});
*/
app.route('/login')
    .get(function(req, res) {
        res.sendFile(path.join(__dirname, 'views/login.html' ));
    })
    .post(function(req, res){
        // find the user
        User.findOne({name: req.query.username}, function(err, user) {

          if (err) throw err;

          if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
          } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
              res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

              // if user is found and password is right
              // create a token
              var token = jwt.sign(user, app.get('superSecret'), {
                expiresInMinutes: 1440 // expires in 24 hours
              });

              // return the information including token as JSON
              res.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });
            }
          }
          console.log(req.query.uname);
        });
    });

app.get('/setup', function(req, res) {

  // create a sample user
  var nick = new User({
    name: 'test',
    email: 'test@test.at',
    password: 'test',
    admin: true
  });

  // save the sample user
  nick.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({ success: true });
  });
});

var apiRoutes = express.Router();

apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.username
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

apiRoutes.get('/', function(req, res){
    res.json({message: 'Welcome to first version of wdp3chat-api'});
});

apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        res.json(users);
    });
});

app.use('/api', apiRoutes);
apiRoutes.get('/')



//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
