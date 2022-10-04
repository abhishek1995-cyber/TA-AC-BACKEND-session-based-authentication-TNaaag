var express = require('express');
const user = require('../models/user');
var router = express.Router();
var Users = require('../models/user');
var Product = require('../models/product')

/* GET users listing. */
router.get('/',(req,res)=>{
  res.render('usersdashboard')
})

router.get('/register', function(req, res, next) {
  res.render('usersregistration');
});

router.post('/register',(req,res,next)=>{
  Users.create(req.body,(err,user)=>{
    if (err) return next(err);
    res.redirect('/users/login')
  })
})

router.get('/login',(req,res,next)=>{
  var error = req.flash('error')[0];
  var nouser = req.flash('nouser')[0];
  var noresult = req.flash('noresult')[0];
  res.render('userslogin',{error,nouser,noresult})
})

router.post('/login',(req,res,next)=>{
  var {email,password} = req.body;
  if(!email || !password){
  req.flash('error','Email/Password is required')
   return res.redirect('/users/login')
  }
  Users.findOne({email},(err,user)=>{
    if (err) return next(err);
    // no user
    if(!user){
      req.flash("nouser", "User not found")
     return res.redirect('/users/login')
    }
    // compare password

    user.verifyPassword(password,(err,result)=>{
      if (err) return next(err);
      if(!result){
        req.flash("noresult","password didnn't match"  )
        return res.redirect('/users/login')
       }
       // persist loggedin user information
      req.session.userId = user.id;
      return res.redirect('/users')
    })
  })
})


// view cart

router.get('/cart',(req,res,next)=>{
  if(req.session.userId){
    var id = req.session.userId;
    Users.findOne({id}).populate('cart').exec((err,user)=>{
      if (err) return next(err);
      res.render('cart',{user})
    })
  }
})



// logout

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/')
})

module.exports = router;
