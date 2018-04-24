
const methodOverride = require('method-override')
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');

const app = express();

//Load Routes
const ideas = require('./routes/ideas');

//connect to mongoose
//if deprication warning set mongoose promise to global promise
mongoose.connect('mongodb://localhost/vidjot-dev')
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

//Method Override Middleware for put request
app.use(methodOverride('_method'))

//Express Sessions Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Flash Middleware
app.use(flash());

//Global Variables flash message handling
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
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


//User Login Route
app.get('/users/login', (req, res) => {
    
});

//User Register Route
app.get('/users/register', (req, res) => {

});

//Use Routes
app.use('/ideas', ideas);

app.listen(3000, () => {
    console.log('port is listening on port 3000!')
})