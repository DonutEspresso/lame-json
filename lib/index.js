/*
 * lame-json
 * Module that attempts to parse string values of an object into JSON.
 *
 * Copyright (c) 2015 Alex Liu
 * Licensed under the MIT license.
 */


/*

Sometimes JSON comes back with values as a string:

{
    "foo": "true",
    "bar": "123",
    "baz": "{\"hello\":\"world\"}",
    "qux": "[ 1, 2, 3 ]"
}
```

In some cases, these values are meant to be parsed into JS primitives:

{
    "foo": true,
    "bar": 123,
    "baz": {
        "hello": "world"
    },
    "qux": [ 1, 2, 3 ]
}

This module helps you do that.

*/


'use strict';

var _           = require('lodash');
var safeParse   = require('safe-json-parse/tuple');

// const
var DEFAULT_OPTIONS = {
    boolean: true,
    float: true,
    array: true,
    object: true
};



/**
 * normalize options values
 * @private
 * @method normalizeOptions
 * @param {Object} options an options object
 * @return {Object} a normalized options object
*/
function normalizeOptions(options) {

    // if options wasn't passed in, set it to the defaults
    if (!options) {
        return DEFAULT_OPTIONS;
    } else {
        // otherwise, loop through the passed in options
        // and fill in any missing values with defaults
        return _.reduce(DEFAULT_OPTIONS, function normalize(acc, val, key) {
            // if passed in option not undefined, copy it
            if (typeof options[key] !== 'undefined') {
                acc[key] = options[key];
            } else {
                // otherwise use the default value
                acc[key] = DEFAULT_OPTIONS[key];
            }

            return acc;
        }, {});
    }
}



/**
 * Loop through all key/val pairs,
 * and attempt to JSON parse those values.
 * @public
 * @method parseJson
 * @param {Object} data an object with key/val pairs where vals are strings that could be JSON.
 * @param {Object} options an options object
 * @return {Object} a possibly parsed JSON object
 */
function parseJson(data, options) {
    var opt = normalizeOptions(options);

    // loop through the key/val pairs
    return _.reduce(data, function parse(acc, val, key) {

        var parsed;

        // If the key is a string, let's try to parse it.
        if (_.isString(val)) {

            // if parsing boolean option is true,
            // and val is true or false, make it a boolean
            if (opt.boolean === true) {
                if (val === 'true') {
                    acc[key] = true;
                } else if (val === 'false') {
                    acc[key] = false;
                }
            }

            if (opt.float === true) {
                parsed = parseFloat(val);

                if (parsed.toString().length === val.length) {
                    acc[key] = parsed;
                }
            }

            // if parsing arrays or objects is true, let's do some more magic.
            if (opt.array === true || opt.object === true) {
                // it's possible the string might be a JSON value.
                // check if first or last characters are {}, [].
                if ((val[0] === '[' && val[val.length - 1] === ']') ||
                   (val[0] === '{' && val[val.length - 1] === '}')) {

                    var parsedTuple = safeParse(val);
                    // if parse didn't throw, use the value we got.
                    if (!parsedTuple[0]) {
                        acc[key] = parsedTuple[1];
                    }
                }
            }

        }

        // if by this point we don't have a value, use the existing value
        if (typeof acc[key] === 'undefined') {
            acc[key] = val;
        }

        return acc;
    }, {});
}


module.exports.parseJson = parseJson;
