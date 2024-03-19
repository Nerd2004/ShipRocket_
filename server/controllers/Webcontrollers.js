require('../models/database');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const orders = require('../models/orders');
const {json} = require('express');
const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const bcrypt = require('bcryptjs');
const validator = require("validator");
const { error } = require('console');
var db = mongoose.connection;
var data,expenses;
const toTitleCase =(str) =>{
    return str.replace(/\w\S*/g,(txt)=>{
        return txt.charAt(0).toUpperCase()+txt.substr(1).toLowerCase();
    });
}
const ObjectId = require('mongodb').ObjectId;
// let name="ye babUji ka iLaka Hai dHANG se ChAL";
// console.log(toTitleCase(name));
exports.landingPage = async(req,res) => {
    try{
        res.render('landing',{layout:false});
    }catch(error){
        res.status(500).send("Error Occured while showing landing page"+ error);
    }
}
exports.loginPage = async(req,res) => {
   
    try{
        res.render('login',{layout: false,title : 'ShipRocket Login'});
    }catch(error){
        res.status(500).send(`Error Occured while showing login page ${error}`);
    }
}
exports.registerPage = async (req,res) =>{
    try{
        // console.log(req);
       const {name,email,password,password2} = req.body;
       let errors = [];

        //Check required fields
        if(!name || !email || !password || !password2){
            errors.push({msg:'Please fill in all fields'});
        }
         //Check passwords match
        if(password !== password2){
            errors.push({msg:'Passwords do not match'});
        }

        //Check pass length
        // if(password.length < 6){
        //     errors.push({msg:'Password should be at least 6 characters'});
        // }

        if(errors.length > 0){
            res.render('register',{
                errors,
                name,
                email,
                password,
                password2
            });
        }
        else{
            // Validation passed
            const user = await User.findOne({email : email})
            //    .then(user => {
                if(user){
                    //User Already Exists
                    errors.push({msg: 'Email is already registered'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    },{layout:'layouts/admin'});
                }
                else{
                    //Create new User
                    const ans = validator.isEmail(email);
                    if(!ans){
                        req.flash('error_msg','Enter a Valid Email');
                        res.redirect('register',{layout:'layouts/admin'});
                    }
                    else{
                        let imageUploadFile;
                        let uploadPath;
                        let newImageName;

                        if(!req.files || Object.keys(req.files).length === 0){
                            console.log('No Files were uploaded.');
                        }else{

                            imageUploadFile = req.files.image;
                            newImageName = Date.now() + imageUploadFile.name;

                            uploadPath = require('path').resolve('./')+'/public/uploads/' + newImageName;

                            imageUploadFile.mv(uploadPath,function(err){
                                if(err) return res.status(500).send(err);
                            })
                        }
                        const prod = await Product.find({});
                        var allproducts = [];
                        prod.forEach( element=>{
                            allproducts.push(element.name);
                        });
                        const productlen = allproducts.length;
                        var quantarray = Array(productlen).fill(10);//Filling 10 products as starters
                        var dataarray = Array(5).fill(0);
                        var expensesarray = Array(5).fill(0);
                        const newUser = new User({
                            name:toTitleCase(req.body.name),
                            email: req.body.email,
                            password: req.body.password,
                            image:newImageName,
                            products:allproducts,
                            quantity:quantarray,
                            data:dataarray,
                            expenses:expensesarray
                        });
                        // console.log(newUser);
                        // res.send('hello');
                        bcrypt.genSalt(10,(err,salt)=>{
                            bcrypt.hash(newUser.password,salt,(err,hash) =>{
                                if(err) throw err;
                                //Set password to hashed
                                newUser.password = hash;
                                // Save user
                                newUser.save()
                                .then(() =>{
                                    req.flash('success_msg','You are now registered and can log in');
                                    res.redirect('login');
                                    // console.log(newUser,'Hello');
                                    // let user = newUser;
                                    // res.render('profile',{user:user});
                                })
                                .catch(err => console.log(err));
                            })
                        })
                    }
                }
            //    });
        }
    }
    catch(err){
        console.log(err);
    }
    // console.log(req.body);
    // res.send('hello'); 
}
exports.homePage = async(req,res) => {
    // console.log(req.session.userId);
    // console.log(req.session);
    data = await req.user.data;
    expenses = await req.user.expenses;
    // console.log({data,expenses});
    try{
    res.render('home',{data:data,expenses:expenses,layout:''});
    }catch(error){
        res.status(500).send(`Error Occured while showing home page ${error}`);
    }
}
exports.productPage = async(req,res) => {
    try{
        const prod = await Product.find({});
        const user = req.user;
        // const user = await User.find({email:curruser});
        // console.log(user);
        // const a = user.quantity;
        // console.log(a);
        res.render('products',{prod:prod,user:user});
    }catch(error){
        res.status(500).send(`Error Occured while showing product page ${error}`);
    }
}
exports.newproduct = async(req,res) => {
    // console.log(res.locals.loggedin);
    // console.log(req.body);
    try{
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        // req.app.set('layout', 'layouts/admin');
        res.render('newproduct',{layout:'layouts/admin'});
        // req.app.set('layout','./layouts/main');
    }catch(error){
        res.status(500).send(`Error Occured while showing new product page ${error}`);
    }
}
exports.newproductOnPost = async(req,res,next) =>{
    try{
 
        let imageUploadFile;
        let uploadPath;
        let newImageName;
        console.log(req.body);
        console.log(req.files);
        if(!req.files || Object.keys(req.files).length === 0){
            console.log('No Files were uploaded.');
        }else{

            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./')+'/public/img/' + newImageName;

            imageUploadFile.mv(uploadPath,function(err){
                if(err) return res.status(500).send(err);
            })
        }
        var newname = toTitleCase(req.body.name);
        var newdesc = toTitleCase(req.body.description);
        const newProduct = new Product({
           name : newname ,
           description : newdesc,
           cost : req.body.cost,
           sell : req.body.sell,
           category : req.body.category,
           image : newImageName
        });
        await newProduct.save();
        req.flash('infoSubmit','Product has been added');
        res.redirect('/newproduct');
        // res.json(recipe);
        const user = await User.find({});
        user.forEach(x=>{
            db.collection('users').updateOne(
                {email:x.email},
               {
                $push:{
                    products:req.body.name
                }
               }
            )
            db.collection('users').updateOne(
                {email:x.email},
               {
                $push:{
                    quantity:5
                }
               }
            )
        })
        
    }
    catch(error){
        // req.flash('infoErrors',error);
        res.status(500).send({message:error.message} ||"Error Occured while Submitting");
    }
}
exports.buy = async(req,res) => {
    try{
        const prod = await Product.find({});
        const user = req.user; 
        // const infoErrorsObj = req.flash('infoErrors');
        // const infoSubmitObj = req.flash('infoSubmit');
        res.render('buy',{prod:prod,user:user});
    }catch(error){
        res.status(500).send(`Error Occured while showing new product page ${error}`);
    }
}
exports.buyOnPost = async(req,res) => {
    try{
        const product = await req.params.name;
        // console.log(product);
        const prod = await Product.find({"name":product});
        const categ = prod[0].category;
        // console.log(prod);
        const categs = ['Dairy','Home-Decor','Clothing & footware','Kitchenware','Others'];
        const index0 = categs.findIndex(x=>x==categ);
        if(index0 == null || index0 == undefined) index0 = 0;
        var sell = prod[0].sell;
        var cost = prod[0].cost;
        const user = await req.user; 
        // console.log(user);
        const emaile = await req.user.email;
        const arr = user.products;
        const index = arr.findIndex(x=>x==product);
        // console.log(index);
        // console.log(index0);
        var newnum= user.quantity[index];
        var nnum = --newnum;
        var newdata = Number(user.data[index0] + sell);
        var newexpense = Number(user.expenses[index0] + cost);
        // console.log(user.data[index0]);
        // console.log(user.expenses[index0]);
        console.log("Newnum"+ newnum);
        var updateQuery = {};
        var updateQuery1 = {};
        var updateQuery2 = {};
        // console.log(newdata);
        // console.log(newexpense);
        updateQuery["quantity." + index] = nnum;
        updateQuery1["data." + index0] = newdata;
        updateQuery2["expenses." + index0] = newexpense;
        const admin = await User.find({email:"admin@gmail.com"});
        var admindata = admin[0].data[index0] + sell;
        var adminexpenses =admin[0].expenses[index0] + cost;
        var adminquery1 ={};
        var adminquery2 ={};
        adminquery1["data." + index0] = admindata;
        adminquery2["expenses." + index0] = adminexpenses;
        // console.log(adminquery1);
        // console.log(adminquery2);
        db.collection('users').updateOne(
            {email:emaile},
                { $set: updateQuery }
        )
        db.collection('users').updateOne(
            {email:emaile},
                { $set: updateQuery1 }
        )
        db.collection('users').updateOne(
            {email:emaile},
                { $set: updateQuery2}
        )
        // console.log(admin);
        db.collection('users').updateOne(
            {email:admin[0].email},
                { $set: adminquery1}
        )
        db.collection('users').updateOne(
            {email:admin[0].email},
                { $set: adminquery2}
        )
        res.render('products',{prod:prod,user:user});
    }catch(error){
        res.status(500).send(`Error Occured while showing new product page ${error}`);
    }
}
exports.adminPage = async(req,res) =>{
    // console.log(req.user)
    const admin = await User.find({email:"admin@gmail.com"});
    data = admin[0].data;
    expenses = admin[0].expenses;
    // console.log({data,expenses});
    try{
        // req.app.set('layout', 'layouts/admin');
        res.render('adminhome',{layout:'layouts/admin',data:data,expenses:expenses});
        // req.app.set('layout','./layouts/main');
    }catch(error){
        res.status(500).send(`Error Occured while showing admin Page ${error}`);
    }
}
exports.adminproductsPage = async(req,res) =>{
    try{
        const prod = await Product.find({});
        // req.app.set('layout', 'layouts/admin');
        // console.log("ji");
        res.render('adminproducts',{layout:'layouts/admin',prod:prod});
        // req.app.set('layout','./layouts/main');
    }catch(error){
        res.status(500).send(`Error Occured while showing admin Products Page ${error}`);
    }
}
exports.neworderPage = async(req,res) =>{
    try{
        const product = req.params.name;
        console.log(req.params.name);
        const prod = await Product.find({"name":product});
        // console.log(prod);
        // req.app.set('layout', 'layouts/admin');
        // console.log(prod[0].name);
        res.render('neworder',{prod:prod[0]});
        // req.app.set('layout','./layouts/main');
    }catch(error){
        res.status(500).send(`Error Occured while showing new order Page ${error}`);
    }
}
exports.postorderPage= async(req,res) =>{
    try{
        // console.log(req.params.name);
        // console.log(req.body);
        // console.log(req.user.email);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var time = new Date().toLocaleTimeString();
        today = dd + '/' + mm + '/' + yyyy;
        // console.log(today);
        // console.log(time);
        const order = new orders({
            name : req.params.name,
            from: req.user.email,
            quantity : req.body.qty,
            date:today,
            time:time
         });
        //  console.log(order);
         await order.save();
         req.flash('success_msg','Order has been sent');
        //  req.flash('infoSubmit','Order has been sent');
         res.redirect('/products');
    }catch(error){
        res.status(500).send(`Error Occured while showing new order Page ${error}`);
    }
}
exports.requestsPage = async(req,res) =>{
    try{
        // req.app.set('layout', 'layouts/admin');
        const Orders = await orders.find({});
        Orders.reverse();
        // console.log(Orders);
        const prod = await Product.find({});
        res.render('requests',{layout:'layouts/admin',Orders:Orders,prod:prod});
        // req.app.set('layout','./layouts/main');
    }catch(error){
        res.status(500).send(`Error Occured while showing Requests Page ${error}`);
    }
}
exports.ordersPage = async(req,res) =>{
    try{
        const emaile = req.user.email;
        const prod = await Product.find({});
        // console.log(prod);
        const Orders = await orders.find({"from":emaile});
        // console.log(Orders);
        Orders.reverse();
        res.render('orders',{Orders:Orders,prod:prod});
    }catch(error){
        res.status(500).send(`Error Occured while showing past orders Page ${error}`);
    }
}
exports.acceptedPage = async(req,res) =>{
    try{
        const id = new ObjectId(req.params.id);
        // console.log(id);
        const Order = await orders.findById(id);
        // console.log(Order);
        const Status = "Accepted";
        db.collection('orders').updateOne(
            {_id:id},
                { $set: {
                    "accepted":Status,
                 }
                }
        )
        
        const user = await User.find({email:Order.from});
        const index = (user[0].products).findIndex(x=>x==Order.name);
        // console.log(user);
        var updateQuery = {};
        const newquantity = user[0].quantity[index] + Order.quantity;
        updateQuery["quantity." + index] = newquantity;
        // console.log(updateQuery);
        db.collection('users').updateOne(
            {email:Order.from},
                { $set: updateQuery }
        )
        res.redirect(302,'/requests');
    }catch(error){
        res.status(500).send(`Error Occured while accepting orders ${error}`);
    }
}
exports.declinedPage = async(req,res) =>{
    try{
        const id = new ObjectId(req.params.id);
        // console.log(id);
        const Status = "Declined";
        db.collection('orders').updateOne(
            {_id:id},
                { $set: {
                    "accepted":Status,
                 }
                }
        )
        res.redirect(302,'/requests');
    }catch(error){
        res.status(500).send(`Error Occured while declining orders ${error}`);
    }
}
