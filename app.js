const express = require('express');
require("dotenv").config();
const app = express()
const port = 4000;
const mysql = require('mysql');
const session = require('express-session');

app.use(express.static('public'));
let bodyParser = require('body-parser');
const { emit } = require('nodemon');
const { request } = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: true
  })
)


// Database connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASENAME,
  password: process.env.DB_PASSWORD
});

// ROUTING
const router = require('./routes/routes');
app.use(router);


connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


//Fetches user from db
app.get('/api/getfavoritecolor', (req, res) => {
  if(req.session.authenticated && req.session.username){

    connection.query(`SELECT * FROM user WHERE name='${req.session.username}'`, function (error, results, fields) {
      if (error) throw error;
  
      if (results.length > 0) {
        console.log(results[0].favorite_color);
        res.json(`color: ${results[0].favorite_color}`);
      }
      else {

      }
    });
  }
  else{
    res.redirect('/login');
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});