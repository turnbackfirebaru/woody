import moment from 'moment';
import Logger from './Logger';

/**
 * Pushes a timestamp on to the context stack.
 * It's dynamically fetched everytime a message is
 * logged.
 *
 * @param {String}
 * The date format to use.
 *
 * @returns {Function}
 */
export function timestamp(format) {
  return () =>
    moment()
      .format(format || 'YYYY-MM-DD hh:mm:ss.SSS');
};

/**
 * Push the log-level onto the context stack.
 * It's dynamically fetched from the invocation.
 *
 * @returns {Function}
 */
export function level() {
  return function() {
    return this.level.toUpperCase();
  };
};
