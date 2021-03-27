const express = require('express');
const app = express();
const router = express.Router();
const User = require('../../schemas/userSchema');
const Post = require('../../schemas/postSchema');
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({ extended : false }))


router.put("/:userId/follow", async(req, res, next) => {
    // var user = await User.findByIdAndUpdate(req.params.userId,{})
    var userId = req.params.userId;

    var user = await User.findById(userId);

    if (!user) return res.sendStatus(404);

    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    
    var option = isFollowing ? "$pull" : "$addToSet"; 
    //updating follwoing array in active user
    req.session.user = await User.findByIdAndUpdate(req.session.user._id,{ [option]: {following:userId} },{new : true})
    .catch((e) => {
        console.log(e);
    })

    //updating followers array of user we want to follow
    await User.findByIdAndUpdate(userId,{ [option]: {followers:req.session.user._id} })
    .catch((e) => {
        console.log(e);
    })

    res.status(200).send(req.session.user);
    
})

router.get("/:userId/following", async(req, res, next) => {
    User.findById(req.params.userId)
    .populate("following")
    .then((results) => {
        res.status(200).send(results)
    })
    .catch((e) => {
        console.log(e);
        res.sendStatus(400);
    })
});
router.get("/:userId/followers", async(req, res, next) => {
    User.findById(req.params.userId)
    .populate("followers")
    .then((results) => {
        res.status(200).send(results)
    })
    .catch((e) => {
        console.log(e);
        res.sendStatus(400);
    })
});




module.exports = router