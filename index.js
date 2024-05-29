// server.js
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookie = require('cookie-parser')
const { User } = require('./Model/dbdetails')
const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "UPDATE", "DELETE"],
    credentials: true,
}));

app.use(cookie());

mongoose.connect(process.env.MONGO_URL);

const verifyuser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        console.log('No token found')
        return res.json({ msg: "No token found" });
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("Wrong Token");
                return res.json({ msg: "Wrong Token" });
            }

            req.userId = decoded.userId;
            console.log("Token Verified");
            next();
        });
    }
};

app.get('/', (req, res) => {
    res.json({ message: "Hello World" });
});

app.get('/verify', verifyuser, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.json({ msg: "User not found" });
        }
        return res.json({ msg: "Successfully Verified", userId: req.userId });
    } catch (error) {
        console.error("Error retrieving user details:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        res.cookie('token', token, { httpOnly: true }).json({ msg: "Login Successful", token });
                    } else {
                        res.json({ msg: "Wrong Password" })
                    }
                })
            } else {
                res.json({ msg: "User not found" })
                console.log("User not found")
            }
        })
});

app.post('/signup',(req,res)=>{
    const {name,email,password}=req.body;
    const lowercaseEmail=email.toLowerCase();
    User.findOne({email:lowercaseEmail})
        .then(exist=>{
            if(exist){
                return res.json({msg:"Email already exist"})
            }else{
                bcrypt.hash(password,10)
                    .then(hash=>{
                        User.create({name,email:lowercaseEmail,password:hash})
                            .then((result)=>{
                                res.json({msg:"Created Successfully"});
                                console.log("Successfully Created User");
                            })
                            .catch((err)=> {
                                res.json({message:err.msg})
                                console.log(err.msg);
                            })
                    })
            }
        })
        .catch(err=> {
            res.json({msg:err.msg});
            console.log(err.msg)
        })
    

})


app.get('/user-details/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.json({ username: user.name });
    } catch (error) {
        console.error("Error retrieving user details:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
});

const PORT = 3001 || process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is running", PORT);
});
