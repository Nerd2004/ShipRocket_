const { application } = require('express');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const {ensureAdmin}= require('../config/auth');
const Webcontrollers = require('../controllers/Webcontrollers.js');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const session = require('express-session');
router.get('/',Webcontrollers.landingPage);
router.get('/home',ensureAuthenticated,Webcontrollers.homePage);
router.get('/login',Webcontrollers.loginPage);
router.get('/products',ensureAuthenticated,Webcontrollers.productPage);
router.get('/newproduct',ensureAdmin,Webcontrollers.newproduct);

router.get('/buy',ensureAuthenticated,Webcontrollers.buy);
//New Product Handle
router.post('/newproduct',ensureAdmin,Webcontrollers.newproductOnPost);
router.get('/buy/:name',ensureAuthenticated,Webcontrollers.buyOnPost);
//Login Handle
router.post('/login',async(req,res,next) => {
    // const user = await User.find({email:req.body.email});
    // // console.log(user);
    // req.session.userId = user[0];
    // res.locals.loggedin =req.session.userId;
    // // console.log(req.session.userId);
    if(req.body.email === 'admin@gmail.com'){
        
        passport.authenticate('local',{
            successRedirect : '/admin',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next);
    }
    else{
        passport.authenticate('local',{
            successRedirect : '/home',
            failureRedirect:'/login',
            failureFlash:true
        })(req,res,next);
    }
        
});
//Register Page
router.get('/register',ensureAdmin,(req,res) => res.render('newuser',{layout:'layouts/admin'}));

//Register Handle
router.post('/register',Webcontrollers.registerPage);
//Logout Handle
router.get('/logout',ensureAuthenticated,(req,res)=>{
    req.logout(function(err){
        if(err) return err;
        req.flash('success_msg','You are logged out');
        res.redirect('/login');
    });
})
router.get('/orders',ensureAuthenticated,Webcontrollers.ordersPage);
router.get('/neworder/:name',ensureAuthenticated,Webcontrollers.neworderPage);
//Orders Handle
router.post('/neworder/:name',ensureAuthenticated,Webcontrollers.postorderPage);
router.get('/requests',ensureAdmin,Webcontrollers.requestsPage);
router.get('/accepted/:id',ensureAdmin,Webcontrollers.acceptedPage);
router.get('/declined/:id',ensureAdmin,Webcontrollers.declinedPage);
router.get('/admin',ensureAdmin,Webcontrollers.adminPage);
router.get('/adminproducts',ensureAdmin,Webcontrollers.adminproductsPage);
module.exports = router;

