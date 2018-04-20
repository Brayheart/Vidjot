const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

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

app.listen(3000, () => {
    console.log('port is listening on port 3000!')
})