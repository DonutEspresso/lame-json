/*
 * try-json
 * Module that attempts to parse string values of an object into JSON.
 *
 * Copyright (c) 2015 Netflix
 * Licensed under the MIT license.
 */

'use strict';

var _           = require('lodash'),
    safeParse   = require('safe-json-parse/tuple');

// default parsing options
var DEFAULT_OPTIONS = {
    boolean: true,
    integer: true,
    array: true,
    object: true
};


/**
Loop through all key/val pairs and attempt to JSON
parse those values.
@public
@method tryParse
@return {Object} an object with key/val pairs where vals are all strings that could be JSON.
@return {Object} an instance of RestModel
*/
function tryParse(data, options) {
    var opt = {},
        newData = {};

    // if options wasn't passed in, set it to the defaults
    if (!options) {
        opt = DEFAULT_OPTIONS;
    } else {
        // otherwise, loop through the passed in options
        // and fill in any missing values with defaults
        _.forOwn(options, function normalizeOptions(val, key) {
            // if passed in option not undefined, copy it
            if (typeof val !== 'undefined') {
                opt[key] = val;
            } else {
                // otherwise use the default value
                opt[key] = DEFAULT_OPTIONS[key];
            }
        });
    }

    // loop through the key/val pairs
    _.forOwn(data, function parseJson(val, key) {
        // If the key is a string, let's try to parse it.
        if (_.isString(val)) {

            // if parsing boolean option is true,
            // and val is true or false, make it a boolean
            if (opt.boolean === true) {
                if (val === 'true') {
                    newData[key] = true;
                } else if (val === 'false') {
                    newData[key] = false;
                }
            }

            if (opt.integer === true) {
                var parsed = parseInt(val, 10);

                if (parsed.toString().length === val.length) {
                    newData[key] = parsed;
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
                        newData[key] = parsedTuple[1];
                    }
                }
            }

        }

        // if by this point we don't have a value, use the existing value
        if (typeof newData[key] === 'undefined') {
            newData[key] = val;
        }
    });

    return newData;
}


module.exports.parse = tryParse;