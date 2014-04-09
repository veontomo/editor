/*jslint plusplus: true, white: true */
/*global describe, it, it, expect, spyOn, beforeEach, Factory, Registry, Node */

describe('Factory-related functionality', function(){
    var factory, registry, SpanClass, DivClass, ArticleClass, TextClass, TagClass, ContentClass;
    beforeEach(function(){
        SpanClass = function(){this.tag = 'span'; this.className = 'SpanClass';};
        DivClass = function(){this.tag = 'div'; this.className = 'DivClass';};
        ArticleClass = function(){this.tag = 'article'; this.className = 'ArticleClass';};
        TextClass = function(){this.tag = 'text'; this.className = 'TextClass';};
        TagClass = function(){this.tag = 'text'; this.className = 'TagClass';};
        ContentClass = function(){this.className = 'ConsoleClass';};
        registry = new Registry({classes: [SpanClass, DivClass, ArticleClass, TextClass, ContentClass], defaultClass: TagClass});
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

    // xdescribe('Factory::classFor() gives the class to construct object', function(){
    //     it('calls Registry::getClassByTag()', function(){
    //         spyOn(factory.registry, 'getClassByTag');
    //         spyOn(factory, 'tagFor').andCallFake(function(){return 'tagForElement';});
    //         var el = {};
    //         factory.classFor(el);
    //         expect(factory.registry.getClassByTag).toHaveBeenCalledWith('tagForElement');
    //         expect(factory.tagFor).toHaveBeenCalledWith(el);
    //     });
    // });

    // xdescribe('Factory::createInstance(): returns an instance of a class', function(){
    //     it('returns null if "isSupported" returns false for the argument', function(){
    //         spyOn(factory, 'isSupported').andCallFake(function(){return false;});
    //         var el = {'tagName': 'bmw'},
    //             car = factory.createInstance(el);
    //         expect(car).toBe(null);
    //         expect(factory.isSupported).toHaveBeenCalledWith(el);
    //     });

    //     it('returns instance of BMW if "tagFor" of the argument returns "bmw"', function(){
    //         spyOn(factory, 'isSupported').andCallFake(function(){return true;});
    //         spyOn(factory, 'tagFor').andCallFake(function(){return 'bmw';});
    //         var el = {},
    //             car = factory.createInstance(el);
    //         expect(car instanceof BMW).toBe(true);
    //         expect(factory.isSupported).toHaveBeenCalledWith(el);
    //         expect(factory.tagFor).toHaveBeenCalledWith(el);
    //     });
    //     it('returns instance of CAR if "tagFor" of the argument returns "nonExistentTag"', function(){
    //         spyOn(factory, 'isSupported').andCallFake(function(){return true;});
    //         spyOn(factory, 'tagFor').andCallFake(function(){return 'nonExistentTag';});
    //         var el = {},
    //             car = factory.createInstance(el);
    //         expect(car instanceof CAR).toBe(true);
    //         expect(factory.isSupported).toHaveBeenCalledWith(el);
    //         expect(factory.tagFor).toHaveBeenCalledWith(el);
    //     });
    // });

    describe('Factory::copyElement() loads properties', function(){
        it('returns false if called without arguments', function(){
            expect(factory.copyElement()).toBe(false);
        });
        it('returns false if called with one argument', function(){
            expect(factory.copyElement({})).toBe(false);
        });

        it('returns false if the the first argument does not respond to "load" method', function(){
            var obj = {'noLoad': 1};
            expect(factory.copyElement(obj, {})).toBe(false);
        });
        it('returns true if the the first argument has "load" method that returns "true"', function(){
            var obj = {'load': function(){return true;}};
            expect(factory.copyElement(obj, {})).toBe(true);
        });
        it('returns true if the the first argument has "load" method that returns "false"', function(){
            var obj = {'load': function(){return false;}};
            expect(factory.copyElement(obj, {})).toBe(false);
        });

        it('passes the second argument to the "load" method of the first one', function(){
            var obj = {'load': function(){return null;}},
                prop = {'a': 'properties', 1: 0};
            spyOn(obj, 'load');
            factory.copyElement(obj, prop);
            expect(obj.load).toHaveBeenCalledWith(prop);
        });
    });

    // xdescribe('Factory::produce(): produce full-featured object', function(){
    //     it('calls "createInstance" method', function(){
    //         var el = {};
    //         spyOn(factory, 'createInstance');
    //         factory.produce(el);
    //         expect(factory.createInstance).toHaveBeenCalledWith(el);
    //     });
    //     it('calls "brightenObj" method', function(){
    //         var el = {},
    //             prod = {};
    //         spyOn(factory, 'createInstance').andCallFake(function(){return prod;});
    //         spyOn(factory, 'brightenObj');
    //         factory.produce(el);
    //         expect(factory.brightenObj).toHaveBeenCalledWith(prod, el);
    //     });

    // });

    describe('Factory::clone(): creates a copy of the factory', function(){
        var clone;
        it('produces an instance of Factory', function(){
            clone = factory.clone();
            expect(clone instanceof Factory).toBe(true);
        });
        it('has the same classes as original factory if not empty', function(){
            factory.registry.classes = [SpanClass, TagClass];
            clone = factory.clone();
            expect(clone.registry.classes.length).toBe(2);
            expect(clone.registry.classes[0]).toBe(SpanClass);
            expect(clone.registry.classes[1]).toBe(TagClass);
        });
        it('has the same classes as original factory if empty', function(){
            factory.registry.classes = [];
            clone = factory.clone();
            expect(clone.registry.classes.length).toBe(0);
        });

        it('has the same defaultClass as original factory', function(){
            factory.registry.defaultClass = ArticleClass;
            clone = factory.clone();
            expect(clone.registry.defaultClass).toBe(ArticleClass);
        });
        it('has no defaultClass if the original factory has it empty', function(){
            delete factory.registry.defaultClass;
            clone = factory.clone();
            expect(clone.registry.defaultClass).toBe(null);
        });
    });

    describe('Factory::bindFactory(): binds the factory for the element', function(){
        it('returns "false" if no argument is given', function(){
            expect(factory.bindFactory()).toBe(false);
        });
        it('returns "false" if the argument has no "setFactory()" method', function(){
            var el = {};
            delete el.setFactory;
            expect(factory.bindFactory(el)).toBe(false);
        });
        it('returns "true" if the argument has "setFactory()" that returns "true"', function(){
            var el = {setFactory: function(){return null;}};
            spyOn(el, 'setFactory').andCallFake(function(){return true;});
            expect(factory.bindFactory(el)).toBe(true);
        });
        it('returns "false" if the argument has "setFactory()" that returns "false"', function(){
            var el = {setFactory: function(){return null;}};
            spyOn(el, 'setFactory').andCallFake(function(){return false;});
            expect(factory.bindFactory(el)).toBe(false);
        });
        it('calls "setFactory()" method with the output of the "clone()" method', function(){
            var el = {setFactory: function(){return null;}};
            spyOn(factory, 'clone').andCallFake(function(){return 'factory clone';});
            spyOn(el, 'setFactory');
            factory.bindFactory(el)
            expect(el.setFactory).toHaveBeenCalledWith('factory clone');
            expect(factory.clone).toHaveBeenCalled();
        });


        // it('does not assign "defaultClass if it is absent in the registry', function(){
        //     var el = {factory: 1};
        //     factory = new Factory(new Registry({classes: [DivClass, SpanClass]}));
        //     factory.bindFactory(el);
        //     expect(el.factory.registry.defaultClass).toBe(null);
        // });
        // it('does not assign "classes" if it is absent in the registry', function(){
        //     var el = {factory: 1};
        //     factory = new Factory(new Registry({defaultClass: DivClass}));
        //     factory.bindFactory(el);
        //     expect(el.factory.registry.classes.length).toBe(0);
        // });



    });

    describe('Factory::createInstanceOf(): creates an instance of the requested class', function(){
        it('calls Registry method "getClassByName"', function(){
            spyOn(factory.registry, 'getClassByName');
            factory.createInstanceOf('class name');
            expect(factory.registry.getClassByName).toHaveBeenCalledWith('class name');
        });
        it('returns an instance of a class that method "getClassByName" returns', function(){
            function Foo(){this.foo = 1;}
            spyOn(factory.registry, 'getClassByName').andCallFake(function(){return Foo;});
            var baby = factory.createInstanceOf('class name');
            expect(baby instanceof Foo).toBe(true);
        });
        it('returns null if method "getClassByName" returns null', function(){
            spyOn(factory.registry, 'getClassByName');
            var baby = factory.createInstanceOf('class name');
            expect(baby).toBe(null);
        });
    });

    describe('Factory::createInstanceByTag(): creates ac class instance with required "tag"', function(){
        it('calls Registry method "getClassByTag"', function(){
            spyOn(factory.registry, 'getClassByTag');
            factory.createInstanceByTag('class name');
            expect(factory.registry.getClassByTag).toHaveBeenCalledWith('class name');
        });
        it('returns an instance of a class that method "getClassByTag" returns', function(){
            function Foo(){this.foo = 2;}
            spyOn(factory.registry, 'getClassByTag').andCallFake(function(){return Foo;});
            var baby = factory.createInstanceByTag('class name');
            expect(baby instanceof Foo).toBe(true);
        });
        it('returns default class if method "getClassByTag" returns null', function(){
            spyOn(factory.registry, 'getClassByTag');
            var baby = factory.createInstanceByTag('class name');
            expect(baby instanceof TagClass).toBe(true);
        });
        it('returns null if method "getClassByTag" and "defaultClass" are both null', function(){
            registry = new Registry({classes: [SpanClass, DivClass, ArticleClass, TextClass, ContentClass]});
            factory = new Factory(registry);
            spyOn(factory.registry, 'getClassByTag').andCallFake(function(){return null;});
            var baby = factory.createInstanceByTag('class name');
            expect(baby).toBe(null);
        });

    });


    describe('Factory::forgeElement(): imitates the argument', function(){
        it('returns null if no argument is provided', function(){
            expect(factory.forgeElement()).toBe(null);
        });
        it('calls "createInstanceByTag" with the argument tag', function(){
            var el = {'tagName': 'a-tag'};
            spyOn(factory, 'createInstanceByTag');
            factory.forgeElement(el);
            expect(factory.createInstanceByTag).toHaveBeenCalledWith('a-tag');
        });
        it('calls "imitate" method with proper arguments', function(){
            var el = {'tagName': 'a-tag'},
                baby = {};
            spyOn(factory, 'createInstanceByTag').andCallFake(function(){return baby;});
            spyOn(factory, 'copyElement');
            factory.forgeElement(el);
            expect(factory.copyElement).toHaveBeenCalledWith(baby, el);
        });
        it('calls "bindFactory" method with proper arguments', function(){
            var el = {'tagName': 'a-tag'},
                baby = {};
            spyOn(factory, 'createInstanceByTag').andCallFake(function(){return baby;});
            spyOn(factory, 'copyElement');
            spyOn(factory, 'bindFactory');
            factory.forgeElement(el);
            expect(factory.bindFactory).toHaveBeenCalledWith(baby);
        });




    });


});
