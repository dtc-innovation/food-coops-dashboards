'use strict';

const mem = require('mem');

const { getUsers, getShifts } = require('./odoo');
const { users: userStats, shifts: shiftStats } = require('./stats');
const { shiftsTimes, shiftsDays } = require('./stats');

const fetchUsers = mem(getUsers, { maxAge: 1*3600*1000 });
const fetchShifts = mem(getShifts, { maxAge: 0.5*3600*1000 });

module.exports.index = (request, response) => {
  response.redirect('/users');
};

module.exports.users = (request, response) => {
  fetchUsers()
    .then(userStats)
    .then((data) => response.render('users', { data }));
};

module.exports.planning = (request, response) => {
  let times = [];
  let days = [];

  fetchShifts(request.params.date)
    .then(services => {
      times = shiftsTimes(services);
      days = shiftsDays(services);
      return services;
    })
    .then(shiftStats)
    .then((data) => {
      response.render('schedule', { data, times, days });
    });
};
