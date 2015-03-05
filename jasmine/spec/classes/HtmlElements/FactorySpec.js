/*jslint plusplus: true, white: true */
/*global describe, it, it, expect, spyOn, beforeEach, Factory, Mapper*/

describe('Factory-related functionality', function(){
    var f, mapping;
    beforeEach(function(){
        f = new Factory();
        mapping = new Mapper();
    });

    describe('Factory construction', function(){
        it('prevents accidental call without "new"', function(){
            f = Factory();
            expect(f instanceof Factory).toBe(true);
        });
        it('imposes mapping to be Mapper instance if no argument is provided', function(){
            f = new Factory();
            expect(f.getMapping() instanceof Mapper).toBe(true);
        });

        it('imposes Mapper instance if passed as argument', function(){
            f = new Factory(mapping);
            expect(f.getMapping()).toBe(mapping);
            expect(f.getMapping() instanceof Mapper).toBe(true);
        });


        it('does not set mapping to be equal to the argument if it is a string, array, number, object, function', function(){
            var invalids = ['', 'aa bb', [], [0], ['a b c', 5], 1, 2.978, 0, -1.21, {}, {1: 5}, function(){return null;} ];
            invalids.forEach(function(invalid){
                f = new Factory(invalid);
                expect(f.getMapping()).not.toBe(invalid);
                expect(f.getMapping() instanceof Mapper).toBe(true);
            });
        });

        describe('Factory::mapping: setter and getter', function(){
            it('sets mapping if it is a Mapper class instance', function(){
                f.setMapping(mapping);
                expect(f.getMapping()).toBe(mapping);
            });

            it('returns true, if the argument is a Mapper class instance', function(){
                expect(f.setMapping(mapping)).toBe(true);
            });

            it('returns false, if the argument is a string, number, array or object', function(){
                var invalids = ['', 'non empty string', 0, -4.2, [], [0], [0, 23], {}, {out: 1}];
                invalids.forEach(function(invalid){
                    expect(f.setMapping(invalid)).toBe(false);
                });
            });
        });


        describe('Factory::stub(): creates an instance corresponding to the argument', function(){
            it('returns null, if not argument is given', function(){
                expect(f.stub()).toBe(null);
            });
            it('calls "getMapping"', function(){
                function Foo(){}
                spyOn(f.getMapping(), 'findTargetFor').and.returnValue(Foo);
                var stub = f.stub('something');
                expect(stub instanceof Foo).toBe(true);
                expect(f.getMapping().findTargetFor).toHaveBeenCalledWith('something');
            });
        });

        describe('Factory::mimic(): tries to mimic the argument', function(){
            it('calls "stub" method', function(){
                spyOn(f, 'stub');
                f.mimic('an element');
                expect(f.stub).toHaveBeenCalledWith('an element');
            });
            it('calls "load" method of "stub" output, if it exists', function(){
                function Target(){this.loadFromElement = function(){return null;};}
                var target = new Target();
                spyOn(target, 'loadFromElement');
                spyOn(f, 'stub').and.returnValue(target);
                f.mimic('an element');
                expect(f.stub).toHaveBeenCalledWith('an element');
                expect(target.loadFromElement).toHaveBeenCalledWith('an element');
            });
            it('returns output of "stub" method if it has no "load" method', function(){
                function Target(){}
                var target = new Target();
                spyOn(f, 'stub').and.returnValue(target);
                var copy = f.mimic('an element');
                expect(f.stub).toHaveBeenCalledWith('an element');
                expect(copy instanceof Target).toBe(true);
            });
        });
    });
    describe('has a method "findClass" that', function(){
        var A, B, C, cTrue, cFalse;
        beforeEach(function(){
            A = function(){return;};
            B = function(){return;};
            C = function(){return;};
            cTrue = function(){return true;};
            cFalse = function(){return false;};
        });

        it('returns nothing if array of available classes is empty', function(){
            spyOn(f, 'getAvailableClasses').and.returnValue([]);
            expect(f.findClass(cTrue)).not.toBeDefined();
        });
        it('returns nothing if the criteria always returns false', function(){
            expect(f.findClass(cFalse)).not.toBeDefined();
        });
        it('returns the first class of the available ones if the criteria always returns true', function(){
            spyOn(f, 'getAvailableClasses').and.returnValue([A, B, C]);
            expect(f.findClass(cTrue)).toBe(A);
        });
        it('returns the second class of the available ones if the criteria evaluates to true on 2-nd and 3-d classes', function(){
            var crit = function(x){return x === A || x === B;}
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(f.findClass(crit)).toBe(A);
        });
        it('does not throw expection if the criteria throws one', function(){
            var crit = function(x){throw new Error('error!');}
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(function(){
                f.findClass(crit)
            }).not.toThrow();
        });
        it('returns the third class of the available ones if the criteria evaluates to true on it but on previous calls it throws an error', function(){
            var crit = function(x){
                if(x === B) {return true;}
                if(x === A) {throw new Error('error');}
            }
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(f.findClass(crit)).toBe(B);
        });
    });


});
