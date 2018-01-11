window.onload = () => {
  getUsername((username) => {
    M.toast({html: 'Welcome ' + username});
  });
}
