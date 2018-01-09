const Sequelize = require('sequelize');
const uuidV4 = require('uuid/v4');

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

    this.User = this.sequelize.define('user', {
      username: Sequelize.STRING,
      password: Sequelize.STRING,
      first_name: Sequelize.STRING,
      last_name: Sequelize.STRING,
      api_token: Sequelize.STRING,
    });
  }

  createUser(username, password, firstName, lastName, cb) {
    this.sequelize.sync()
      .then(() => this.User.create({
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
        cb(true, {
          reason: 'SQL error'
        });
      });
  }

  loginUser(username, password, cb) {
    this.User.findOne({
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
      cb(true, {
        reason: 'SQL error'
      })
    });
  }

  getUser(apiToken, cb) {
    this.User.findOne({
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
      cb(true, {
        reason: 'SQL error'
      });
    })
  }
}
