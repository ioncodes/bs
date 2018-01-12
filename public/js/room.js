var roomId = readGet('room_id');

var ctx = document.getElementById('stats').getContext('2d');
var chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};

var stats = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [{
      label: "Player 1",
      backgroundColor: chartColors.red,
      borderColor: chartColors.red,
      data: [
        1000.0,
        2000.0
      ],
      fill: false,
    }, {
      label: "Player 2",
      fill: false,
      backgroundColor: chartColors.blue,
      borderColor: chartColors.blue,
      data: [
        2.0,
        10.0
      ],
    }]
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Dashboard'
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
  }
});
