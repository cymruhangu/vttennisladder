var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Player          = require("./models/player"),
    Match          = require("./models/match");
    // seedDB          = require("./seedMatches");

//const routes     = require("./routes");
var playerRoutes       = require("./routes/player");
var indexRoutes       = require("./routes/index");   
var matchRoutes     = require("./routes/match");

mongoose.Promise = global.Promise;    
mongoose.connect("mongodb://localhost/vttennis", {useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Player.authenticate()));
//Unencoding session data
passport.serializeUser(Player.serializeUser());
passport.deserializeUser(Player.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
}); 


app.use("/", indexRoutes);
app.use("/players", playerRoutes);
app.use("/matches", matchRoutes);
//====================================
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("VTTennisLadder Server has started!"); 
});