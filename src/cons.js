import _ from 'lodash';
import Logger from './Logger';

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
    to: (...committers) => new Logger(committers, render)
  };
};

/**
 * Simple no-operation logger.
 *
 * @returns {Logger}
 * A noop logger.
 */
export const noop = new Logger(() => {}, () => {});
