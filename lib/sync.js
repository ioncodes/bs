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
        if(data !== null) {
          let result = {}
          data.forEach(entry => {
            result[entry] = _obj[entry];
          });
          cb(false, result);
        } else {
          cb(false, _obj);
        }
      }
    })
    .catch(err => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      });
    });
  }

  findAll(obj, where, data, msg, cb) {
    obj.findAll({
      where: where
    })
    .then(_obj => {
      if(_obj == null) {
        cb(true, {
          reason: msg
        });
      } else {
        if(data !== null) {
          let result = {}
          data.forEach(entry => {
            result[entry] = _obj[entry];
          });
          cb(false, result);
        } else {
          cb(false, _obj);
        }
      }
    })
    .catch(err => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      });
    });
  }

  remove(obj, where, cb) {
    obj.destroy({
      where: where
    })
    .then(() => cb(false, {}))
    .catch((err) => {
      console.log(err);
      cb(true, {
        reason: 'SQL error'
      });
    });
  }

  query(query, cb) {
    this.sequelize.query(query).spread((results, metadata) => {
      cb();
    });
  }
}
