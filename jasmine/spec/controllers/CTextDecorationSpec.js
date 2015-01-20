/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, Controller, CTextDecoration */

describe ('CTextDecoration class has a', function(){
	var c;
    beforeEach(function(){
    	c = new CTextDecoration();
    });

    describe('constructor that creates an instance', function(){
        it('which is an instance of both CTextDecoration and Controller classes', function(){
            expect(c instanceof CTextDecoration).toBe(true);
            expect(c instanceof Controller).toBe(true);
        });

        it('even if keyword "new" is missing', function(){
            var c2 = CTextDecoration();
            expect(c2 instanceof CTextDecoration).toBe(true);
            expect(c2 instanceof Controller).toBe(true);
        });

        it('that is independent on the changes made in a Controller class instance afterwords', function(){
            // assure that the base and inherited classe instances do not have a property
            var prop = 'aProperyThatDoesNotExist',
                cBase = new Controller();
            expect(cBase.hasOwnProperty(prop)).toBe(false);
            expect(c.hasOwnProperty(prop)).toBe(false);

            // assigning the property to the base class instance
            cBase[prop] = 'whatever';

            // creating another inherited class instance
            var cAgain = new CTextDecoration();

            // assuring that the base class instance has acquired the property, while the inherited class instance - not
            expect(cBase.hasOwnProperty(prop)).toBe(true);
            expect(cAgain.hasOwnProperty(prop)).toBe(false);
        });
    });

    describe('method "convertToBold" that', function(){
        var fakeAdapter, fakeWorker;
        beforeEach(function(){
            // creating spies that the method makes use of
            fakeAdapter = jasmine.createSpyObj('fakeAdapter', ['setEditorContent', 'getEditorContent', 'getNativeRanges']);
            fakeWorker = jasmine.createSpyObj('fakeWorker', ['convertToBold']);
        });
        it('catches exceptions thrown by "getEditorAdapter" method', function(){
            spyOn(c, 'getEditorAdapter').and.throwError('Manually genereted exception');
            expect(function(){
                c.convertToBold();
            }).not.toThrow();
        });

        it('calls the adapter method "setEditorContent"', function(){
            spyOn(c, 'getEditorAdapter').and.returnValue(fakeAdapter);
            spyOn(c, 'getWorker').and.returnValue(fakeWorker);
            c.convertToBold();
            expect(fakeAdapter.setEditorContent).toHaveBeenCalled();
        });

        it('calls the worker method "convertToBold"', function(){
            spyOn(c, 'getEditorAdapter').and.returnValue(fakeAdapter);
            spyOn(c, 'getWorker').and.returnValue(fakeWorker);
            c.convertToBold();
            expect(fakeWorker.convertToBold).toHaveBeenCalled();
        });


    });


});


