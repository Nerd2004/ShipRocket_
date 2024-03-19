const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var User = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    email:{
        type:String
    },
    image:{
        type:String
    },
    products:{
       type:[String],
       unique:true
    },
    quantity:[Number],
    data:[Number],
    expenses:[Number]
})
  
User.plugin(passportLocalMongoose);
  
module.exports = mongoose.model('Users', User)