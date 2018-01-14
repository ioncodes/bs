var logTable = document.getElementById('logtable');

window.onload = () => {
  getMyStocks(stocks => {
    stocks.forEach(stock => {
      let row = logTable.insertRow();
      let symbol = row.insertCell(0);
      let amount = row.insertCell(1);
      let buyPrice = row.insertCell(2);
      let buyDate = row.insertCell(3);
      let sellPrice = row.insertCell(4);
      let sellDate = row.insertCell(5);
      symbol.innerHTML = stock.symbol;
      amount.innerHTML = stock.amount;
      buyPrice.innerHTML = `$${stock.buy_price}`;
      buyDate.innerHTML = new Date(stock.buy_date);
      sellPrice.innerHTML = stock.sell_price === null ? 'N/A' : `$${stock.sell_price}`;
      sellDate.innerHTML = stock.sell_date === null ? 'N/A' : new Date(stock.sell_date);
    });
  });
}
