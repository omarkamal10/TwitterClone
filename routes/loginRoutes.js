const express = require('express');
const app = express();
const router = express.Router();
const User = require('../schemas/userSchema');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


app.set('view engine','pug');
app.set('views','views');
app.use(bodyParser.urlencoded({ extended : false }))


router.get('/',(req,res,next) => {
    res.status(200).render('login')
})

router.post('/',async (req,res,next) => {
    var username = req.body.logUserName;
    var email = req.body.logUserName;
    var password = req.body.logPassword;

    var payload = req.body;

    console.log(password);


    try {
        if (req.body.logUserName && req.body.logPassword) {
            var user = await User.findOne({
                $or: [
                    {username:username},
                    {email:email}
                ]
            })
    
            if (user) {
                var isPasswordMatch = await bcrypt.compare(req.body.logPassword, user.password);
                if(isPasswordMatch === true){
                    req.session.user = user;
                    return res.redirect('/');
                }
            } 
            payload.errorMessage = "Login credentials are wrong.";
            return res.status(200).render('login',payload);
        }
        else {
            console.log("Enter required data in all fields!");
        }


    } catch (e) {
        console.log(e);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render('login',payload);
    }
})

module.exports = router