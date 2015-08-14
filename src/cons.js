import _ from 'lodash';
import Logger from './logger';

/**
 * Partially apply the Logger constructor with a render function.
 *
 * @param {Function} render
 * The render callback
 *
 * @returns {Function}
 * Returns the partially applied logger, wrapped in a object
 * with key `to` for good looking function application.
 */
export function as(render) {
  return {
    to: committer => new Logger(committer, render)
  };
};

/**
 * Simple no-operation logger.
 *
 * @returns {Logger}
 * A noop logger.
 */
export function noop() {
  return new Logger(
      () => {}
    , () => {}
  );
};
