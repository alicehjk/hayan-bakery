'use strict';
const request = require('supertest');
const express = require('express');

test('health: site router attaches', async () => {
  const app = express();
  app.use('/', require('../routes/site'));
  const res = await request(app).get('/');
  expect([200,302,404]).toContain(res.status); // smoke
});
