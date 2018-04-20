'use strict';

const express = require('express');
const cons = require('consolidate');
const nunjucks = require('nunjucks');
const { join } = require('path');
const env = require('require-env');
const app = express();

env.require('ODOO_USERNAME');
env.require('ODOO_PASSWORD');
env.require('ODOO_URL');

const controllers = require('./lib/controllers');
const installDateFns = require('./lib/nunjucks-date-fns');
const isProduction = process.env.NODE_ENV === 'production';

cons.requires.nunjucks = nunjucks.configure(join(__dirname, 'views'), {
  express: app,
  watch: !isProduction,
});
installDateFns(cons.requires.nunjucks, { locale: 'fr' });

app.engine('html', cons.nunjucks);
app.set('view engine', 'html');
app.use(express.static(join(__dirname, 'public')));

app.get('/', controllers.index);
app.get('/users', controllers.users);
app.get('/planning/:date(\\d{4}-\\d{2}-\\d{2})?', controllers.planning);

app.listen(process.env.PORT || 3000);
