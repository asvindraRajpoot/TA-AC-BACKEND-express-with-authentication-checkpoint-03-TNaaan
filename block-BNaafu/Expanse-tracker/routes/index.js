var express = require('express');
var router = express.Router();
var passport=require('passport');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(req.user);
  res.render('index');
});

router.get('/success',(req,res)=>{
  res.render('success');
})

router.get('/failure',(req,res)=>{
  res.render('failure');
})

router.get('/auth/github',(passport.authenticate('github')));

router.get('/auth/github/callback',passport.authenticate('github',{failureRedirect:'/failure'}),

(req,res)=>{
  let error = req.flash('error')[0];
  req.session.userId = req.user.id;
   console.log(req.user);
  res.render('home', { error });
}
    
)

router.get('/auth/google',
  passport.authenticate('google',{ scope: ['profile', 'email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so
    // this function will not be called.
  });

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/failure'}),
  function(req, res) {
    // Successful authentication, redirect home.
    let error = req.flash('error')[0];
    req.session.userId = req.user.id;
    res.render('home', { error });
  });




module.exports = router;
