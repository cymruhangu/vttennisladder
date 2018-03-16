//CHALLENGE ROUTES
var express = require("express");
var router  = express.Router();
var Challenge = require("../models/challenge");
//var middleware = require("../middleware");

// INDEX - show all challenges
//NEW

 var challenger = {id: "5a70f4c00b0e77150fd9dae6"};
 var defender = {id: "5a70f4890b0e77150fd9dae4"};
 var challengeDate = new Date();
 var challengeAck = false;
 var comment = ["Monday, Wed, or Sat"];
 
 var newChallenge = new Challenge({challenger:challenger, defender:defender, challengeDate:challengeDate, challengeAck:challengeAck, comment:comment});
 Challenge.create(newChallenge, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           console.log(newlyCreated);
           //res.render("");
       }
   });
//CREATE
//SHOW
//EDIT
//UPDATE
//DESTROY


module.exports = router;