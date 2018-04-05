'use strict';

const express = require('express');
const cons = require('consolidate');
const { join } = require('path');
const app = express();

const { getUsers, getShifts } = require('./lib/odoo');
const { users: userStats, shifts: shiftStats } = require('./lib/stats');

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.set('views', join(__dirname, 'views'));
app.use(express.static(join(__dirname, 'public')));

app.get('/', (request, response) => response.render('index'));

app.get('/users', (request, response) => {
  getUsers()
    .then(userStats)
    .then((data) => response.render('users', { data }));
});

app.get('/planning/:date(\\d{4}-\\d{2}-\\d{2})?', (request, response) => {
  getShifts(request.params.date || new Date())
    .then(shiftStats)
    .then((data) => response.render('schedule', { data }));
});

app.listen(process.env.PORT || 3000);
