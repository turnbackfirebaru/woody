import woody from '..';
import _ from 'lodash';
import assert from 'assert';
import moment from 'moment';
import Promise from 'promise';

describe('A logger', () => {
  it('should log messages', () => {
    const logs = [];
    const logger = woody
      .as(woody.bracketed())
      .to((level, msg) => {
        logs.push({ level: level, message: msg })
      });

    logger
      .fatal('foo-0')
      .error('foo-1')
      .warn('foo-2')
      .info('foo-3')
      .debug('foo-4')
      .trace('foo-5')
      .log('foo-6');

    assert.strictEqual(logs[0].level, woody.level.FATAL);
    assert.strictEqual(logs[1].level, woody.level.ERROR);
    assert.strictEqual(logs[2].level, woody.level.WARN);
    assert.strictEqual(logs[3].level, woody.level.INFO);
    assert.strictEqual(logs[4].level, woody.level.DEBUG);
    assert.strictEqual(logs[5].level, woody.level.TRACE);
    assert.strictEqual(logs[6].level, woody.level.INFO);

    assert.strictEqual(logs[0].message, 'foo-0');
    assert.strictEqual(logs[1].message, 'foo-1');
    assert.strictEqual(logs[2].message, 'foo-2');
    assert.strictEqual(logs[3].message, 'foo-3');
    assert.strictEqual(logs[4].message, 'foo-4');
    assert.strictEqual(logs[5].message, 'foo-5');
    assert.strictEqual(logs[6].message, 'foo-6');
  });

  it('should be able to be contextualized', () => {
    const logs = [];
    const logger = woody
      .as(woody.bracketed())
      .to((level, msg) => {
        logs.push(msg);
      });

      logger.info('foo');
      assert.strictEqual(logs[0], 'foo');

      logger.fork('qux').info('foo');
      assert.strictEqual(logs[1], '[qux] foo');

      logger.fork('qux').fork('baz').info('foo');
      assert.strictEqual(logs[2], '[qux][baz] foo');
  });

  it('should stack it\s contexts', () => {
    const loggerContexts = [];
    const logger = woody
      .as((level, contexts, messages) => {
        loggerContexts.push(contexts);
      })
      .to(woody.nowhere);

    logger.log();
    assert.strictEqual(loggerContexts[0].length, 0);

    logger.fork('foo').log();
    assert.strictEqual(loggerContexts[1].length, 1);
    assert.strictEqual(loggerContexts[1][0], 'foo');

    logger.fork('foo').fork('bar').log();
    assert.strictEqual(loggerContexts[2].length, 2);
    assert.strictEqual(loggerContexts[2][0], 'foo');
    assert.strictEqual(loggerContexts[2][1], 'bar');

    logger.fork().log();
    assert.strictEqual(loggerContexts[3].length, 0);

    logger.fork().fork().log();
    assert.strictEqual(loggerContexts[4].length, 0);
  })

  it('should keep independent contexts', () => {
    const loggerContexts = [];
    const logger = woody
      .as((level, contexts, messages) => {
        loggerContexts.push(contexts);
      })
      .to(woody.nowhere);

    logger.log();
    assert.strictEqual(loggerContexts[0].length, 0);

    const logger2 = logger.fork('foo');
    logger2.log();
    assert.strictEqual(loggerContexts[1].length, 1);

    const logger3 = logger2.fork('bar')
    logger3.log();
    assert.strictEqual(loggerContexts[2].length, 2);

    logger.log();
    assert.strictEqual(loggerContexts[3].length, 0);

    logger.fork('foo').log();
    assert.strictEqual(loggerContexts[4].length, 1);

    logger.fork('foo').fork('bar').log();
    assert.strictEqual(loggerContexts[5].length, 2);
  });

  it('should cull logs based on the given log level', () => {
    const logs = [];
    const logger = woody
      .as(woody.bracketed())
      .to((level, msg) => {
        logs.push({ level, msg });
      });

    logger
      .if(woody.level.WARN)
      .fatal()
      .error()
      .warn()
      .info()
      .debug()
      .trace();

    assert.strictEqual(logs.length, 3);
    assert.strictEqual(logs[0].level, woody.level.FATAL);
    assert.strictEqual(logs[1].level, woody.level.ERROR);
    assert.strictEqual(logs[2].level, woody.level.WARN);
  });

  it('should be able to commit to multiple places', () => {
    const logsA = [], logsB = [];
    const logger = woody
      .as(woody.bracketed())
      .to(() => logsA.push('x'));

    const logger2 = logger
      .to(() => logsB.push('x'));

    logger.log();
    assert.strictEqual(logsA.length, 1);
    assert.strictEqual(logsB.length, 0);

    logger2.log();
    assert.strictEqual(logsA.length, 2);
    assert.strictEqual(logsB.length, 1);
  });

  it('should expose a promise upon logging - `.then`', () => {
    return new Promise((resolve) => {
      const logger = woody
        .as(woody.bracketed())
        .to(woody.console)
        .log()
        .then(resolve);
    });
  });

  it('should expose a promise upon logging - `.catch`', () => {
    return new Promise((resolve) => {
      const logger = woody
        .as(woody.bracketed())
        .to((level, message, cb) => {
          cb(new Error())
        })
        .log()
        .catch(resolve);
    });
  });

  it('should allow committers to return a promise', () => {
    return new Promise((resolve) => {
      const logger = woody
        .as(woody.bracketed())
        .to((level, message) => {
          return Promise.reject(new Error())
        })
        .log()
        .catch(resolve);
    });
  });

  it('should cull logs based on it\'s `conditionals', () => {
    const logs = [];
    const logger = woody
      .as(woody.bracketed())
      .to((level, msg) => {
        logs.push({ level, msg });
      });

    logger
      .if(level => level > woody.level.DEBUG)
      .fatal()
      .error()
      .warn()
      .info()
      .debug()
      .trace();

    assert.strictEqual(logs.length, 4);
    assert.strictEqual(logs[0].level, woody.level.FATAL);
    assert.strictEqual(logs[1].level, woody.level.ERROR);
    assert.strictEqual(logs[2].level, woody.level.WARN);
    assert.strictEqual(logs[3].level, woody.level.INFO);
  });

  it('should short-cuit conditionals', () => {
    var i = 0;
    const logs = [];
    const logger = woody
      .as(woody.bracketed())
      .to((level, msg) => {
        i += 1;
        logs.push({ level, msg });
      });

    logger
      .if(level => level > woody.level.DEBUG)
      .if(level => i < 3)
      .trace()
      .trace()
      .trace()
      .info()
      .info()
      .info()
      .info();

    assert.strictEqual(logs.length, 3);
    assert.strictEqual(logs[0].level, woody.level.INFO);
    assert.strictEqual(logs[1].level, woody.level.INFO);
    assert.strictEqual(logs[2].level, woody.level.INFO);
  });
});

describe('Built-in combinator', () => {
  describe('Timestamped', () => {
    it('should render timestamps', () => {
      const stamps = [];
      const logger = woody
        .as((level, [ stamp ], message) => {
          stamps.push(stamp);
        })
        .to(woody.nowhere);

      logger.fork(woody.timestamp()).log()
      logger.fork(woody.timestamp('YYYY')).log();

      assert(moment(stamps[0]));
      assert.strictEqual(stamps[1], new Date().getFullYear().toString());
    });
  });

  describe('Level', () => {
    it('should render the level', () => {
      const levels = [];
      const logger = woody
        .as((_, [ level ], message) => {
          levels.push(level);
        })
        .to(woody.nowhere)
        .fork(woody.level())
        .fatal()
        .error()
        .warn()
        .info()
        .debug()
        .trace();

      assert.strictEqual(levels[0], 'FATAL');
      assert.strictEqual(levels[1], 'ERROR');
      assert.strictEqual(levels[2], 'WARN');
      assert.strictEqual(levels[3], 'INFO');
      assert.strictEqual(levels[4], 'DEBUG');
      assert.strictEqual(levels[5], 'TRACE');
    });
  });
});

describe('Chain operations:', () => {
  describe('`Logger#sequence`', () => {
    it('should invoke the current logger first, then the second', () => {
      let x = null;

      const logger1 = woody
        .as(woody.bracketed())
        .to((level, rendered) => { x = 'foo'; });

      const logger2 = woody
        .as(woody.bracketed())
        .to((level, rendered) => {
          assert.notStrictEqual(x, null);
        });

      const logger3 = logger1.sequence(logger2);
      logger3.log('test');
      assert.notStrictEqual(x, null);
    });
  });
});
