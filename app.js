
const dotenv = require('dotenv');

const express = require("express");
const bodyParser = require('body-parser');
const loanRouter = require('./routes/loanRoutes');
const methodOverride = require("method-override");
const session = require('express-session');
const passport = require("passport");
const morgan = require("morgan");

dotenv.config({path: './config.env'});  

const app =express();

app.use(function (req, res, next) {
    res.setHeader(
      'Content-Security-Policy-Report-Only', "default-src 'self'; script-src 'self' https://code.jquery.com https://cdnjs.cloudflare.com https://stackpath.bootstrapcdn.com https://cdn.jsdelivr.net; style-src 'self' https://stackpath.bootstrapcdn.com  https://cdn.jsdelivr.net; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self'; frame-src 'self'"
    );
     
    next();
  });

//Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(express.static('public'));

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const User= require('./model/loanUsers');
passport.use(User.createStrategy());

passport.serializeUser(function(user,done){
  done(null, user.id);
  });
  
passport.deserializeUser(function(id,done){
   User.findById(id,function(err,user){
  done(err,user);
  })
  });

// app.use(morgan('combined')); 


// 3) ROUTES
app.use('/', loanRouter);

//invalid route
app.all('*',(req,res)=>{
    // next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
    // res.status(400).json(`Unknown address ${req.originalUrl}`);
    res.render('404');

});
 
module.exports = app; 

// const express= require('express');
// const app=express();

// port=5000
// app.listen(port,()=>{
//     console.log(`App started on port ${port}`);
// });