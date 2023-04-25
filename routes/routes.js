const express = require('express');
const router = express.Router(); 


router.get('/', (req, res) => {
    const data = {
      title: 'Welcome',
      style: 'color: red;'
    };
  
    res.render('index', data);
  })

  //Login
router.get('/login', (req, res) => {
    res.render('login');
  });

//Logged in
router.get('/logged-in', (req, res) => {
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
router.post('/login', (req, res) => {
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
router.get('/signup', (req, res) => {
  res.render('signup')
})

// Route for creating a new user
router.post('/users', (req, res) => {
  const { name, email, password, favorite_color } = req.body;
  const user = { name, email, password, favorite_color};

  // Insert new user into MySQL database
  connection.query('INSERT INTO user SET ?', user, (err, results) => {
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



  module.exports = router;


