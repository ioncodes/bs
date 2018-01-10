import request from 'request';
import assert from 'assert';

import '../lib/app.js';

describe('Node Server', () => {
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
        username: 'test',
        password: 'test',
        first_name: 'Raviolio',
        last_name: 'Pertillo'
      }
    };
    request(options, function(error, response, body) {
      assert.equal(error, null);
      assert.equal(body.status, 'ok');
      done();
    });
  });
});
