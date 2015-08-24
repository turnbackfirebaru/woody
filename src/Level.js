const Level = {
  INFO:    0
, WARN:    1
, ERROR:   2
, DEBUG:   3
, TRACE:   4
, VERBOSE: 5
};

const _levelNames = {
  [Level.INFO]: 'info'
, [Level.WARN]: 'warn'
, [Level.ERROR]: 'error'
, [Level.DEBUG]: 'debug'
, [Level.TRACE]: 'trace'
, [Level.VERBOSE]: 'verbose'
};

Level.toString = level => _levelNames[level];

export default Level;
