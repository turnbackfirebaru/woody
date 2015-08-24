const Level = {
  INFO:    5
, WARN:    4
, ERROR:   3
, DEBUG:   2
, TRACE:   1
, VERBOSE: 0
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
