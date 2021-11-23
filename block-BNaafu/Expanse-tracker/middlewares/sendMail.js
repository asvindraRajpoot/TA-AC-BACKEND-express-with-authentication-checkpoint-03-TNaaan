var nodemailer = require('nodemailer');
var dotenv=require('dotenv').config();

module.exports={
    Mail:function(mailId,otp){
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
            to:mailId,
            cc:'aswin1399904@gmail.com',
            subject:'OTP Verification',
            html:"<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + otp + "</h1>"


  
          }
          
          
          //
          transporter.sendMail(mailOptions,function(err,data){
            if(err){
              console.log('Error occurs',err);
            }else{
              console.log('Email Sent!!!');
            }
          
          })
    }
}

