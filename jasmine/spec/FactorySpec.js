/*jslint plusplus: true, white: true */
/*global describe, describe, it, it, expect, spyOn, beforeEach, Factory, Registry */


describe('Factory-related functionality', function(){
    var factory, registry, BMW, MINI, PORSCHE, CAR;
    beforeEach(function(){
        BMW = function(){this.name = 'bmw';};
        MINI = function(){this.name = 'mini';};
        PORSCHE = function(){this.name = 'porsche';};
        CAR = function(){};
        registry = new Registry({classes: [BMW, MINI, PORSCHE], defaultClass: CAR});
        factory = new Factory(registry);
    });
    describe('Factory::constuctor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            factory = Factory(registry);
            expect(factory instanceof Factory).toBe(true);
        });
        it('instantiates "registry"  property', function(){
            expect(factory.registry instanceof Registry).toBe(true);
        });
    });

    describe('Factory::isSupported() whether the argument is of supported type', function(){
        it('returns false if the argument is missing', function(){
            expect(factory.isSupported()).toBe(false);
        });

        it('returns false for strings, arrays, numbers, functions', function(){
            var invalids = ['', 'string', [], [1, 2, 'a'], 0, -2.12, function(){return 'a';}];
            invalids.forEach(function(invalid){
                expect(factory.isSupported(invalid)).toBe(false);
            });
        });
        it('returns true for ELEMENT_NODE', function(){
            var el = document.createElement('a');
            expect(factory.isSupported(el)).toBe(true);
            el = document.createElement('div');
            expect(factory.isSupported(el)).toBe(true);
        });
        it('returns true for TEXT_NODE', function(){
            var el = document.createTextNode('text node');
            expect(factory.isSupported(el)).toBe(true);
        });
        it('returns true for any object with nodeType equal to Node.ELEMENT_NODE', function(){
            var el = {'nodeType': Node.ELEMENT_NODE};
            expect(factory.isSupported(el)).toBe(true);
        });
        it('returns true for any object with nodeType equal to Node.TEXT_NODE', function(){
            var el = {'nodeType': Node.TEXT_NODE};
            expect(factory.isSupported(el)).toBe(true);
        });

    });

    xdescribe('Factory::produce(): returns correct instances', function(){
        it('returns null, if the arguments has "nodeType" property different from Node.ELEMENT_NODE and Node.TEXT_NODE', function(){
            var el = {nodeType: "non-existing node type"};
            expect(factory.produce(el)).toBe(null);
        });
        it('returns ');
    });

});
