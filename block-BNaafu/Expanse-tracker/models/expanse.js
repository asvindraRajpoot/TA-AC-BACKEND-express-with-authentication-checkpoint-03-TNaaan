var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var expanseSchema=new Schema({
    category:[String],
    amount:Number,
    date:{type:Date,default:Date.now()},
    author:{type:Schema.Types.ObjectId,required:true,ref:'User'},
    

},{timestamps:true})

module.exports=mongoose.model('Expanse',expanseSchema);