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

const safeParse = require('safe-json-parse/tuple');
const lodash = require('lodash');

// const
const DEFAULT_OPTIONS = {
    boolean: true,
    float: true,
    exponential: false,
    array: true,
    object: true
};

const EXPONENTIAL_REGEX = /^[\-+]?[\d]*\.?[\d]*e[+\-]?[\d]+$/;

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
        // otherwise, loop through the passed in options and fill in any
        // missing values with defaults
        let key;
        const opts = {};

        for (key in DEFAULT_OPTIONS) {
            if (DEFAULT_OPTIONS.hasOwnProperty(key)) {
                const defaultVal = DEFAULT_OPTIONS[key];

                // if passed in option not undefined, copy it
                if (typeof options[key] !== 'undefined') {
                    opts[key] = options[key];
                } else {
                    // otherwise use the default value
                    opts[key] = defaultVal;
                }
            }
        }

        return opts;
    }
}

/**
 * Loop through all key/val pairs,
 * and attempt to JSON parse those values.
 * @public
 * @method parseJson
 * @param {Object} data an object with key/val pairs where vals are strings
 * that could be JSON.
 * @param {Object} options an options object
 * @param {Boolean} normalized if true, options are already normalized.
 * @return {Object} a possibly parsed JSON object
 */
function parseJson(data, options, normalized) {
    let key;
    const parsed = {};

    // loop through the key/val pairs
    for (key in data) {
        if (data.hasOwnProperty(key)) {
            parsed[key] = parse(data[key], options, normalized);
        }
    }

    return parsed;
}

/**
 * parse a value out of a string, maybe
 * @private
 * @function parse
 * @param {String} val input string to parse
 * @param {Object} options an options obj
 * @param {Boolean} normalized if true, options are already normalized.
 * @return {Object | String | Boolean | Number} anything!
 */
function parse(val, options, normalized) {
    // if input is not a string, return it right away.
    if (typeof val !== 'string') {
        return val;
    }

    const opts = normalized === true ? options : normalizeOptions(options);

    if (opts.boolean === true) {
        if (val === 'true') {
            return true;
        } else if (val === 'false') {
            return false;
        }
    }

    if (opts.float === true && val.length > 0) {
        const isExponential = EXPONENTIAL_REGEX.test(val);

        // if we are not parsing exponentials, return exponentials as a string
        if (isExponential && opts.exponential === false) {
            return val;
        }

        const num = lodash.toNumber(val);
        if (isFinite(num)) {
            return num;
        }
    }

    // if parsing arrays or objects is true, let's do some more magic.
    if (opts.array === true || opts.object === true) {
        // it's possible the string might be a JSON value.
        // check if first or last characters are {}, [].
        const firstChar = val[0];
        const lastChar = val[val.length - 1];

        if (
            (firstChar === '[' && lastChar === ']') ||
            (firstChar === '{' && lastChar === '}')
        ) {
            const parsedTuple = safeParse(val);
            // if parse didn't throw, use the value we got.
            if (!parsedTuple[0]) {
                return parsedTuple[1];
            }
        }
    }

    // if we reached here, then return original string value
    return val;
}

module.exports = function factory(options) {
    const opts = normalizeOptions(options);

    return {
        parseJson: function parseJsonWithOptions(val) {
            return parseJson(val, opts, true);
        },
        parse: function parseWithOptions(val) {
            return parse(val, opts, true);
        }
    };
};
module.exports.parseJson = parseJson;
module.exports.parse = parse;
