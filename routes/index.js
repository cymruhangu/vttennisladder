var express = require("express");
var app = express();
var router  = express.Router(); //Can't get router.get to work. Must be something simple
var passport = require("passport");
var Player = require("../models/player");

//root route
router.get("/", function(req, res){
  res.render("./landing"); 
});

//===========
//AUTH ROUTES
//===========
//show register form
router.get("/register", function(req, res){
   res.render("register", {page:'register'}); 
});
//handle signup logic
router.post("/register", function(req, res){
    //get data from form to add to player array
    var username = req.body.username;
    var email = req.body.email;
    // var passwordConf = req.body.passwordConf;
    // var rank = 999;
    var firstName = req.body.first;
    var lastName = req.body.last;
    var newPlayer = new Player({username: username, firstName:firstName, lastName:lastName, email:email});
    Player.register(newPlayer, req.body.password, function(err, player){
        if(err){
            console.log(err);
            return res.render("register", {error:err.message});
        }else{
                passport.authenticate("local")(req, res, function(){
                    console.log(player);
                    res.redirect("/players");
                });
            }
    });
});
//show login form
router.get("/login", function(req, res){
    res.render("login", {page:'login'});
});

//handle login LOGIC
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/players",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "Logged you out!");
  res.redirect("/players");
});

module.exports = router;