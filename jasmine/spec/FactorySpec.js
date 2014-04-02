/*jslint plusplus: true, white: true */
/*global describe, describe, it, it, expect, spyOn, beforeEach, Factory, Registry, Node */


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

    describe('Factory::tagFor() gives tag for the argument', function(){
        it('returns element "tagName" property if it is not empty', function(){
            var el = {tagName: 'elem tag name'};
            expect(factory.tagFor(el)).toBe('elem tag name');
        });
        it('returns string "text" if "tagName" property is an empty string', function(){
            var el = {tagName: ''};
            expect(factory.tagFor(el)).toBe('text');
        });
        it('returns string "text" if "tagName" property is a function', function(){
            var el = {tagName: function(){return null;}};
            expect(factory.tagFor(el)).toBe('text');
        });

        it('returns string "text" if the argument is an object with no "tagName" property', function(){
            var el = {notTagName: 'any'};
            expect(factory.tagFor(el)).toBe('text');
        });
        it('returns string "text" if no argument is given', function(){
            expect(factory.tagFor()).toBe('text');
        });
        it('returns string "text" if the argument is a string, number, array or function', function(){
            var invalids = ['', 'a string', 4, -3, 5.1, [], [0], ['', 3], function(){return 'output';}, function(){return null;} ];
            invalids.forEach(function(invalid){
                expect(factory.tagFor(invalid)).toBe('text');
            });
        });
    });

    describe('Factory::classFor() gives the class to construct object', function(){
        it('calls Registry::classFor()', function(){
            spyOn(factory.registry, 'classForTag');
            spyOn(factory, 'tagFor').andCallFake(function(){return 'tagForElement';});
            var el = {};
            factory.classFor(el);
            expect(factory.registry.classForTag).toHaveBeenCalledWith('tagForElement');
            expect(factory.tagFor).toHaveBeenCalledWith(el);
        });
    });

    describe('Factory::createInstance(): returns an instance of a class', function(){
        it('returns null if "isSupported" returns false for the argument', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return false;});
            var el = {'tagName': 'bmw'},
                car = factory.createInstance(el);
            expect(car).toBe(null);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
        });

        it('returns instance of BMW if "tagFor" of the argument returns "bmw"', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return true;});
            spyOn(factory, 'tagFor').andCallFake(function(){return 'bmw';});
            var el = {},
                car = factory.createInstance(el);
            expect(car instanceof BMW).toBe(true);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
            expect(factory.tagFor).toHaveBeenCalledWith(el);
        });
        it('returns instance of CAR if "tagFor" of the argument returns "nonExistentTag"', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return true;});
            spyOn(factory, 'tagFor').andCallFake(function(){return 'nonExistentTag';});
            var el = {},
                car = factory.createInstance(el);
            expect(car instanceof CAR).toBe(true);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
            expect(factory.tagFor).toHaveBeenCalledWith(el);
        });
    });

    describe('Factory::brightenObj() loads properties', function(){
        it('returns false if the the first argument does not respond to "load" method', function(){
            var obj = {'noLoad': 1};
            expect(factory.brightenObj(obj, {})).toBe(false);
        });
        it('returns true if the the first argument has "load" method', function(){
            var obj = {'load': function(){return null;}};
            expect(factory.brightenObj(obj, {})).toBe(true);
        });
        it('returns false if called without arguments', function(){
            expect(factory.brightenObj()).toBe(false);
        });
        it('returns false if called with one argument', function(){
            expect(factory.brightenObj({})).toBe(false);
        });
        it('passes the second argument to the "load" method of the first one', function(){
            var obj = {'load': function(){return null;}},
                prop = {'a': 'properties', 1: 0};
            spyOn(obj, 'load');
            factory.brightenObj(obj, prop);
            expect(obj.load).toHaveBeenCalledWith(prop);
        });
    });

    describe('Factory::produce(): produce full-featured object', function(){
        it('calls "createInstance" method', function(){
            var el = {};
            spyOn(factory, 'createInstance');
            factory.produce(el);
            expect(factory.createInstance).toHaveBeenCalledWith(el);
        });
        it('calls "brightenObj" method', function(){
            var el = {},
                prod = {};
            spyOn(factory, 'createInstance').andCallFake(function(){return prod;});
            spyOn(factory, 'brightenObj');
            factory.produce(el);
            expect(factory.brightenObj).toHaveBeenCalledWith(prod, el);
        });

    });


});
