require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
const User = require("./User")
const session = require('express-session')
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


mongoose.connect('mongodb://localhost:27017/userDB');


// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.get("/", (req, res) => {
    res.render("Home")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
    res.render("register")
});

app.get("/secrets",(req, res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login")
    }
})

app.post("/register", (req, res) => {
    const userName = req.body.username
    const password = req.body.password
    
    User.register({username: userName}, password, (err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req, res ,()=>{
                res.redirect("/secrets")
            })
        }
    })


    // bcrypt.hash(password, saltRounds, function (err, hash) {
    //     // Store hash in your password DB.
    //     const newUser = new User({
    //         email: userName,
    //         password: hash
    //     })
    //     newUser.save((err) => {
    //         if (err) {
    //             console.log(err);
    //         } else {
    //             res.render("secrets")
    //         }
    //     })

    // });



})

app.post("/login", passport.authenticate("local"), (req, res) => {
    const userName = req.body.username
    const password = req.body.password

    const user = new User({
        username: userName,
        password: password
    })

    req.login(user, function(err) {
        if (err) {
            console.log(err); 
        } else {
        
            res.redirect("/secrets")

      }
    });

    // User.findOne({
    //     email: userName
    // }, (err, foundUser) => {
    //     if (err) {
    //         console.log(err);
    //     } else if (foundUser) {
    //         bcrypt.compare(password, foundUser.password, function (err, result) {

    //             if (result === true) {

    //                 res.render("secrets")

    //             }
    //         });


    //     }
    // })
})

app.get("/logout", (req, res)=>{
    req.logOut();
    res.redirect("/")
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});