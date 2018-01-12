import Stocks from 'stocks.js';

module.exports = class StockManager {
  constructor() {
    this.stocks = new Stocks('UQ3IQP280QRWMFYD');
  }

  buy(id, amount, cb) {

  }

  sell(id, amount, cb) {

  }

  getLatest(symbol, cb) {
    this.stocks.timeSeries({
      symbol: symbol,
      interval: '1min',
      amount: 1
    })
    .then(function (data) {
      cb(data[0].close);
    });
  }
}
