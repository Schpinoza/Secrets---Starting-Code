

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const User = require("./User")

 
const app = express();
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');







app.get("/",(req,res)=>{
   res.render("Home")
});

app.get("/login",(req,res)=>{
   res.render("login")
});

app.get("/register",(req,res)=>{
   res.render("register")
});

app.post("/register", (req, res)=>{
    const userName = req.body.username
    const password = req.body.password

    const newUser = new User({
        email: userName,
        password: password
    })
    newUser.save((err)=>{
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
    })


})

app.post("/login", (req, res) =>{
    const userName = req.body.username
    const password = req.body.password

User.findOne({email:userName}, (err, foundUser) =>{
    if(err){
        console.log(err);
    }else if (foundUser.password === password){

    res.render("secrets")

    }
})
})

app.listen(3000, () => {
  console.log(`Server started on port 3000`);
});