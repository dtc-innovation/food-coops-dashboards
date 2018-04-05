'use strict';

const OdooRPC = require('odoo-xmlrpc');
const { startOfWeek, lastDayOfWeek, format } = require('date-fns');

const { ODOO_USERNAME: username, ODOO_PASSWORD: password } = process.env;
const { ODOO_URL: url, ODOO_DATABASE: db = '' } = process.env;

const init = () => {
  return new OdooRPC({
    url,
    db,
    port: 443,
    username,
    password
  });
};

module.exports.getUsers = async () => {
  const odoo = init();

  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        return reject(err);
      }

      const criterion = [['is_member', '=', true]];

      odoo.execute_kw('res.partner', 'count', [[criterion]], (err, count) => {
        const inParams = [];
        const batch = [];
        const limit = Math.ceil(count / 5);

        inParams.push(criterion);
        inParams.push([
          'cooperative_state',
          'badge_to_print',
          'display_ftop_points',
          'display_std_points',
          'in_ftop_team'
        ]);

        for (let i = 0; i < 5; i++) {
          batch.push(
            new Promise((resolve, reject) => {
              const params = [
                inParams,
                {
                  offset: i * limit,
                  limit
                }
              ];

              odoo.execute_kw(
                'res.partner',
                'search_read',
                params,
                (err, rows) => {
                  if (err) {
                    return reject(err);
                  }

                  resolve(rows);
                }
              );
            })
          );
        }

        Promise.all(batch)
          .then((responses) => resolve(...responses))
          .catch(reject);
      });
    });
  });
};

module.exports.getShifts = async (date) => {
  const odoo = init();

  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        return reject(err);
      }
      const week_start = startOfWeek(date);
      const week_end = lastDayOfWeek(date);
      const params = [];
      const inParams = [];
      inParams.push([
        ['date_begin_tz', '>=', format(week_start, 'YYYY-MM-DD 00:00:00')],
        ['date_begin_tz', '<=', format(week_end, 'YYYY-MM-DD 23:59:00')]
      ]);
      inParams.push([
        'name',
        'display_name',
        'begin_time_string',
        'date_begin_tz',
        'date_end_tz',
        'seats_min',
        'seats_expected',
        'seats_max',
        'ftop_registration_ids',
        'standard_registration_ids',
        'shift_type_id',
        'week_number'
      ]);

      params.push(inParams);
      params.push({ order: 'date_begin_tz ASC' });

      odoo.execute_kw('shift.shift', 'search_read', params, (err, items) => {
        if (err) {
          return reject(err);
        }

        resolve(items);
      });
    });
  });
};
