var express = require('express');
var router = express.Router();
var Article = require('../models/article');
//var Comment = require('../models/comment');
var auth=require('../middlewares/auth');
const app = require('../app');
var User=require('../models/user');
var Income=require('../models/income');
var Expanse=require('../models/expanse');

/* GET users listing. */



//render all articles list
router.get('/', (req, res, next) => {
  //console.log(req.user._id);

  
    Income.find({author:req.user._id}, (err, data) => {

      if (err) return next(err);
      console.log(data);
      Expanse.find({author:req.user._id},(err,expanses)=>{
        if(err)return next(err);
        console.log(expanses);

        res.render('articleList', { income: data,expanse:expanses });
      })
       
      
        
    
       
    
      
    })
  
  


})

//render article home page
router.get('/home',auth.loggedInUser,(req,res)=>{
  let error=req.flash('error')[0];
  res.render('home',{error});
})

//render a new article form
router.get('/new',auth.loggedInUser, (req, res, next) => {
  res.render('createArticleForm');
});

//render the article with comments
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  
  // Article.findById(id, (err, article) => {
  //   if (err) return next(err);
  //   if(article.title!=null){
  //   console.log(article, id);

  // }
   
  
  // })
  Article
  .findById(id)
  .populate('author','name email')
  .exec((err,article)=>{
    //console.log(err,article);
     if(err)return next(err);
      // Comment.find({ articleId: id }).populate('author','name email')
    //.exec((err,comments)=>{
      //console.log(err,comments);
     // if(err)return next(err);
      res.render('articleDetails', ({ article: article }))

   // })
    // res.render('articleDetails',{article});
  })


})



router.use(auth.loggedInUser);














//update the article
// router.get('/:id/edit', (req, res, next) => {
//   const id = req.params.id;
//   Article.findById(id).populate('author','name email').exec((err,article)=>{
//     if(err)return next(err);
//     console.log(article.author.name);
//     console.log(req.user.name);
//     if(article.author.name===req.user.name){
//   console.log('inside the update');
//   res.render('updateArticleForm', { article});
//   }else{
//   console.log('inside the article');
//   res.redirect('/articles/'+id);
// }
//   })

// })




//create the article
router.post('/', (req, res, next) => {
 // console.log(req.body, req.body.tags);
  req.body.tags = req.body.tags.split(' ');
 // console.log(req.body, req.body.tags);
  req.body.author=req.user._id;
  Article.create(req.body, (err, data) => {
    if (err) return next(err);
   // data.author=req.session.userId;
   // console.log(req.session.userId,data.author,);
    res.redirect('/articles');
  })
})

//income'
router.get('/new/income',(req,res)=>{
  res.render('income')

})

//income post request
router.post('/income',(req,res,next)=>{
  //console.log(req.user);
  req.body.source = req.body.source.split(' ');
  req.body.author=req.user._id;
  Income.create(req.body,(err,data)=>{
    if(err)return next(err);
    res.redirect('/articles')
  })


})


//expanse post request
router.post('/expanse',(req,res,next)=>{
  //console.log(req.user);
  req.body.category = req.body.category.split(' ');
  req.body.author=req.user._id;
  Expanse.create(req.body,(err,data)=>{
    if(err)return next(err);
    res.redirect('/articles')
  })


})



//expanse
router.get('/new/expanse',(req,res)=>{
  res.render('expanse')

})

//update the article
router.post('/:id', (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  Article.findByIdAndUpdate(id, req.body, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})




//delete the article

router.get('/:id/delete', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id).populate('author','name email')
  .exec((err,article)=>{
    if(err)return next(err);
    if(article.author.name===req.user.name){
      Comment.deleteMany({ articleId: id }, (err, data) => {
        Article.findByIdAndDelete(id,(err,deletedArticle)=>{
         if(err)return next(err);
         console.log('it is deleted');
          res.redirect('/articles/');
        });
        
      })
     

    }else{
      res.redirect('/articles/'+id);

    }
     
  })

})


//increment likes in article
router.get('/:id/inclikes', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})


//decrement likes in article
router.get('/:id/declikes', (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: -1 } }, (err, data) => {
    if (err) return next(err);
    res.redirect(`/articles/` + id);
  })

})

//create the comment in article
router.post('/:id/comments', (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, data) => {
    if (err) return next(err);
    console.log(req.body);
    req.body.articleId = id;
    req.body.author=req.user._id;
    Comment.create(req.body, (err, comment) => {
      if (err) return next(err);
      res.redirect('/articles/' + id);

    })

  })

})


module.exports = router;
