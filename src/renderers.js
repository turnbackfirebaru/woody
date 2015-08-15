import _ from 'lodash';
import { as } from './cons';

/**
 * Bracketed renderer, e.g.:
 *  "[context0][context1] message"
 *
 * @returns {Function}
 * Returns a function to create a new logger with.
 */
export function bracketed() {
  return as(
    (level, contexts, messages = []) =>
        (_.map(contexts, c => ('[' + c + ']')).join(''))
      + ((contexts.length > 0) ? ' ' : '')
      + messages.join(' '))
}

/**
 * Dotted renderer, e.g.:
 *  "context0.context1: message"
 *
 * @returns {Function}
 * Returns a function to create a new logger with.
 */
export function dotted() {
  return as(
    (level, contexts, messages) =>
      (contexts.length > 0)
        ? contexts.join('.') + ': ' + messages.join(' ')
        : messages.join(' '));
}

/**
 * Verbatim
 *
 * @returns {Function}
 * Returns a function to create a new logger with.
 */
export function verbatim() {
  return as(
    (level, contexts, messages) =>
      ({ contexts: contexts
       , messages: messages }));
};

/**
 * Json-serialized, e.g.:
 *
 *     "{ \"context\": [\"x\", \"y\"]
 *      , \"messages\": [ ... ]
 *      }"
 *
 * @returns {Function}
 * Returns a function to create a new logger with.
 */
export function stringified() {
  return as(
    (level, contexts, messages) =>
      JSON.stringify({
        contexts: contexts
      , messages: messages
      }));
}
