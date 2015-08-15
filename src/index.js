import
{ as
, noop }
from './cons';

import
{ toConsole
, toNowhere
, toLog4js }
from './committers';

import
{ bracketed
, dotted
, stringified
, verbatim }
from './renderers';

import
{ debug }
from './presets';

export default {

/**
 * Construction
 */

  Logger: require('./Logger')
, as: as
, noop: noop

/**
 * Renderers
 */

, bracketed: bracketed
, dotted: dotted
, stringified: stringified
, verbatim: verbatim

/**
 * Committers
 */

, console: toConsole
, nowhere: toNowhere
, log4js: toLog4js

/**
 * Presets
 */
, debug: debug
}
