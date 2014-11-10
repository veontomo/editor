/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, Worker */

xdescribe ('Worker functionality', function(){
	var w;
    beforeEach(function(){
    	w = new Worker();
    });

    describe('Constructor properties', function(){
        it('throws an error if initialized with just one argument', function(){
            expect(function(){
                return new Worker('whatever');
            }).toThrow(new Error('Action is missing!'));
        });

        it('sets trigger and action upon initialization if they are both provided', function(){
            var a = function(){return 'whatever';},
                t = function(){return 'whatever';};
            var w2 = new Worker(t, a);
            expect(w2.getTrigger()).toBe(t);
            expect(w2.getAction()).toBe(a);
        });

    });

    describe('Trigger setter/getter', function (){
        it('throws an error if argument is not given', function(){
            expect(function(){
                return w.setTrigger();
            }).toThrow(new Error('Trigger must be a function!'));
        });

        it('throws an error if trying to set a non-function as a trigger', function(){
            var invalids = [0, 4, [], [1, 2], '', 'a string', {}, {key: 'value'}];
            invalids.forEach(function(invalid){
                expect(function(){
                    return w.setTrigger(invalid);
                }).toThrow(new Error('Trigger must be a function!'));
            });
        });

        it('sets a trigger', function(){
            var f = function(){return true;};
            w.setTrigger(f);
            expect(w.getTrigger()).toBe(f);
        });
    });

    describe('Action setter/getter', function (){
        it('throws an error if argument is not given', function(){
            expect(function(){
                return w.setAction();
            }).toThrow(new Error('Action must be a function!'));
        });

        it('throws an error if trying to set a non-function as an action', function(){
            var invalids = [0, 4, [], [1, 2], '', 'a string', {}, {key: 'value'}];
            invalids.forEach(function(invalid){
                expect(function(){
                    return w.setAction(invalid);
                }).toThrow(new Error('Action must be a function!'));
            });
        });

        it('sets an action', function(){
            var f = function(){return 'whatever';};
            w.setAction(f);
            expect(w.getAction()).toBe(f);
        });
    });

    describe('Elaborates the argument', function(){
        it('performs identity transformation if the trigger returns "false"', function(){
            spyOn(w, 'getTrigger').and.returnValue(function(){return false;});
            var n = {};
            expect(w.elaborate(n)).toBe(n);
        });
        it('returns outout of the action if the trigger returns "true"', function(){
            spyOn(w, 'getTrigger').and.returnValue(function(){return true;});
            // just to be sure that the argument is passed to the action
            spyOn(w, 'getAction').and.returnValue(function(a){return (typeof a);});
            expect(w.elaborate({})).toBe('object');
        });
    });


});


