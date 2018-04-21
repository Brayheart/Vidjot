

const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


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
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


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

//Process form
app.post('/ideas', (req, res) => {
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
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new idea(newUser)
            .save()
            .then(idea => {
                res.redirect('/ideas');
            })
    }
})

app.listen(3000, () => {
    console.log('port is listening on port 3000!')
})