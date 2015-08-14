import _ from 'lodash';
import moment from 'moment';

/**
 * @class
 */

export default class Logger {

  /*
   * @constructor
   *
   * @param {!Logger~commitCallback} commit
   * Given a rendered context stack, commit it, e.g. print to console.
   *
   * @param {!Logger~renderCallback} render
   * Transform the context stack into a single object, e.g. a string.
   *
   * @param {?(Object|Object[])} contexts
   * The context stack the logger is running in.
   */

  constructor(commit, render, contexts=[]) {
    this._commit = commit;
    this._render = render;
    this._contexts = contexts;
  }

  /**
   * Helper function to register various log levels.
   *
   * @private
   *
   * @param {string} level - The log level.
   * Must be one of 'log', 'info', 'warn', 'error', 'debug', 'trace', 'verbose'.
   *
   * @param {Object[]} x - The messages to log.
   *
   * @returns {undefined} - Void.
   */

  _log(level, args) {
    this._commit(
      level
    , this._render(
        level
      , _.map(this._contexts, context =>
          _.isFunction(context)
            ? context.apply({ level: level})
            : context)
      , _.flatten(args, false)));
  };

  /**
   * Provide log levels as specied in log4js.
   */

  log() { this._log('log', arguments) }
  info() { this._log('info', arguments) }
  warn() { this._log('warn', arguments) }
  error() { this._log('error', arguments) }
  debug() { this._log('debug', arguments) }
  trace() { this._log('trace', arguments) }
  verbose() { this._log('verbose', arguments) }

  /**
   * Contextualize the logger.
   *
   * @param {!Object} context
   * The context to push, usually a string.
   *
   * @returns {!Logger}
   * Returns a new logger with a new context pushed onto it's context stack.
   */
  context(context) {
    return new Logger(
        this._commit
      , this._render
      , this._contexts.concat([context])
    );
  }

  /**
   * Combine two loggers by invoking the current
   * logger first and then the second (other).
   *
   * @param {!Logger} other - The logger to sequence
   *
   * @returns {!Logger}
   * Returns a new Logger instance.
   */
  sequence(other) {
    return new Logger(
      ([left, right]) => {
        this._commit.call(this, left);
        other._commit.call(other, right);
      }
    , (contexts, messages) =>
        [ this._render.call(this, contexts, messages)
        , other._render.call(other, contexts, messages) ]
    , this._contexts);
  }
}
