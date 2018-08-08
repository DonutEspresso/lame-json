# lame-json

[![NPM Version](https://img.shields.io/npm/v/lame-json.svg)](https://npmjs.org/package/lame-json)
[![Build Status](https://travis-ci.org/DonutEspresso/lame-json.svg?branch=master)](https://travis-ci.org/DonutEspresso/lame-json)
[![Coverage Status](https://coveralls.io/repos/DonutEspresso/lame-json/badge.svg?branch=master)](https://coveralls.io/r/DonutEspresso/lame-json?branch=master)
[![Dependency Status](https://david-dm.org/DonutEspresso/lame-json.svg)](https://david-dm.org/DonutEspresso/lame-json)
[![devDependency Status](https://david-dm.org/DonutEspresso/lame-json/dev-status.svg)](https://david-dm.org/DonutEspresso/lame-json#info=devDependencies)

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

In some cases, these values are meant to be parsed into primitives or native JS
objects:

```js
{
    foo: true,
    bar: 123,
    baz: {
        "hello": "world"
    },
    qux: [ 1, 2, 3 ]
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

var newData = lameJson.parseJson(data);

/*
=> {
    foo: true,
    bar: 123,
    baz: {
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

If you want to parse a specific string value:

```js
var newData = lameJson.parse('[1, 2, 3]');

// => [1, 2, 3]
```

If you want to parse many times using the same options, you can use the
factory method returned by the module. The factory method accepts a set of
options, which are then used to create a parser object that always uses those
options:

```js
var parser = lameJson({
    boolean: false
});

parser.parse('[1, 2, 3]');
// => [1, 2, 3]

parser.parse('false');
// => 'false'

parser.parseJson({
    "foo": "true",
    "bar": "123",
});
/*
=> {
    foo: 'true',
    bar: 123,
}
*/
```


## API


### lameJson(options)
Creates a lameJson parser object that alwayhs uses the passed in options. If
you only need to use the functions once or twice, you can use the static
functions documented below.

* `options.boolean` _{Boolean}_ - If true, parses booleans. Defaults to true.
* `options.float` _{Boolean}_ - If true, parses ints and floats. Defaults to true. This only works when the full string is used during parsing (e.g `123foo` would be ignored)
* `options.exponential` _{Boolean}_ - If true, parses exponential numbers such as `2e2`. Defaults to false. This only works when the full string is used during parsing (e.g `2e2foo` would be ignored)
* `options.array` _{Boolean}_ - If true, attempts parse arrays. Defaults to true.
* `options.object` _{Boolean}_ - If true, attempts to parse objects. Defaults to true.

__Returns:__ _{Object}_ a parser object with two methods, parseJson and parse

### lameJson.parseJson(obj [, options])
Try to parse string values out of JSON values. You can use this in place of
`JSON.parse()`. Options are the same as above.

__Returns:__ _{Object}_ a new object with possibly parsed values.

### lameJson.parse(str [, options])
Try to parse a possible value out of a string. This is the underlying
implementation used by `parseJson()`. Options are the same as above.

__Returns:__ _{Object}_ a new object with possibly parsed values.


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality.

To start contributing, install the git pre-push hooks:

```sh
make githooks
```

Before committing, lint and test your code:
```sh
make prepush
```

## License

Copyright (c) 2018 Alex Liu.

Licensed under the MIT license.
