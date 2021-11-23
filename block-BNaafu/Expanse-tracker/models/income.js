var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var incomeSchema=new Schema({
    source:[String],
    amount:Number,
    date:{type:Date,default:Date.now()},
    author:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    

},{timestamps:true})

module.exports=mongoose.model('Income',incomeSchema);