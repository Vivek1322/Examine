//REQUIRING NPM PACKAGES
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override");



//INITIALIZING CONSTANTS
const PORT = process.env.PORT || 1000;


//BASIC CONFIGURATIONS
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));



//LISTEN ON PORT
app.listen(PORT, function(){
    console.log("Server has started!!!");
});
