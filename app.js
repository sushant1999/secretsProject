//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const app=express();
var encrypt = require('mongoose-encryption');
var loginCorrect=0;
var secretCorrect=0;
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");


var userSchema=new mongoose.Schema({
  email:String,
  password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

var User=mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){


  res.render("register");
});
app.get("/secrets",function(req,res){

if(loginCorrect===1){
    res.render("secrets");
    loginCorrect=0;
    secretCorrect=1;
}
else{
  res.redirect("/");
}

});
app.get("/submit",function(req,res){

if(secretCorrect===1){
    res.render("submit");

    secretCorrect=0;
}
else{
  res.redirect("/");
}

});


app.post("/register",function(req,res){
  let mail=req.body.username;
  let pass=req.body.password;

  let use=new User({email:mail,password:pass});
  use.save();
res.redirect("/login");
});

app.post("/login",function(req,res){
  let mail=req.body.username;
  let pass=req.body.password;

  User.findOne({email:mail},function(err,mai){
    if(!err){
      if(pass===mai.password){
        loginCorrect=1;
        res.redirect("/secrets");
      }
      else{
        res.redirect("/login");
      }
    }
    else{
      console.log(err);
      res.redirect("/login");
    }
  });


});





app.listen("3000",function(){
  console.log("Server at 3000 aai aai aaaa");
});
