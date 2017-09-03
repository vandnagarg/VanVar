var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash')
var validator = require('express-validator');
var fileUpload = require('express-fileupload');


mongoose.connect('mongodb://localhost:27017/dailylancer',{useMongoClient:true});
var index = require('./routes/index');


var app = express();
require('./config/passport');

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout',extname:'.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret:'mySecret',
  resave:false,
  saveUninitialized:false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next) {       // another middleware
    res.locals.login = req.isAuthenticated();    // here login is global vriable which is defined by locals
    res.locals.session = req.session;
    next();
});


app.use(fileUpload());

app.get("/upload",function(req,res){
  res.sendFile(__dirname+"/upload.html");
});

app.post("/upload",function(req,res){
  return res.send("I will handle Singup Page");
  if(!req.files){
    res.send("no file");
  }
  else{
    var file = req.files.file;
    var extension = path.extname(file.name);
    if(extension !==".png" && extension !==".gif" && extension !==".jpg"){
      res.send("only image are allowed");
    }
    else{
      file.mv(__dirname+"/uploads/"+file.name,function(err){
        if(err){
          res.status(8000).send(err);
        }
        else{
          res.send('file uploaded');
        }
      });
    }
  }
})

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
