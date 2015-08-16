# Woody

[![npm version](https://badge.fury.io/js/woody.svg)](http://badge.fury.io/js/woody)
[![Build Status](https://travis-ci.org/felixSchl/woody.svg?branch=master)](https://travis-ci.org/felixSchl/woody)

> Tiny logging combinator library for node

```javascript
import woody from './woody';
const logger = woody
    .bracketed()
    .to(woody.console);
    .push(woody.level())
    .push(woody.timestamp())
    .push('woody');

logger.warn('Good stuff');

// console:
// [WARN][2015-06-02 ...][woody]  Good stuff
```

## Installation

```bash
$ npm install --save woody
```

## Usage

The idea of woody is to make it as easy as possible to contextualize logging.
The application or library using woody could have a root logger and then pass
"contextualized" sub-loggers into different areas of the codebase.

The `.push(...)` function takes either a string or a function and creates a
**new logger** with the new context pushed onto it's context stack. The old
logger remains in tact and operationally independent; It can be used as before.

> :warning: Note that since functions can capture state at site of definition,
> threading down a function may not be a great idea. It's best used for internal
> loggers or where the function does not reference any outer state, such as e.g.
> a timestamped logger.


### Application domains

The `.push(...)` function lends itself very well to creating application or
library domain specific loggers:

```javascript
class Foo {
  constructor(logger=woody.noop) {
    logger.info('created');
  }
}

class Application {
  constructor() {
    const logger = woody
      .bracketed()
      .to(woody.console)
      .push('app');
    logger.info('created');
    const foo = new Foo(logger.push('foo'));
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

const debug = woody.debug().push('woody')
    , debugFoo = debug.push('foo');

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
