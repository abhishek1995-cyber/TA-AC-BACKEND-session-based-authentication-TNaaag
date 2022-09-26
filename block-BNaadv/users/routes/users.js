var express = require('express');
var router = express.Router();
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  var success = req.flash('success')[0];
  res.render('home',{success});
});

router.get('/register',(req,res,next)=>{
  var error = req.flash('error')[0];
  res.render('registerform',{error})
});

router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    if(err){
      req.flash('error', err.name);
      return res.redirect('/users/register');
  }
    res.redirect('/users/login')
  })
})

router.get('/login',(req,res,next)=>{
  var error = req.flash('error')[0];
  var emailerror = req.flash('emailerror')[0];
  var passworderror = req.flash('passworderror')[0];
  res.render('login',{error,emailerror,passworderror,logout})
})

router.post('/login',(req,res,next)=>{
  var { email,password } = req.body;
  if(!email || !password){
    req.flash('error',"Email/Password required")
    res.redirect('/users/login')
  }
  User.findOne({email} ,(err,user)=>{
    if (err) return next(err);
    // no user
    if(!user){
      req.flash('emailerror',"Email isn't registered")
      return res.redirect('/users/login')
    }
    // compare password
    user.verifyPassword(password,(err,result)=>{
      if (err) return next(err);
      if(!result){
        req.flash('passworderror',"Incorrect Password")
       return res.redirect('/users/login')
      }
      // persist loggedin user information
      req.session.userId = user.id;
      req.flash('success',"login successfull")
      res.redirect('/users')
    })

  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login')
})

module.exports = router;