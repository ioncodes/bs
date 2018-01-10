var username = document.getElementById('username');
var password = document.getElementById('password');

function login() {
  post('/api/user/login', {
    username: username.value,
    password: password.value,
  }, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Logged In! Redirecting...'});
      setTimeout(() => window.location.replace('/index.html'), 1000);
    } else {
      M.toast({html: 'Sorry, but there was an error!'})
    }
  });
}
