const Sequelize = require('sequelize');

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
    });
  }

  createUser(username, password, firstName, lastName, cb) {
    this.sequelize.sync()
      .then(() => this.User.create({
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      }))
      .then(user => {
        console.log(user.toJSON());
        cb(true)
      })
      .catch((err) => {
        cb(false)
      });
  }
}
