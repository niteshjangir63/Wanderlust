const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {

    res.render("user/signup.ejs")

}

module.exports.signup = async (req, res) => {

    try {

        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);
        req.login(registerUser, (err) => {

            if (err) {

                return next(err);
            }
            req.flash("success", `Welcome ${registerUser.username} to Wanderlust!`);
            res.redirect("/listings");

        })
    }
    catch (e) {

        req.flash("error", e.message);
        res.redirect("/signup")
    }


}


module.exports.renderLogin = (req, res) => {

    res.render("user/login.ejs")
}


module.exports.login = async (req, res) => {

        req.flash("success", `Welcome ${req.user.username} to WanderLust`);
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }


    module.exports.logout = (req,res) =>{

        req.logout((err) =>{

            if(err){

                req.flash("error",err.message);
                return next(err);
                
            }

            req.flash("success","You are Logged Out");
            res.redirect("/listings");
        })
    }