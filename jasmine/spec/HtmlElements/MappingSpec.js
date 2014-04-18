/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Mapping, window */

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
        var T1, T2, T3, T4;
        beforeEach(function(){
            window.crit1 = function(){return null;};
            window.crit2 = function(){return null;};
            window.crit3 = function(){return null;};
            window.crit4 = function(){return null;};
            T1 = function(){};
            T2 = function(){};
            T3 = function(){};
            T4 = function(){};
            spyOn(map, 'getMappings').andCallFake(function(){return [
                {'criterion': crit1, 'target': T1},
                {'criterion': crit2, 'target': T2},
                {'criterion': crit3, 'target': T3},
                {'criterion': crit4, 'target': T4}
            ]});

        });

        it('returns first target if its "criterion" returns "true"', function(){
            spyOn(window, 'crit1').andCallFake(function(){return true;});
            spyOn(window, 'crit2').andCallFake(function(){return false;});
            spyOn(window, 'crit3').andCallFake(function(){return true;});
            spyOn(window, 'crit4').andCallFake(function(){return false;});
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('anything')).toBe(T1);
            expect(window.crit1).toHaveBeenCalledWith('anything');
            expect(window.crit2).not.toHaveBeenCalled();
            expect(window.crit3).not.toHaveBeenCalled();
            expect(window.crit4).not.toHaveBeenCalled();
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });

        it('returns second target if its "criterion" returns "true"', function(){
            spyOn(window, 'crit1').andCallFake(function(){return false;});
            spyOn(window, 'crit2').andCallFake(function(){return true;});
            spyOn(window, 'crit3').andCallFake(function(){return false;});
            spyOn(window, 'crit4').andCallFake(function(){return true;});
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('second?')).toBe(T2);
            expect(window.crit1).toHaveBeenCalledWith('second?');
            expect(window.crit2).toHaveBeenCalledWith('second?');
            expect(window.crit3).not.toHaveBeenCalled();
            expect(window.crit4).not.toHaveBeenCalled();
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });
        it('returns last target if its "criterion" returns "true"', function(){
            spyOn(window, 'crit1').andCallFake(function(){return false;});
            spyOn(window, 'crit2').andCallFake(function(){return false;});
            spyOn(window, 'crit3').andCallFake(function(){return false;});
            spyOn(window, 'crit4').andCallFake(function(){return true;});
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('last')).toBe(T4);
            expect(window.crit1).toHaveBeenCalledWith('last');
            expect(window.crit2).toHaveBeenCalledWith('last');
            expect(window.crit3).toHaveBeenCalledWith('last');
            expect(window.crit4).toHaveBeenCalledWith('last');
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });

        it('returns output of "getDefaultTarget" if no criteria functions return "true"', function(){
            spyOn(window, 'crit1').andCallFake(function(){return false;});
            spyOn(window, 'crit2').andCallFake(function(){return false;});
            spyOn(window, 'crit3').andCallFake(function(){return false;});
            spyOn(window, 'crit4').andCallFake(function(){return false;});
            spyOn(map, 'getDefaultTarget').andCallFake(function(){return 'default target';});
            expect(map.findTargetFor('default')).toBe('default target');
            expect(window.crit1).toHaveBeenCalledWith('default');
            expect(window.crit2).toHaveBeenCalledWith('default');
            expect(window.crit3).toHaveBeenCalledWith('default');
            expect(window.crit4).toHaveBeenCalledWith('default');
            expect(map.getDefaultTarget).toHaveBeenCalled();
        });


    });

});
