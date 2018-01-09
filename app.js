const express = require('express');
const bodyParser = require('body-parser');
const SQL = require('./sql.js');
const app = express();
const sql = new SQL();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/api/user/register', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.first_name;
  let lastName = req.body.last_name;
  sql.createUser(username, password, firstName, lastName, (success) => {
    if(success) {
      res.send({status: 'ok'})
    } else {
      res.send({status: 'error'})
    }
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});
