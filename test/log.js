'use strict';

var log = require('..')
  , _ = require('lodash')
  , moment = require('moment')
  , assert = require('assert');

/**
 * Install source maps.
 */

require('source-map-support').install();

describe('A', function() {

  var logs = [];
  beforeEach(function() {
    logs.length = 0;
  });

  var validate = function(expected) {
    expected = _.chunk(expected, 2);
    assert.strictEqual(expected.length, logs.length);
    _.each(
      expected
    , function(x, i) {
        assert.strictEqual(x[0], logs[i].level);
        assert.strictEqual(x[1], logs[i].message);
      });
  };

  describe('baseline logger', function() {
    it('logs level and message', function() {
      var logger = log.bracketed().to(function(level, message) {
        logs.push({ level: level, message: message });
      });

      logger.info('foo-0');
      logger.warn('foo-1');
      logger.error('foo-2');
      logger.verbose('foo-3');
      logger.debug('foo-4');
      logger.trace('foo-5');
      logger.log('foo-6');

      validate(
        [ 'info', 'foo-0'
        , 'warn', 'foo-1'
        , 'error', 'foo-2'
        , 'verbose', 'foo-3'
        , 'debug', 'foo-4'
        , 'trace', 'foo-5'
        , 'log', 'foo-6' ]);
    });
  });

  describe('contextualized logger', function() {
    it('stacks it\'s contexts', function() {
      var logger = log
        .as(function(level, contexts, message) { logs.push(contexts); })
        .to(log.nowhere);

      logger.log();
      logger.context('ctx').info();
      logger.log();
      logger.context('ctx').context('foo').context('bar').log();

      var i = 0
        , f = logger.context(function() { return '' + (i++); });
      _.times(2, f.log.bind(f));

      var expected = [
        []
      , [ 'ctx' ]
      , []
      , [ 'ctx', 'foo', 'bar' ]
      , [ '0' ]
      , [ '1' ] ];

      assert.strictEqual(expected.length, logs.length);
      _.each(_.zip(expected, logs), _.spread(function(ex, actual) {
        assert.strictEqual(ex.length, actual.length);
        _.each(_.zip(ex, actual), _.spread(function(exName, actualName) {
          assert.strictEqual(exName, actualName);
        }));
      }));
    });
  });

  describe('Built-in logging combinators', function() {
    var logger = null;
    beforeEach(function() {
      logger = log.bracketed().to(function(level, message) {
        logs.push({ level: level, message: message });
      });
    });

    describe('Timestamped', function() {
      it('Renders timestamps', function() {
        var loggerTimed = logger.timestamped();
        loggerTimed.log('test');
        var date = _.takeWhile(
          _.drop(logs[0].message, 1)
        , function(c) { return c !== ']'; }).join('');
        assert(moment(date));
      });
    });

    describe('Level', function() {
      it('Renders levels', function() {
        var loggerLevel = logger.level();
        loggerLevel.log('test');
        var level = _.takeWhile(
          _.drop(logs[0].message, 1)
        , function(c) { return c !== ']'; }).join('');
        assert(level === 'LOG');
      });
    });
  });

  describe('Sequencing', function() {
    describe('Logger.sequence', function() {
      it('invokes the current logger first, and then the second', function() {
        var x = null;
        var msgs = [];
        var logger1 = log
          .bracketed()
          .to(function() {
            assert.strictEqual(x, null);
            x = 10;
          });

        var logger2 = log
          .bracketed()
          .to(function() {
            assert.notStrictEqual(x, null);
          });

        var logger3 = logger1.sequence(logger2);

        logger3.log('test');

        assert.notStrictEqual(x, null);
      });
    });
  });
});