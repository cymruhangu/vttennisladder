var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// require('mongoose-type-email');
var playerSchema = new mongoose.Schema({
    username: String,
    email: String,
    rank: {type: Number, default: 999},
    firstName: String,
    lastName: String,
    password: String,
//   passwordConf: {
//     type: String,
//     //required: true,
//   },
    lastPlayed: {type: Date, default: Date.now},
    birthDate: Date,
    points: {type: Number, default: 0},
    wins: {type: Number, default: 0},
    losses: {type: Number, default: 0},
    gamesWon: {type: Number, default: 0},
    gamesLost: {type: Number, default: 0},
    rating: {type: Number, default: 3.5},
    ladders: [],
    partner:  {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    matches: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Match"
        }
    }]
});

playerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("Player", playerSchema);