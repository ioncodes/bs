var firstName = document.getElementById('firstname');
var lastName = document.getElementById('lastname');
var username = document.getElementById('username');
var password = document.getElementById('password');
var verifyPassword = document.getElementById('verifypassword');

var inputs = [
  firstName,
  lastName,
  username,
  password,
  verifyPassword
];

function checkContent() {
  for(let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    if(input.value === '') {
      input.classList.remove('valid');
      input.classList.add('invalid');
    } else {
      input.classList.remove('invalid');
      input.classList.add('valid');
    }
  }
}

function checkPassword() {
  if(password.value.length < 8) {
    password.classList.remove('valid');
    password.classList.add('invalid');
  }
  if(password.value !== verifyPassword.value || verifyPassword.value.length < 8) {
    verifyPassword.classList.remove('valid');
    verifyPassword.classList.add('invalid');
  } else {
    verifyPassword.classList.remove('invalid');
    verifyPassword.classList.add('valid');
  }
}

function validate() {
  for(let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    if(input.classList.contains('invalid')) {
      return false;
    }
  }
  return true;
}

function register() {
  checkContent();
  checkPassword();
  let ret = validate();
  if(ret) {
    post('/api/user/register', {
      username: username.value,
      password: password.value,
      first_name: firstName.value,
      last_name: lastName.value,
    }, (res) => {
      if(res.status === 'ok') {
        M.toast({html: 'Account created!'});
      } else {
        M.toast({html: 'Sorry, but there was an error!'})
      }
    });
  } else {
    M.toast({html: 'Sorry, but there was an error!'})
  }
}
