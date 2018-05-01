
const methodOverride = require('method-override');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport config
require('./config/passport')(passport);
//DB config
const db = require('./config/database');

//connect to mongoose
//if deprication warning set mongoose promise to global promise
mongoose.connect(db.mongoURI)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

//handlebars middlewear
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars'); 

//bodyparser middlewear
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Static Folder
app.use(express.static(path.join(__dirname, 'public')))

//Method Override Middleware for put request
app.use(methodOverride('_method'))

//Express Sessions Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport middleware PUT AFTER SESSION
app.use(passport.initialize());
app.use(passport.session());

//Flash Middleware
app.use(flash());

//Global Variables flash message handling
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})

//index route
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    });
})

//about route
app.get('/about', (req, res) => {
    res.render('about');
});

//Use Routes
app.use('/ideas', ideas);
app.use('/users', users);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`port is listening on port ${port}!`)
})