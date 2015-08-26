const Level = {
  FATAL:   50000
, ERROR:   40000
, WARN:    30000
, INFO:    20000
, DEBUG:   10000
, TRACE:    5000
};

const _levelNames = {
  [Level.FATAL]:   'fatal'
, [Level.ERROR]:   'error'
, [Level.WARN]:    'warn'
, [Level.INFO]:    'info'
, [Level.DEBUG]:   'debug'
, [Level.TRACE]:   'trace'
};

Level.toString = level => _levelNames[level];

export default Level;
