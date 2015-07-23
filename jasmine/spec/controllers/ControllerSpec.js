/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, Controller */

describe ('Base controller class has', function(){
	var c;
    beforeEach(function(){
    	c = new Controller();
    });

    describe('has a worker setter/getter such that', function(){
        it('the getter returns an argument that has been given to the setter', function(){
            var foo = {};
            c.setWorker(foo);
            expect(c.getWorker()).toBe(foo);
        });
    });

    describe('has an editor adapter setter/getter such that', function(){
        it('the getter returns an argument that has been given to the setter', function(){
            var foo = {};
            c.setEditorAdapter(foo);
            expect(c.getEditorAdapter()).toBe(foo);
        });
    });

    describe('has a method "onShow" that', function(){
        it('just exists', function(){
            expect(c.hasOwnProperty('onShow')).toBe(true);
            expect(typeof c.onShow).toBe('function');

        });
    });

    describe('has a method "createModel" that', function(){
        it('returns nothing if method "getModel" returns nothing', function(){
            spyOn(c, 'getModel');
            expect(c.createModel()).not.toBeDefined();
        });

        it('does not throw any error if method "getModel" throws an error', function(){
            spyOn(c, 'getModel').and.throwError('dynamically generated error');
            expect(function(){
                c.createModel();
            }).not.toThrow();
        });

        it('returns nothing if method "getModel" throws an error', function(){
            spyOn(c, 'getModel').and.throwError('dynamically generated error');
            expect(c.createModel()).not.toBeDefined();
        });

        it('returns nothing if method "getModel" returns a string', function(){
            spyOn(c, 'getModel').and.returnValue('a string');
            expect(c.createModel()).not.toBeDefined();
        });

        it('returns an object if method "getModel" returns a function', function(){
            spyOn(c, 'getModel').and.returnValue(function(){});
            expect(typeof c.createModel()).toBe('object');
        });

        it('returns an instance of a class that is returned by method "getModel"', function(){
            function A(){};
            spyOn(c, 'getModel').and.returnValue(A);
            expect(c.createModel() instanceof A).toBe(true);
        });
    });

});


