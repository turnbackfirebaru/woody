import { as } from './cons';

/**
 * Integrate with the `debug` package.
 *
 * Creates a logger that when applied will log to `debug`.
 * It keeps a logger-local cache per prefix in order to take advantage
 * of the colouring that `debug` provides.
 */
export function debug() {
  return (
    as((level, contexts, messages) =>
      ({ prefix: contexts.join(':')
       , message: messages.join(' ') }))
    .to(function(_, { prefix, message }) {
      (this.__debug__ || (this.__debug__ = require('debug')(prefix)))
        (message);
    }));
}
