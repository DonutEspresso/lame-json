# try-json

> Module that attempts to parse string values of an object into JSON.


## Getting Started

Install the module with: `npm install try-json`


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

In some cases, these values are meant to be parsed into JS primitives:

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
var tryJson = require('try-json');
var data = {
    "foo": "true",
    "bar": "123",
    "baz": "{\"hello\":\"world\"}"
    }
}

var newData = tryJson.parseJson(data);
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

var newData = tryJson.parseJson({
    "foo": "[ 1, 2, 3 }"
});

// => { "foo": "[ 1, 2, 3 }" }
```


## API

### parseJson(obj, [options])
* `options.boolean` _{Boolean}_ - If true, parses booleans. Defaults to true.
* `options.integer` _{Boolean}_ - If true, parses ints. Defaults to true. This only works when the length of the string is also the number of digits in the parsed number.
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

Copyright (c) 2015 Netflix.

Licensed under the MIT license.
