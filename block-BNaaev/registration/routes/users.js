var express = require('express');
const user = require('../models/user');
var router = express.Router();
var User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',(req,res,next)=>{
  res.render('registerform')
});

router.post('/register',(req,res,next)=>{
  user.create(req.body,(err,user)=>{
    console.log(err,user)
    if (err) return next(err);
    res.redirect('/users/register')
  })
})


module.exports = router;
