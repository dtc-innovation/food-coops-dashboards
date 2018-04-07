'use strict';

const groupBy = require('group-array');
const { format } = require('date-fns');
const locale = require('date-fns/locale/fr');

const ACTIVE_STATES = ['up_to_date', 'vacation', 'alert'];

module.exports.users = ({ count:total_last_30d, data:users }) => ({
  total_last_30d,
  users,
  total_to_date: users.length,
  total: users.filter((d) => ACTIVE_STATES.includes(d.cooperative_state))
    .length,
  in_ftop_team: users.filter((d) => d.in_ftop_team).length,
  badge_to_print: users.filter((d) => d.badge_to_print).length,
  state: {
    unsubscribed: users.filter((d) => d.cooperative_state === 'unsubscribed')
      .length,
    up_to_date: users.filter((d) => d.cooperative_state === 'up_to_date')
      .length,
    suspended: users.filter((d) => d.cooperative_state === 'suspended').length,
    vacation: users.filter((d) => d.cooperative_state === 'vacation').length,
    unpayed: users.filter((d) => d.cooperative_state === 'unpayed').length,
    delay: users.filter((d) => d.cooperative_state === 'delay').length,
    alert: users.filter((d) => d.cooperative_state === 'alert').length
  },
  negative_points: [
    [
      0,
      users.filter((d) => d.display_ftop_points < 0 || d.display_std_points < 0)
        .length
    ],
    [
      -1,
      users.filter(
        (d) => d.display_ftop_points < -1 || d.display_std_points < -1
      ).length
    ],
    [
      -2,
      users.filter(
        (d) => d.display_ftop_points < -2 || d.display_std_points < -2
      ).length
    ],
    [
      -3,
      users.filter(
        (d) => d.display_ftop_points < -3 || d.display_std_points < -3
      ).length
    ],
    [
      -4,
      users.filter(
        (d) => d.display_ftop_points < -4 || d.display_std_points < -4
      ).length
    ],
    [
      -5,
      users.filter(
        (d) => d.display_ftop_points < -5 || d.display_std_points < -5
      ).length
    ],
    [
      -6,
      users.filter(
        (d) => d.display_ftop_points < -6 || d.display_std_points < -6
      ).length
    ]
  ]
});

module.exports.shifts = (services) => {
  return groupBy(
    services,
    // by day of the week (monday, tuesday, etc.)
    (d) => format(d.date_begin_tz, 'dddd', { locale }),
    // by venue
    (d) =>
      d.name
        .split('-')
        .pop()
        .trim()
  );
};
