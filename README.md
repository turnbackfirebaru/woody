[![npm version](https://badge.fury.io/js/woody.svg)](http://badge.fury.io/js/woody)
[![Build Status](https://travis-ci.org/felixSchl/woody.svg?branch=master)](https://travis-ci.org/felixSchl/woody)

> Tiny logging combinator library for node

```javascript
import woody from 'woody';
const logger = woody
    .as(woody.bracketed())
    .to(woody.console)
    .fork(woody.level())
    .fork(woody.timestamp())
    .fork('woody');

logger.warn('foo', 'bar'); // => [WARN][2015-06-02 ...][woody] foo bar
```

## Installation

```bash
$ npm install --save woody
```

## Usage

The idea of woody is to make it as easy as possible to contextualize logging.
The application or library using woody could have a root logger and then pass
"contextualized" sub-loggers into different areas of the codebase.

The `.log(...)` and friends are semantically identical with the `console.log`
function and has a straight forward mapping provided by `woody.console`.

The `.fork(...)` function takes either a string or a function and creates a
**new logger** with the new context pushed onto it's context stack. The old
logger remains in tact and operationally independent; It can be used as before.

The `.if(...)` function takes either a log level to "set the bar" and cull any
levels lower than the given level, or a function that is evaluated on each
log application.

> :warning: Note that since functions can capture state at site of definition,
> threading down a function may not be a great idea. It's best used for internal
> loggers or where the function does not reference any outer state, such as e.g.
> a timestamped logger.

### Levels

Levels are directly taken from `Log4j` for consistency:

```javascript
const Level = {
  FATAL: 50000 // => Logger#fatal(...)
  ERROR: 40000 // => Logger#error(...)
  WARN:  30000 // => Logger#warn(...)
  INFO:  20000 // => Logger#info(...)
  DEBUG: 10000 // => Logger#debug(...)
  TRACE:  5000 // => Logger#trace(...)
};
```

### Application domains

The `.fork(...)` function lends itself very well to creating application or
library domain specific loggers:

```javascript
import woody from 'woody';

class Foo {
  constructor(logger=woody.noop) {
    logger.info('created');
  }
}

class Application {
  constructor() {
    const logger = woody
      .as(woody.bracketed())
      .to(woody.console)
      .fork('app');
    logger.info('created');
    const foo = new Foo(logger.fork('foo'));
  }
}
```

Now:

```javascript
const app = new Application();
```

Will print the following to the console:

```
> [app] created
> [app][foo] created
```

### Culling

Woody allows to conditionally cull logs from a logger. It takes either a
function or a log level to determine when to cull a log request.

```javascript
import woody from 'woody';

const logger = woody
  .as(woody.bracketed())
  .to(woody.console)
  .fork(woody.level())
  .if(woody.level.INFO);

logger.warn('foo')  // => [WARN] foo
logger.info('foo')  // => [INFO] foo
logger.debug('foo') // =>
logger.trace('foo') // =>
```

Culling works the same way `&&` would work, consider:

```javascript
import woody from 'woody';

let shouldlog = true;
const logger = woody
  .as(woody.bracketed())
  .to(woody.console)
  .fork(woody.level())
  .if(woody.level.INFO)
  .if(() => shouldLog);

logger.warn('foo')  // => [WARN] foo
logger.info('foo')  // => [INFO] foo
logger.debug('foo') // =>
logger.trace('foo') // =>

shouldlog = false;

logger.warn('foo')  // =>
logger.info('foo')  // =>
logger.debug('foo') // =>
logger.trace('foo') // =>
```

This could, for example, make it easy to restrict logging at the top level
and add more fine grained control later, but since it's essentially a binary
`&&` operation, any consecutive `if` can only further restrict.

### Fallback to `noop`

Woody ships with a `noop` logger, that literally does nothing but satisfies the
logger interface, such that application code does not have to null-check:

```javascript
// ES5
function foo(bar, logger) {
  logger = logger || woody.noop;
  logger.info('test');
}

// ES6+
function foo(bar, logger=woody.noop) {
  logger.info('test');
}
```

> :warning: `noop` only means it does not render or commit anything.
> Sequencing it with another logger using `.sequence` will *not* return a `noop`
> logger, but a logger that applies both the `noop` and the second logger.

### Integration with `debug`

There is out-of-the-box integration with the [debug](https://www.npmjs.com/package/debug)
package on npm:

```javascript
import woody from 'woody';

const debug = woody.debug().fork('woody')
    , debugFoo = debug.fork('foo');

debug.log('foo');
debugFoo.log('qux');
debug.log('bar');
debugFoo.log('biz');

```

yields

>   <strong style="color:orange">woody</strong> foo +0ms<br/>
>   <strong style="color:#5a2">woody:foo</strong> qux +1ms<br/>
>   <strong style="color:orange">woody</strong> bar +2ms<br/>
>   <strong style="color:#5a2">woody:foo</strong> biz +3ms
