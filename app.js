const express = require('express')
const app = express()
const port = 4000
const mysql = require('mysql');
const session = require('express-session');

app.use(express.static('public'));
let bodyParser = require('body-parser');
const { emit } = require('nodemon');
const { request } = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


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
  res.sendFile(__dirname + '/views/index.html');
})


//Login
app.get('/login', (req, res) => {
  console.log(req.body)
  res.sendFile(__dirname + '/views/login.html');
})

app.get('/api/getuser', (req, res) => {
  res.json({"name": "Eddie"});
})


//Logged in
app.get('/logged-in', (req, res) => {
  if (req.session.authenticated) {
    // If user is authenticated
    res.sendFile(__dirname + '/views/logged-in.html');
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
      req.session.authenticated = true;
      res.redirect('/logged-in');
    }
    else {
      res.send('Found no users');
    }
  });
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
