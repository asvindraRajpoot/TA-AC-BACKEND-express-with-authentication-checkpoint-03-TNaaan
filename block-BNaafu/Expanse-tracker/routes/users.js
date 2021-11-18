var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var auth=require('../middlewares/auth');
var sendMail=require('../middlewares/sendMail');

var User = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('Welcome');
  // next();
});



//render login form
router.get('/login', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('logIn', { error });
  // next()
})


//render register form
router.get('/register', (req, res, next) => {
  var error = req.flash('error')[0];
  res.render('register', { error });
  //next();
})


//capture the from registration form
router.post('/register', (req, res, next) => {
  console.log(req.body);
  User.create(req.body, (err, user) => {
    if (err) {
      if (err.code === 'MongoError') {
        req.flash('error', 'This email is taken');
        return res.redirect('/users/registers');
      }

      if (err.name === 'ValidationError') {
        req.flash('error', err.message);
        return res.redirect('/users/register');
      }

     
      return res.json({ err });
    }
    //console.log('after saving into database',user);
    // req.flash('error','User hasbeen Successfully registered');
    sendMail.Mail(req.body.email,'123');
    res.redirect('/users/logIn');
  })

})


//handle post request on login
router.post('/login', (req, res, next) => {

  var { email, password } = req.body;
  console.log(email,password);
  if (!email || !password) {
    req.flash('error', 'Email/Password is required');
    return res.redirect('/users/login');

  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      req.flash('error', 'user does not exist');
      return res.redirect('/users/login');
    }

    //compare the password
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Password is not correct');
        return res.redirect('/users/login');
      } else {
        //persist the userlogin using session




        req.session.userId = user.id;
        req.flash('error', 'Login Successful');
        res.redirect('/articles/home');

      }

    })

  })

})

router.get('/dashboard', (req, res) => {
  let error = req.flash('error')[0];
  res.render('dashboard', { error });
})

//handle logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');

})




//forgot password
router.get('/forgot',(req,res)=>{
  res.render('forgotPassword');
})


//mail send 
router.post('/forgot',(req,res)=>{

console.log(req.body);
const {email}=req.body;
//check mail exist or not 
res.send(email)
  //res.render('otp');
})

//check for otp
router.post('/otp',(req,res)=>{
  console.log(req.body);
  //match the otp then 
  res.render('changePassword');
})

//changed password
router.post('/new/password',(req,res)=>{
  //check password is updated in database or not
  res.redirect('/users/login');
})

module.exports = router;
