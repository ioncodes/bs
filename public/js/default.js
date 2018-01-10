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

function getUsername(cb) {
  get('/api/user/username', (res) => {
    if(res.status === 'ok') {
      cb(res.username);
    } else {
      M.toast({html: 'An error occured!'});
      cb(undefined);
    }
  });
}

function getFirstName(cb) {
  get('/api/user/first_name', (res) => {
    if(res.status === 'ok') {
      cb(res.first_name);
    } else {
      M.toast({html: 'An error occured!'});
      cb(undefined);
    }
  });
}

function getLastName(cb) {
  get('/api/user/last_name', (res) => {
    if(res.status === 'ok') {
      cb(res.last_name);
    } else {
      M.toast({html: 'An error occured!'});
      cb(undefined);
    }
  });
}

function logout() {
  post('/api/user/logout', {}, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Logged out! Redirecting...'});
      setTimeout(() => window.location.replace('/login.html'), 1000);
    } else {
      M.toast({html: 'An error occured!'});
    }
  });
}
