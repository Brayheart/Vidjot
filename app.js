
const methodOverride = require('method-override')
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');



const app = express();

//connect to mongoose
//if deprication warning set mongoose promise to global promise
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDB connected!'))
.catch(err => console.log(err));

//Load Idea Model
require('./models/Ideas');
const idea = mongoose.model('ideas');

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

//Idea Index Page
app.get('/ideas', (req, res) => {
    idea.find({})
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas:ideas
            });
        })
})

//Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

//Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

//Post request to mongodb
app.post('/ideas', (req, res) => {
    //error handling
    let errors = [];
    
    if (!req.body.title) {
        errors.push({text: 'Please add a title'})
    }
    if (!req.body.details) {
        errors.push({text: 'Please add some details'})
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    //if no errors
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video Idea Added');
                res.redirect('/ideas');
            })
    }
});

//edit form process
app.put('/ideas/:id', (req, res) => {
    idea.findOne({
        _id: req.params.id
    })
    .then(
        idea => {
            //new values
            idea.title = req.body.title;
            idea.details = req.body.details;

            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video Idea Updated');
                    res.redirect('/ideas')
                })
        }
    );
});

//Delete idea 
app.delete('/ideas/:id', (req,res) => {
    idea.remove({
        _id: req.params.id
    })
    .then(() => { 
        req.flash('success_msg', 'Video Idea Removed');
        res.redirect('/ideas');
    })
})

app.listen(3000, () => {
    console.log('port is listening on port 3000!')
})