function post(url, data, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      cb(JSON.parse(xhr.responseText));
    }
  }
  xhr.send(JSON.stringify(data));
}

function get(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      cb(JSON.parse(xhr.responseText))
    }
  }
  xhr.open('GET', url, true);
  xhr.send(null);
}

function readGet(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=');
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

function getUsername(cb) {
  get('/api/user/username', (res) => {
    if (res.status === 'ok') {
      cb(res.username);
    } else {
      M.toast({
        html: 'An error occured!'
      });
      cb(undefined);
    }
  });
}

function getFirstName(cb) {
  get('/api/user/first_name', (res) => {
    if (res.status === 'ok') {
      cb(res.first_name);
    } else {
      M.toast({
        html: 'An error occured!'
      });
      cb(undefined);
    }
  });
}

function getLastName(cb) {
  get('/api/user/last_name', (res) => {
    if (res.status === 'ok') {
      cb(res.last_name);
    } else {
      M.toast({
        html: 'An error occured!'
      });
      cb(undefined);
    }
  });
}

function getRooms(cb) {
  get('/api/room/rooms', (res) => {
    if (res.status === 'ok') {
      cb(res.rooms);
    } else {
      M.toast({
        html: 'An error occured!'
      });
      cb(undefined);
    }
  });
}

function getOtherRooms(cb) {
  get('/api/room/others', (res) => {
    if (res.status === 'ok') {
      cb(res.rooms);
    } else {
      M.toast({
        html: 'An error occured!'
      });
      cb(undefined);
    }
  });
}

function logout() {
  post('/api/user/logout', {}, (res) => {
    if (res.status === 'ok') {
      M.toast({
        html: 'Logged out! Redirecting...'
      });
      setTimeout(() => window.location.replace('/login.html'), 1000);
    } else {
      M.toast({
        html: 'An error occured!'
      });
    }
  });
}

function getMoney(roomId, cb) {
  post('/api/room/money', {
    room_id: roomId
  }, (res) => {
    if (res.status === 'ok') {
      cb(res.money);
    } else {
      cb(undefined);
    }
  });
}

function getStats(roomId, cb) {
  post('/api/room/stats', {
    room_id: roomId
  }, (res) => {
    if (res.status === 'ok') {
      cb(res.stats);
    } else {
      cb(undefined);
    }
  });
}

function getMyStocks(cb) {
  get('/api/user/stocks', (res) => {
    if (res.status === 'ok') {
      cb(res.stocks);
    } else {
      cb(undefined);
    }
  });
}

function getDate(roomId, cb) {
  post('/api/room/date', {
    room_id: roomId
  }, (res) => {
    if (res.status === 'ok') {
      cb(new Date(res.date));
    } else {
      cb(undefined);
    }
  });
}

function getStocks(roomId, cb) {
  post('/api/room/stocks', {
    room_id: roomId
  }, (res) => {
    if (res.status === 'ok') {
      cb(res.stocks);
    } else {
      cb(undefined);
    }
  });
}

function toDate(timestamp) {
  let monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let date = new Date(timestamp * 1000);
  let year = date.getFullYear();
  let month = monthsArr[date.getMonth()];
  let day = date.getDate();
  let convdataTime = month + '-' + day + '-' + year;
  return convdataTime;
}

function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
