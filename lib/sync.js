import sequelize from 'sequelize';

module.exports = class Sync {
  constructor(sequelize) {
    this.sequelize = sequelize;
  }

  create(obj, data, cb) {
    this.sequelize.sync()
      .then(() => obj.create(data))
      .then(_obj => cb(false, {}))
      .catch(err => {
        console.log(err);
        cb(true, {
          reason: 'SQL error'
        });
      });
  }

  find(obj, where, data, msg, cb) {
    obj.findOne({
      where: where
    })
    .then(_obj => {
      if(_obj == null) {
        cb(true, {
          reason: msg
        });
      } else {
        let result = {}
        data.forEach(entry => {
          result[entry] = _obj[entry];
        });
        cb(false, result);
      }
    })
    .catch(err => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      })
    });
  }
}
