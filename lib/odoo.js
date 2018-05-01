'use strict';

const OdooRPC = require('odoo-xmlrpc');
const { addDays, format } = require('date-fns');

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

const execute = (odoo, table, method, params) => {
  return new Promise((resolve, reject) => {
    odoo.execute_kw(
      table,
      method,
      params,
      (err, rows) => {
        if (err) {
          return reject(err);
        }

        resolve(rows);
      }
    );
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

      const query = execute(odoo, 'res.partner', 'search_count', [[
        [['is_member', '=', true]]
      ]]);

      query.then(count => {
        const inParams = [];
        const batch = [];
        const limit = Math.ceil(count / 5);

        inParams.push(criterion);
        inParams.push([
          'create_date',
          'cooperative_state',
          'badge_to_print',
          'display_ftop_points',
          'display_std_points',
          'in_ftop_team'
        ]);

        for (let i = 0; i < 5; i++) {
          const params = [
            inParams,
            {
              offset: i * limit,
              limit
            }
          ];

          batch.push(execute(odoo, 'res.partner', 'search_read', params));
        }

        Promise.all(batch)
          .then((data) => resolve({ data: [].concat(...data) }))
          .catch(reject);
      });
    });
  });
};

module.exports.getShifts = async (date=new Date()) => {
  const odoo = init();

  return new Promise((resolve, reject) => {
    odoo.connect((err) => {
      if (err) {
        return reject(err);
      }
      const day_start = date;
      const day_end = addDays(date, 7);
      const params = [];
      const inParams = [];
      inParams.push([
        ['date_begin_tz', '>=', format(day_start, 'YYYY-MM-DD 00:00:00')],
        ['date_begin_tz', '<=', format(day_end, 'YYYY-MM-DD 23:59:00')]
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
