'use strict';

// external modules
var _        = require('lodash');
var assert   = require('chai').assert;

// internal files
var lameJson = require('../lib/index.js');


describe('lame-json node module.', function() {

    var goodData = {
        foo: true,
        raz: false,
        bar: 123,
        baz: {
            hello: 'world'
        },
        qux: [ 1, 2, 3 ],
        xul: '1.2.3',
        zub: 45.66,
        buz: '1e6',
        fooString: 'foo',
        infinity: '240e1234'
    };
    var stringData = {
        foo: 'true',
        raz: 'false',
        bar: '123',
        baz: '{\"hello\": \"world\"}',
        qux: '[1, 2, 3]',
        xul: '1.2.3',
        zub: '45.66',
        buz: '1e6',
        fooString: 'foo',
        infinity: '240e1234'
    };

    it('should return JSON object as is', function() {
        var newData = lameJson.parseJson(goodData);

        _.forEach(_.keys(newData), function(key) {
            assert.equal(goodData[key], newData[key]);
        });
    });

    it('should return parsed JSON', function() {
        var newData = lameJson.parseJson(stringData);

        assert.equal(newData.foo, true);
        assert.equal(newData.raz, false);
        assert.equal(newData.bar, 123);
        assert.equal(newData.baz.hello, 'world');
        assert.equal(newData.qux[0], 1);
        assert.equal(newData.qux[1], 2);
        assert.equal(newData.qux[2], 3);
        assert.equal(newData.xul, '1.2.3');
        assert.equal(newData.zub, 45.66);
        assert.equal(newData.buz, '1e6');
        assert.equal(newData.infinity, '240e1234');
        assert.equal(typeof newData.infinity, 'string');
    });

    it('should not parse JSON with options set to false', function() {
        var newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false,
            array: false,
            object: false
        });

        assert.deepEqual(newData, stringData);
    });

    it('should parse partial JSON', function() {

        var newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false
        });

        assert.equal(newData.foo, 'true');
        assert.equal(newData.raz, 'false');
        assert.equal(newData.bar, '123');
        assert.equal(newData.baz.hello, 'world');
        assert.equal(newData.qux[0], 1);
        assert.equal(newData.qux[1], 2);
        assert.equal(newData.qux[2], 3);
        assert.equal(newData.xul, '1.2.3');
        assert.equal(newData.zub, '45.66');
        assert.equal(newData.buz, '1e6');
        assert.equal(newData.infinity, '240e1234');
        assert.equal(typeof newData.infinity, 'string');
    });


    it('should create instance with persistent options', function() {

        var lame = lameJson({
            boolean: false,
            float: false
        });

        assert.equal(lame.parse('false'), 'false');
        assert.equal(lame.parse('true'), 'true');
        assert.equal(lame.parse('1.2.3'), '1.2.3');

        var qux = lame.parse(goodData.qux);
        assert.equal(qux[0], 1);
        assert.equal(qux[1], 2);
        assert.equal(qux[2], 3);


        var newData = lame.parseJson(stringData, {
            boolean: false,
            float: false
        });

        assert.equal(newData.foo, 'true');
        assert.equal(newData.raz, 'false');
        assert.equal(newData.bar, '123');
        assert.equal(newData.baz.hello, 'world');
        assert.equal(newData.qux[0], 1);
        assert.equal(newData.qux[1], 2);
        assert.equal(newData.qux[2], 3);
        assert.equal(newData.xul, '1.2.3');
        assert.equal(newData.zub, '45.66');
        assert.equal(newData.buz, '1e6');
        assert.equal(newData.infinity, '240e1234');
        assert.equal(typeof newData.infinity, 'string');
    });
});
