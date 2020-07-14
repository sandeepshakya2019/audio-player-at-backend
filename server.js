//jshint esversion:6

//Setup the server

//require the npm packages express,mongoose,bodyparser,ejs
const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const ejs = require('ejs');
const upload = require('express-fileupload')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session') 
// var popupS = require('popups');
// const swat = require("sweetalert")
// var JSAlert = require("js-alert");
// var flash = require('connect-flash');
//definning the app instance
const app = express();
app.use(session({ 
    secret: "i am developing the code that has been used audio player", 
  resave: true, 
  saveUninitialized: true
})) 




//setting the view engine ejs (templating engine) (in view files)
app.set("view engine",'ejs');
// use the body parser for the post request
app.use(bodyParser.urlencoded({extended:true}));
//used to store the static files (html,css,js) (public directory)
app.use(express.static("public"));
app.use(upload());
// mongoose.connect("mongodb://localhost:27017/audioDB", {useNewUrlParser: true , useUnifiedTopology: true });
mongoose.connect("mongodb+srv://sandeep_2020:Avsirphysics_2022123456@cluster0.xwnyq.mongodb.net/audioDB?retryWrites=true&w=majority", {useNewUrlParser: true , useUnifiedTopology: true });

// mongodb+srv://sandeep_2020:<password>@cluster0.xwnyq.mongodb.net/<dbname>?retryWrites=true&w=majority
// mongo "mongodb+srv://cluster0.xwnyq.mongodb.net/<dbname>" --username sandeep_2020

const userSchema = new mongoose.Schema ({
    name:String,
    email: { type: String, required: true},
    password: String
  });

  const songsSchema = new mongoose.Schema ({
    email: { type: String, required: true},
    song: String
  });

  const User =new mongoose.model("User",userSchema);
  const Song =new mongoose.model("Song",songsSchema);

var songs = []

// const testFolder = './tests/';
// const fs = require('fs');
/*
fs.readdirSync("public/upload").forEach(file => {
    // console.log(file)
  songs.push(file)
});
*/
app.get("/",function(req,res){
	
	var name = req.session.name;
   //console.log(name)
    if(name) {
      res.redirect("/index");
    }else{
      res.redirect("/login");
    }
})

app.get("/index",function(req,res){
    // console.log(songs)
    // res.set('Content-Type', 'application/javascript');
    
    var name = req.session.name;
   //console.log(name)
   Song.find({email:name},function(err,songdata){
    //    var songs = songdata
       
       var songs = []
       songdata.forEach(function(songdataget){
          var songget = songdataget.song
          songs.push(songget)
        })
        // console.log(songs)
    if(name) {
        res.render("index",{songs:songs,name:name})
    }else{
      res.redirect("/login");
    }
   })
    
})

app.get("/register",function(req,res){
	
	var name = req.session.name;
   //console.log(name)
    if(name) {
      res.redirect("/index");
    }else{
      res.render('register',{errors:""})
    }
})
app.post("/register",function(req,res){
  const email = req.body.email
  
  const pass = req.body.password
  if (pass.length < 6){
    res.render("register",{errors:"Password Length is less than 6 char"})
  }else{
    // console.log(email)
    User.findOne({email:email},function(err,data){
      var dataget = data
      // console.log(dataget)
      if (dataget) {
        res.render("register",{errors:"Email Id Already Exist"})
      }else{
        if (email.includes(".com")){
          bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
                name:req.body.name,
          email: req.body.email,
          password: hash
          //Password: md5(req.body.password)
          })
          newUser.save(function(err){
            if(!err){
              res.render("login",{success:"Succesfully Registered Login Please"});
            }else{
              console.log(err);
              // res.redirect("/")
            }
          });
          
          });
        }else{
          res.render("register",{errors:"Wrong Email Address"})
        }
      }
    })
    
  }
  
})

app.get("/login", function(req, res){
    var name = req.session.name;
    //console.log(name)
     if(name) {
       res.redirect("/index");
     }else{
       res.render('login',{success:"Please Login"})
     }
 });
 
 app.post("/login",function(req,res){
  
   const username= req.body.emaillogin
   //const password= md5(req.body.password)
   const password= req.body.passlogin
  
   User.findOne({email:username},function(err,foundUser){
    
     if(err){
       console.log(err)
     }else{
       if (foundUser){
         bcrypt.compare(password, foundUser.password, function(err, result){
           // result == true
           if (result === true){
              req.session.name = username
                 res.redirect("/index");
           }else{
             res.render("login",{success:"Wrong Password"})
           }
       });
      }else{
        res.render("login",{success:"Wrong Email Address"})
      }
     }
    });
    //res.render("login",{success:"Wrong Email Address"})
 });


app.post("/index",function(req,res){
    var name = req.session.name;
    
	if (req.files){
        // console.log(req.files)
        var nameOfFile = req.files.filename.name
        // console.log(nameOfFile)
        songs.push(nameOfFile)
        // console.log(songs)
        req.files.filename.mv("public/upload/"+nameOfFile,function(err){
            if(err){
                console.log(err)
            }else{
                const newSong = new Song({
                    email: name,
                    song: nameOfFile
                    //Password: md5(req.body.password)
                    })
                    newSong.save(function(err){
                      if(!err){
                        res.redirect("/");
                      }else{
                        console.log(err);
                      }
                    });
            }
        })
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy( (err) => {
     //req.logOut();
    res.clearCookie('graphNodeCookie');
    res.status(200);
    res.redirect('/');
    });
   });
//to listen at port 3000
app.listen(process.env.PORT || 3000,function(){
	console.log("Running at Port 3000");
})