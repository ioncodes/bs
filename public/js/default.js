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

function toDate(timestamp) {
  var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var date = new Date(timestamp * 1000);
  var year = date.getFullYear();
  var month = months_arr[date.getMonth()];
  var day = date.getDate();
  var convdataTime = month + '-' + day + '-' + year;
  return convdataTime;
}
