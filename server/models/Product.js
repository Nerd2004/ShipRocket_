const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   name:{
    type:String,
    unique:true,
    required:'This field is required'
   },
   description:{
    type:String,
    required:'This field is required'
   },
   cost:{
    type:Number,
    required:'This field is required'
   },
   sell:{
    type:Number,
    required:'This field is required'
   },
   category:{
    type:String,
    enum:['Dairy','Home-Decor','Clothing & footware','Kitchenware','Others'],
    required:'This field is required'
   },
   image:{
    type:String,
    required:'This field is required'
   },
});

productSchema.index({name:'text',description:'text'});
module.exports = mongoose.model('Product',productSchema);