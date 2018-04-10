'use strict';

const mem = require('mem');

const { getUsers, getShifts } = require('./odoo');
const { users: userStats, shifts: shiftStats } = require('./stats');

const fetchUsers = mem(getUsers, { maxAge: 1*3600*1000 });
const fetchShifts = mem(getShifts, { maxAge: 0.5*3600*1000 });

module.exports.index = (request, response) => {
  response.render('index');
};

module.exports.users = (request, response) => {
  fetchUsers()
    .then(userStats)
    .then((data) => response.render('users', { data }));
};

module.exports.planning = (request, response) => {
  fetchShifts(request.params.date)
    .then(shiftStats)
    .then((data) => response.render('schedule', { data }));
};
