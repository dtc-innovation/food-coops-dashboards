'use strict';

const {weekLetter, weekNumber} = require('../weeks');

const getClasses = (resource) => {
  const classes = [];

  if (!resource) {
    classes.push('slots--na');
  }
  else {
    const difference = diff(resource);

    if (difference === 0) {
      classes.push('slots--full');
    }
    else if (difference < 0) {
      classes.push('slots--missing');
    }
    else if (difference > 0) {
      classes.push('slots--overflow');
    }

    if (Math.abs(difference) >= (resource.seats_max / 2)) {
      classes.push('heavy');
    }
  }

  return classes.join(' ');
}

const diff = (resource={}) => {
  return (resource.seats_expected || 0) - (resource.seats_max || 0);
}

module.exports = (env) => {
  env.addFilter('resource_class', getClasses);
  env.addFilter('resource_diff', diff);
  env.addFilter('weekLetter', weekLetter);
  env.addFilter('weekNumber', weekNumber);
};
