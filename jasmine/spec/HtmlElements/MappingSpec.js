/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Mapping*/

describe('Mapping-related functionality', function(){
    var map;
    beforeEach(function(){
        map = new Mapping();
    });

    describe('Mapping construction', function(){
        it('prevents accidental call without "new"', function(){
            map = Mapping();
            expect(map instanceof Mapping).toBe(true);
        });
    });

    describe('Mapping::getCriteria(): gets criteria', function(){
        it('returns an array', function(){
            expect(Array.isArray(map.getMappings())).toBe(true);
        });
        it('does not affect private variable criteria if accessing it be means of the getter', function(){
            expect(map.getMappings().length).toBe(0);
            map.getMappings().push('dummy text');
            expect(map.getMappings().length).toBe(0);
        });
    });

    describe('Mapping::isValidMapping() decides whether the mapping is valid', function(){
        var DummyClass;
        beforeEach(function(){
            DummyClass = function(){return null;};
        });
        it('returns false if the argument is missing', function(){
            expect(map.isValidMapping()).toBe(false);
        });
        it('returns false if the argument has no "criterion" key', function(){
            expect(map.isValidMapping({'target': DummyClass})).toBe(false);
        });

        it('returns false if "criterion" key is a string, number, array or an object', function(){
            var invalids = ['', 'non empty string', 0, -4.2, [], [0], [0, 23], {}, {out: 1}];
            invalids.forEach(function(invalid){
                expect(map.isValidMapping({'criterion': invalid, 'target': DummyClass})).toBe(false);
            });
        });
        it('returns false, if the argument has no "target" key', function(){
            expect(map.isValidMapping({'criterion': function(){return null;}})).toBe(false);
        });

        it('returns true, if the argument has correct "criterion" and "target" keys', function(){
            expect(map.isValidMapping({'criterion': function(){return null;}, 'target': DummyClass})).toBe(true);
        });
    });

    describe('Mapping::default: setter and getter', function(){
        var DummyClass;
        beforeEach(function(){
            DummyClass = function(){return null;};
        });

        it('sets default target if the argument is a function', function(){
            map.setDefaultTarget(DummyClass);
            expect(map.getDefaultTarget()).toBe(DummyClass);
        });

        it('does not set default target if the argument is a string, number, array or object', function(){
            var invalids = ['', 'non empty string', 0, -4.2, [], [0], [0, 23], {}, {out: 1}];
            invalids.forEach(function(invalid){
                map.setDefaultTarget(invalid);
                expect(map.getDefaultTarget()).toBe(null);
            });
        });
    });

    describe('Mapping::add(): adds mapping', function(){
        it('calls isValidMapping', function(){
            spyOn(map, 'isValidMapping');
            map.add('whatever');
            expect(map.isValidMapping).toHaveBeenCalledWith({'criterion':'whatever'});
        });
        it('returns false if isValidMapping returns false', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return false;});
            expect(map.add(2343.2)).toBe(false);
        });
        it('returns true if isValidMapping returns true', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return true;});
            expect(map.add()).toBe(true);
        });
        it('appends argument if isValidMapping returns true', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return true;});
            expect(map.getMappings().length).toBe(0);
            map.add('aaa');
            expect(map.getMappings().length).toBe(1);
            expect(map.getMappings()[0].criterion).toBe('aaa');
        });
    });

    describe('Mapping::flush(): removes all mappings', function(){
        it('flushes empty mappings', function(){
            expect(map.getMappings().length).toBe(0);
            map.flush();
            expect(map.getMappings().length).toBe(0);
        });
        it('flushes, if "mappings" has one record ', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return true;});
            map.add('any record');
            expect(map.getMappings().length).toBe(1);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });

        it('flushes, if "mappings" has one record ', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return true;});
            map.add('any record');
            expect(map.getMappings().length).toBe(1);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });

        it('flushes, if "mappings" has two records ', function(){
            spyOn(map, 'isValidMapping').andCallFake(function(){return true;});
            map.add('first record');
            map.add('second record');
            expect(map.getMappings().length).toBe(2);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });
    });

    describe('Mapping::findTargetFor(): finds target for the argument', function(){

        it('calls "criterion" from each "mapping" until first true', function(){
            var crit1 = function(){return null;},
                crit2 = function(){return null;},
                crit3 = function(){return null;},
                crit4 = function(){return null;},
                T1 = function(){},
                T2 = function(){},
                T3 = function(){},
                T4 = function(){};
            map.add({});


        });
    });

});