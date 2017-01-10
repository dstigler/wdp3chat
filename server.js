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
var Rooms = require('./app/models/room');
var Message = require('./app/models/messages')

var port = process.env.PORT || 8080;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

app.set("views", "./views");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(morgan('dev'));


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
          var userData = {
              name : req.body.username
          };
          var token = jwt.sign(userData, app.get('superSecret'), {
            expiresIn: '60m' // expires in 24 hours
          });
          console.log(token);
          //var decoded = jwt.decode(token);
          //console.log(decoded);

        res.cookie('auth',token);
        res.send({message: 'ok'});
        //res.redirect('/');
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
apiRoutes.use(express.static("public"));
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
        //return res.json({ success: false, message: 'Failed to authenticate token.' });
        return res.redirect('/');
      } else {
        // if everything is good, save to request for use in other routes
        req.user_data = token_data;
        next();
      }
    });
  } else {
    // if there is no token
    // return an error
    /*return res.status(403).send({
        success: false,
        message: 'No token provided.'

    });*/
    return res.redirect('/');
  }
});


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
                res.redirect('/api/chat');
              }
            });
        }else{
            res.redirect('/login');
        }

    });
/*apiRoutes.get('/', function(req, res){
    res.json({message: 'Welcome to first version of wdp3chat-api'});
});
*/
/*apiRoutes.get('/users', function(req, res){
    User.find({}, function(err, users){
        res.json(users);
    });
});*/

apiRoutes.route('/chat')
    .get(function(req, res){
        res.sendFile(path.join(__dirname, 'views/index.html' ));
        //console.log(jwt.decode(req.cookie));
        //console.log(jwt.decode(req.cookies.auth));
    });

apiRoutes.route('/rooms')
    .get(function(req, res){
        res.sendFile(path.join(__dirname, 'views/rooms.html' ));
        //console.log(jwt.decode(req.cookie));
        //console.log(jwt.decode(req.cookies.auth));
    });

apiRoutes.route('/roomlist')
    .get(function(req, res, next){
        Rooms.find({}, function(err, rooms){
            if(err){
                res.sent('401');
            }else {
                res.json(rooms);
                next();
            }
        // .catch(next);
        })
    })
    .post(function(req, res){
        Rooms.findOne({'name': req.body.roomName}, function(err, rooms) {
            if (err) throw err;

            if (rooms) {
                res.json({ success: false, message: 'Room already exists.' });
            } else {
                var newRoom = new Rooms({
                  chat_name: req.body.roomName,
                  deleteable: false
                });
                newRoom.save(function(err) {
                  if (err) throw err;
                  res.json({ success: true, message: 'Room created successfully' });
                });
            }
        });
    });

apiRoutes.route("/roomlist/messages:roomId")
    .get(function (req, res) {
        var roomId = req.params.roomId;//req.body.room;
        console.log("Body: "+req.params.roomId);
        /*
        var roomMessages = Message
          .filter(m => m.msg_chat_name === roomId)
          .map(m => {
            //var user = _.find(users, u => u.id === m.userId);
            //var userName = user ? user.alias : "unknown";
            //return {text: `${userName}: ${m.text}`};
            return {text: `${m.msg_user_name}:${m.msg_text}`}
        });*/
        Rooms.find({'chat_name': roomId}, function(err, room) {
          if (err) {
              //room not found
              res.sendStatus(401);
          }
          if(!room){
              res.sendStatus(401);
          }
        });
        //).sort('-msg_datetime').exec(function(err, msgs){
        var roomMessages;
        Message.find({'msg_chat_name': roomId},function(err, msgs){
            if(err){
                res.sendStatus(401);
            }
            if(!msgs){
                roomMessages = {text: `${roomId}: Chat is empty!`}
            }else{
                //console.log(JSON.stringify(msgs.map(function(obj){text: `${obj.msg_user_name}: ${obj.msg_text}`})));
                /*roomMessages = msgs.map(function(obj){
                    console.log('text: '+obj.msg_user_name+': '+obj.msg_text);
                    return {text: obj.msg_user_name+': '+obj.msg_text};
                });*/
                res.json({messages: msgs});
            }
        });
        //console.log("Content: " + roomMessages);
        /*res.json({
          room: roomId,
          messages: roomMessages
      })*/
    })
    .post(function (req, res) {
        //var roomId = "586bc112852c8845a199456e";//req.params.roomId;
        var token = req.cookies.auth;
        var decoded = jwt.decode(token);
        //console.log(req.body);
        //console.log(decoded);
        //console.log(req.body);
        var msg = new Message({
            msg_datetime: Date.now(),
            msg_text: req.body.msg,
            msg_chat_name: req.body.room,
            msg_user_name: decoded.name
        });
        //console.log(req.body);
        //Message.push(msg);
        msg.save(function(err) {
          if (err) throw err;

          console.log("Message saved");
          res.sendStatus(200);
        });
  });

apiRoutes.route('/users')
    .get(function(req, res){
        res.sendFile(path.join(__dirname, 'views/users.html' ));
        //console.log(jwt.decode(req.cookie));
        //console.log(jwt.decode(req.cookies.auth));
    });

app.use('/api', apiRoutes);


apiRoutes.route('/logout')
    .get(function(req, res){ //.get muss wieder gelöscht werden
        res.clearCookie("auth");
        res.redirect('/');
    })
    .delete(function(req, res){
        res.clearCookie("auth");
        res.redirect('/');
    });


//start the server
app.listen(port);
console.log('Magic happens at http://127.0.0.1:' + port);
