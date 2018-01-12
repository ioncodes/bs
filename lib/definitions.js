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
  owner_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
  }
};

let Stock = {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
  },
  amount: Sequelize.INTEGER,
  owner_id: {
    type: Sequelize.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
  },
  room_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Room,
      key: 'id'
    },
  },
  buy_price: Sequelize.DOUBLE,
  sell_price: Sequelize.DOUBLE,
  buy_date: Sequelize.DATE,
  sell_date: Sequelize.DATE,
  symbol: Sequelize.STRING,
}

module.exports = {
  User : User,
  Room : Room,
  Stock : Stock,
}
