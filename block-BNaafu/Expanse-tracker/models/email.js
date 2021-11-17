var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var emailSchema=new Schema({
    email:{type:String,required:true},
    otp:Number,
})

module.exports=mongoose.model('Email',emailSchema);