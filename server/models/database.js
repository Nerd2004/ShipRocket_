const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true})
 .then(()=>console.log("MongoDB Atlas connected successfully"))
 .catch(err => console.log(`MongoDB Not Connected ${err}`));

 var db = mongoose.connection;
 db.on('error',(err)=>{
    console.error('Connection Error');
 }) 
db.once('open',function(){
    console.log("Connected");
});

//Models
require('./User');
require('./Product');
require('./orders')