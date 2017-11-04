var express = require('express');
var router = express.Router();
var UserModel = require("../models/UserModel");
var PhotoModel = require('../models/PhotoModel');
var passwordHash = require("../lib/passwordHash");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    var result = user;
    result.userPassword = "";
    console.log('deserializeUser');
    done(null, result);
});


passport.use(new LocalStrategy({
        usernameField: 'userID',
        passwordField : 'userPassword',
        passReqToCallback : true
    },
    function (req, userID, userPassword, done) {
        UserModel.findOne({ userID : userID , userPassword : passwordHash(userPassword) }, function (err,user) {
            if (!user){
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user );
            }
        });
    }
));

router.get('/login', function(req, res){
    res.render('desktop/accounts/login', { flashMessage : req.flash().error });
})

router.post('/login' ,
    passport.authenticate('local', {
        failureRedirect: '/accounts/login',
        failureFlash: true,
        successFlash: 'Welcome!'
    }),
    function(req, res){
        res.json({
            "success" : true,
            "isLogin" : isLogin
        })
    }
);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/join', function(req, res){
    var User = new UserModel({
        userID: req.body.userID,
        userPassword: passwordHash(req.body.userPassword),
        userName: req.body.userName,
        userAge : req.body.userAge
    });
    User.save(function (err) {
        if(err){
          res.json({
              "success" : false
          });
        }else{
            res.json({
                "success": true
            });
        }
    });
});

var multer  = require('multer');
var path = require('path');
var uploadDir = path.join( __dirname , '../uploads' ); // 루트의 uploads위치에 저장한다.
var storage = multer.diskStorage({
    destination : function (req, file, callback) { //이미지가 저장되는 도착지 지정
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) { // products-날짜.jpg(png) 저장
        callback(null, 'products-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
var upload = multer({ storage: storage });

router.post('/upload', upload.single('thumbnail'), function(req, res){
    var photo = new PhotoModel({
        thumbnail : req.file.filename
    });

    photo.save(function(err){
        if(err){
            res.json({
                "success" : false
            })
        }else {
             console.log(req.file.filename);
            res.json({
                "success" : true
            })
        }
    })
     console.log(req.body.name);
})

module.exports = router;


