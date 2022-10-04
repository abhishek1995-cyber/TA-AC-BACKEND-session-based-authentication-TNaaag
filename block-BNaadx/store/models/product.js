var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema =  new Schema({
    name:{type:String,required:true},
    quantity:{type:Number,dafault:0},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    image:String,
    likes: {type: Number, default: 0},
    comment:[{type:Schema.Types.ObjectId, ref:"Comment"}],
},{timestamps:true})


module.exports = mongoose.model('Products', productSchema);