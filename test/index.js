'use strict';

var _        = require('lodash');
var chai     = require('chai');

var lameJson = require('../lib/index.js');

var expect = chai.expect;


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
        buz: '1e6'
    };
    var stringData = {
        foo: 'true',
        raz: 'false',
        bar: '123',
        baz: '{\"hello\": \"world\"}',
        qux: '[1, 2, 3]',
        xul: '1.2.3',
        zub: '45.66',
        buz: '1e6'
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
        expect(newData.raz).to.be.false;
        expect(newData.bar).to.be.equal(123);
        expect(newData.baz.hello).to.be.equal('world');
        expect(newData.qux[0]).to.be.equal(1);
        expect(newData.qux[1]).to.be.equal(2);
        expect(newData.qux[2]).to.be.equal(3);
        expect(newData.xul).to.be.equal('1.2.3');
        expect(newData.zub).to.be.equal(45.66);
        expect(newData.buz).to.be.equal('1e6');
    });

    it('should not parse JSON with options set to false', function() {
        var newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false,
            array: false,
            object: false
        });

        expect(newData).to.be.deep.equal(stringData);
    });

    it('should parse partial JSON', function() {
        var newData = lameJson.parseJson(stringData, {
            boolean: false,
            float: false
        });

        expect(newData.foo).to.be.equal('true');
        expect(newData.raz).to.be.equal('false');
        expect(newData.bar).to.be.equal('123');
        expect(newData.baz.hello).to.be.equal('world');
        expect(newData.qux[0]).to.be.equal(1);
        expect(newData.qux[1]).to.be.equal(2);
        expect(newData.qux[2]).to.be.equal(3);
        expect(newData.xul).to.be.equal('1.2.3');
        expect(newData.zub).to.be.equal('45.66');
        expect(newData.buz).to.be.equal('1e6');
    });

});
