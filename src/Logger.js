import _ from 'lodash';
import moment from 'moment';
import { timestamped, level } from './comb';

/**
 * @class
 */

export default class Logger {

  /*
   * @constructor
   *
   * @param {Function} commit
   * Given a rendered context stack, commit it, e.g. print to console.
   *
   * @param {Function} render
   * Transform the context stack into a single object, e.g. a string.
   *
   * @param {Object[]} contexts
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
    var self = this;
    this._commit.call(
      this
    , level
    , this._render.call(
        this
      , level
      , _.map(this._contexts, context =>
          _.isFunction(context)
            ? context.apply({ level: level})
            : context)
      , _.toArray(args)));
  };

  /**
   * Provide log levels as specied in log4js.
   */

  log() { this._log('log', _.toArray(arguments)) }
  info() { this._log('info', _.toArray(arguments)) }
  warn() { this._log('warn', _.toArray(arguments)) }
  error() { this._log('error', _.toArray(arguments)) }
  debug() { this._log('debug', _.toArray(arguments)) }
  trace() { this._log('trace', _.toArray(arguments)) }
  verbose() { this._log('verbose', _.toArray(arguments)) }

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
   * Pipe the rendered output of this logger into another
   * comitter.
   *
   * @param {!Logger} other
   * The logger to sequence
   *
   * @returns {!Logger}
   * Returns a new Logger instance.
   */
  sequence(other) {
    const self = this;
    return new Logger(
      (level, [left, right]) => {
        self._commit.call(self, level, left);
        other._commit.call(other, level, right);
      }
    , (level, contexts, messages) =>
        [ self._render.call(self, level, contexts, messages)
        , other._render.call(other, level, contexts, messages) ]
    , self._contexts);
  }

  /*
   * Add the various combinators to the prototype for
   * a function chaining interface.
   *
   * XXX Could this be solved differently? In such a way that
   *     combinators can be contributed in user land?
   */

  timestamped(format) {
    return timestamped(this, format);
  }

  level() {
    return level(this);
  }
}
