require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser')
const bodyparser = require("body-parser")
const { User,Publiclib,Privatelib } = require('./Model/dbdetails');
const app = express();

app.use(cors({
    origin: "https://movie-library-gln.vercel.app",
    // origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));




app.use(bodyparser.json())
app.use(cookie());
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

const verifyuser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        // console.log("No token found")
        return res.json({ msg: "No token found" }); // Return 401 Unauthorized
    } else {
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.log("Wrong Token");
                res.clearCookie('token');
                return res.json({ msg: "Wrong Token" }); // Return 401 Unauthorized
            }

            req.userId = decoded.userId;
            console.log("Token Verified");
            next();
        });
    }
};

function generateUniqueIdentifier() {
    // Generate a random string or number
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
  

app.get('/', (req, res) => {
    res.json({ message: "Hello World" });
});

// Assuming you are using Express.js

app.post('/logout', (req, res) => {
    // Clear the authentication token from cookies
    res.clearCookie('token');
    // Redirect the user to the home page or any other desired page
    res.redirect('/');
});

app.get('/verify', verifyuser, (req, res) => {
    console.log(req.userId);
    if (req.userId) {
        return res.json({ msg: "Successfully Verified", userId: req.userId });
    } else {
        return res.json({ msg: "No token found" });
    }
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (result) {
                        const uniqueIdentifier = generateUniqueIdentifier(); // You need to implement generateUniqueIdentifier function
                        const token = jwt.sign({ userId: user._id, username: user.username, uniqueIdentifier }, process.env.SECRET_KEY, { expiresIn: '1h' });
                        
                      res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'None' }).json({ msg: "Login Successful", token });

                    } else {
                        res.json({ msg: "Wrong Password" });
                    }
                });
            } else {
                res.json({ msg: "User not found" });
                console.log("User not found");
            }
        });
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const lowercaseEmail = email.toLowerCase();
    User.findOne({ email: lowercaseEmail })
        .then(exist => {
            if (exist) {
                return res.json({ msg: "Email already exist" });
            } else {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        User.create({ name, email: lowercaseEmail, password: hash })
                            .then((result) => {
                                res.json({ msg: "Created Successfully" });
                                console.log("Successfully Created User");
                            })
                            .catch((err) => {
                                res.json({ message: err.message });
                                console.log(err.message);
                            });
                    });
            }
        })
        .catch(err => {
            res.json({ msg: err.message });
            console.log(err.message);
        });
});

app.get('/user-details/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate the userId to ensure it is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid user ID format" });
        }

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

app.post('/publiclib', async (req, res) => {
    try {
        const { playlistname, username, uid } = req.body;
        console.log(playlistname, username, uid);

        if (!playlistname) {
            return res.json({ msg: "Playlist name is required" });
        }

        const existingPlaylist = await Publiclib.findOne({ playlistname: playlistname });
        if (existingPlaylist) {
            return res.json({ msg: "Playlist already exist" });
        }

        const newPlaylist = new Publiclib({ username, uid, playlistname, Movie: [] });
        await newPlaylist.save();

        res.json({ msg: "Successfully Playlist Created", playlist: newPlaylist });
    } catch (e) {
        console.log(e);
        res.json({ msg: "Server error" });
    }
});


app.post('/privatelib', async (req, res) => {
    try {
        const { playlistname, username, uid } = req.body;
        console.log(playlistname, username, uid);

        if (!playlistname) {
            return res.json({ msg: "Playlist name is required" });
        }

        const existingPlaylist = await Privatelib.findOne({ playlistname: playlistname });
        if (existingPlaylist) {
            return res.json({ msg: "Playlist already exist" });
        }

        const newPlaylist = new Privatelib({ username, uid, playlistname, Movie: [] });
        await newPlaylist.save();

        res.json({ msg: "Successfully Playlist Created", playlist: newPlaylist });
    } catch (e) {
        console.log(e);
        res.json({ msg: "Server error" });
    }
});


app.get('/publiclibget', async (req, res) => {
    try {
        const playlists = await Publiclib.find();
        // console.log(playlists)   
        res.json({msg:"Successfully fetched",playlists});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/privatelibget/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const playlists = await Privatelib.find({uid: userId });
    /* console.log(playlists);*/
      res.json({ msg: "Successfully fetched", playlists });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  app.get('/privatelibgets', async (req, res) => {
    try {
        const playlists = await Privatelib.find();
        // console.log(playlists)   
        res.json({msg:"Successfully fetched",playlists});
        
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
  

  app.post('/add-playlist', async (req, res) => {
    try {
        const { playlistname, movie, uid } = req.body;
       
            let playlist = await Publiclib.findOne({ playlistname, uid });
            if (!playlist) {
                playlist = new Publiclib({ username: req.body.username, uid, playlistname, Movie: [] });
            }
            playlist.Movie.push(movie);
            await playlist.save();
        
        res.json({ success: true, msg: "Movie added to playlist successfully." });
    } catch (e) {
        console.log(e);
        res.json({ msg: "Server Error" });
    }
});

app.post('/add-private', async (req, res) => {
    try {
        const { movie, playlistname, uid } = req.body;
        let playlist = await Privatelib.findOne({ playlistname, uid });
        console.log(playlist);
        if (!playlist) {
            return res.json({ success: false, msg: "Private playlist not found. Please create a private playlist." });
        }
        playlist.Movie.push(movie);
        await playlist.save();
        res.json({ success: true, msg: "Movie added to private playlist successfully." });
    } catch (e) {
        console.log('Error adding to private playlist:', e.message);
        res.status(500).json({ msg: "Server Error", error: e.message });
    }
});


app.get('/publiclistgetall/:playlistname', async (req, res) => {
    try {
        const playlistname = req.params.playlistname;
        const playlist = await Publiclib.findOne({ playlistname }); // Find the playlist by its name

        if (!playlist) {
            return res.status(404).json({ success: false, msg: "Playlist not found" });
        }

        // If the playlist is found, return all the movies in the playlist
        return res.status(200).json({ success: true, playlist: playlist });
    } catch (error) {
        console.error('Error fetching public playlist details:', error);
        return res.status(500).json({ success: false, msg: "Server Error" });
    }
});

// Update the route to accept parameters
app.get('/privategetall/:playlistname', async (req, res) => {
    try {
        
        const { playlistname } = req.params;
        // const{uid}=req.body;
        // console.log(playlistname," ".uid)
        const playlist = await Privatelib.findOne({ playlistname}); // Find the playlist by its name and user ID

        if (!playlist) {
            return res.status(404).json({ success: false, msg: "Playlist not found" });
        }

        // If the playlist is found, return all the movies in the playlist
        return res.status(200).json({ success: true, playlist: playlist });
    } catch (error) {
        console.error('Error fetching public playlist details:', error);
        return res.status(500).json({ success: false, msg: "Server Error" });
    }
});


app.get('/findtoken', (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({ tokenFound: false });
    } else {
        // If a token is found, you can optionally verify it here
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                // Token verification failed
                console.error("Token verification failed:", err);
                return res.json({ tokenFound: false });
            } else {
                // Token verification successful
                console.log("Token verification successful");
                return res.json({ tokenFound: true });
            }
        });
    }
});




const PORT =   process.env.PORT||3001;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
