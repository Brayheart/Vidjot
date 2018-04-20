const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


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

//Add Idea Form
app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.listen(3000, () => {
    console.log('port is listening on port 3000!')
})