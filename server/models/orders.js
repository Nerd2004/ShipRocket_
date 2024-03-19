const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
   name:{
    type:String,
    required:'This field is required'
   },
   from:{
    type:String,
    required:'This field is required'
   },
   quantity:{
    type:Number,
    required:'This field is required'
   },
   accepted:{
    type:String,
    enum:['Accepted','Declined','Hold'],
    default:'Hold'
   },
   date:{
    type:String,
    required:'This field is required'
   },
   time:{
      type:String,
      required:'This field is required'
   }
});

// productSchema.index({name:'text',description:'text'});
module.exports = mongoose.model('orders',orderSchema);