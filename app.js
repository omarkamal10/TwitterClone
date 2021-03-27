const express = require('express');
const middleware = require('./middleware');
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./database');
const session = require('express-session');

const app = express();
app.set('view engine','pug');
app.set('views','views');
app.use(bodyParser.urlencoded({ extended : false }));
app.use(express.static(path.join(__dirname,"public")));

app.use(session({ 
    secret: "bbq chips",
    resave: true,
    saveUninitialized: false
 }))



//Routes
const loginRoutes = require('./routes/loginRoutes');
app.use('/login',loginRoutes);

const registerRoutes = require('./routes/registerRoutes')
app.use('/register',registerRoutes);

const logoutRoutes = require('./routes/logout');
app.use('/logout',logoutRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/posts',postRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/profile',profileRoutes);

//api routes
const postsApiRoute = require('./routes/api/posts');
app.use('/api/posts',middleware.requireLogin,postsApiRoute);

const usersApiRoute = require('./routes/api/users');
app.use('/api/users',middleware.requireLogin,usersApiRoute);


app.get('/',middleware.requireLogin,(req,res,next) => {

    var payload = {
        pageTitle:'Home',
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    }
    res.render('home',payload)
})




app.listen(port,() => {
    console.log('Server is running on port 3000!');
})