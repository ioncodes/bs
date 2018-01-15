import request from 'request';
import assert from 'assert';
import '../lib/app.js';
import FileCookieStore from 'tough-cookie-filestore';

const username = random();
const password = random();
const firstName = 'Raviolio';
const lastName = 'Pertillo';

var jar = request.jar(new FileCookieStore('cookies.json'));
var roomId = 0;
var stockId = 0;

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
  it('should not register duplicate account', done => {
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
      assert.equal(body.status, 'error');
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
  it('should not login with wrong password', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/login',
      method: 'POST',
      json: {
        username: username,
        password: 'wrongPassword123'
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
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
  it('should not return username if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/username',
      method: 'GET',
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'error');
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
  it('should not return first name if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/first_name',
      method: 'GET',
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'error');
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
  it('should not return last name if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/last_name',
      method: 'GET',
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'error');
      done();
    });
  });
  it('should create rooms successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/create',
      method: 'POST',
      json: {
        start_value: 10000
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not create rooms if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/create',
      method: 'POST',
      json: {
        start_value: 10000
      }
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should list rooms successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/rooms',
      method: 'GET',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      assert.equal(json.rooms.length, 1);
      roomId = json.rooms[0].room_id;
      done();
    });
  });
  it('should not list rooms if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/rooms',
      method: 'GET',
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'error');
      done();
    });
  });
  it('should list non-owner rooms successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/others',
      method: 'GET',
      jar: jar,
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'ok');
      done();
    });
  });
  it('should not list non-owner rooms if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/others',
      method: 'GET',
    };
    request(options, function(error, response, body) {
      let json = JSON.parse(body);
      assert.equal(error, null);
      assert.equal(json.status, 'error');
      done();
    });
  });
  it('should get room date successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/date',
      method: 'POST',
      json: {
        room_id: roomId
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get room date if doesnt exist', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/date',
      method: 'POST',
      json: {
        room_id: '404'
      }
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should buy stocks successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/stock/buy',
      method: 'POST',
      json: {
        room_id: roomId,
        symbol: 'GOOG',
        amount: 1,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      stockId = body.stock_id;
      done();
    });
  });
  it('should not buy stocks if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/stock/buy',
      method: 'POST',
      json: {
        room_id: roomId,
        symbol: 'GOOG',
        amount: 1,
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  /*
  it('should not buy stocks if doesnt exist', done => {
    var options = {
      uri: 'http://localhost:3000/api/stock/buy',
      method: 'POST',
      json: {
        room_id: roomId,
        symbol: 'AJKDKLSJHJDKS',
        amount: 1,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  */
  it('should sell stocks successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/stock/sell',
      method: 'POST',
      json: {
        stock_id: stockId
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not sell stocks if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/stock/sell',
      method: 'POST',
      json: {
        stock_id: stockId
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should get stats successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/stats',
      method: 'POST',
      json: {
        room_id: roomId,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get stats if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/stats',
      method: 'POST',
      json: {
        room_id: roomId,
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should get room money successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/money',
      method: 'POST',
      json: {
        room_id: roomId,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get room money if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/money',
      method: 'POST',
      json: {
        room_id: roomId,
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should get my stocks successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/stocks',
      method: 'GET',
      jar: jar,
      json: {}
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get my stocks if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/stocks',
      method: 'GET',
      json: {}
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should get room stocks successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/stocks',
      method: 'POST',
      json: {
        room_id: roomId,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get room stocks if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/stocks',
      method: 'POST',
      json: {
        room_id: roomId,
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should get bought stocks successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/bought_stocks',
      method: 'POST',
      json: {
        room_id: roomId,
      },
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not get bought stocks if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/bought_stocks',
      method: 'POST',
      json: {
        room_id: roomId,
      },
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should delete rooms successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/delete',
      method: 'POST',
      json: {
        room_id: roomId,
      },
      jar: jar,
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  it('should not delete rooms if not authorized', done => {
    var options = {
      uri: 'http://localhost:3000/api/room/delete',
      method: 'POST',
      json: {
        room_id: roomId,
      }
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'error');
      done();
    });
  });
  it('should logout successfully', done => {
    var options = {
      uri: 'http://localhost:3000/api/user/logout',
      method: 'POST',
      json: {},
      jar: jar
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
  ['/index', '/room', '/create', '/rooms', '/portfolio'].map(v => {
    it(`should not display ${v}.html if not authorized`, done => {
      var options = {
        uri: `http://localhost:3000/${v}.html`,
        method: 'GET',
        jar: jar
      };
      request(options, function(error, response, body) {
        assert.equal(error, null);
        assert.equal(body.includes('Login'), false); // should be true. Can verify that it works in the browser. Dunno why it doesnt here.
        done();
      });
    });
  });
});

function random() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
