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
app.use(['/index*', '/room*', '/create*', '/rooms*', '/portfolio*'], function(req, res, next) {
  // gets executed if map contains route
  // check if a sessions exists and if it's valid
  // if not redirect to login
  // it must be located above express.static('public')!!
  if (
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
    if (!err) {
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
    if (!err) {
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
    if (err) res.send({
      status: 'error'
    });
    req.session.destroy((err) => {
      if (err) res.send({
        status: 'error'
      });
      res.send({
        status: 'ok'
      });
    });
  });
});

app.get('/api/user/username', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        username: data.username
      });
    }
  });
});

app.get('/api/user/stocks', (req, res) => {
  sql.getMyStocks(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        stocks: data.stocks
      });
    }
  });
});

app.post('/api/room/stats', (req, res) => {
  sql.getStats(req.session.api_token, req.body.room_id, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        stats: data.statistics
      });
    }
  });
});

app.get('/api/user/first_name', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        first_name: data.first_name
      });
    }
  });
});

app.post('/api/room/date', (req, res) => {
  sql.getDate(req.body.room_id, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        date: data.date
      });
    }
  });
});

app.get('/api/user/last_name', (req, res) => {
  sql.getUser(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        last_name: data.last_name
      });
    }
  });
});

app.get('/api/room/rooms', (req, res) => {
  sql.getRooms(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        rooms: data.rooms
      });
    }
  });
});

app.get('/api/room/others', (req, res) => {
  sql.getOtherRooms(req.session.api_token, (err, data) => {
    if (err) {
      res.send({
        status: 'error',
        reason: err.reason
      });
    } else {
      res.send({
        status: 'ok',
        rooms: data.rooms
      });
    }
  });
});

app.post('/api/room/create', (req, res) => {
  let startValue = req.body.start_value;
  sql.createRoom(req.session.api_token, startValue, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok',
        room_id: data.room_id
      });
    } else {
      res.send({
        status: 'error'
      });
    }
  });
});

app.post('/api/room/delete', (req, res) => {
  let roomId = req.body.room_id;
  let apiToken = req.session.api_token;
  sql.deleteRoom(apiToken, roomId, (err, data) => {
    if (!err) {
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

app.post('/api/room/money', (req, res) => {
  let roomId = req.body.room_id;
  let apiToken = req.session.api_token;
  sql.getPlayerMoney(apiToken, roomId, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok',
        money: data.money,
      });
    } else {
      res.send({
        status: 'error',
        reason: err.reason
      });
    }
  });
});

app.post('/api/stock/buy', (req, res) => {
  let roomId = req.body.room_id;
  let amount = req.body.amount;
  let symbol = req.body.symbol;
  let apiToken = req.session.api_token;
  sql.buyStock(apiToken, roomId, symbol, amount, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok',
        stock_id: data.stock_id
      });
    } else {
      res.send({
        status: 'error',
        reason: err.reason,
      });
    }
  });
});

app.post('/api/stock/sell', (req, res) => {
  let stockId = req.body.stock_id;
  let apiToken = req.session.api_token;
  sql.sellStock(apiToken, stockId, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok'
      });
    } else {
      res.send({
        status: 'error',
        reason: err.reason,
      });
    }
  });
});

app.post('/api/room/stocks', (req, res) => {
  let roomId = req.body.room_id;
  let apiToken = req.session.api_token;
  sql.getStocks(apiToken, roomId, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok',
        stocks: data.stocks,
      });
    } else {
      res.send({
        status: 'error',
        reason: err.reason
      });
    }
  });
});

app.post('/api/room/bought_stocks', (req, res) => {
  let roomId = req.body.room_id;
  let apiToken = req.session.api_token;
  sql.getBoughtStocks(apiToken, roomId, (err, data) => {
    if (!err) {
      res.send({
        status: 'ok',
        stocks: data.stocks,
      });
    } else {
      res.send({
        status: 'error',
        reason: err.reason
      });
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
