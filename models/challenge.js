var mongoose = require("mongoose");
/* A challenge initiates creation of a Match. match = !played = challenge*/

var challengeSchema = new mongoose.Schema({
    challenger: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    defender: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Player"
        },
        username: String
    },
    challengeDate: Date,
    challengeAck: Boolean,
    Comment: []
});

module.exports = mongoose.model("Challenge", challengeSchema);