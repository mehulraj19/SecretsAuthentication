//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRound = 10;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set('view engine','ejs');

mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true , useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.get("/register",function(req,res){
  res.render("register");
})

app.post("/register",function(req,res){

  bcrypt.hash(req.body.password,saltRound,function(err,hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }else{
        res.render("secrets");
      }
    });
  });


});

app.post("/login",function(req,res){
  const uname = req.body.username;
  const password = req.body.password;

  User.findOne({email: uname},function(err,foundUser){
    if(err){
      console.log(err);
    }else if(foundUser){
      bcrypt.compare(password,foundUser.password,function(err,result){
        if(result === true){
          res.render("secrets");
        }else{
          console.log("Incorrect Password!!");
        }
      })
    }else{
      console.log("No such UserName Found!!");
    }
  })
});


app.listen(3000,function(){
  console.log("The server is running in port 3000.");
})
