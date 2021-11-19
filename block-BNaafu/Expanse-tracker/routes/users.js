var express = require('express');
var router = express.Router();
var flash = require('connect-flash');
var auth = require('../middlewares/auth');
var sendMail = require('../middlewares/sendMail');

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
router.post('/register', async function (req, res, next) {
  //console.log(req.body);

  let user = await User.create(req.body)

  if (user) {
    console.log('created using await', user);
    let otp = Math.floor(Math.random() * 1000000) + 1;
    req.body.otp = otp;


    // console.log('',req.body,user);
    const updatedUser = await User.findOne({ _id: user._id }, { upsert: true })
    updatedUser.otp = otp;
    await updatedUser.save()
    const updatedOtpUser = await User.findOne({ _id: user._id })
    console.log('updated user', updatedOtpUser);
    if (updatedOtpUser) {
      sendMail.Mail(req.body.email, otp);
      res.redirect('/users/otp');

    } else {
      res.json({ msg: 'not updated with otp' })


    }
  } else {
    res.redirect('/users/register');
  }






})


//handle post request on login
router.post('/login', (req, res, next) => {

  var { email, password } = req.body;
  console.log(email, password);
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
router.get('/forgot', (req, res) => {
  res.render('forgotPassword');
})

//forgot email render
router.get('/forgot/email', (req, res) => {
  res.render('forgotEmail');
})


//mail send 
router.post('/forgot/email', async function (req, res, next) {



  console.log(req.body);
  const { email } = req.body;
  const user = await User.findOne({ email: email })
  if (user) {
    console.log('user found for forgot password', user);
    let otp = Math.floor(Math.random() * 1000000) + 1;
    //req.body.otp=otp;
    user.otp = otp;
    await user.save()
    const updateduser = await User.findOne({ otp: otp })
    if (updateduser) {
      sendMail.Mail(email, otp);
      res.render('forgotOtp');
    } else {
      return next()
    }
  } else {
    res.redirect('/users/register');
  }




})


//render otp page
router.get('/otp', (req, res) => {
  res.render('otp');
})

//check for otp
router.post('/otp', async function (req, res, next) {

  let otp = req.body.otp;

  const user = await User.findOne({ otp: otp })
  console.log('user is found with otp', user);
  if (user) {
    user.verified = true;
    user.otp = null
    await user.save();
    const updateUser = await User.findOne({ _id: user._id })
    console.log('updated user with verified field', updateUser);
    if (updateUser) {
      res.redirect('/users/login')
    } else {
      res.json({ msg: 'user is not updated' })
    }
  } else {
    console.log('inside redirect');
    res.redirect('/users/otp')
  }



  //res.render('changePassword');

})


//otp for forgot password
router.post('/forgotOtp', async function (req, res, next) {
  let otp = req.body.otp;
  const user = await User.findOne({ otp: otp })
  if (user) {
    console.log(user);
    user.otp = null;
    res.render('forgotPassword');
  } else {
    return next();
  }

})

//changed password
router.post('/forgotPassword', async function (req, res) {
  //check password is updated in database or not
  let email = req.body.email;
  let password = req.body.newPassword;

  console.log(email, password);
  const user = await User.findOne({ email: email })

  if (user) {
    console.log(user);

    user.password = password
    await user.save();
    const updatedUser = await User.findOne({ email: email })
    if (updatedUser) {
      console.log(updatedUser);
      sendMail.Mail(email, 'Password is updated');
      res.redirect('/users/login');
    } else {
      res.json({ msg: 'Password is not updated' })
    }



  } else {
    res.redirect('/users/forgotPassword');
  }

})

module.exports = router;
