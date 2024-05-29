const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    date:{type:Date,default:Date},
    profile:{
        imageurl:String,
        publicId:String
    }
})


const User = mongoose.model("UserDetails" , UserSchema);

module.exports={User};

