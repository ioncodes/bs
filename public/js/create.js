var startValue = document.getElementById('startmoney');

function create() {
  post('/api/room/create', {
    start_value: startValue.value
  }, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Room created!'});
      setTimeout(() => window.location.replace('/room.html'), 1000);
    } else {
      M.toast({html: 'Sorry, but there was an error!'})
    }
  });
}
