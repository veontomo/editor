/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Registry, window */

describe('Registry-related functionality', function(){
    var reg, classes, defaultClass, obj, A, B, C, D, E, F;

    beforeEach(function(){
        A = function (){this.name = 'a';};
        B = function (){this.name = 'b';};
        C = function (){this.name = 'c';};
        E = function (){this.name = 'e';};
        F = function (){this.name = '';}; // "bad" class: property "name" is not set
        D = function (){};
        classes = [A, B, C];
        defaultClass = D;
        obj = {'classes': classes, 'defaultClass': defaultClass};
        reg = new Registry(obj);
    });

    describe('Registry construction', function(){
        it('prevents accidental call without "new"', function(){
            var reg2 = Registry(obj);
            expect(reg2 instanceof Registry).toBe(true);
        });
        it('gives [] for "classes" property, if nothing is passed to the constructor', function(){
            reg = new Registry();
            expect(reg.classes.length).toBe(0);
        });
        it('sets property "defaultClass" to "null" if a number is given as "defaultClass"', function(){
            reg = new Registry({'defaultClass': 23});
            expect(reg.defaultClass).toBe(null);
        });

        it('sets property "defaultClass" to "null" if a string is given as "defaultClass"', function(){
            reg = new Registry({'defaultClass': 'string'});
            expect(reg.defaultClass).toBe(null);

            reg = new Registry({'defaultClass': 23});
            expect(reg.defaultClass).toBe(null);

        });
        it('sets property "defaultClass" to "null" if an object is given as "defaultClass"', function(){
            reg = new Registry({'defaultClass': {'foo': 1}});
            expect(reg.defaultClass).toBe(null);
        });

        it('sets property "defaultClass" to "null" if an array is given as "defaultClass"', function(){
            reg = new Registry({'defaultClass': [3, 9, 'haha', {}]});
            expect(reg.defaultClass).toBe(null);
        });
        it('sets property "defaultClass" if it is given as a function', function(){
            reg = new Registry({'defaultClass': D});
            expect(reg.defaultClass).toBe(D);
        });
    });

    describe('Registry::hasValidName(): whether a class has a valid name property', function(){
        it('returns false, if the argument is a string', function(){
            expect(reg.hasValidName('a string')).toBe(false);
        });
        it('returns false, if the argument is an object', function(){
            expect(reg.hasValidName({'obj': 1})).toBe(false);
        });
        it('returns false, if the argument is a plain function', function(){
            expect(reg.hasValidName(function(){return 1;})).toBe(false);
        });
        it('returns true, if a class with non-empty string-valued property "name" is given', function(){
            expect(reg.hasValidName(A)).toBe(true);
        });
        it('returns false, if a class with empty string-valued property "name" is given', function(){
            expect(reg.hasValidName(F)).toBe(false);
        });
        it('returns false, if a class with non-empty array-valued property "name" is given', function(){
            expect(reg.hasValidName(function (){this.name = [1, 2];})).toBe(false);
        });
        it('returns false, if a class with non-empty object-valued property "name" is given', function(){
            expect(reg.hasValidName(function (){this.name = {'foo': 1};})).toBe(false);
        });
        it('returns false, if a class with non-empty function-valued property "name" is given', function(){
            expect(reg.hasValidName(function (){this.name = function(){return 1;};})).toBe(false);
        });
    });


    describe('Registry::classes: contains names of available classes', function(){
        it('inserts valid classes into property "classes"', function(){
            reg = new Registry(obj);
            classes.forEach(function(cName){
                expect(reg.classes.indexOf(cName) !== -1).toBe(true);
            });
        });
        it('ignores strings if given instead of classes', function(){
            var spot = 'a string';
            classes.push(spot);
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.indexOf(spot)).toBe(-1);
        });
        it('ignores arrays if given instead of classes', function(){
            var wrongInput = [['a', 3], 'string', 0.32, {foo: -3}],
                classesTmp;
            wrongInput.forEach(function(el){
                classesTmp = classes.slice(0, 2).concat(el).concat(classes.slice(2));
                obj = {'classes': classesTmp, 'defaultClass': defaultClass};
                reg = new Registry(obj);
                expect(reg.classes.indexOf(el)).toBe(-1);
            });
        });

        it('ignores last element if it duplicate the first', function(){
            classes = [A, B, C, A];
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.length).toBe(3);
            // index of last occurrence must be equal to the index of the first one
            expect(reg.classes.lastIndexOf(A) === reg.classes.indexOf(A)).toBe(true);
        });

        it('ignores middle element if it duplicates another middle element', function(){
            classes = [A, B, C, B, E];
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.length).toBe(4);
            // index of last occurrence must be equal to the index of the first one
            expect(reg.classes.indexOf(A) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(B) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(C) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(E) !== -1 ).toBe(true);

        });

        it('ignores last element if it duplicates a middle one', function(){
            classes = [A, C, E, C];
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.length).toBe(3);
            // index of last occurrence must be equal to the index of the first one
            expect(reg.classes.indexOf(A) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(C) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(E) !== -1 ).toBe(true);
        });

        it('ignores multiple duplicates', function(){
            classes = [A, C, E, C, B, A, B, E];
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.length).toBe(4);
            expect(reg.classes.indexOf(A) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(B) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(C) !== -1 ).toBe(true);
            expect(reg.classes.indexOf(E) !== -1 ).toBe(true);
        });
    });

    describe('Registry::tagMap: gives the mapping of available classes into tag names', function(){
        it('gives "a" for A', function(){
            expect(reg.tagMap.a).toBe(A);
        });
        it('gives "b" for B', function(){
            expect(reg.tagMap.b).toBe(B);
        });
        it('gives "c" for C', function(){
            expect(reg.tagMap.c).toBe(C);
        });
    });

    describe('Registry::register(): registers another class', function(){
        it('returns true, if the class is valid', function(){
            expect(reg.register(E)).toBe(true);
        });
        it('returns false, if not a valid class is given', function(){
            spyOn(reg, 'hasValidName').andCallFake(function(){return false;});
            var DummyFun = function(){};
            expect(reg.register(DummyFun)).toBe(false);
        });

        it('includes the class into "classes", if it is valid', function(){
            spyOn(reg, 'hasValidName').andCallFake(function(){return true;});
            var DummyFun = function(){this.name = 'dummyFun';};
            reg.register(DummyFun);
            expect(reg.classes.indexOf(DummyFun) !== -1).toBe(true);
        });

        it('includes the mapping name into "tagMap", if the class is valid', function(){
            spyOn(reg, 'hasValidName').andCallFake(function(){return true;});
            var DummyFun = function(){this.name = 'dummyFun';};
            reg.register(DummyFun);
            expect(reg.tagMap.dummyFun).toBe(DummyFun);
        });
    });

    describe('Registry::unregister(): unregister the class', function(){
        it('returns false if the argument is not among "classes" property', function(){
            expect(reg.unregister(E)).toBe(false);
        });
        it('returns true if the argument is among "classes" property', function(){
            expect(reg.unregister(B)).toBe(true);
        });
        it('removes argument from "classes" property', function(){
            reg.unregister(B);
            expect(reg.classes.indexOf(B)).toBe(-1);
        });
        it('removes argument-related info from "tagMap" property', function(){
            reg.unregister(B);
            expect(reg.tagMap.b).not.toBeDefined();
        });
    });

    describe('Registry::classForTag() gives the class to correspondinf to the argument', function(){
        it('gives the default class if the argument is missing', function(){
            expect(reg.classForTag()).toBe(D);
        });
        it('gives the default class if the argument is an empty string', function(){
            expect(reg.classForTag('')).toBe(D);
        });
        it('gives the default class if the argument corresponds to a tag not present in the class names', function(){
            expect(reg.classForTag('no such name in class names')).toBe(D);
        });
        it('gives a class if the argument corresponds to a tag present in the class names', function(){
            expect(reg.classForTag('a')).toBe(A);
        });
    });

});