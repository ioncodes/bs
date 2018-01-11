import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import expressSession from 'express-mysql-session';
import SQL from './sql.js';
const app = express();
const MySQLStore = expressSession(session);
const sql = new SQL();
const salt = '%C*F-JaNdRgUkXp2s5v8y/B?D(G+KbPeShVmYq3t6w9z$C&F)J@McQfTjWnZr4u7';
const options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bs_db'
};
// create our persistent store.
// This caches all sessions in a MySQL database.
// No sessions are lost after server restart.
const sessionStore = new MySQLStore(options);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'ac82334c-d126-4123-8824-17f7799f083c',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));
app.use(['/index*', '/join*', '/create*', '/rooms*', '/portfolio*'], function(req, res, next) {
   // gets executed if map contains route
   // check if a sessions exists and if it's valid
   // if not redirect to login
   // it must be located above express.static('public')!!
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
app.use(express.static('public'));

app.post('/api/user/register', (req, res) => {
  let username = req.body.username;
  let password = hash(req.body.password);
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
  let password = hash(req.body.password);
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

app.post('/api/user/logout', (req, res) => {
  sessionStore.destroy(req.session.id, (err) => {
    if(err) res.send({status: 'error'});
    req.session.destroy((err) => {
      if(err) res.send({status: 'error'});
      res.send({status: 'ok'});
    });
  });
});

app.post('/api/user/delete', (req, res) => {
  sql.deleteUser(req.session.api_token, (err, data) => {
    if(!err) {
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

app.get('/api/user/first_name', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if(err) {
      res.send({status: 'error', reason: err.reason});
    } else {
      res.send({status: 'ok', first_name: data.first_name});
    }
  });
});

app.get('/api/user/last_name', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if(err) {
      res.send({status: 'error', reason: err.reason});
    } else {
      res.send({status: 'ok', last_name: data.last_name});
    }
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});

function hash(password) {
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let hex = hash.digest('hex');
  return hex;
}
