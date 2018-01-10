const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const SQL = require('./sql.js');
const app = express();
const sql = new SQL();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'ac82334c-d126-4123-8824-17f7799f083c',
  resave: false,
  saveUninitialized: true,
}));
app.use(express.static('public'));
app.use(['/index*'], function(req, res, next) {
   // gets executed if map contains route
   // check if a sessions exists and if it's valid
   // if not redirect to login
  if(
    req.session.api_token !== undefined &&
    req.session.api_token !== null &&
    function() {
      sql.getUser(req.session.api_token, (err, data) => {
        return !err;
      });
    }
  ) {
    next();
  } else {
    res.redirect('/login.html');
  }
});

app.post('/api/user/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  sql.createUser(username, password, firstName, lastName, (err, data) => {
    if(!err) {
      res.send({
        status: 'ok'
      });
    } else {
      res.send({
        status: 'error'
      });
    }
  });
});

app.post('/api/user/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  sql.loginUser(username, password, (err, data) => {
    if(!err) {
      req.session.api_token = data.api_token;
      res.send({
        status: 'ok'
      });
    } else {
      res.send({
        status: 'error',
        reason: data.reason
      });
    }
  });
});

app.get('/api/user/username', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if(err) {
      res.send({status: 'error', reason: err.reason});
    } else {
      res.send({status: 'ok', username: data.username});
    }
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
