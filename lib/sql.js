import Sequelize from 'sequelize';
import uuidV4 from 'uuid/v4';
import { User, Room } from './definitions.js';

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

    this.sequelize.define('user', User);
    this.sequelize.define('room', Room);
  }

  createUser(username, password, firstName, lastName, cb) {
    this.sequelize.sync()
      .then(() => User.create({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
        api_token: uuidV4(),
      }))
      .then(user => {
        cb(false, {});
      })
      .catch(err => {
        console.log(err);
        cb(true, {
          reason: 'SQL error'
        });
      });
  }

  loginUser(username, password, cb) {
    User.findOne({
      where: {
        username: username,
        password: password
      }
    })
    .then(user => {
      if(user == null) {
        cb(true, {
          reason: 'User not found'
        });
      } else {
        cb(false, {
          api_token: user.api_token
        });
      }
    })
    .catch(err => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      })
    });
  }

  getUser(apiToken, cb) {
    User.findOne({
      where: {
        api_token: apiToken
      }
    })
    .then(user => {
      if(user == null) {
        cb(true, {
          reason: 'User not found'
        });
      } else {
        cb(false, user);
      }
    })
    .catch(err => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      });
    })
  }

  createRoom(apiToken, cb) {

  }
}
