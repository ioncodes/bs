var roomId = readGet('room_id');

var ctx = document.getElementById('stats').getContext('2d');
var chart;
var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
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
