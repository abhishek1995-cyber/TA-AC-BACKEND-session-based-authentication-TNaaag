var express = require('express');
var router = express.Router();
var Users = require('../models/user');
var Admin = require('../models/admin')

/* GET users listing. */

router.get('/',(req,res,next)=>{
    res.render('admindashboard')
})

router.get('/register', function(req, res, next) {
  res.render('adminregistration');
});

router.post('/register',(req,res,next)=>{
    Admin.create(req.body,(err,user)=>{
      console.log(user);
      if (err) return next(err);
      res.redirect('/admin/login')
    })
  })

router.get('/login',(req,res,next)=>{
    res.render('adminlogin')
})

router.post('/login',(req,res)=>{
    var { email ,password} = req.body;
    if(!email || !password){
        req.flash('error','Emai/Password required')
        res.redirect('/admin/login')
    }

    Admin.findOne({email},(err,admin)=>{
        if (err) return next(err);
        // no admin
        if(!admin){
            req.flash("noadmin","Admin not found ")
        }

        admin.verifyPassword(password,(err,result)=>{
            if (err) return next(err);
            if(!result){
                req.flash("noresult","Password didn't match");
                req.redirect('/admin/login')
            }
            
            // persist loggedin admin information

            req.session.adminId = admin.id;
            return res.redirect('/admin')

        })
    })
})


router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.clearCookie('connnect.sid');
    res.redirect('/')
})

module.exports = router;