const express = require('express')
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
  host: 'localhost',
  user: 'admin',
  password: 'password',
  database: 'user'
});


connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


//Index HTML
app.get('/', (req, res) => {
  const data = {
    title: 'Welcome',
    style: 'color: red;'
  };

  res.render('index', data);
})


//Login
app.get('/login', (req, res) => {
  res.render('login');
})


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


//Logged in
app.get('/logged-in', (req, res) => {
  if (req.session.authenticated && req.session.username) {
    // If user is authenticated
    const username = req.session.username; 
    const data = {
      name: username,
      style: 'color: red;'
    }
    res.render('logged-in', data);
  }
  else {
    res.redirect('/login');
  }
});


//When user Posts the form
app.post('/login', (req, res) => {
  console.log(req.body);

  const email = req.body.email;
  const password = req.body.password;

  console.log('User-input', email, password)
  connection.query(`SELECT * FROM user WHERE email='${email}'AND password='${password}'`, function (error, results, fields) {
    if (error) throw error;

    if (results.length > 0) {
      console.log(results[0].name);
      req.session.username = results[0].name;
      req.session.authenticated = true;

      res.redirect('/logged-in');
    }
    else {
      res.send('Found no users');
    }
  });
})

// SIGN UP
app.get('/signup', (req, res) => {
  res.render('signup')
})

// Route for creating a new user
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;
  const user = { name, email, password };

  // Insert new user into MySQL database
  connection.query('INSERT INTO users SET ?', user, (err, results) => {
      if (err) {
          console.error('Error creating new user: ', err);
          res.status(500).send('Error creating new user');
          return;
      }
      console.log('New user created with id: ', results.insertId);
      req.session.username = user.name;
      req.session.authenticated = true;
      res.redirect('/logged-in');
  });
});

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});