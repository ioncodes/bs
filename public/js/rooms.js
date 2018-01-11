var roomsTable = document.getElementById('roomstable');

window.onload = () => {
  getRooms((rooms) => {
    rooms.forEach((room) => {
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
      btn.outerHTML = `<a onclick="delete('${room.room_id}')" class="red waves-effect waves-light btn">delete</a>`
    });
  });
}
