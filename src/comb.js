import moment from 'moment';
import Logger from './Logger';

/**
 * Pushes a timestamp on to the context stack
 *
 * @param {Logger}
 * The logger to timestamp.
 *
 * @param {String}
 * The date format to use.
 *
 * @returns {Logger}
 * The timestamped logger.
 */
export function timestamped(logger, format) {
  return logger.context(() =>
    moment()
      .format(format || 'YYYY-MM-DD hh:mm:ss.SSS'));
};

/**
 * Push log-level onto the context stack
 *
 * @param {Logger}
 * The logger to print levels on.
 *
 * @returns {Logger}
 * The new logger
 */
export function level(logger) {
  return logger.context(function() {
    return this.level.toUpperCase();
  });
};
