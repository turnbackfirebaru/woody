# Woody

[![Build Status](https://travis-ci.org/felixSchl/woody.svg?branch=master)](https://travis-ci.org/felixSchl/woody)

> Tiny logging combinator library for node

```javascript
import woody from './woody';
const logger = woody
    .bracketed()
    .to(woody.console);
    .level()
    .timestamped()
    .context('woody');

logger.warn('Good stuff');

// console:
// [WARN][2015-06-02 ...][woody]  Good stuff
```

## Installation

```bash
$ npm install --save woody
```

## Usage

The idea of woody is to make it as easily as possible to contextualize logging.

The `.context()` function takes either a string or a function and creates a
**new logger** with the new context pushed onto it's context stack. The old
logger remains in tact and operationally independent; It can be used as before.

> :warning: Note that since functions can capture state at site of definition,
> threading down a function may not be a great idea. It's best used for internal
> loggers or where the function does not reference any outer state, such as e.g.
> a timestamped logger.
