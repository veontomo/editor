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
            var el = {tagName: function(){}};
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

    xdescribe('Factory::classFor() gives the class to construct object', function(){
        it('calls Registry::classFor()', function(){
            spyOn(factory.registry, 'classForTag');
            var el = {tagName: 'tag'};
            factory.classFor(el);
            expect(factory.registry.classForTag).toHaveBeenCalledWith('tag');
        })
    });

    xdescribe('Factory::produce(): returns correct instances', function(){
        it('returns null if "isSupported" returns false for the argument', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return false;});
            var el = {'tagName': 'bmw'},
                car = factory.produce(el);
            expect(car).toBe(null);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
        });

        it('returns instance of BMW if "tagFor" of the argument returns "bmw"', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return true;});
            var el = {'tagName': 'bmw'},
                car = factory.produce(el);
            expect(car instanceof BMW).toBe(true);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
        });
        it('returns instance of CAR if "tagFor" of the argument returns "text"', function(){
            spyOn(factory, 'isSupported').andCallFake(function(){return true;});
            var el = {'tagName': 'text'},
                car = factory.produce(el);
            expect(car instanceof CAR).toBe(true);
            expect(factory.isSupported).toHaveBeenCalledWith(el);
        });

    });

});
