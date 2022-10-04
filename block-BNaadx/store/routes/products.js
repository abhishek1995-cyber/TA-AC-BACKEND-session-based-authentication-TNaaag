var express = require('express');
var router = express.Router();
const session = require('express-session');
var Products = require('../models/product');
var Users = require('../models/user');
var Admin = require('../models/admin')

router.get('/',(req,res)=>{
    if(req.session.adminId || req.session.userId){
    Products.find({},(err,products)=>{
        if(err) return next(err);
        res.render('viewproducts',{products})
    })
    }
})

router.get('/add',(req,res)=>{
    if(req.session.adminId){
        res.render('addproduct');
    }
})

router.post('/add',(req,res,next)=>{
  Products.create(req.body,(err,products)=>{
    if(err) return next(err);
    res.redirect('/products')
  })
})

router.get('/view',(req,res)=>{
    if(req.session.adminId ){
  res.redirect('/products')
    }
})

router.get('/:id/edit',(req,res)=>{
    if(req.session.adminId){
        var id = req.params.id;
        Products.findById(id,(err,product)=>{
            if(err) return next(err)
            res.render('editproduct',{product})
        })
    }
})
router.post('/:id/edit',(req,res)=>{
    if(req.session.adminId){
        var id = req.params.id;
        Products.findByIdAndUpdate(id,req.body,(err,updatedproduct)=>{
            if(err) return next(err);
            res.redirect('/products/' + id)
        })
    }
})

router.get('/:id/delete',(req,res)=>{
    if(req.session.adminId){
        var id = req.params.id;
        Products.findByIdAndDelete(id,(err,deletedproduct)=>{
            if(err) return next(err);
            res.redirect('/products' )
        })
    }
})

// add to cart

router.get('/:id/cart',(req,res)=>{
    if(req.session.userId){
        var productID = req.params.id;
        var userid = req.session.userId;
        Users.findOneAndUpdate(userid, {$push: {cart: productID}},(err,product)=>{
            if(err) return next(err);
            res.redirect('/products')
        })
    }
})



router.get('/:id',(req,res)=>{
    if(req.session.adminId || req.session.userId){
        var id = req.params.id;
        Products.findById(id,(err,product)=>{
            res.render('productdetails',{product})
        })
    }
})
// increment quantity

router.get('/:id/quantity',(req,res,next)=>{
    if(req.session.userId || req.session.adminId ){
    var id = req.params.id;
    Products.findByIdAndUpdate(id,{$inc: {quantity: 1}},(err,product)=>{
        if (err) return next(err);
    res.redirect('/products/' + id)
    })
}
})

module.exports = router;