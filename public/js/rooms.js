var roomsTable = document.getElementById('roomstable');

window.onload = () => {
  getRooms(rooms => {
    rooms.forEach(room => {
      let row = roomsTable.insertRow();
      let name = row.insertCell(0);
      let startValue = row.insertCell(1);
      let date = row.insertCell(2);
      let money = row.insertCell(3);
      let btn = row.insertCell(4);
      name.innerHTML = 'todo';
      startValue.innerHTML = `$${room.start_value}`;
      date.innerHTML = 'todo';
      money.innerHTML = 'todo';
      btn.outerHTML = `<a onclick="deleteRoom('${room.room_id}')" class="red waves-effect waves-light btn">delete</a>`
    });
  });
}

function deleteRoom(roomId) {
  post('/api/room/delete', {
    room_id: roomId
  }, (res) => {
    if(res.status === 'ok') {
      M.toast({html: 'Room deleted!'});
      location.reload();
    } else {
      M.toast({html: 'Sorry, but there was an error!'})
    }
  });
}
