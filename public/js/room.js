var roomId = readGet('room_id');
var modalBuy = document.querySelector('#modalbuy');
var modalSell = document.querySelector('#modalsell');
var buyInstance = M.Modal.init(modalBuy, {});
var sellInstance = M.Modal.init(modalSell, {});

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

getStats(roomId, stats => {
  let values = [];
  stats.forEach(stat => {
    data.labels.push(toDate(stat.timestamp));
    stat.users.forEach((user, i) => {
      if (values[i] === undefined) {
        values[i] = [];
      }
      values[i].push(user.money);
    });
  });
  values.forEach((money, i) => {
    let color = getRandomColor();
    data.datasets.push({
      label: i,
      backgroundColor: color,
      borderColor: color,
      fill: false, // TODO: true if owner
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
  sellInstance.open();
}
