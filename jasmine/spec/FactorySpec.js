/*jslint plusplus: true, white: true */
/*global describe, describe, it, it, expect, spyOn, beforeEach, Factory*/


describe('Factory-related functionality', function(){
    var factory;
    beforeEach(function(){
        factory = new Factory();
    });
    describe('Factory::constuctor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            factory = Factory();
            expect(factory instanceof Factory).toBe(true);
        });
    });

    describe('Factory::register gives the available assortiment', function(){
        var register;
        beforeEach(function(){
            register = factory.register;
        });
        it('is an object', function(){
            expect(typeof register === 'object').toBe(true);
        });
        it('contains info about Cell', function(){
            expect(register.td).toBe('Cell');
        });
        it('contains info about Row', function(){
            expect(register.tr).toBe('Row');
        });
        it('contains info about Table', function(){
            expect(register.table).toBe('Table');
        });
        it('contains info about List', function(){
            expect(register.ol).toBe('List');
            expect(register.ul).toBe('List');
        });
        it('contains info about ListItem', function(){
            expect(register.li).toBe('ListItem');
        });
        it('contains info about Link', function(){
            expect(register.a).toBe('Link');
        });

    });

    describe('Factory::produceTag(): creation of Tag instance', function(){
        it('returns an instance of Tag', function(){
            expect(factory.produceTag() instanceof Tag).toBe(true);
        });

        it('');


    })
});
