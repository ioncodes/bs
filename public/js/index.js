window.onload = () => {
  getUsername((username) => {
    document.getElementById('msg').innerText = 'Welcome ' + username;
  });
}
