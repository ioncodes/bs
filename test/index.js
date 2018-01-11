import request from 'request';
import assert from 'assert';
import FileCookieStore from 'tough-cookie-filestore';

import '../lib/app.js';

const username = 'test';
const password = 'test';
const firstName = 'Raviolio';
const lastName = 'Pertillo';

var jar = request.jar(new FileCookieStore('cookies.json'));

describe('Börsenspiel', () => {
  it('should start', done => {
    request.get('http://localhost:3000/', (error, response, body) => {
      assert.equal(200, response.statusCode);
      done();
    });
  });
  it('should register account successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/register',
      method: 'POST',
      json: {
        username: username,
        password: password,
        first_name: firstName,
        last_name: lastName
      }
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should login successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/login',
      method: 'POST',
      json: {
        username: username,
        password: password
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      jar.setCookie(request.cookie(`${response.headers['set-cookie']}`), 'http://localhost:3000');
      done();
    });
  });
  it('should return username', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/username',
      method: 'GET',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      assert.equal(json.username, username);
      done();
    });
  });
  it('should return first name', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/first_name',
      method: 'GET',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      assert.equal(json.first_name, firstName);
      done();
    });
  });
  it('should return last name', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/last_name',
      method: 'GET',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      assert.equal(json.last_name, lastName);
      done();
    });
  });
  it('should delete account successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/delete',
      method: 'POST',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      done();
    });
  });
});
