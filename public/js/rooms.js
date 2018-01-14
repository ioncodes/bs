var roomsTable = document.getElementById('roomstable');

window.onload = () => {
  getRooms(rooms => {
    rooms.forEach(room => {
      getMoney(room.room_id, money => {
        getDate(room.room_id, date => {
          let row = roomsTable.insertRow();
          let startValue = row.insertCell(0);
          let dateCell = row.insertCell(1);
          let moneyCell = row.insertCell(2);
          let btnShow = row.insertCell(3);
          let btnDel = row.insertCell(4);
          startValue.innerHTML = `$${room.start_value}`;
          dateCell.innerHTML = date;
          moneyCell.innerHTML = `$${money}`;
          btnShow.innerHTML = `<a onclick="showRoom('${room.room_id}')" class="green waves-effect waves-light btn">show</a>`;
          btnDel.innerHTML = `<a onclick="deleteRoom('${room.room_id}')" class="red waves-effect waves-light btn">delete</a>`;
        });
      });
    });
  });
  getOtherRooms(rooms => {
    rooms.forEach(room => {
      let row = roomsTable.insertRow();
      let startValue = row.insertCell(0);
      let dateCell = row.insertCell(1);
      let moneyCell = row.insertCell(2);
      let btnShow = row.insertCell(3);
      let btnDel = row.insertCell(4);
      startValue.innerHTML = `$${room.start_value}`;
      dateCell.innerHTML = new Date(room.date);
      moneyCell.innerHTML = `$${room.money}`;
      btnShow.innerHTML = `<a onclick="showRoom('${room.room_id}')" class="green waves-effect waves-light btn">show</a>`;
      btnDel.innerHTML = '<a onclick="#" class="red waves-effect waves-light btn disabled">delete</a>';
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

function showRoom(roomId) {
  location.replace(`/room.html?room_id=${roomId}`);
}
