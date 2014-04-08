/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Registry, window */

describe('Registry-related functionality', function(){
    var reg, classes, defaultClass, obj, A, B, C, D, E, F;

    beforeEach(function(){
        A = function (){this.tag = 'a'; this.className = 'A';};
        B = function (){this.tag = 'b'; this.className = 'B';};
        C = function (){this.tag = 'c'; this.className = 'C';};
        D = function (){};
        E = function (){this.tag = 'e';};                      // no "className" for some reason
        F = function (){this.tag = ''; this.className = 'F';}; // "bad" class: property "tag" is empty string
        G = function (){this.className = 'F';};                // "bad" class: property "tag" is not set
        classes = [A, B, C, D, E, F, G];
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

    describe('Registry::hasValidTag(): whether a class has a valid name property', function(){
        it('returns false, if the argument is a string', function(){
            expect(reg.hasValidTag('a string')).toBe(false);
        });
        it('returns false, if the argument is an object', function(){
            expect(reg.hasValidTag({'obj': 1})).toBe(false);
        });
        it('returns false, if the argument is a plain function', function(){
            expect(reg.hasValidTag(function(){return 1;})).toBe(false);
        });
        it('returns true, if a class with non-empty string-valued property "tag" is given', function(){
            expect(reg.hasValidTag(A)).toBe(true);
        });
        it('returns false, if a class with empty string-valued property "tag" is given', function(){
            expect(reg.hasValidTag(F)).toBe(false);
        });
        it('returns false, if a class with non-empty array-valued property "tag" is given', function(){
            expect(reg.hasValidTag(function (){this.tag = [1, 2];})).toBe(false);
        });
        it('returns false, if a class with non-empty object-valued property "tag" is given', function(){
            expect(reg.hasValidTag(function (){this.tag = {'foo': 1};})).toBe(false);
        });
        it('returns false, if a class with non-empty function-valued property "tag" is given', function(){
            expect(reg.hasValidTag(function (){this.tag = function(){return 1;};})).toBe(false);
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
            classes = [A, B, C, spot, F];
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.indexOf(spot)).toBe(-1);
        });
        it('ignores arrays, strings, numbers and objects if given instead of classes', function(){
            var wrongInput = [['a', 3], 'string', 0.32, {foo: -3}],
                classesTmp;
            wrongInput.forEach(function(el){
                classesTmp = classes.slice(0, 2).concat(el).concat(classes.slice(2));
                classes = [A, C, el, F, C];
                obj = {'classes': classes, 'defaultClass': defaultClass};
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
        it('gives empty tagMap if the input has no classes with "tag" property', function(){
            reg = new Registry({'classes': [F, D], 'defaultClass': A});
            expect(Object.keys(reg.tagMap).length).toBe(0);
        });
        it('contains tags of all classes passes as input', function(){
            reg = new Registry({'classes': [A, B, C, E]});
            expect(Object.keys(reg.tagMap).length).toBe(4);
            expect(reg.tagMap.hasOwnProperty('a')).toBe(true);
            expect(reg.tagMap.hasOwnProperty('b')).toBe(true);
            expect(reg.tagMap.hasOwnProperty('c')).toBe(true);
            expect(reg.tagMap.hasOwnProperty('e')).toBe(true);
        });

        it('ignores classes with invalid tag names', function(){
            reg = new Registry({'classes': [A, F, D, E]});   // D and F have invalid tag names
            expect(Object.keys(reg.tagMap).length).toBe(2);
            expect(reg.tagMap.hasOwnProperty('a')).toBe(true);
            expect(reg.tagMap.hasOwnProperty('e')).toBe(true);
        });
    });

    describe('Registry::register(): registers another class', function(){
        it('returns true, if the class is valid', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': A});
            expect(reg.register(E)).toBe(true);
        });
        it('returns false, if it is tried to register a string, a number, an array or an object', function(){
            var invalides = ['', 'a string', 34, -3, 2.2, [], [2.1, 'text'], {}, {foo: 1}];
            invalides.forEach(function(invalid){
                reg = new Registry({'classes': [A, B, C], 'defaultClass': A});
                expect(reg.register(invalid)).toBe(false);
            });
        });
        it('includes the class into "classes" if it has a valid tag', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': A});
            expect(reg.classes.length).toBe(3);
            reg.register(E);
            expect(reg.classes.length).toBe(4);
            expect(reg.classes.indexOf(E) !== -1).toBe(true);
            expect(reg.classes.indexOf(A) !== -1).toBe(true);
            expect(reg.classes.indexOf(B) !== -1).toBe(true);
            expect(reg.classes.indexOf(C) !== -1).toBe(true);
        });

        it('includes the class into "classes" if it does not have a valid tag', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': A});
            expect(reg.classes.length).toBe(3);
            reg.register(F);
            expect(reg.classes.length).toBe(4);
            expect(reg.classes.indexOf(F) !== -1).toBe(true);
            expect(reg.classes.indexOf(A) !== -1).toBe(true);
            expect(reg.classes.indexOf(B) !== -1).toBe(true);
            expect(reg.classes.indexOf(C) !== -1).toBe(true);
        });


        it('includes the class into tagMap if it has a valid tag', function(){
            reg = new Registry({'classes': [A, B]});
            reg.register(C);
            expect(reg.tagMap.c).toBe(C);
        });

        it('does not include the class into tagMap if it has an invalid tag', function(){
            reg = new Registry({'classes': [B, C]});
            reg.register(F);
            expect(Object.keys(reg.tagMap).length).toBe(2);
            expect(reg.tagMap.b).toBe(B);
            expect(reg.tagMap.c).toBe(C);
        });


        it('includes the class into "classes" if it has a valid className', function(){
            reg = new Registry({'classes': [A, B], 'defaultClass': A});
            expect(reg.classes.length).toBe(2);
            reg.register(F);
            expect(reg.classes.length).toBe(3);
            expect(reg.classes.indexOf(F) !== -1).toBe(true);
            expect(reg.classes.indexOf(A) !== -1).toBe(true);
            expect(reg.classes.indexOf(B) !== -1).toBe(true);

        });

        it('includes the class into "classes" if it does not have a valid className', function(){
            reg = new Registry({'classes': [C], 'defaultClass': A});
            expect(reg.classes.length).toBe(1);
            reg.register(D);
            expect(reg.classes.length).toBe(2);
            expect(reg.classes.indexOf(D) !== -1).toBe(true);
            expect(reg.classes.indexOf(C) !== -1).toBe(true);
        });


        it('includes the class into classNameMap if it has a valid className', function(){
            reg = new Registry({'classes': [A, B]});
            console.log(reg);
            reg.register(C);
            console.log(reg);
            expect(reg.classNameMap.C).toBe(C);
        });

        it('does not include the class into classNameMap if it has an invalid classNameMap', function(){
            reg = new Registry({'classes': [B, C]});
            reg.register(E);
            expect(Object.keys(reg.classNameMap).length).toBe(2);
            expect(reg.classNameMap.B).toBe(B);
            expect(reg.classNameMap.C).toBe(C);
        });
    });

    describe('Registry::unregister(): unregister the class', function(){
        it('returns false if the argument is not among "classes" property', function(){
            reg = new Registry({'classes': [A, C], 'defaultClass': C});
            expect(reg.unregister(E)).toBe(false);
        });
        it('returns true if the argument is among "classes" property', function(){
            reg = new Registry({'classes': [A, C], 'defaultClass': B});
            expect(reg.unregister(C)).toBe(true);
        });
        it('removes argument from "classes" property', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': C});
            reg.unregister(B);
            expect(reg.classes.indexOf(B)).toBe(-1);
        });
        it('removes argument-related info from "tagMap" property', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': C});
            expect(reg.tagMap.b).toBeDefined();
            reg.unregister(B);
            expect(reg.tagMap.b).not.toBeDefined();
        });
        it('removes argument-related info from "tagMap" property', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': C});
            expect(reg.classNameMap.B).toBeDefined();
            reg.unregister(B);
            expect(reg.classNameMap.B).not.toBeDefined();
        });

        it('leaves "defaultClass" if unregistering another class', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': C});
            reg.unregister(B);
            expect(reg.defaultClass).toBe(C);
        });


        it('removes "defaultClass" if it happens to unregister it', function(){
            reg = new Registry({'classes': [A, B, C], 'defaultClass': C});
            reg.unregister(C);
            expect(reg.defaultClass).toBe(null);
        });


    });

    describe('Registry::findClassByTag() gives the class to correspondinf to the argument', function(){
        it('gives the default class if the argument is missing', function(){
            expect(reg.findClassByTag()).toBe(D);
        });
        it('gives the default class if the argument is an empty string', function(){
            expect(reg.findClassByTag('')).toBe(D);
        });
        it('gives the default class if the argument corresponds to a tag not present in the class names', function(){
            expect(reg.findClassByTag('no such name in class names')).toBe(D);
        });
        it('gives a class if the argument corresponds to a tag present in the class names', function(){
            expect(reg.findClassByTag('a')).toBe(A);
        });
    });

});