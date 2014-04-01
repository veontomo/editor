/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Registry, window */

describe('Registry-related functionality', function(){
    var reg, classes, defaultClass, obj;

    beforeEach(function(){
        window.A = function (){this.name = 'a';};
        window.B = function (){this.name = 'b';};
        window.C = function (){this.name = 'c';};
        window.E = function (){this.name = 'c';};
        window.F = function (){this.name = '';}; // "bad" class: property "name" is not set
        window.D = function (){};
        classes = ['A', 'B', 'C'];
        defaultClass = 'D';
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
            expect(reg.defaultClass).toBe(null);
        });
    });


    describe('Registry::classes: contains names of available classes', function(){
        it('contains available classes', function(){
            classes.forEach(function(cName){
                expect(reg.classes.indexOf(cName) !== -1).toBe(true);
            });
        });
        it('ignores undefined classes', function(){
            var nonExistentClass = 'this-class-does-not-exist';
            classes.push(nonExistentClass);
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            expect(reg.classes.indexOf(nonExistentClass)).toBe(-1);
        });
        it('ignores duplicates', function(){
            classes.push('A');
            obj = {'classes': classes, 'defaultClass': defaultClass};
            reg = new Registry(obj);
            // index of last occurrence must be equal to the index of the first one
            expect(reg.classes.lastIndexOf('A') === reg.classes.indexOf('A') ).toBe(true);
        });

    });

    describe('Registry::map: gives the mapping of available classes into tag names', function(){
        it('gives "a" for A', function(){
            expect(reg.map.A).toBe('a');
        });
        it('gives "b" for B', function(){
            expect(reg.map.B).toBe('b');
        });
        it('gives "c" for C', function(){
            expect(reg.map.C).toBe('c');
        });
    });

    describe('Registry::register(): registers another class', function(){
        it('returns true, if the class exists', function(){
            expect(reg.register('E')).toBe(true);
        });
        it('returns false, if the class does not exist', function(){
            expect(reg.register('no such class')).toBe(false);
        });

        it('includes the class name into "classes", if it exists', function(){
            reg.register('E');
            expect(reg.classes.indexOf('E') !== -1).toBe(true);
        });
        it('does not include the class name from "classes", if it does not exists', function(){
            reg.register('no such class');
            expect(reg.classes.indexOf('E') === -1).toBe(true);
        });
        it('does not include the class name from "classes", if it has empty "name" property', function(){
            reg.register('F');
            expect(reg.classes.indexOf('F') === -1).toBe(true);
        });
        it('returns false, if the class has empty "name" property', function(){
            expect(reg.register('F')).toBe(false);
        });




    });


});