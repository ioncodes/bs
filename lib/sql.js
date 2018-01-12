import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';
import {
  User,
  Room,
  Stock,
} from './definitions.js';
import Sync from './sync.js';
import StockManager from './stockmanager.js';

module.exports = class SQL {
  constructor() {
    this.sequelize = new Sequelize('bs_db', 'root', 'root', {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        timestamps: false
      }
    });

    this.sync = new Sync(this.sequelize);
    this.stocks = new StockManager();

    this.User = this.sequelize.define('user', User);
    this.Room = this.sequelize.define('room', Room);
    this.Stock = this.sequelize.define('stock', Stock);
  }

  createUser(username, password, firstName, lastName, cb) {
    this.sync.create(this.User, {
      username: username,
      password: password,
      first_name: firstName,
      last_name: lastName,
      api_token: uuidV4()
    }, cb);
  }

  loginUser(username, password, cb) {
    this.sync.find(this.User, {
      username: username,
      password: password
    }, ['api_token'], 'User not found', cb);
  }

  getUser(apiToken, cb) {
    this.sync.find(this.User, {
      api_token: apiToken
    }, null, 'User not found', cb);
  }

  deleteUser(apiToken, cb) {
    this.sync.remove(this.User, {
      api_token: apiToken
    }, cb);
  }

  createRoom(apiToken, startValue, cb) {
    this.getUser(apiToken, (error, user) => {
      if (error) {
        cb(true, {
          reason: 'User not found'
        });
      } else {
        let uuid = uuidV4();
        this.sync.query(`INSERT INTO rooms (room_id, start_value, owner_id) VALUES ('${uuid}', ${startValue}, ${user.id})`, () => {
          cb(false, {
            room_id: uuid
          });
        });
      }
    });
  }

  getRooms(apiToken, cb) {
    this.getUser(apiToken, (error, user) => {
      if (error) cb(true, 'User not found');
      else {
        this.sync.findAll(this.Room, {
          owner_id: user.id,
        }, null, 'Room not found', (error, rooms) => {
          if (error) cb(true, {
            reason: error.reason
          });
          else {
            let _rooms = [];
            rooms.forEach(room => {
              _rooms.push({
                room_id: room.room_id,
                start_value: room.start_value,
              });
            });
            cb(false, {
              rooms: _rooms
            });
          }
        });
      }
    });
  }

  getRoom(roomId, cb) {
    this.sync.find(this.Room, {
      room_id: roomId
    }, null, 'Room not found', cb);
  }

  deleteRoom(apiToken, roomId, cb) {
    this.getUser(apiToken, (error, user) => {
      if (error) cb(true, error.reason);
      else {
        this.sync.remove(this.Room, {
          room_id: roomId,
          owner_id: user.id,
        }, cb);
      }
    });
  }

  buyStock(apiToken, roomId, symbol, amount, cb) {
    this.getUser(apiToken, (error, user) => {
      this.getRoom(roomId, (_error, room) => {
        if(error) cb(true, error.reason);
        else if(_error) cb(true, _error.reason);
        else {
          this.stocks.getLatest(symbol, value => {
            this.sync.query(`INSERT INTO stocks
              (amount, buy_price, owner_id, room_id, symbol) VALUES (
              '${amount}', ${value}, ${user.id}, ${room.id}, '${symbol}')`, () => {
              cb(false, {});
            });
          })
        }
      })
    });
  }
}
