const multer = require('multer');
const express = require('express');
const router = express.Router();
const cookieParser = require("cookie-parser");
const fs=require('fs');
const path = require('path');
const Loan = require('../model/loans');
const User = require('../model/loanUsers');
const passport = require('passport');
const app = require('../app');
     
const storage = multer.diskStorage({
    // to locate destination of a file which is being uploaded
    destination: function(res, file, callback){
        callback(null,'./public/uploads');
    },

    // add back the extension to the file name
    filename: function(res, file, callback){
        callback(null, file.originalname);
    },
});

// upload parameters for multer for uploading images
const upload = multer({
    // multer will only accept files with these extensions
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 3,
    },
});

 
router.get('/', async(req,res,next)=>{
 
    res.locals.user = req.user;

    // doc = await Land.find();
    
    // if(!doc){
    //     return next(err);
    // }

    // if(req.isAuthenticated()){

    //     res.render('index', {room:doc});
    // }else{ 
    //     res.render('index', {room:doc});
    // }

    res.render('index');
});
 
router.get("/dashboard", async (req,res,next)=>{
    res.locals.user = req.user;
  
    if(req.isAuthenticated()){
        const allUsers=await User.find();

        const userDetail= await User.findOne({_id: req.user._id})
        .populate({
            path:'loan',
            model: Loan
        });
        // console.log(userDetail);
        
        const myStatus = userDetail.loan;
        // console.log(myStatus);
        // console.log(myStatus.status);

        res.render('dashboard', {allUsers:allUsers, myStatus: myStatus });
    }else{ 
        res.redirect("/login");
    }
    
});

router.get('/login', (req,res)=>{
    res.render('login');
});

router.get('/signup', (req,res)=>{
        res.render('signup');
    });

router.get('/apply/:id', async(req,res)=>{

    const requestedRoomId= req.params.id;

    const details= await User.findOne({_id: req.user._id});

    res.render('application_form', {user:details} );

    });

router.get('/myrequests', async(req,res)=>{

    doc = await Loan.find();
    
        res.render('allRequest', {loans:doc});
    
    });

// hidden route
router.get('/myrequests/loanDetail/:id', async(req,res)=>{
    
    const requestedRoomId= req.params.id;
 
    // user id and update DB with RoomID
    const doc = await User.findByIdAndUpdate(req.user._id, {
        $push: {
            loan: requestedRoomId
        }
    });
    res.redirect('/dashboard');
    
    });

router.get('/generateReport', (req,res)=>{
        res.render('generateReport');
    });
    
router.get("/logout", (req,res,next)=>{
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
          });
    });

router.get('/thank-you', (req,res)=>{
    res.sendFile(__dirname + "/success.html");
});


// Get route ends here

// POST ROUTE
router.post('/thank-you', (req,res)=>{
    res.send('generateReport');
});

router.post('/apply', upload.single('photos'), async(req,res)=>{
    
    let loanDetails = ({
                address: req.body.address,
                dob: req.body.dob,
                reason: req.body.reason,
                photos: req.file.filename
            });
    
            try{
                    const newLoan = await Loan.create(loanDetails); 
                    // JS method after application form is submitted
                    res.redirect('/myrequests');
                }catch(err){
                    res.render('404');
            
                }
        
        // res.redirect("/login");
});

router.post("/signup", (req,res,next)=>{
    // console.log(req.body);

    User.register(
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username
        }, 
        req.body.password, 
        function(err, user){
        if(err){
            return next(err);
            res.redirect('/signup');
        }else{
            passport.authenticate('local')(req,res, function(){
                res.redirect('/');
            })
        }
    });
});

router.post("/login",(req,res)=>{

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    // console.log(req.body);

    req.login(user, function(err){
        if(err){
            return next(err);
        }
        else{
            passport.authenticate('local')(req,res, function(){
                res.redirect('/');
            })
        }
    });
});



module.exports=router;