'use strict';

const { differenceInDays } = require('date-fns');

const FIRST_WEEK_EVER = '2015-12-28';
const WEEKS = new Map([[1, 'A'], [2, 'B'], [3, 'C'], [4, 'D']]);
pr;
const weekNumber = (date) => {
  const weekA_date = new Date(FIRST_WEEK_EVER);
  const diff = differenceInDays(date, weekA_date);

  return 1 + (diff / 7).toFixed(0) % 4;
};

const weekLetter = (date) => WEEKS[weekNumber(date)];

module.exports = { weekNumber, weekLetter };
