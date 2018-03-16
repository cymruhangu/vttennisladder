//PLAYER ROUTES
var express = require("express");
var app = express();
var router  = express.Router();
var Player = require("../models/player");
var Match = require("../models/match");
//var middleware = require("../middleware");

//INDEX - show all players
router.get("/", function(req, res){
        //Get all players from DB
        Player.find({}, function(err, allPlayers){
           if(err){
               console.log(err);
           }else{
                res.render("players/index", {allPlayers});
           }
        }).sort({rank: 1});
});

//NEW & CREATE - taken care of by registration form in INDEX routes

//SHOW - info about a specific player
router.get("/:id", function(req, res){
    //find the player with provided ID
    Player.findById(req.params.id).populate("player").exec(function(err, foundPlayer){
        if(err){
            console.log(err);
        }else {
           //render the show template with that player
           res.render("players/show", {player: foundPlayer});
        }
    });
});

//CHALLENGE A PLAYER
router.get("/:id/matches/new", function(req, res) {
    Player.findById(req.params.id, function(err, foundPlayer){
        if(err){
            console.log(err);
        }else {
            res.render("matches/new", {player: foundPlayer});
            // console.log(req.user._id);
        }
    })
});

//CREATE THE CHALLENGE
//POST NEW MATCH
router.post("/:id/matches", function(req, res){
    //find defenders username
    Player.findById(req.params.id, function(err, foundPlayer){
        if(err){
            console.log(err);
        }else{
            var defender = {
                id:req.params.id,
                username: foundPlayer.username,
                firstName: foundPlayer.firstName,
                lastName: foundPlayer.lastName,
            };
            var challenger = {
                    id: req.user._id,
                    username: req.user.username,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName
            }; 
            let defBeforeRank = foundPlayer.rank;
            let chalBeforeRank = req.user.rank;
            let comment = req.body.comment;
            //var challengeDate = Date();
            var newMatch = new Match({defender:defender, challenger:challenger,  Comment: comment, defBeforeRank: defBeforeRank, chalBeforeRank: chalBeforeRank});
            Match.create(newMatch, function(err, newlyCreated){
                if(err){
                    console.log(err);
                }else {
                    //FIND NEW MATCH ID
                    //console.log("Match ID: " +newlyCreated._id);
                    var matchToPush = newlyCreated._id;
                    //PUSH NEW MATCH ID TO BOTH CHALLENGER AND DEFENDER?
                    //console.log("new match: " + newlyCreated);
                    foundPlayer.matches.push(newlyCreated);
                    foundPlayer.save();
                    //Find Challenger
                    Player.findById(req.user._id, function(err, Challenger){
                        if(err){
                        console.log(err);
                    }else{
                    Challenger.matches.push(newlyCreated);
                    Challenger.save();
                    }
                    });
                    res.redirect("/players");
                }
            });
        }
    });
});
//EDIT - player update form. ADMIN or user ONLY.
router.get("/:id/edit", function(req, res){
    Player.findById(req.params.id, function(err, foundPlayer){
        res.render("players/edit", {player: foundPlayer});
    
    });
});
//UPDATE player in DB.  ADMIN ONLY
//Need middleware to check for admin and to check that no other player with that rank, username, etc exists
router.put("/:id", function(req, res){
   //find and update the correct player
   Player.findByIdAndUpdate(req.params.id, req.body.player, function(err, updatedPlayer){
       if(err){
           res.redirect("/players");
       }else {
           res.redirect("/players/" + req.params.id);
       }
   });
});
//DESTROY - delete a player from DB. ADMIN ONLY
router.delete("/:id", function(req, res){
    Player.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/players");
        } else {
            res.redirect("/players");
        }
    });
});

module.exports = router;