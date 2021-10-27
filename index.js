// const express = require('express');
// const exphba = require('express-handlebars');
// const bodyParser = require('body-parser');
// const session = require('express-session');
// const Factory = require('./the-balloon-shop')
// const { Pool } = require('pg');

// const app = express();

// const connectionString = 'postgres://lgdlhyerwimabq:6fec1fc7beda746eb042b4dadd85e661b87ff34d40db60e522a69a14aaf413d2@ec2-3-209-65-193.compute-1.amazonaws.com:5432/dcmg278r7k8pm4'

// const pool = new Pool({
//     connectionString,
//     ssl: {
//         rejectUnauthorized: false,
//     },
// });

// pool.connect();

// const validColours = ['red', 'blue', 'yellow'];

// const factory = Factory(pool, validColours);

// app.use(session({
//     secret: 'keyboard cat5 run all 0v3r',
//     resave: false,
//     saveUninitialized: true,
// }));

// app.engine('handlebars', exphba({ defaultLayout: 'main', layoutsDir: `${__dirname}/views/layouts` }));
// app.set('view engine', 'handlebars');

// app.use(express.static(`${__dirname}/public`));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// app.get('/', (req, res) => {
//     if (req.query.colourInput) {
        
//     } else {
//         res.render('index');
//     }
// })

// app.post('/colour_request', (req, res) => {
//     res.send('get fukt');
// })

// const PORT = process.env.PORT || 3017;

// app.listen(PORT, () => {
//     console.log('App starting on port', PORT);
// });