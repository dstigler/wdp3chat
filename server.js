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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));

/*app.get('/', function(req, res){
    res.send('Hello! The API is at http://127.0.0.1:' + port + '/api');
});
*/
//API ROUTES
/*
app.get('/login', function(req, res){
    var data = fs.readFileSync('./login/login.html').toString();
    res.send(data);
});
*/
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
          //req.body.token = token;
          console.log(token);
          //var decoded = jwt.decode(token);
          //console.log(decoded);

          // return the information including token as JSON
          /*res.send(JSON.stringify({
            success: true,
            message: 'Enjoy your token!',
            token: token
        }));*/
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

var apiRoutes = express.Router();

    // route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  //var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  var token = req.cookies.auth;
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, token_data) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.user_data = token_data;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
});


/*
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
        res.send({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});*/
app.route('/')
    .get(function(req, res) {
        //res.sendFile(path.join(__dirname, 'views/login.html' ));
        res.redirect('/login');
    });
/*apiRoutes.get('/', function(req, res){
    res.json({message: 'Welcome to first version of wdp3chat-api'});
});
*/
apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        res.json(users);
    });
});

apiRoutes.route('/home')
    .get(function(req, res){
        res.send('Here is the main-page'+(jwt.decode(req.cookies.auth)).name);
        //console.log(jwt.decode(req.cookie));
        console.log((jwt.decode(req.cookies.auth)).name);
    });

app.use('/api', apiRoutes);




//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
