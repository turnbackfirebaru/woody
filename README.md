# Beaver

[![Build Status](https://travis-ci.org/felixSchl/beaver.svg?branch=master)](https://travis-ci.org/felixSchl/beaver)

> Tiny logging combinator library for node

:construction: ...work in progress... :construction:

```javascript
import beaver from './beaver';
const logger = beaver
    .bracketed()
    .to(beaver.console);
    .level()
    .timestamped()
    .context('beaver');

logger.warn('Good stuff');

// console:
// [WARN][2015-06-02 ...][beaver]  Good stuff
```

## Installation

```bash
$ npm install --save beaver # XXX not just yet
```

## Usage

The idea of beaver is to make it as easily as possible to contextualize logging.

The `.context()` function takes either a string or a function and creates a
**new logger** with the new context pushed onto it's context stack. The old
logger remains in tact and operationally independent; It can be used as before.

> :warning: Note that since functions can capture state at site of definition,
> threading down a function may not be a great idea. It's best used for internal
> loggers or where the function does not reference any outer state, such as e.g.
> a timestamped logger.
