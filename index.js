const express = require('express');
const exphba = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Pool } = require('pg');

const app = express();

// const pool = new Pool({
//     connectionString,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// pool.connect();

app.use(session({
    secret: 'keyboard cat5 run all 0v3r',
    resave: false,
    saveUninitialized: true,
}));

app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: `${__dirname}/views/layouts` }));
app.set('view engine', 'handlebars');

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index');
})

const PORT = process.env.PORT || 3017;

app.listen(PORT, () => {
    console.log('App starting on port', PORT);
});