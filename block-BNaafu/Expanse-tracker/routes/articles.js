var express = require('express');
var router = express.Router();
var Article = require('../models/article');
//var Comment = require('../models/comment');
var auth = require('../middlewares/auth');
const app = require('../app');
var User = require('../models/user');
var Income = require('../models/income');
var Expanse = require('../models/expanse');

/* GET users listing. */



//render all articles list
router.get('/view/saving', (req, res, next) => {
  Income.find({ author: req.user._id }, (err, data) => {
    if (err) return next(err);
    console.log(data);
    Expanse.find({ author: req.user._id }, (err, expanses) => {
      if (err) return next(err);
      console.log(expanses);
      res.render('saving', { Income: data, Expanse: expanses });
    })
  })
})




//render article home page
router.get('/home', auth.loggedInUser, (req, res) => {
  let error = req.flash('error')[0];
  res.render('home', { error });
})

//render a new article form
router.get('/new', auth.loggedInUser, (req, res, next) => {
  res.render('createArticleForm');
});



router.use(auth.loggedInUser);





//render a dashboard page
router.get('/articleList',(req,res)=>{
  res.render('articleList');
})










//income'
router.get('/new/income', (req, res) => {
  res.render('income')

})

//income post request
router.post('/income', (req, res, next) => {
  req.body.source = req.body.source.split(' ');
  req.body.author = req.user._id;
  Income.create(req.body, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles/home')
  })


})


//expanse post request
router.post('/expanse', (req, res, next) => {
  //console.log(req.user);
  req.body.category = req.body.category.split(' ');
  req.body.author = req.user._id;
  Expanse.create(req.body, (err, data) => {
    if (err) return next(err);
    res.redirect('/articles/home')
  })


})



//expanse
router.get('/new/expanse', (req, res) => {
  res.render('expanse')

})













//view income
router.get('/view/income',(req,res)=>{

  Income.find({ author: req.user._id }, (err, income) => {
    if (err) return next(err);
    //console.log(data);
    res.render('incomesList',{income})

  })

})

//view expanses
router.get('/view/expanse',(req,res)=>{

  Expanse.find({ author: req.user._id }, (err, data) => {
    if (err) return next(err);
    console.log(data);
    res.render('expansesList',{data})

  })

})

//filters
router.get('/view/filters',(req,res)=>{

  res.render('filters');

})


//start and end date
router.get('/view/startAndEndDate',(req,res)=>{
  res.render('startAndEndDate')
})

//post request on start and end date
router.post('/startAndEndDate',(req,res)=>{
  //console.log(req.body);
  let from=req.body.date[0]

  let to=req.body.date[1]
  
 // console.log(from.toISOString(),to.toISOString());
  Income.find({author:req.user._id,'date':{$gte:from},'date':{$lte:to}},(err,income)=>{
    console.log(err,income);
    res.render('incomesList',{income})
  })
})


//get request on sources and category
router.get('/view/sourceAndCategory',(req,res)=>{
  res.render('sourceAndCategory');
})


//post req on source and category
router.post('/sourceAndCategory',(req,res)=>{
  //console.log(req.body);
  let source=req.body.source
  let category=req.body.category
  Income.find({source:source},(err,Income)=>{
    //console.log(err,income);
    Expanse.find({category:category},(err,Expanse)=>{
      res.render('incomeAndExpanseList',{Income,Expanse})
    })
  })

})

//get request on date and category
router.get('/view/dateAndCategory',(req,res)=>{
  res.render('dateAndCategory');
})


//post req on date and category
router.post('/dateAndCategory',(req,res)=>{
  //console.log(req.body);
  let date=req.body.date
  let category=req.body.category
  //console.log(date.toISOString());
   console.log(date,category);
    Expanse.find({'date':{$gte:date},'date':{$lte:date}},(err,data)=>{
      console.log(data);
      res.render('expansesList',{data})
    })
 

})

//get request on month and year
router.get('/view/monthAndYear',(req,res)=>{
  res.render('monthAndYear');
})


//post req on month and year
router.post('/monthAndYear',(req,res)=>{
  //console.log(req.body);
  let month=req.body.month
  let year=req.body.year


  Income.find({$match:{ $month:month,$year:year}},(err,Income)=>{
    console.log(err,Income);
 

  
  
    Expanse.find({},(err,Expanse)=>{

      

      res.render('monthAndYearList',{Income,Expanse})
    })
  })
 

})


module.exports = router;
