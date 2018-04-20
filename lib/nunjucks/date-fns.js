const dateFns = require('date-fns');

DEFAULT_OPTIONS = {
  namespace: 'date',
  locale: 'en',
}

module.exports = (env, user_options) => {
  const {locale, namespace} = {...DEFAULT_OPTIONS, ...user_options};
  const localeObject = require(`date-fns/locale/${locale}`);

  Object.entries(dateFns).forEach(([key, fn]) => {
    env.addFilter(`${namespace}.${key}`, fn);
  });

  env.addGlobal('locale', localeObject);
};
