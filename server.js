var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var fs = require('fs');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var escape = require('escape-html');


app.use(cookieParser())

var jwt = require('jsonwebtoken');
var config = require('./config');

var User = require('./app/models/user');
var Rooms = require('./app/models/room');
var Message = require('./app/models/messages');

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
        var escName = escape(req.body.username)
        User.findOne({name: escName}, function(err, user) {

          if (err) {
              return res.sent(401);
          }

          if (!user) {
            return res.sendStatus(401);
          }
          if (user.password != req.body.password) {
            return res.sendStatus(401);
          }
          var userData = {
              name : escName
          };
          var token = jwt.sign(userData, app.get('superSecret'), {
            expiresIn: '1440m'
          });

        user.lastactivity = Date.now();
        user.online = true;
        user.save();

        res.cookie('auth',token);
        res.send({message: 'ok',
                  username: escName});
      });


    })
    .post(function(req, res){
        var escName = escape(req.body.username);
        User.findOne({'name': escName}, function(err, user) {
            if (err) throw err;

            var newUser = new User({
              name: escName,
              email: req.body.email,
              password: req.body.password,
              admin: false,
              lastactivity: Date.now(),
              online: false
            });
            if (user) {
                return res.sendStatus(401);
                //res.json({ success: false, message: 'Signup failed. User already exists.' });
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
apiRoutes.use(function(req, res, next) {
  var token = req.cookies.auth;

  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, token_data) {
      if (err) {
        return res.sendStatus(401);
      } else {
        //console.log((jwt.decode(token)).exp - Date.now()/1000 + " seconds");
        req.user_data = token_data;
        next();
      }
    });
  } else {
    return res.sendStatus(401);
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
                req.user_data = token_data;
                res.redirect('/api/chat');
              }
            });
        }else{
            res.redirect('/login');
        }

    });
apiRoutes.route('/chat')
    .get(function(req, res){
        res.sendFile(path.join(__dirname, 'views/index.html' ));
    });

apiRoutes.route('/rooms')
    .get(function(req, res){
        res.sendFile(path.join(__dirname, 'views/rooms.html' ));
        //console.log(jwt.decode(req.cookie));
        //console.log(jwt.decode(req.cookies.auth));
    });

apiRoutes.route('/userlist')
    .get(function(req, res){
        User.find({},'name lastactivity admin online', function(err, users){
            if(err){
                res.send('401');
            }else{
                res.json(users);
            }
        })
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
        })
    })
    .post(function(req, res){
        var escName = escape(req.body.roomName);
        Rooms.findOne({'chat_name': escName}, function(err, rooms) {
            if (err) throw err;

            if (rooms) {
                res.json({ success: false, message: 'Room already exists.' });
            } else {

                var newRoom = new Rooms({
                  chat_name: escName,
                  deleteable: true,
                  user_name: req.body.creator
                });
                newRoom.save(function(err) {
                  if (err) throw err;
                  res.json({ success: true, message: 'Room created successfully' });
                });
            }
        });
    })
    .delete(function(req, res){
        Rooms.findById({_id:req.body.roomId}, function(err, room){
            if(err) throw err;
            if(!room){
                res.json({success: false, message: 'Room not found'});
            }else{
                room.remove(function(err) {
                  if (err) throw err;
                });
                Message.remove({msg_chat_name:req.body.roomId}, function(err){
                    if(err) throw err;
                });
                res.json({success:true, message: 'Room delete'});
            }
        });
    });

apiRoutes.route("/roomlist/messages:roomId")
    .get(function (req, res) {
        var roomId = req.params.roomId;

        Rooms.find({'_id': roomId}, function(err, room) {
          if (err) {
              res.sendStatus(401);
          }
          else if(!room){
              res.sendStatus(401);
          }
        });
        var roomMessages;
        Message.find({'msg_chat_name': roomId},function(err, msgs){
            if(err){
                res.sendStatus(401);
            }
            if(!msgs){
                roomMessages = {text: `${roomId}: Chat is empty!`}
            }else{
                res.json({messages: msgs});
            }
        });
    })
    .post(function (req, res) {
        var token = req.cookies.auth;
        var decoded = jwt.decode(token);
        escText = escape(req.body.msg);
        var msg = new Message({
            msg_datetime: Date.now(),
            msg_text: escText,
            msg_chat_name: req.body.room,
            msg_user_name: decoded.name
        });
        msg.save(function(err) {
          if (err) throw err;

          res.sendStatus(200);
        });
        User.findOne({name: decoded.name}, function(err, user) {
            user.lastactivity = Date.now();
            user.online = true;
            user.save();
        });
  });

app.use('/api', apiRoutes);


apiRoutes.route('/logout')
    .get(function(req, res){
        var token = req.cookies.auth;
        var decoded = jwt.decode(token);
        User.findOne({name: decoded.name}, function(err, user) {
            user.lastactivity = Date.now();
            user.online = false;
            user.save();
        });
        res.clearCookie("auth");
        res.redirect('/');
    })
    /*.delete(function(req, res){
        res.clearCookie("auth");
        res.redirect('/');
    })*/;

function CleanActiveUserList(){
    User.find({online: true}, function(err, users){
        users.forEach(function(user){
            if((Date.now() - user.lastactivity)/(60*1000) > 5){
                console.log((Date.now() - user.lastactivity)/(60*1000));
                user.online = false;
                user.save();
            }
        });
    });
    setTimeout(CleanActiveUserList, 300000);
}

//start the server
app.listen(port, function(){
    CleanActiveUserList();
});
console.log('Magic happens at http://127.0.0.1:' + port);
