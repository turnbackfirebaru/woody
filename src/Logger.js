import _ from 'lodash';
import Level from './level';
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
   *
   * @param {(Boolean|Function)[]} conditions
   */

  constructor(commit, render, contexts=[], conds=[]) {
    this._commit = commit;
    this._render = render;
    this._contexts = contexts;
    this._conditions = conds;
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
    if (_.all(
      this._conditions
    , cond => (
      /* condition is a function */
      _.isFunction(cond)
        ? cond(level)
      /* condition is a log-level */
    : _.isNumber(cond)
        ? (level >= Level[cond])
      /* condition is any old value */
    :   cond))) {
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
    }
    return this;
  };

  /**
   * Provide log levels as specied in log4js.
   */

  log() { return this._log(Level.INFO, _.toArray(arguments)) }
  info() { return this._log(Level.INFO, _.toArray(arguments)) }
  warn() { return this._log(Level.WARN, _.toArray(arguments)) }
  error() { return this._log(Level.ERROR, _.toArray(arguments)) }
  debug() { return this._log(Level.DEBUG, _.toArray(arguments)) }
  trace() { return this._log(Level.TRACE, _.toArray(arguments)) }
  verbose() { return this._log(Level.VERBOSE, _.toArray(arguments)) }

  /**
   * Contextualize the logger.
   *
   * @param {!Object} context
   * The context to push, usually a string.
   *
   * @returns {!Logger}
   * Returns a new logger with a new context pushed onto it's context stack.
   */
  fork(context) {
    return new Logger(
        this._commit
      , this._render
      , this._contexts.concat(
          (_.isUndefined(context) || _.isNull(context))
            ? []
            : [context])
      , this._conditions.concat([]));
  }

  /**
   * Alias for `fork`
   */
  push(context) {
    return this.fork(context);
  }

  if(cond) {
    return new Logger(
        this._commit
      , this._render
      , this._contexts.concat([])
      , this._conditions.concat(
          (_.isUndefined(cond) || _.isNull(cond))
            ? []
            : [cond]));
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
    , self._contexts
    , self._conditions);
  }
}
