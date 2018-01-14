var roomId = readGet('room_id');
var modalBuy = document.querySelector('#modalbuy');
var modalSell = document.querySelector('#modalsell');
var buyInstance = M.Modal.init(modalBuy, {});
var sellInstance = M.Modal.init(modalSell, {});
var buySymbol = document.querySelector('#buysymbol');
var buyAmount = document.querySelector('#buyamount');
var stocksSelect = document.querySelector('#stocks');
var stocksInstance;
var stocksTable = document.getElementById('stockstable');

var ctx = document.getElementById('stats').getContext('2d');
var chart;
var data = {
  labels: [],
  datasets: [],
};
var options = {
  elements: {
    line: {
      tension: 0, // disables bezier curves
    }
  },
  responsive: true,
  title: {
    display: true,
    text: 'Statistics'
  },
  tooltips: {
    mode: 'index',
    intersect: false,
  },
  hover: {
    mode: 'nearest',
    intersect: true
  },
  scales: {
    xAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Time'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString: 'Money'
      }
    }]
  }
};
var owner = -1;

window.onload = () => {
  getBoughtStocks(roomId, stocks => {
    stocks.forEach(stock => {
      let row = stocksTable.insertRow();
      let symbol = row.insertCell(0);
      let amount = row.insertCell(1);
      let buyPrice = row.insertCell(2);
      let currentPrice = row.insertCell(3);
      symbol.innerHTML = stock.symbol;
      amount.innerHTML = stock.amount;
      buyPrice.innerHTML = `$${stock.buy_price}`;
      currentPrice.innerHTML = `$${stock.current_price}`;
      if(stock.buy_price > stock.current_price) {
        currentPrice.style = 'color: red';
      } else if(stock.buy_price < stock.current_price) {
        currentPrice.style = 'color: green';
      }
    });
  });
}

function getName(i) {
  if(i === owner) {
    return 'You';
  } else {
    return i;
  }
}

function isOwner(i) {
  return i === owner;
}

getStats(roomId, stats => {
  let values = [];
  stats.forEach(stat => {
    data.labels.push(toDate(stat.timestamp));
    stat.users.forEach((user, i) => {
      if (values[i] === undefined) {
        values[i] = [];
      }
      if(user.user === 1337) {
        owner = i;
      }
      values[i].push(user.money);
    });
  });
  values.forEach((money, i) => {
    let color = getRandomColor();
    data.datasets.push({
      label: getName(i),
      backgroundColor: color,
      borderColor: color,
      fill: false, // or isOwner(i)
      data: money
    });
  });
  chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: options,
  });
});

function buy() {
  buyInstance.open();
}

function sell() {
  getStocks(roomId, stocks => {
    stocks.forEach(stock => {
      let option = document.createElement('option');
      option.text = `${stock.amount}x ${stock.symbol} @ $${stock.buy_price}`;
      option.value = stock.stock_id;
      stocksSelect.appendChild(option);
    });
    stocksInstance = M.Select.init(stocksSelect, {});
    sellInstance.open();
  });
}

function confirmBuy() {
  post('/api/stock/buy', {
    room_id: roomId,
    symbol: buySymbol.value,
    amount: buyAmount.value,
  }, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Bought!'});
      setTimeout(() => window.location.reload(), 1000);
    } else {
      M.toast({html: 'Sorry, but there was an error!'})
    }
  });
  M.toast({html: 'Buying... Please hold on...'});
}

function confirmSell() {
  post('/api/stock/sell', {
    stock_id: stocksInstance.getSelectedValues()[0]
  }, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Sold!'});
      setTimeout(() => window.location.reload(), 1000);
    } else {
      M.toast({html: 'Sorry, but there was an error!'})
    }
  });
  M.toast({html: 'Selling... Please hold on...'});
}
