import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';
import _ from 'lodash';
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


  getBoughtStocks(apiToken, roomId, cb) {
    this.getStocks(apiToken, roomId, (error, data) => {
      if (error) cb(true, error.reason);
      else {
        let stocks = [];
        data.stocks.forEach(stock => {
          this.stocks.getLatest(stock.symbol, value => {
            stocks.push({
              amount: stock.amount,
              buy_price: stock.buy_price,
              symbol: stock.symbol,
              current_price: value
            });
          });
        });

        setTimeout((stocks) => {
          cb(false, {
            stocks: stocks
          });
          console.log(stocks)
        }, 10000, stocks); // async fix
      }
    });
  }

  getOtherRooms(apiToken, cb) {
    this.getUser(apiToken, (error, user) => {
      if (error) cb(true, 'User not found');
      else {
        this.sync.findAll(this.Stock, {
          owner_id: user.id,
        }, null, 'Stock not found', (_error, stocks) => {
          if (_error) cb(true, _error.reason);
          else {
            let rooms = []
            stocks.forEach(stock => {
              this.getRoomById(stock.room_id, (__error, room) => {
                if (__error) cb(true, __error.reason);
                else {
                  if (room.owner_id !== user.id) {
                    this.getPlayerMoney(apiToken, room.room_id, (___error, money) => {
                      if (___error) cb(true, ___error.reason);
                      else {
                        rooms.push({
                          start_value: room.start_value,
                          date: room.date,
                          money: money.money,
                          room_id: room.room_id
                        });
                      }
                    });
                  }
                }
              });
            });
            setTimeout((rooms) => {
              cb(false, {
                rooms: rooms
              });
            }, 2000, rooms); // async fix
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

  getRoomById(roomId, cb) {
    this.sync.find(this.Room, {
      id: roomId
    }, null, 'Room not found', cb);
  }

  deleteRoom(apiToken, roomId, cb) {
    this.getUser(apiToken, (error, user) => {
      this.getRoom(roomId, (_error, room) => {
        if (error) cb(true, error.reason);
        else if (_error) cb(true, _error.reason);
        else {
          this.deleteAllStocks(room.id, (__error, data) => {
            this.sync.remove(this.Room, {
              room_id: roomId,
              owner_id: user.id,
            }, cb);
          });
        }
      });
    });
  }

  deleteAllStocks(roomId, cb) {
    this.sync.remove(this.Stock, {
      room_id: roomId
    }, cb);
  }

  getPlayerMoney(apiToken, roomId, cb) {
    this.getUser(apiToken, (error, user) => {
      this.getRoom(roomId, (_error, room) => {
        if (error) cb(true, error.reason);
        else if (_error) cb(true, _error.reason);
        else {
          this.sync.findAll(this.Stock, {
            owner_id: user.id,
            room_id: room.id,
          }, null, 'Stock not found', (__error, stocks) => {
            if (__error) cb(true, {
              reason: __error.reason
            });
            else {
              let money = room.start_value;
              stocks.forEach(stock => {
                if (stock.sell_price === null) {
                  money -= stock.buy_price * stock.amount;
                } else {
                  money -= (stock.sell_price - stock.buy_price) * stock.amount;
                }
              });
              cb(false, {
                money: money
              });
            }
          });
        }
      });
    });
  }

  buyStock(apiToken, roomId, symbol, amount, cb) {
    this.getUser(apiToken, (error, user) => {
      this.getRoom(roomId, (_error, room) => {
        if (error) cb(true, error.reason);
        else if (_error) cb(true, _error.reason);
        else {
          this.stocks.getLatest(symbol, value => {
            this.getPlayerMoney(apiToken, roomId, (__error, data) => {
              if (__error) cb(true, __error.reason);
              else if (data.money < value * amount) cb(true, 'Not enough money');
              else {
                let stockId = uuidV4();
                this.sync.query(`INSERT INTO stocks
                                    (amount, buy_price, owner_id, room_id, symbol, stock_id) VALUES (
                                    '${amount}', ${value}, ${user.id}, ${room.id}, '${symbol}', '${stockId}')`, () => {
                  cb(false, {
                    stock_id: stockId
                  });
                });
              }
            });
          });
        }
      });
    });
  }

  getStock(apiToken, stockId, cb) {
    this.getUser(apiToken, (error, user) => {
      this.sync.find(this.Stock, {
        stock_id: stockId,
        owner_id: user.id
      }, null, 'Stock not found', cb);
    });
  }

  getStocks(apiToken, roomId, cb) {
    this.getUser(apiToken, (error, user) => {
      this.getRoom(roomId, (_error, room) => {
        if (error) cb(true, error.reason);
        else if (_error) cb(true, _error.reason);
        else {
          this.sync.findAll(this.Stock, {
            owner_id: user.id,
            room_id: room.id,
          }, null, 'Stock not found', (__error, stocks) => {
            if (__error) cb(true, __error.reason);
            else {
              let myStocks = [];
              stocks.forEach(stock => {
                if (stock.sell_price === null) {
                  myStocks.push({
                    stock_id: stock.stock_id,
                    amount: stock.amount,
                    symbol: stock.symbol,
                    buy_price: stock.buy_price
                  });
                }
              });
              cb(false, {
                stocks: myStocks
              });
            }
          });
        }
      });
    });
  }

  getStats(apiToken, roomId, cb) {
    this.getUser(apiToken, (e, u) => {
      this.getRoom(roomId, (error, room) => {
        if (e) cb(true, e.reason);
        else if (error) cb(true, error.reason);
        else {
          this.sync.findAll(this.Stock, {
            room_id: room.id,
          }, null, 'Stock not found', (_error, stocks) => {
            let playerMap;
            let timestampMap;
            this.createPlayerMap(stocks, (_playerMap) => playerMap = _playerMap);
            this.createTimestampMap(stocks, (_timestampMap) => timestampMap = _timestampMap);
            let stats = new Map();
            timestampMap.forEach((timestamp, i) => {
              let data = new Map();
              playerMap.forEach((player, j) => {
                if(i === 0) {
                  data = new Map(player, room.start_value);
                } else {
                  data = stats.get(timestampMap[i - 1]);
                }
                console.log(data)
              });
            });
            cb(false, stats);
          });
        }
      });
    });
  }

  createPlayerMap(stocks, cb) {
    let players = [];
    stocks.forEach(stock => {
      players.push(stock.owner_id);
    });
    players = _.uniq(players);
    players.sort();
    cb(players);
  }

  createTimestampMap(stocks, cb) {
    let timestampMap = [];
    stocks.forEach(stock => {
      timestampMap.push(this.toDateTimestamp(stock.buy_date));
      if(stock.sell_price !== null) {
        timestampMap.push(this.toDateTimestamp(stock.sell_date));
      }
    });
    timestampMap = _.uniq(timestampMap);
    timestampMap.sort();
    cb(timestampMap);
  }

  getDate(roomId, cb) {
    this.getRoom(roomId, (error, room) => {
      if (error) cb(true, error.reason);
      else {
        cb(false, {
          date: room.date
        });
      }
    });
  }

  getMyStocks(apiToken, cb) {
    this.getUser(apiToken, (error, user) => {
      if (error) cb(true, error.reason);
      else {
        this.sync.findAll(this.Stock, {
          owner_id: user.id,
        }, null, 'Stock not found', (_error, stocks) => {
          if (_error) cb(true, _error.reason);
          else {
            let s = [];
            stocks.forEach(stock => {
              s.push({
                amount: stock.amount,
                sell_price: stock.sell_price,
                sell_date: stock.sell_date,
                buy_price: stock.buy_price,
                buy_date: stock.buy_date,
                symbol: stock.symbol,
              });
            });
            cb(false, {
              stocks: s
            });
          }
        });
      }
    });
  }

  sellStock(apiToken, stockId, cb) {
    this.getStock(apiToken, stockId, (error, stock) => {
      if (error) cb(true, {
        reason: error.reason
      });
      else {
        this.stocks.getLatest(stock.symbol, value => {
          this.sync.query(`
          UPDATE stocks
          SET sell_price=${value}, sell_date='${this.toMysqlFormat(new Date())}'
          WHERE stock_id='${stockId}'`, () => {
            cb(false, {});
          });
        });
      }
    });
  }

  twoDigits(d) {
    if (0 <= d && d < 10) return '0' + d.toString();
    if (-10 < d && d < 0) return '-0' + (-1 * d).toString();
    return d.toString();
  }

  toMysqlFormat(date) {
    return date.getUTCFullYear() + '-' + this.twoDigits(1 + date.getUTCMonth()) + '-' + this.twoDigits(date.getUTCDate()) + ' ' + this.twoDigits(date.getUTCHours()) + ':' + this.twoDigits(date.getUTCMinutes()) + ':' + this.twoDigits(date.getUTCSeconds());
  }

  toDateTimestamp(date) {
    date.setHours(0, 0, 0, 0);
    return date.getTime() / 1000 | 0;
  }
}
