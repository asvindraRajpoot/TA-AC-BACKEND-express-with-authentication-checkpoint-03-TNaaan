var nodemailer = require('nodemailer');
var dotenv=require('dotenv').config();


let transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:process.env.EMAIL,
      pass:process.env.PASSWORD
    }
  })
  
  
  //
  let mailOptions={
    from:'aswin1399904@gmail.com',
    to:'lovekushrazput143@gmail.com,upendrarajput9911@gmail.com,rishabh1399904@gmail.com',
    cc:'aswin1399904@gmail.com',
    subject:'Testing and Tesing',
    text:'Hello🌹'        
  }
  
  
  //
  transporter.sendMail(mailOptions,function(err,data){
    if(err){
      console.log('Error occurs',err);
    }else{
      console.log('Email Sent!!!');
    }
  
  })