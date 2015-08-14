/*
 * Commit to nowhere.
 */
export function nowhere() {};

/*
 * Commit message to console.
 *
 * @alias {Logger~commitCallback}
 */
export function console(level, message) {
  level = _.has(console, level) ? level : 'info';
  console[level].apply(console, [message]);
};

/**
 * Commit to a log4s logger.
 *
 * @param {!Log4Js} log4jsLogger
 * The log4js logger instance to commit to.
 *
 * @returns {Function}
 * Returns a callback to create a new logger with.
 */
export function log4js(log4jsLogger) {
  return (level, message) => {
    const lvl = (level === 'log') ? 'info' : level;
    if (log4jsLogger[lvl]) {
      log4jsLogger[lvl](message);
    }
  };
};
