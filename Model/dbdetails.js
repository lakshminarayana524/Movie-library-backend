/*dbdetails.js */

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

const Public_library = new mongoose.Schema({
    username: String,
    uid: String,
    playlistname: String,
    Movie: [
        {
            Title: String,
            Year: String,
            Poster: String,
            imdbID: String,
            Type: String,
        }
    ]
});

const Publiclib = mongoose.model("Public_library",Public_library);

const Private_library = new mongoose.Schema({
    username: String,
    uid: String,
    playlistname: String,
    Movie: [
        {
            Title: String,
            Year: String,
            Poster: String,
            imdbID: String,
            Type: String,
        }
    ]
});
const Privatelib = mongoose.model("Private_library",Private_library);


module.exports={User, Publiclib,Privatelib};

