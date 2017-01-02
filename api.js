var express = require('express');

var apiRoutes = express.Router();

var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser')
apiRoutes.use(cookieParser())
var jwt = require('jsonwebtoken');
var config = require('./config');


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



/*apiRoutes.get('/', function(req, res){
    res.json({message: 'Welcome to first version of wdp3chat-api'});
});
*/
apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        res.json(users);
    });
});

apiRoutes.route('/chat')
    .get(function(req, res){
        res.send('Here is the main-page'+jwt.decode(req.cookies.auth));
        //console.log(jwt.decode(req.cookie));
        console.log(jwt.decode(req.cookies.auth));
    });

//app.use('/api', apiRoutes);
