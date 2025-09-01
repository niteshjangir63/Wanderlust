
if(process.env.NODE_ENV != "production"){

    require('dotenv').config()

}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





main().then(() => {

    console.log("mongodb connected");
}).catch(err => {

    console.log(err);
})

async function main() {
    await mongoose.connect(process.env.ATLAS_DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

const store = MongoStore.create({

    mongoUrl:process.env.ATLAS_DB,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600
});

store.on("error",(err)=>{

    console.log("ERROR IN MONGO SESSION",err)
})

const sessionOption = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() + 7 * 24 *60 * 60 * 1000,
        maxAge:7 * 60 * 60 * 1000,
        httpOnly:true 
    }


})




app.use(session(sessionOption));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {

    res.locals.user = req.user || null;
    res.locals.success = req.flash("success");
    res.locals.Delete = req.flash("Delete");
    res.locals.review = req.flash("review");
    res.locals.error = req.flash("error");
    next();
})


app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);


app.all("{/*splat}", (req, res, next) => {

    next(new ExpressError(404, "Page Not found"));
})



app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong!" } = err;
    res.render("listings/error.ejs", { statusCode, message });
});



app.listen(8080, () => {

    console.log("App is Listening..");
})
