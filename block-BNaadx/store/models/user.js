var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var Product = require(`../models/product`)

var userSchema = new Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    cart:[{type:Schema.Types.ObjectId, ref:"Products"}]

},{timestamps:true})

userSchema.pre('save',function(next){
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashed)=>{
            if(err) return next(err);
            this.password = hashed;
            return next()
        }) 
    }
    else{
        next()
    }
})



userSchema.methods.verifyPassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,result)=>{
        return cb(err,result)
    })
}
module.exports = mongoose.model('User', userSchema);