//MATCH ROUTES
const express = require("express");
const app = express();
const router  = express.Router();
const Match = require("../models/match");
const Player = require("../models/player");
//var middleware = require("../middleware");

//INDEX - show all matches.  
//Would we ever want to see all matches?  All completed maybe or all outstanding challenges but probbly never all.
router.get("/", function(req, res){
        //Get all matches from DB
        Match.find({}, function(err, allMatches){
          if(err){
              console.log(err);
          }else{
                res.render("./matches/index", {allMatches});
          }
        }).sort({challengeDate: 1});
});

//SHOW - show an individual match
router.get("/:id", function(req, res){
    //find the match with provided ID
    Match.findById(req.params.id).populate("player").exec(function(err, foundMatch){
        if(err){
            console.log(err);
        }else {
           //render the show template for match
           res.render("matches/show", {match: foundMatch});
        }
    });
});


// EDIT - show match update form
router.get("/:id/edit", function(req, res){
    Match.findById(req.params.id, function(err, foundMatch){
        if(err){
            console.log(err);
        }else{
            res.render("matches/edit", {match: foundMatch});
        }
    });
});

//UPDATE Match in DB.  
//Need middleware to check for admin and to check that no other player with that rank, username, etc exists
router.put("/:id", function(req, res){
   //find and update the correct match
//FindMatch by ID
    Match.findById(req.params.id, function(err, completedMatch){
        if(err){
           res.redirect("/matches");
           console.log(err);
        }else {
            //Get defender, challenger and rank
            //Pull score from form and update
            //create matchScore object pulling data from form
            let defSets = 0;
            let chalSets = 0;
            
            //Set constructor
            function Set(defScore, chalScore, defTB, chalTB){
                this.defScore = defScore; 
                this.chalScore = chalScore;
                this.defTB = defTB;
                this.chalTB = chalTB;
                this.winner = function(){
                    if(this.defScore > this.chalScore){
                        defSets++;
                        return "Defender"
                    }else {
                        chalSets++;
                        return "Challenger"
                    }
                }
            };
            let firstSet = new Set(req.body.match.def1st, req.body.match.chal1st, req.body.match.defTB1, req.body.match.chalTB1);
            let secondSet = new Set(req.body.match.def2nd, req.body.match.chal2nd, req.body.match.defTB2, req.body.match.chalTB2);
            let thirdSet = new Set(req.body.match.def3rd, req.body.match.chal3rd, req.body.match.defTB3, req.body.match.chalTB3);
   
            
            completedMatch.defSets = defSets;
            completedMatch.chalSets = chalSets;
            completedMatch.defGames =(parseInt(firstSet.def, 10) + parseInt(secondSet.def, 10) + parseInt(thirdSet.def, 10));
            completedMatch.chalGames = (parseInt(firstSet.chal, 10) + parseInt(secondSet.chal, 10) + parseInt(thirdSet.chal, 10));
            
            if(defSets > chalSets){                             //Defender wins
                console.log("Winner: " + completedMatch.defender.username);
                completedMatch.winner = completedMatch.defender;
                completedMatch.loser = completedMatch.challenger;
                completedMatch.defAfterRank = completedMatch.defBeforeRank,
                completedMatch.chalAfterRank = completedMatch.chalAfterRank
            }else{                                              //Challenger wins
                console.log("Winner: " + completedMatch.challenger.username);
                completedMatch.winner = completedMatch.challenger;
                completedMatch.loser = completedMatch.defender;
                //Rank change 
                //Have them swap ranks for now
                completedMatch.rankChange = true;
                //Defender rank becomes (Original Rank - 1) times -1
                completedMatch.defAfterRank = completedMatch.chalBeforeRank;
                //Challenger rank becomes defender
                completedMatch.chalAfterRank = completedMatch.defBeforeRank;
                //Actually change the rankings
                //How many rankings to change?
                //DefenderRank - ChallengerRank
                
               //Change Defender to temporary (rank -1) * -1
                Player.findById(completedMatch.defender.id, function(err, foundPlayer){  //Change defender's rank
                   if(err){
                       console.log(err);
                   }else  {  //Change rank
                       foundPlayer.rank = ((completedMatch.defBeforeRank - 1) * -1);
                       foundPlayer.save();
                   }
                });
                //Change Challenger rank to Defender rank
                Player.findById(completedMatch.challenger.id, function(err, foundPlayer){  //Change defender's rank
                   if(err){
                       console.log(err);
                   }else  {  //Change rank
                       foundPlayer.rank = completedMatch.defBeforeRank;
                       foundPlayer.save();
                   }
                });
                
                //Change everyone else----THIS IS NOT WORKING!!!
                let ranksToChange = (completedMatch.chalBeforeRank - completedMatch.defBeforeRank);
                // console.log("ranksToChange = " + ranksToChange);
                // var z = 7;
                // Player.find({'rank':  z}, 'id', function(err, testPlayer) {
                //     if(err){
                //         console.log(err);
                //     }else {
                //         console.log("player is: " + testPlayer);
                //         Player.findById(testPlayer, function(err, testPlayer2) {
                //             if(err){
                //                 console.log(err);
                //             }else {
                //                 console.log("Player2 username: " + testPlayer2.username);
                //             }
                            
                //         })
                //     }
                    
                // });
                
                if(ranksToChange > 1){
                      console.log("GOT IN HERE");
                    //Start with Chall -1
                    var x = (completedMatch.chalBeforeRank - 1 );
                    for(let i=x; i>completedMatch.defBeforeRank; i--){
                        Player.find({'rank': i}, 'id', function(err, playerToChange){
                            if(err){
                                console.log(err);
                            }else {
                                Player.findById(playerToChange, function(err, player) {
                                    if(err){
                                        console.log(err);
                                    }else {
                                        player.rank = i + 1;
                                        player.save();
                                    }
                                });
                            }
                        });
                    }
                }
                //Change defender's rank 
                Player.findById(completedMatch.defender.id, function(err, foundPlayer){  //Change defender's rank
                   if(err){
                       console.log(err);
                   }else  {  //Change rank
                       foundPlayer.rank = (completedMatch.defBeforeRank + 1);
                       foundPlayer.save();
                   }
                });
            } //End of Challenger defeats Defender
            }//End of else FindMatchByID
            completedMatch.save();
            res.redirect("/players");
    
    });  //End of FindMatchByID
}); //End of router.put
//====================================================



//DESTROY - delete a match from DB.
//NOTE: NEED TO ALSO DELETE MATCH FROM PLAYER'S RECORD
router.delete("/:id", function(req, res){
    Match.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/matches");
        } else {
            res.redirect("/matches");
        }
    });
});


module.exports = router;
