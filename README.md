# lame-json

[![NPM Version](https://img.shields.io/npm/v/lame-json.svg)](https://npmjs.org/package/lame-json)
[![Build Status](https://travis-ci.org/DonutEspresso/lame-json.svg?branch=master)](https://travis-ci.org/DonutEspresso/lame-json)
[![Coverage Status](https://coveralls.io/repos/DonutEspresso/lame-json/badge.svg?branch=master)](https://coveralls.io/r/DonutEspresso/lame-json?branch=master)
[![Dependency Status](https://david-dm.org/DonutEspresso/lame-json.svg)](https://david-dm.org/DonutEspresso/lame-json)
[![devDependency Status](https://david-dm.org/DonutEspresso/lame-json/dev-status.svg)](https://david-dm.org/DonutEspresso/lame-json#info=devDependencies)
[![bitHound Score](https://www.bithound.io/github/DonutEspresso/lame-json/badges/score.svg)](https://www.bithound.io/github/DonutEspresso/lame-json/master)

> Module that attempts to parse string values of an object into JSON.


## Getting Started

Install the module with: `npm install lame-json`


## Documentation

Sometimes JSON comes back with values as a string.

```js
{
    "foo": "true",
    "bar": "123",
    "baz": "{\"hello\":\"world\"}",
    "qux": "[ 1, 2, 3 ]"
}
```

In some cases, these values are meant to be parsed into primitives or native JS objects:

```js
{
    "foo": true,
    "bar": 123,
    "baz": {
        "hello": "world"
    },
    "qux": [ 1, 2, 3 ]
}
```

This module helps you do that.


## Examples

Usage is very straight forward:

```js
var lameJson = require('lame-json');
var data = {
    "foo": "true",
    "bar": "123",
    "baz": "{\"hello\":\"world\"}"
    }
}

var newData = lameJson.parseJson(data);

/*
=> {
    "foo": true,
    "bar": 123,
    "baz": {
        "hello": "world"
    }
}
*/
```

If a value cannot be parsed out of the string, the original value is returned:

```js

var newData = lameJson.parseJson({
    "foo": "[ 1, 2, 3 }"
});

// => { "foo": "[ 1, 2, 3 }" }
```


## API

### parseJson(obj, [options])
* `options.boolean` _{Boolean}_ - If true, parses booleans. Defaults to true.
* `options.float` _{Boolean}_ - If true, parses ints and floats. Defaults to true. This only works when the length of the string is also the number of digits in the parsed number.
* `options.array` _{Boolean}_ - If true, attempts parse arrays. Defaults to true.
* `options.object` _{Boolean}_ - If true, attempts to parse objects. Defaults to true.

__Returns:__ _{Object}_ a new object with possibly parsed values.


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

To start contributing, install the git pre-push hooks:

```sh
npm run githook
```

Before committing, lint and test your code using the included gulpfile.js:
```sh
npm run test
npm run build
```

## License

Copyright (c) 2015 Alex Liu.

Licensed under the MIT license.
