const Level = {
  LOG:     0
, INFO:    1
, WARN:    2
, ERROR:   3
, DEBUG:   4
, TRACE:   5
, VERBOSE: 6
};

const _levelNames = {
  [Level.LOG]: 'log'
, [Level.INFO]: 'info'
, [Level.WARN]: 'warn'
, [Level.ERROR]: 'error'
, [Level.DEBUG]: 'debug'
, [Level.TRACE]: 'trace'
, [Level.VERBOSE]: 'verbose'
};

Level.toString = level => _levelNames[level];

export default Level;
