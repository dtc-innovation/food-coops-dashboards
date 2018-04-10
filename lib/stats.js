'use strict';

const groupBy = require('group-array');
const { format, subDays } = require('date-fns');

const ACTIVE_STATES = ['up_to_date', 'vacation', 'alert'];

const stateIs = (state) => (d) => d.cooperative_state === state;
const stateIncludes = (states) => (d) => states.includes(d.cooperative_state);
const hasLessPointsThan = (score) => (d) => d.display_ftop_points + d.display_std_points < score;
const sinceDays = (days) => {
  const date_base = format(subDays(new Date(), days), 'YYYY-MM-DD 00:00:00');
  return (d) => d.create_date >= date_base;
}

module.exports.users = ({ data:users }) => ({
  users_last_30d: users.filter(sinceDays(30)),
  users_last_30d_alert: users.filter(sinceDays(30)).filter(stateIs('alert')).length,
  users_last_45d_alert: users.filter(sinceDays(45)).filter(stateIs('alert')).length,
  users,
  total_to_date: users.length,
  total: users.filter(stateIncludes(ACTIVE_STATES)).length,
  in_ftop_team: users.filter((d) => d.in_ftop_team).length,
  badge_to_print: users.filter((d) => d.badge_to_print).length,
  state: {
    unsubscribed: users.filter(stateIs('unsubscribed')).length,
    up_to_date: users.filter(stateIs('up_to_date')).length,
    suspended: users.filter(stateIs('suspended')).length,
    vacation: users.filter(stateIs('vacation')).length,
    unpayed: users.filter(stateIs('unpayed')).length,
    delay: users.filter(stateIs('delay')).length,
    alert: users.filter(stateIs('alert')).length
  },
  negative_points: [
    [ 0, users.filter(hasLessPointsThan(0)).length ],
    [ -1, users.filter(hasLessPointsThan(-1)).length ],
    [ -2, users.filter(hasLessPointsThan(-2)).length ],
    [ -3, users.filter(hasLessPointsThan(-3)).length ],
    [ -4, users.filter(hasLessPointsThan(-4)).length ],
    [ -5, users.filter(hasLessPointsThan(-5)).length ],
    [ -6, users.filter(hasLessPointsThan(-6)).length ]
  ]
});

module.exports.shifts = (services) => {
  const LOCATIONS = {
    'Cleme': 'Clémenceau',
    'Balar': 'Balard',
  }
  return groupBy(
    services,
    // by day of the week (monday, tuesday, etc.)
    (d) => format(d.date_begin_tz, 'YYYY-MM-DD'),
    // by venue
    (d) => LOCATIONS[ d.name.split('-').pop().trim() ],
    // by datetime
    (d) => d.date_begin_tz,
  );
};
