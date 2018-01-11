import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';
import { User, Room } from './definitions.js';
import Sync from './sync.js';

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

    this.User = this.sequelize.define('user', User);
    this.Room = this.sequelize.define('room', Room);
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

  createRoom(apiToken, cb) {

  }
}
