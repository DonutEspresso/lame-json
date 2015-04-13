/*global describe,it*/
'use strict';
var _ = require('lodash'),
    chai = require('chai'),
    lameJson = require('../lib/index.js');

var expect = chai.expect;


describe('lame-json node module.', function() {

    var goodData = {
            foo: true,
            bar: 123,
            baz: {
                hello: 'world'
            },
            qux: [ 1, 2, 3 ]
        },
        stringData = {
            foo: 'true',
            bar: '123',
            baz: '{\"hello\": \"world\"}',
            qux: '[1, 2, 3]'
        };

    it('should return JSON object as is', function() {
        var newData = lameJson.parseJson(goodData);

        _.forEach(_.keys(newData), function(key) {
            expect(goodData[key]).to.be.equal(newData[key]);
        });
    });

    it('should return parsed JSON', function() {
        var newData = lameJson.parseJson(stringData);

        expect(newData.foo).to.be.true;
        expect(newData.bar).to.be.equal(123);
        expect(newData.baz.hello).to.be.equal('world');
        expect(newData.qux[0]).to.be.equal(1);
        expect(newData.qux[1]).to.be.equal(2);
        expect(newData.qux[2]).to.be.equal(3);
    });

    it('should not parse JSON with options set to false', function() {
        var newData = lameJson.parseJson(stringData, {
            boolean: false,
            integer: false,
            array: false,
            object: false
        });

        expect(newData.foo).to.be.equal('true');
        expect(newData.bar).to.be.equal('123');
        expect(newData.baz).to.be.equal(stringData.baz);
        expect(newData.qux).to.be.equal(stringData.qux);
    });
});
