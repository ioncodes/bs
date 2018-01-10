var username = document.getElementById('username');
var fullname = document.getElementById('fullname');

getUsername((_username) => {
  getFirstName((firstName) => {
    getLastName((lastName) => {
      username.innerText = _username;
      fullname.innerText = firstName + ' ' + lastName;
    });
  });
});
