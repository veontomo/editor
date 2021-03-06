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

        describe('Factory::stub(): creates an instance corresponding to the argument', function(){
            it('returns null, if no argument is given', function(){
                expect(f.stub()).not.toBeDefined();
            });
            it('passes it argument to method findClassFor()', function(){
                var obj = {};
                spyOn(f, 'findClassFor');
                f.stub(obj);
                expect(f.findClassFor).toHaveBeenCalledWith(obj);
            });
            it('produces an instance of class A if method findClassFor() outputs class A', function(){
                function A(){return;}
                spyOn(f, 'findClassFor').and.returnValue(A);
                var stub = f.stub('something');
                expect(stub instanceof A).toBe(true);
            });
            it('produces an instance of class B if method findClassFor() outputs nothing and getDefaultClass() produces B', function(){
                function B(){return;}
                spyOn(f, 'findClassFor');
                spyOn(f, 'getDefaultClass').and.returnValue(B);
                var stub = f.stub('something');
                expect(stub instanceof B).toBe(true);
            });
            it('produces nothing if findClassFor() and getDefaultClass() produce nothing', function(){
                function B(){return;}
                spyOn(f, 'findClassFor');
                spyOn(f, 'getDefaultClass');
                var stub = f.stub('something');
                expect(stub).not.toBeDefined();
            });



        });

        describe('Factory::mimic(): tries to mimic the argument', function(){
            it('calls "stub" method', function(){
                spyOn(f, 'stub');
                f.mimic('an element');
                expect(f.stub).toHaveBeenCalledWith('an element');
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
            var crit = function(x){return x === A || x === B;};
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(f.findClass(crit)).toBe(A);
        });
        it('does not throw expection if the criteria throws one', function(){
            var crit = function(){throw new Error('error!');};
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(function(){
                f.findClass(crit);
            }).not.toThrow();
        });
        it('returns the third class of the available ones if the criteria evaluates to true on it but on previous calls it throws an error', function(){
            var crit = function(x){
                if(x === B) {return true;}
                if(x === A) {throw new Error('error');}
            };
            spyOn(f, 'getAvailableClasses').and.returnValue([C, A, B]);
            expect(f.findClass(crit)).toBe(B);
        });
    });

    describe('has a method "findClassByName" that', function(){
        var Bmw, Porsche, Fiat, AlfaRomeo, WithoutName;
        beforeEach(function(){
            Bmw =     function(){this.getName = function(){return 'Bmw';};};
            Porsche = function(){this.getName = function(){return 'Porsche';};};
            AlfaRomeo =  function(){this.getName = function(){return 'Alfa Romeo';};};
            Fiat =    function(){this.getName = function(){return 'Fiat';};};
            WithoutName = function(){return;};
            f.setAvailableClasses([Bmw, WithoutName, AlfaRomeo, Porsche, Fiat]);
        });
        it('returns nothing if the argument is a number', function(){
            expect(f.findClassByName(0)).not.toBeDefined();
            expect(f.findClassByName(1)).not.toBeDefined();
            expect(f.findClassByName(4)).not.toBeDefined();
            expect(f.findClassByName(-12.99)).not.toBeDefined();
        });
        it('returns nothing if the argument is an array', function(){
            expect(f.findClassByName([])).not.toBeDefined();
            expect(f.findClassByName([0, 1])).not.toBeDefined();
        });
        it('returns nothing if the argument is a function', function(){
            expect(f.findClassByName(function(){return;})).not.toBeDefined();
        });
        it('returns nothing if the argument is an object', function(){
            expect(f.findClassByName({})).not.toBeDefined();
        });
        it('returns nothing if no class has requested name', function(){
            expect(f.findClassByName('no such name')).not.toBeDefined();
        });
        it('returns class Fiat if the argument is "Fiat"', function(){
            expect(f.findClassByName('Fiat')).toBe(Fiat);
        });
        it('returns class Porsche if the argument is "Porsche"', function(){
            expect(f.findClassByName('Alfa Romeo')).toBe(AlfaRomeo);
        });
        it('returns nothing if the argument is "BMW"', function(){
            expect(f.findClassByName('BMW')).not.toBeDefined();
        });
    });

    describe('has a method "produceInstanceOf" that', function(){
        it('returns nothing if the argument is a number', function(){
            expect(f.produceInstanceOf(0)).not.toBeDefined();
            expect(f.produceInstanceOf(1)).not.toBeDefined();
            expect(f.produceInstanceOf(4)).not.toBeDefined();
            expect(f.produceInstanceOf(-12.99)).not.toBeDefined();
        });
        it('returns nothing if the argument is an array', function(){
            expect(f.produceInstanceOf([])).not.toBeDefined();
            expect(f.produceInstanceOf([0, 1])).not.toBeDefined();
        });
        it('returns nothing if the argument is a string', function(){
            expect(f.produceInstanceOf('a string')).not.toBeDefined();
        });
        it('returns nothing if the argument is an object', function(){
            expect(f.produceInstanceOf({})).not.toBeDefined();
        });
        it('returns an instance of given class', function(){
            var A = function(){};
            expect(f.produceInstanceOf(A) instanceof A).toBe(true);
        });
        it('does not throw any error even if argument is a an error-throwing function', function(){
            var A = function(){throw new Error('error!!!');};
            expect(function(){
                f.produceInstanceOf(A);
            }).not.toThrow();
        });



    });


});
