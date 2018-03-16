var mongoose = require("mongoose");
/* A challenge initiates creation of a Match. match = !played = challenge*/
/* The match object is updated when score is recorded */
/* Player ranks are adjusted */

var matchSchema = new mongoose.Schema({
    ladder: String,
    defAcked: {type:Boolean, default: false},  
    challengeDate: {type:Date, default: Date.now},
    matchDate: Date,  /*if !Date = match not played */
    stretchChallenge: {type: Boolean, default: false}, 
    rankChange: {type: Boolean, default: false},
    defBeforeRank: Number,
    defAfterRank: Number,
    chalBeforeRank: Number,
    chalAfterRank: Number,
    challenger: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String,
        firstName: String,
        lastName: String,
        rank: Number
    },
    defender: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String,
        firstName: String,
        lastName: String,
        rank: Number
    },
    matchType: String,  // full3rd, tiebreak3rd, straights, proSet, tiebreak10s
    set1: {
            def:{type:  Number, default: undefined},
            chal:{type: Number, default: undefined},
            chalTB:{type: Number, default: undefined},
            defTB:{type: Number, default: undefined},
    }, 
    set2: {
            def:{type:  Number, default: undefined},
            chal:{type: Number, default: undefined},
            chalTB:{type: Number, default: undefined},
            defTB:{type: Number, default: undefined},
        }, 
    set3: {
            def:{type:  Number, default: undefined},
            chal:{type: Number, default: undefined},
            chalTB:{type: Number, default: undefined},
            defTB:{type: Number, default: undefined}
    },
    winner: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        }
    },
    defGames: {Number, default: 0},
    chalGames: {Number, default: 0},
    defSets: {Number, default: 0},
    chalSets: {Number, default: 0},
    suggested: String,
    Comment: []
});

module.exports = mongoose.model("Match", matchSchema);