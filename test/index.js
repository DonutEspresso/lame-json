'use strict';

// external modules
const _ = require('lodash');
const assert = require('chai').assert;

// internal files
const lameJson = require('../lib/index.js');

describe('lame-json node module.', function() {
    const goodData = {
        foo: true,
        raz: false,
        bar: 123,
        baz: {
            hello: 'world'
        },
        qux: [1, 2, 3],
        xul: '1.2.3',
        zub: 45.66,
        buz: '1e6',
        fooString: 'foo',
        infinity: '240e1234',
        exponential: '2e2',
        negative: -2,
        negativeFloat: -2.2,
        badNumberInExponent: '53.3.5e3',
        emptyString: ''
    };
    const stringData = {
        foo: 'true',
        raz: 'false',
        bar: '123',
        baz: '{"hello": "world"}',
        qux: '[1, 2, 3]',
        xul: '1.2.3',
        zub: '45.66',
        buz: '1e6',
        fooString: 'foo',
        infinity: '240e1234',
        exponential: '2e2',
        notANumber: '.',
        leadingDot: '.22',
        endingDot: '22.',
        positiveExponent: '2e+2',
        negativeExponent: '2e-2',
        negative: '-2',
        negativeFloat: '-2.2',
        negativeNumberWithExponent: '-2e2',
        badNumberInExponent: '53.3.5e3',
        exponentWithoutNumber: 'e2',
        emptyString: ''
    };

    it('should return JSON object as is', function() {
        const newData = lameJson.parseJson(goodData);

        _.forEach(_.keys(newData), function(key) {
            assert.strictEqual(newData[key], goodData[key]);
        });
    });

    it('should return parsed JSON', function() {
        const newData = lameJson.parseJson(stringData);

        assert.strictEqual(newData.foo, true);
        assert.strictEqual(newData.raz, false);
        assert.strictEqual(newData.bar, 123);
        assert.strictEqual(newData.baz.hello, 'world');
        assert.strictEqual(newData.qux[0], 1);
        assert.strictEqual(newData.qux[1], 2);
        assert.strictEqual(newData.qux[2], 3);
        assert.strictEqual(newData.xul, '1.2.3');
        assert.strictEqual(newData.zub, 45.66);
        assert.strictEqual(newData.buz, '1e6');
        assert.strictEqual(newData.infinity, '240e1234');
        assert.strictEqual(newData.exponential, '2e2');
        assert.strictEqual(newData.notANumber, '.');
        assert.strictEqual(newData.leadingDot, 0.22);
        assert.strictEqual(newData.endingDot, 22);
        assert.strictEqual(newData.positiveExponent, '2e+2');
        assert.strictEqual(newData.negativeExponent, '2e-2');
        assert.strictEqual(newData.negative, -2);
        assert.strictEqual(newData.negativeFloat, -2.2);
        assert.strictEqual(newData.negativeNumberWithExponent, '-2e2');
        assert.strictEqual(newData.badNumberInExponent, '53.3.5e3');
        assert.strictEqual(newData.exponentWithoutNumber, 'e2');
        assert.strictEqual(newData.emptyString, '');
    });

    it('should not parse JSON with options set to false', function() {
        const newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false,
            array: false,
            object: false
        });

        assert.deepEqual(newData, stringData);
    });

    it('should parse exponential strings when option set to true', function() {
        const newData = lameJson.parseJson(stringData, {
            exponential: true
        });

        assert.strictEqual(newData.buz, 1e6);
        assert.strictEqual(newData.exponential, 2e2);
        assert.strictEqual(newData.notANumber, '.');
        assert.strictEqual(newData.leadingDot, 0.22);
        assert.strictEqual(newData.endingDot, 22);
        assert.strictEqual(newData.positiveExponent, 2e2);
        assert.strictEqual(newData.negativeExponent, 2e-2);
        assert.strictEqual(newData.negative, -2);
        assert.strictEqual(newData.negativeFloat, -2.2);
        assert.strictEqual(newData.negativeNumberWithExponent, -200);
        assert.strictEqual(newData.badNumberInExponent, '53.3.5e3');
        assert.strictEqual(newData.exponentWithoutNumber, 'e2');
        assert.strictEqual(newData.emptyString, '');
    });

    it('should parse partial JSON', function() {
        const newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false
        });

        assert.strictEqual(newData.foo, 'true');
        assert.strictEqual(newData.raz, 'false');
        assert.strictEqual(newData.bar, '123');
        assert.strictEqual(newData.baz.hello, 'world');
        assert.strictEqual(newData.qux[0], 1);
        assert.strictEqual(newData.qux[1], 2);
        assert.strictEqual(newData.qux[2], 3);
        assert.strictEqual(newData.xul, '1.2.3');
        assert.strictEqual(newData.zub, '45.66');
        assert.strictEqual(newData.buz, '1e6');
        assert.strictEqual(newData.infinity, '240e1234');
        assert.strictEqual(newData.exponential, '2e2');
        assert.strictEqual(newData.notANumber, '.');
        assert.strictEqual(newData.leadingDot, '.22');
        assert.strictEqual(newData.endingDot, '22.');
        assert.strictEqual(newData.positiveExponent, '2e+2');
        assert.strictEqual(newData.negativeExponent, '2e-2');
        assert.strictEqual(newData.negative, '-2');
        assert.strictEqual(newData.negativeFloat, '-2.2');
        assert.strictEqual(newData.negativeNumberWithExponent, '-2e2');
        assert.strictEqual(newData.badNumberInExponent, '53.3.5e3');
        assert.strictEqual(newData.exponentWithoutNumber, 'e2');
        assert.strictEqual(newData.emptyString, '');
    });

    it('should create instance with persistent options', function() {
        const lame = lameJson({
            boolean: false,
            float: false
        });

        assert.strictEqual(lame.parse('false'), 'false');
        assert.strictEqual(lame.parse('true'), 'true');
        assert.strictEqual(lame.parse('1.2.3'), '1.2.3');

        const qux = lame.parse(goodData.qux);
        assert.strictEqual(qux[0], 1);
        assert.strictEqual(qux[1], 2);
        assert.strictEqual(qux[2], 3);

        const newData = lame.parseJson(stringData, {
            boolean: false,
            float: false
        });

        assert.strictEqual(newData.foo, 'true');
        assert.strictEqual(newData.raz, 'false');
        assert.strictEqual(newData.bar, '123');
        assert.strictEqual(newData.baz.hello, 'world');
        assert.strictEqual(newData.qux[0], 1);
        assert.strictEqual(newData.qux[1], 2);
        assert.strictEqual(newData.qux[2], 3);
        assert.strictEqual(newData.xul, '1.2.3');
        assert.strictEqual(newData.zub, '45.66');
        assert.strictEqual(newData.buz, '1e6');
        assert.strictEqual(newData.infinity, '240e1234');
        assert.strictEqual(newData.exponential, '2e2');
        assert.strictEqual(newData.notANumber, '.');
        assert.strictEqual(newData.leadingDot, '.22');
        assert.strictEqual(newData.endingDot, '22.');
        assert.strictEqual(newData.positiveExponent, '2e+2');
        assert.strictEqual(newData.negativeExponent, '2e-2');
        assert.strictEqual(newData.negative, '-2');
        assert.strictEqual(newData.negativeFloat, '-2.2');
        assert.strictEqual(newData.negativeNumberWithExponent, '-2e2');
        assert.strictEqual(newData.badNumberInExponent, '53.3.5e3');
        assert.strictEqual(newData.exponentWithoutNumber, 'e2');
        assert.strictEqual(newData.emptyString, '');
    });
});
