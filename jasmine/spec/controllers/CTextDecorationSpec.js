/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, Controller, CTextDecoration */

describe ('CTextDecoration class a method', function(){
	var c;
    beforeEach(function(){
    	c = new CTextDecoration();
    });

    describe('constructor creates an instance', function(){
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
            var c2 = new CTextDecoration();

            // assuring that the base class instance has acquired the property, while the inherited class instance - not
            expect(cBase.hasOwnProperty(prop)).toBe(true);
            expect(c.hasOwnProperty(prop)).toBe(false);
        });
    });


});


