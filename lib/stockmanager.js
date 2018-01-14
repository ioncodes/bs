import Stocks from 'stocks.js';

module.exports = class StockManager {
  constructor() {
    this.stocks = new Stocks('UQ3IQP280QRWMFYD');
  }

  getLatest(symbol, cb) {
    this.stocks.timeSeries({
      symbol: symbol,
      interval: '1min',
      amount: 1
    })
    .then(function (data) {
      cb(data[0].close);
    })
    .catch(function(err) {
      console.log(err);
      cb(undefined);
    });
  }
}
