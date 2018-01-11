import Sequelize from 'sequelize';

let User = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  api_token: Sequelize.STRING,
};

let Room = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  room_id: Sequelize.STRING,
  start_value: Sequelize.INTEGER,
  owner_id: Sequelize.INTEGER,
};

module.exports = {
  User : User,
  Room : Room
}
