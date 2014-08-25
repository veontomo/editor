/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Mapper, window */

describe('Mapper-related functionality', function(){
    var map;
    beforeEach(function(){
        map = new Mapper();
    });

    describe('Mapper construction', function(){
        it('prevents accidental call without "new"', function(){
            map = Mapper();
            expect(map instanceof Mapper).toBe(true);
        });
    });

    describe('Mapper::getCriteria(): gets criteria', function(){
        it('returns an array', function(){
            expect(Array.isArray(map.getMappings())).toBe(true);
        });
        it('does not affect private variable criteria if accessing it be means of the getter', function(){
            expect(map.getMappings().length).toBe(0);
            map.getMappings().push('dummy text');
            expect(map.getMappings().length).toBe(0);
        });
    });

    describe('Mapper::isValidMapping() decides whether the mapping is valid', function(){
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

    describe('Mapper::default: setter and getter', function(){
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

    describe('Mapper::add(): adds mapping', function(){
        it('calls isValidMapping', function(){
            spyOn(map, 'isValidMapping');
            map.add('whatever');
            expect(map.isValidMapping).toHaveBeenCalledWith({'criterion':'whatever'});
        });
        it('returns false if isValidMapping returns false', function(){
            spyOn(map, 'isValidMapping').and.returnValue(false);
            expect(map.add(2343.2)).toBe(false);
        });
        it('returns true if isValidMapping returns true', function(){
            spyOn(map, 'isValidMapping').and.returnValue(true);
            expect(map.add()).toBe(true);
        });
        it('appends argument if isValidMapping returns true', function(){
            spyOn(map, 'isValidMapping').and.returnValue(true);
            expect(map.getMappings().length).toBe(0);
            map.add('aaa');
            expect(map.getMappings().length).toBe(1);
            expect(map.getMappings()[0].criterion).toBe('aaa');
        });
    });

    describe('Mapper::flush(): removes all mappings', function(){
        it('flushes empty mappings', function(){
            expect(map.getMappings().length).toBe(0);
            map.flush();
            expect(map.getMappings().length).toBe(0);
        });
        it('flushes, if "mappings" has one record ', function(){
            spyOn(map, 'isValidMapping').and.returnValue(true);
            map.add('any record');
            expect(map.getMappings().length).toBe(1);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });

        it('flushes, if "mappings" has one record ', function(){
            spyOn(map, 'isValidMapping').and.returnValue(true);
            map.add('any record');
            expect(map.getMappings().length).toBe(1);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });

        it('flushes, if "mappings" has two records ', function(){
            spyOn(map, 'isValidMapping').and.returnValue(true);
            map.add('first record');
            map.add('second record');
            expect(map.getMappings().length).toBe(2);
            map.flush();
            expect(Array.isArray(map.getMappings())).toBe(true);
            expect(map.getMappings().length).toBe(0);
        });
    });

    describe('Mapper::findTargetFor(): finds target for the argument', function(){
        var T1, T2, T3, T4, wrapper;
        beforeEach(function(){
            wrapper = {
                crit1: function(){return null;},
                crit2: function(){return null;},
                crit3: function(){return null;},
                crit4: function(){return null;},
            }
            T1 = function(){};
            T2 = function(){};
            T3 = function(){};
            T4 = function(){};
            spyOn(map, 'getMappings').and.callFake(function(){ return [
                {'criterion': wrapper.crit1, 'target': T1},
                {'criterion': wrapper.crit2, 'target': T2},
                {'criterion': wrapper.crit3, 'target': T3},
                {'criterion': wrapper.crit4, 'target': T4}
            ];});
        });

        it('returns first target if its "criterion" returns "true"', function(){
            spyOn(wrapper, 'crit1').and.returnValue(true);
            spyOn(wrapper, 'crit2').and.returnValue(false);
            spyOn(wrapper, 'crit3').and.returnValue(true);
            spyOn(wrapper, 'crit4').and.returnValue(false);
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('anything')).toBe(T1);
            expect(wrapper.crit1).toHaveBeenCalledWith('anything');
            expect(wrapper.crit2).not.toHaveBeenCalled();
            expect(wrapper.crit3).not.toHaveBeenCalled();
            expect(wrapper.crit4).not.toHaveBeenCalled();
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });

        it('returns second target if its "criterion" returns "true"', function(){
            spyOn(wrapper, 'crit1').and.returnValue(false);
            spyOn(wrapper, 'crit2').and.returnValue(true);
            spyOn(wrapper, 'crit3').and.returnValue(false);
            spyOn(wrapper, 'crit4').and.returnValue(true);
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('second?')).toBe(T2);
            expect(wrapper.crit1).toHaveBeenCalledWith('second?');
            expect(wrapper.crit2).toHaveBeenCalledWith('second?');
            expect(wrapper.crit3).not.toHaveBeenCalled();
            expect(wrapper.crit4).not.toHaveBeenCalled();
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });
        it('returns last target if its "criterion" returns "true"', function(){
            spyOn(wrapper, 'crit1').and.returnValue(false);
            spyOn(wrapper, 'crit2').and.returnValue(false);
            spyOn(wrapper, 'crit3').and.returnValue(false);
            spyOn(wrapper, 'crit4').and.returnValue(true);
            spyOn(map, 'getDefaultTarget');
            expect(map.findTargetFor('last')).toBe(T4);
            expect(wrapper.crit1).toHaveBeenCalledWith('last');
            expect(wrapper.crit2).toHaveBeenCalledWith('last');
            expect(wrapper.crit3).toHaveBeenCalledWith('last');
            expect(wrapper.crit4).toHaveBeenCalledWith('last');
            expect(map.getDefaultTarget).not.toHaveBeenCalled();
        });

        it('returns output of "getDefaultTarget" if no criteria functions return "true"', function(){
            spyOn(wrapper, 'crit1').and.returnValue(false);
            spyOn(wrapper, 'crit2').and.returnValue(false);
            spyOn(wrapper, 'crit3').and.returnValue(false);
            spyOn(wrapper, 'crit4').and.returnValue(false);
            spyOn(map, 'getDefaultTarget').and.returnValue('default target');
            expect(map.findTargetFor('default')).toBe('default target');
            expect(wrapper.crit1).toHaveBeenCalledWith('default');
            expect(wrapper.crit2).toHaveBeenCalledWith('default');
            expect(wrapper.crit3).toHaveBeenCalledWith('default');
            expect(wrapper.crit4).toHaveBeenCalledWith('default');
            expect(map.getDefaultTarget).toHaveBeenCalled();
        });


    });

});
