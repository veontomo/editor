/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Properties, PropertiesChild, window
 */

describe('Properties-related functionality', function(){
    var props;
    beforeEach(function(){
        props = new Properties();
    });

    describe('has statically defined constant', function(){
        describe('named MODE_ATTRIBUTE that', function(){
            it('is equal to 0', function(){
                expect(Properties.MODE_ATTRIBUTE).toBe(0);
            });
            it('remains equal to 0 even if one assignes another value to it', function(){
                Properties.MODE_ATTRIBUTE = 4;
                expect(Properties.MODE_ATTRIBUTE).toBe(0);
            });
        });
        describe('named MODE_ATTRIBUTE that', function(){
            it('named MODE_STYLE that is equal to 1', function(){
                expect(Properties.MODE_STYLE).toBe(1);
            });
            it('remains equal to 1 even if one assignes another value to it', function(){
                Properties.MODE_STYLE = 'a string';
                expect(Properties.MODE_STYLE).toBe(1);
            });

        });
    });


    describe('setProperty(): property setter', function(){
        it('returns false, if no argument is given', function(){
            expect(props.setProperty()).toBe(false);
        });

        it('returns false if only one argument is given', function(){
           expect(props.setProperty('a')).toBe(false);
        });

        it('returns true if both key and value types are among allowed ones', function(){
            spyOn(props, 'getAllowedKeyTypes').and.returnValue(['string', 'number']);
            spyOn(props, 'getAllowedValueTypes').and.returnValue(['object']);
            expect(props.setProperty('a key', {1: 'good'})).toBe(true);
        });

        it('returns false if key type is not among allowed, but value is among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').and.returnValue(['number']);
            spyOn(props, 'getAllowedValueTypes').and.returnValue(['string']);
            expect(props.setProperty('class', 'value')).toBe(false);
        });

        it('returns false if key type is among allowed, but value is not among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').and.returnValue(['number']);
            spyOn(props, 'getAllowedValueTypes').and.returnValue(['number']);
            expect(props.setProperty(2, {})).toBe(false);
        });

        it('returns false if both key and value types are not among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').and.returnValue(['object']);
            spyOn(props, 'getAllowedValueTypes').and.returnValue(['string']);
            expect(props.setProperty('a string', 3)).toBe(false);
        });
    });

    describe('Smart getter', function(){
        it('returns property if it is set directly', function(){
            props.setProperty('border', '20px');
            expect(props.getProperty('border')).toBe('20px');
        });
        describe('finds left/right/top/bottom properties', function(){
            describe('if base property is set as a single length', function(){
                beforeEach(function(){
                    props.setProperty('border', '20px');
                });
                it('returns "20px" for "border-left"', function(){
                    expect(props.getProperty('border-left')).toBe('20px');
                });
                it('returns "20px" for "border-right"', function(){
                    expect(props.getProperty('border-right')).toBe('20px');
                });
                it('returns "20px" for "border-top"', function(){
                    expect(props.getProperty('border-top')).toBe('20px');
                });
                it('returns "20px" for "border-bottom"', function(){
                    expect(props.getProperty('border-bottom')).toBe('20px');
                });
            });
            describe('if base property is set as two lengths (like "20px 10em")', function(){
                beforeEach(function(){
                    props.setProperty('padding', '20px 10em');
                });
                it('returns "left" property if it is and ignores the base property', function(){
                    props.setProperty('padding-left', '6pt');
                    expect(props.getProperty('padding-left')).toBe('6pt');
                });
                it('returns "right" property if it is and ignores the base property', function(){
                    props.setProperty('padding-right', '7pt');
                    expect(props.getProperty('padding-right')).toBe('7pt');
                });
                it('returns "top" property if it is and ignores the base property', function(){
                    props.setProperty('padding-top', '6pt');
                    expect(props.getProperty('padding-top')).toBe('6pt');
                });
                it('returns "bottom" property if it is and ignores the base property', function(){
                    props.setProperty('padding-bottom', '2pt');
                    expect(props.getProperty('padding-bottom')).toBe('2pt');
                });

                it('returns first length for "top" property', function(){
                    expect(props.getProperty('padding-top')).toBe('20px');
                });
                it('returns first length for "bottom" property', function(){
                    expect(props.getProperty('padding-bottom')).toBe('20px');
                });
                it('returns second length for "left" property', function(){
                    expect(props.getProperty('padding-left')).toBe('10em');
                });
                it('returns second length for "right" property', function(){
                    expect(props.getProperty('padding-right')).toBe('10em');
                });
            });

            describe('if base property is set as three lengths (like "1pt 20px 10em")', function(){
                beforeEach(function(){
                    props.setProperty('padding', '1pt 20px 10em');
                });
                it('returns "left" property if it is and ignores the base property', function(){
                    props.setProperty('padding-left', '6pt');
                    expect(props.getProperty('padding-left')).toBe('6pt');
                });
                it('returns "right" property if it is and ignores the base property', function(){
                    props.setProperty('padding-right', '7pt');
                    expect(props.getProperty('padding-right')).toBe('7pt');
                });
                it('returns "top" property if it is and ignores the base property', function(){
                    props.setProperty('padding-top', '6pt');
                    expect(props.getProperty('padding-top')).toBe('6pt');
                });
                it('returns "bottom" property if it is and ignores the base property', function(){
                    props.setProperty('padding-bottom', '2pt');
                    expect(props.getProperty('padding-bottom')).toBe('2pt');
                });

                it('returns first length for "top" property', function(){
                    expect(props.getProperty('padding-top')).toBe('1pt');
                });
                it('returns second length for "right" property', function(){
                    expect(props.getProperty('padding-right')).toBe('20px');
                });

                it('returns third length for "bottom" property', function(){
                    expect(props.getProperty('padding-bottom')).toBe('10em');
                });
                it('returns second length for "left" property', function(){
                    expect(props.getProperty('padding-left')).toBe('20px');
                });
            });

            describe('if base property is set as four lengths (like "1pt 2px 3em 4%")', function(){
                beforeEach(function(){
                    props.setProperty('padding', '1pt 2px 3em 4%');
                });
                it('returns "left" property if it is and ignores the base property', function(){
                    props.setProperty('padding-left', '6pt');
                    expect(props.getProperty('padding-left')).toBe('6pt');
                });
                it('returns "right" property if it is and ignores the base property', function(){
                    props.setProperty('padding-right', '7pt');
                    expect(props.getProperty('padding-right')).toBe('7pt');
                });
                it('returns "top" property if it is and ignores the base property', function(){
                    props.setProperty('padding-top', '6pt');
                    expect(props.getProperty('padding-top')).toBe('6pt');
                });
                it('returns "bottom" property if it is and ignores the base property', function(){
                    props.setProperty('padding-bottom', '2pt');
                    expect(props.getProperty('padding-bottom')).toBe('2pt');
                });

                it('returns first length for "top" property', function(){
                    expect(props.getProperty('padding-top')).toBe('1pt');
                });
                it('returns second length for "right" property', function(){
                    expect(props.getProperty('padding-right')).toBe('2px');
                });

                it('returns third length for "bottom" property', function(){
                    expect(props.getProperty('padding-bottom')).toBe('3em');
                });
                it('returns fourth length for "left" property', function(){
                    expect(props.getProperty('padding-left')).toBe('4%');
                });
            });
        });
        it('returns nothing if niether requested nor base properties are set', function(){
            expect(props.getProperty('margin')).not.toBeDefined();
            expect(props.getProperty('margin-left')).not.toBeDefined();
        });
    });

    describe('Method getPropertyBySide,', function(){
        describe('when the property is not defined', function(){
            beforeEach(function(){
                spyOn(props, 'getProperty');
            });
            it('returns nothing for "top"', function(){
                expect(props.getPropertyBySide('whatever', 'top')).not.toBeDefined();
            });
            it('returns nothing for "right"', function(){
                expect(props.getPropertyBySide('whatever', 'right')).not.toBeDefined();
            });
            it('returns nothing for "bottom"', function(){
                expect(props.getPropertyBySide('whatever', 'bottom')).not.toBeDefined();
            });
            it('returns nothing for "left"', function(){
                expect(props.getPropertyBySide('whatever', 'left')).not.toBeDefined();
            });
            it('returns nothing if the side is wrong', function(){
                expect(props.getPropertyBySide('whatever', 'upperleft')).not.toBeDefined();
            });
        });
        describe('when the property contains single word', function(){
            beforeEach(function(){
                spyOn(props, 'getProperty').and.returnValue('10px');
            });
            it('returns it for "top"', function(){
                expect(props.getPropertyBySide('whatever', 'top')).toBe('10px');
            });
            it('returns it for "right"', function(){
                expect(props.getPropertyBySide('whatever', 'right')).toBe('10px');
            });
            it('returns it for "bottom"', function(){
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('10px');
            });
            it('returns it for "left"', function(){
                expect(props.getPropertyBySide('whatever', 'left')).toBe('10px');
            });
            it('returns nothing if the side is wrong', function(){
                expect(props.getPropertyBySide('whatever', 'upperleft')).not.toBeDefined();
            });
        });
        describe('when the property contains single word with trailing spaces', function(){
            it('at the beginning, drops them for "top"', function(){
                spyOn(props, 'getProperty').and.returnValue('  10px');
                expect(props.getPropertyBySide('whatever', 'top')).toBe('10px');
            });
            it('at the beginning, drops them for "right"', function(){
                spyOn(props, 'getProperty').and.returnValue('  10px');
                expect(props.getPropertyBySide('whatever', 'right')).toBe('10px');
            });
            it('at the beginning, drops them for "bottom"', function(){
                spyOn(props, 'getProperty').and.returnValue('  10px');
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('10px');
            });
            it('at the beginning, drops them for "left"', function(){
                spyOn(props, 'getProperty').and.returnValue('  10px');
                expect(props.getPropertyBySide('whatever', 'left')).toBe('10px');
            });
            it('returns nothing if the side is wrong', function(){
                spyOn(props, 'getProperty').and.returnValue('  10px');
                expect(props.getPropertyBySide('whatever', 'upperleft')).not.toBeDefined();
            });
            it('at the end, drops them for "top"', function(){
                spyOn(props, 'getProperty').and.returnValue('7%    ');
                expect(props.getPropertyBySide('whatever', 'top')).toBe('7%');
            });
            it('at the end, drops them for "right"', function(){
                spyOn(props, 'getProperty').and.returnValue('7%    ');
                expect(props.getPropertyBySide('whatever', 'right')).toBe('7%');
            });
            it('at the end, drops them for "bottom"', function(){
                spyOn(props, 'getProperty').and.returnValue('7%    ');
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('7%');
            });
            it('at the end, drops them for "left"', function(){
                spyOn(props, 'getProperty').and.returnValue('7%    ');
                expect(props.getPropertyBySide('whatever', 'left')).toBe('7%');
            });
            it('returns nothing if the side is wrong', function(){
                spyOn(props, 'getProperty').and.returnValue('7%    ');
                expect(props.getPropertyBySide('whatever', 'upperleft')).not.toBeDefined();
            });
            it('at both ends, drops them for "top"', function(){
                spyOn(props, 'getProperty').and.returnValue(' 19pt  ');
                expect(props.getPropertyBySide('whatever', 'top')).toBe('19pt');
            });
            it('at both ends, drops them for "right"', function(){
                spyOn(props, 'getProperty').and.returnValue(' 19pt  ');
                expect(props.getPropertyBySide('whatever', 'right')).toBe('19pt');
            });
            it('at both ends, drops them for "bottom"', function(){
                spyOn(props, 'getProperty').and.returnValue(' 19pt  ');
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('19pt');
            });
            it('at both ends, drops them for "left"', function(){
                spyOn(props, 'getProperty').and.returnValue(' 19pt  ');
                expect(props.getPropertyBySide('whatever', 'left')).toBe('19pt');
            });
            it('returns nothing if the side is wrong', function(){
                spyOn(props, 'getProperty').and.returnValue(' 19pt  ');
                expect(props.getPropertyBySide('whatever', 'upperleft')).not.toBeDefined();
            });


        });

        describe('when the property contains two words', function(){
            beforeEach(function(){
                spyOn(props, 'getProperty').and.returnValue('1em 5px');
            });
            it('returns first word for "top"', function(){
                expect(props.getPropertyBySide('whatever', 'top')).toBe('1em');
            });
            it('returns second word for "right"', function(){
                expect(props.getPropertyBySide('whatever', 'right')).toBe('5px');
            });
            it('returns first word for "bottom"', function(){
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('1em');
            });
            it('returns second word for "left"', function(){
                expect(props.getPropertyBySide('whatever', 'left')).toBe('5px');
            });
            it('returns nothing if the side is wrong', function(){
                expect(props.getPropertyBySide('whatever', 'upper')).not.toBeDefined();
            });
        });
        describe('when the property contains three words', function(){
            beforeEach(function(){
                spyOn(props, 'getProperty').and.returnValue('1em 5px X');
            });
            it('returns first word for "top"', function(){
                expect(props.getPropertyBySide('whatever', 'top')).toBe('1em');
            });
            it('returns second word for "right"', function(){
                expect(props.getPropertyBySide('whatever', 'right')).toBe('5px');
            });
            it('returns third word for "bottom"', function(){
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('X');
            });
            it('returns second word for "left"', function(){
                expect(props.getPropertyBySide('whatever', 'left')).toBe('5px');
            });
            it('returns nothing if the side is wrong', function(){
                expect(props.getPropertyBySide('whatever', 'upper')).not.toBeDefined();
            });
        });
        describe('when the property contains four words', function(){
            beforeEach(function(){
                spyOn(props, 'getProperty').and.returnValue('1em 5px X 0pt');
            });
            it('returns first word for "top"', function(){
                expect(props.getPropertyBySide('whatever', 'top')).toBe('1em');
            });
            it('returns second word for "right"', function(){
                expect(props.getPropertyBySide('whatever', 'right')).toBe('5px');
            });
            it('returns third word for "bottom"', function(){
                expect(props.getPropertyBySide('whatever', 'bottom')).toBe('X');
            });
            it('returns forth word for "left"', function(){
                expect(props.getPropertyBySide('whatever', 'left')).toBe('0pt');
            });
            it('returns nothing if the side is wrong', function(){
                expect(props.getPropertyBySide('whatever', 'upper')).not.toBeDefined();
            });
        });
    });

    describe('Setting mode', function(){
        it ('sets mode to 0 if the argument is 0', function(){
            props.setMode(0);
            expect(props.getMode()).toBe(0);
        });
        it ('sets mode to 1 if the argument is 1', function(){
            props.setMode(1);
            expect(props.getMode()).toBe(1);
        });
        it ('throws an error if the argument is not 0 or 1', function(){
            var invalids = [2, 6.1, 'string', [1, 2], [], {}, {'load': 10}];
            invalids.forEach(function(invalid){
                expect(function(){
                    return props.setMode(invalid);
                }).toThrow(new Error('Allowed values for mode are 0, 1.'));
            });
        });
    });

    describe('Produces string representation', function(){
        var propEmpty, propSimple, propComplex;
        beforeEach(function(){
            propEmpty = new Properties();
            propSimple = new Properties();
            propComplex = new Properties();
            propSimple.setProperty('width', 200);
            propSimple.setProperty('class', 'screen');
            propSimple.setProperty('id', "#abcd");
            propComplex.setProperty('width', 200);
            propComplex.setProperty('class', 'screen');
            propComplex.setProperty('nested', propSimple);
        });
        it('produces empty string for empty property if mode is 0', function(){
            spyOn(propEmpty, 'getMode').and.returnValue(0);
            expect(propEmpty.toString()).toBe('');
        });
        it('produces empty string for empty property if mode is 1', function(){
            spyOn(propEmpty, 'getMode').and.returnValue(1);
            expect(propEmpty.toString()).toBe('');
        });

        it('produces inline-like representation if mode is 1', function(){
            spyOn(propSimple, 'getMode').and.returnValue(1);
            expect(propSimple.toString()).toBe('width: 200px; class: screen; id: #abcd;');
        });

        it('produces attribute-like representation if mode is 0', function(){
            spyOn(propSimple, 'getMode').and.returnValue(0);
            expect(propSimple.toString()).toBe('width="200" class="screen" id="#abcd"');
        });

        it('produces inline-like representation if mode is 0', function(){
            spyOn(propComplex, 'getMode').and.returnValue(0);
            spyOn(propSimple, 'toString').and.returnValue('nested representation');
            expect(propComplex.toString()).toBe('width="200" class="screen" nested="nested representation"');
        });

        it('produces inline-like representation if mode is 1', function(){
            spyOn(propComplex, 'getMode').and.returnValue(1);
            spyOn(propSimple, 'toString').and.returnValue('nested representation');
            expect(propComplex.toString()).toBe('width: 200px; class: screen; nested: nested representation;');
        });

        it('ignores attribute if its toString() method returns empty string', function(){
            spyOn(propComplex, 'getMode').and.returnValue(1);
            spyOn(propSimple, 'toString').and.returnValue('');
            expect(propComplex.toString()).toBe('width: 200px; class: screen;');
        });
    });


    describe('getProperty(): property getter', function(){
        it('returns "undefined" if the property is not set', function(){
            props.setProperty('a', 20);
            expect(props.getProperty('a-property-that-was-not-set')).not.toBeDefined();
        });
        it('returns a string if the property is a string', function(){
            props.setProperty('level', 'nested');
            expect(props.getProperty('level')).toBe('nested');
        });

        it('returns a number if the property is a number', function(){
            props.setProperty('middle', 192);
            expect(props.getProperty('middle')).toBe(192);
        });

        it('returns attribute value from the Properties core and not from Properties itself', function(){
            // impose two attributes with the same name: one inside the Properties itself and the other
            // inside the Properties core
            props.dummyAttribute = 'inside properties class';
            props.setProperty('dummyAttribute', 'inside core');
            expect(props.getProperty('dummyAttribute')).toBe('inside core');
        });
    });

    describe('Properties::constructor(): creates Properties instance from argument', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            props = Properties();
            expect(props instanceof Properties).toBe(true);
        });

        it('sets "className" property to be equal to "Properties"', function(){
            expect(props.getName()).toBe('Properties');
        });

        it('populates properties from a string input', function(){
            props = new Properties('a:10em; color: some color; another-attr: un altro valore; bivalued: 1px 3px');
            expect(props.getProperty('a')).toBe('10em');
            expect(props.getProperty('color')).toBe('some color');
            expect(props.getProperty('another-attr')).toBe('un altro valore');
            expect(props.getProperty('bivalued')).toBe('1px 3px');
        });

        it('populates properties from an object without methods inside', function(){
            props = new Properties({'a': 10,
                'color': 'some color',
                'another-attr': 'un altro valore',
                'bool': true
            });
            expect(props.getProperty('a')).toBe(10);
            expect(props.getProperty('color')).toBe('some color');
            expect(props.getProperty('another-attr')).toBe('un altro valore');
            expect(props.getProperty('bool')).not.toBeDefined();
        });
        it('populates properties from an object with a method inside', function(){
            props = new Properties({'a':10,
               'color': 'some color',
               'another-attr': 'un altro valore',
               'func': function(){return 1;},
               'bool': true
           });
           expect(props.getProperty('a')).toBe(10);
           expect(props.getProperty('color')).toBe('some color');
           expect(props.getProperty('another-attr')).toBe('un altro valore');
           expect(props.getProperty('func')).not.toBeDefined();
           expect(props.getProperty('bool')).not.toBeDefined();
        });
    });

    describe('Gives possibility to see the core', function(){
        beforeEach(function(){
            props.setProperty('key1', 1);
            props.setProperty('key2', 'two');
            props.setProperty('key3', 'three');
        });
        it('returns core content', function(){
            var core = props.getCore();
            expect(Object.keys(core).length).toBe(3);
            expect(core.key1).toBe(1);
            expect(core.key2).toBe('two');
            expect(core.key3).toBe('three');
        });
        it('returns a copy of the core content, not reference to it', function(){
            var core = props.getCore();
            // changes made on the copy do not affect the core
            expect(core.hasOwnProperty('key2')).toBe(true);
            expect(core.key2).toBe('two');
            core.key2 = 'not two';
            expect(props.getCore().key2).toBe('two');
        });
    });

    describe('Whether the property is empty', function(){
        it('calls "getCore" method', function(){
            spyOn(props, 'getCore').and.returnValue({});
            props.isEmpty();
            expect(props.getCore).toHaveBeenCalled();
        });
        it('returns true if "getCore" returns empty object', function(){
            spyOn(props, 'getCore').and.returnValue({});
            expect(props.isEmpty()).toBe(true);
        });
        it('returns false if "getCore" returns single-record string-valued object', function(){
            spyOn(props, 'getCore').and.returnValue({key: 'value'});
            expect(props.isEmpty()).toBe(false);
        });
        it('returns false if "getCore" returns single-record number-valued object', function(){
            spyOn(props, 'getCore').and.returnValue({prop: 2.98});
            expect(props.isEmpty()).toBe(false);
        });
        it('returns false if "getCore" returns two-record object', function(){
            spyOn(props, 'getCore').and.returnValue({prop: 2.98, val: 'high'});
            expect(props.isEmpty()).toBe(false);
        });
    });

    describe('Properties::suggestProperty(): sets property if it is not defined', function(){
        it('calls setProperty() method if a property is missing in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.returnValue(false);
            props.suggestProperty('a: 192; b: new');
            expect(props.setProperty).toHaveBeenCalledWith('a', '192');
            expect(props.setProperty).toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('a');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });
        it('does not call setProperty() method if a property is present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.returnValue(true);
            props.suggestProperty('hi: yes; b: new');
            expect(props.setProperty).not.toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).not.toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });

        it('calls setProperty() method only with keys not present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.callFake(function(key){return key === 'present' || key === 'present2';});
            props.suggestProperty('hi: yes; present: 3; b: old; present2: nice');
            expect(props.setProperty).not.toHaveBeenCalledWith('present', '3');
            expect(props.setProperty).not.toHaveBeenCalledWith('present2', 'nice');
            expect(props.setProperty).toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).toHaveBeenCalledWith('b', 'old');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
            expect(props.hasProperty).toHaveBeenCalledWith('present');
            expect(props.hasProperty).toHaveBeenCalledWith('present2');

        });
        it('calls setProperty() method if a property is missing in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.returnValue(false);
            props.suggestProperty({a: 192, b: 'new'});
            expect(props.setProperty).toHaveBeenCalledWith('a', 192);
            expect(props.setProperty).toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('a');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });
        it('does not call setProperty() method if a property is present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.returnValue(true);
            props.suggestProperty({hi: 'yes', b: 'new'});
            expect(props.setProperty).not.toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).not.toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });

        it('calls setProperty() method only with keys not present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').and.callFake(function(key){return key === 'present' || key === 'present2';});
            props.suggestProperty({hi: 'yes', present: 3, b: 'old', present2: 'nice'});
            expect(props.setProperty).not.toHaveBeenCalledWith('present', '3');
            expect(props.setProperty).not.toHaveBeenCalledWith('present2', 'nice');
            expect(props.setProperty).toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).toHaveBeenCalledWith('b', 'old');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
            expect(props.hasProperty).toHaveBeenCalledWith('present');
            expect(props.hasProperty).toHaveBeenCalledWith('present2');

        });
    });

    describe('Property::hasOwnProperty(): whether the property is present in the core', function(){
        it('returns true, if requested property is present in the core', function(){
            props.setProperty('foo', 22);
            expect(props.hasProperty('foo')).toBe(true);
        });
        it('returns false, if the core is empty', function(){
            expect(props.propNum()).toBe(0);
            expect(props.hasProperty('property')).toBe(false);
        });
        it('returns false, if the core is not empty but does not contain requested property', function(){
            props.setProperty('level', 'sea');
            props.setProperty('window', 5.8);
            expect(props.propNum()).toBe(2);
            expect(props.hasProperty('door')).toBe(false);
        });
    });

    describe('Properties::dropProperty(): drops the property', function(){
        it('drops the property if it is present', function(){
            props.setProperty('funny-bunny', 'nice value');
            props.dropProperty('funny-bunny');
            expect(props.getProperty('funny-bunny')).not.toBeDefined();
        });
        it('leaves the property undefined if it was not defined', function(){
            var propName = 'property-that-does-not-exit!';
            expect(props.getProperty(propName)).not.toBeDefined();
            props.dropProperty(propName);
            expect(props.getProperty(propName)).not.toBeDefined();
        });
    });

    describe('Properties::appendProperty(): appends property', function(){
        it('appends Object to an empty property', function(){
            props.appendProperty({'new': 10, 'class': 'highest', 'fun': function(a){return a;}, 'last author': 'J.P.B.'});
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('new')).toBe(10);
            expect(props.getProperty('class')).toBe('highest');
            expect(props.hasOwnProperty('fun')).toBe(false);
        });

        it('merges two Properties instances', function(){
            var props2 = new Properties();
            props2.setProperty('new', 10);
            props2.setProperty('class', 'highest');
            props2.setProperty('last author', 'J.P.B.');
            props.appendProperty(props2);
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('new')).toBe(10);
            expect(props.getProperty('class')).toBe('highest');
            expect(props.hasOwnProperty('fun')).toBe(false);
        });

        it('appends a string to an empty property', function(){
            props.appendProperty('last: day; class: super; last author: J.P.B.');
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('last')).toBe('day');
            expect(props.getProperty('class')).toBe('super');
        });


        it('appends Object to a non-empty property', function(){
            props.setProperty('visited last', 'today');
            props.setProperty('name', 'Rome');
            props.appendProperty({'new': 10, 'class': 'highest', 'fun': function(a){return a;}, 'last author': 'J.P.B.'});
            expect(props.getProperty('name')).toBe('Rome');
            expect(props.getProperty('visited last')).toBe('today');
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('new')).toBe(10);
            expect(props.getProperty('class')).toBe('highest');
            expect(props.hasOwnProperty('fun')).toBe(false);
        });

        it('appends a string to an empty property', function(){
            props.setProperty('top pos', '2em');
            props.setProperty('title', 'Gone with wind');
            props.appendProperty('last: day; class: super; last author: J.P.B.');
            expect(props.getProperty('title')).toBe('Gone with wind');
            expect(props.getProperty('top pos')).toBe('2em');
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('last')).toBe('day');
            expect(props.getProperty('class')).toBe('super');
        });


        it('overrides the property value', function(){
            props.setProperty('width', 'new value');
            expect(props.getProperty('width')).toBe('new value');
        });


        it('merges two inline styles', function(){
            props.setStyleProperty('padding', '32em');
            props.setStyleProperty('color', 'red');
            var props2 = new Properties();
            props2.setStyleProperty('margin', '1px');
            props2.setStyleProperty('width', '55em');
            props.appendProperty(props2);
            expect(props.getStyleProperty('padding')).toBe('32em');
            expect(props.getStyleProperty('margin')).toBe('1px');
            expect(props.getStyleProperty('color')).toBe('red');
            expect(props.getStyleProperty('width')).toBe('55em');
        });
    });

    describe('Property::propNum(): gets the number of records in core', function(){
        it('gives zero for empty Properties instance', function(){
            expect(props.propNum()).toBe(0);
        });
        it('gives one for Properties instance with one string-valued record in core', function(){
            props.setProperty('name', 'alignment');
            expect(props.propNum()).toBe(1);
        });
        it('gives one for Properties instance with one number-valued record in core', function(){
            props.setProperty('level', 32.7);
            expect(props.propNum()).toBe(1);
        });
        it('gives two for Properties instance with two records in core', function(){
            props.setProperty('level', 32.7);
            props.setProperty(5, 'five');
            expect(props.propNum()).toBe(2);
        });
    });

    describe('Property::isTheSameAs(): compares Properties instances', function(){
        it('gives false if the the argument is not a Property instance', function(){
            var invalids = ['', 'string', 0, -5, 2.38, [], [1, 'a'], {}];
            invalids.forEach(function(el){
                expect(props.isTheSameAs(el)).toBe(false);
            });
        });
        it('gives true when comparing an empty method with itself', function(){
            expect(props.isTheSameAs(props)).toBe(true);
        });
        it('gives true when comparing a non-empty method with itself', function(){
            props.setProperty('screen', '5x5');
            expect(props.isTheSameAs(props)).toBe(true);
        });

        it('gives true, if both instances have empty cores', function(){
            var props2 = new Properties();
            expect(props.isTheSameAs(props2)).toBe(true);
            expect(props2.isTheSameAs(props)).toBe(true);
        });
        it('gives false, if the instances have lengths 0 and 1', function(){
            var props2 = new Properties();
            spyOn(props, 'propNum').and.returnValue(0);
            spyOn(props2, 'propNum').and.returnValue(1);
            expect(props.isTheSameAs(props2)).toBe(false);
        });

        it('gives false, if the instances have lengths 2 and 4', function(){
            var props2 = new Properties();
            spyOn(props, 'propNum').and.returnValue(4);
            spyOn(props2, 'propNum').and.returnValue(2);
            expect(props.isTheSameAs(props2)).toBe(false);
        });

        it('gives false, if the instances both have length 1 but have different core content', function(){
            var props2 = new Properties();
            props.setProperty('name', 1);
            props2.setProperty('new', 'false');
            expect(props.isTheSameAs(props2)).toBe(false);
        });

        it('gives true, if the instances both have length 1 but have identical core content', function(){
            var props2 = new Properties();
            props.setProperty('name', 1);
            props2.setProperty('name', 1);
            expect(props.isTheSameAs(props2)).toBe(true);
        });

        it('gives false, if the instances both have length 2 but have different core content with overlapping keys', function(){
            var props2 = new Properties();
            props.setProperty('name', 1);
            props.setProperty('new', 'false');
            props2.setProperty('name', 5);
            props2.setProperty('level', 'high');
            expect(props.isTheSameAs(props2)).toBe(false);
        });
    });

    describe('Properties::dropAllProperties(): flushes all recored in the core', function(){
        it('deletes properties in empty core', function(){
            expect(props.propNum()).toBe(0);
            props.dropAllProperties();
            expect(props.propNum()).toBe(0);
        });
        it('deletes properties in one-record empty core', function(){
            props.setProperty('link', 'faraway');
            expect(props.propNum()).toBe(1);
            props.dropAllProperties();
            expect(props.propNum()).toBe(0);
        });

        it('deletes properties in three-record empty core', function(){
            props.setProperty('link', 'faraway');
            props.setProperty(6, 3);
            props.setProperty('width', '10');
            expect(props.propNum()).toBe(3);
            props.dropAllProperties();
            expect(props.propNum()).toBe(0);
        });
    });

    describe('Properties::clone(): gives the property clone', function(){
        it('creates a Properties instance', function(){
            expect(props.clone() instanceof Properties).toBe(true);
        });
        it('creates an instance of a class that inherits from Properties and has "getName" method', function(){
            window.PropertiesChild = function(){
                Properties.call(this);
                this.getName = function(){return 'PropertiesChild';};
            };
            PropertiesChild.prototype = Object.create(Properties.prototype);
            var propsChild = new PropertiesChild();
            expect(propsChild.clone() instanceof PropertiesChild).toBe(true);
        });
        it('creates a Properties instance of if the target inherits from Properties and has improper "className" attribute', function(){
            window.PropertiesChild = function(){
                Properties.call(this);
                this.className = 'in fact I have another name';
            };
            PropertiesChild.prototype = Object.create(Properties.prototype);
            var propsChild = new PropertiesChild();
            expect(propsChild.clone() instanceof Properties).toBe(true);
            expect(propsChild.clone() instanceof PropertiesChild).toBe(false);
        });

        it('copies attributes of the target', function(){
            props.a1 = 'attr 1';
            props.a2 = 2;
            var clone = props.clone();
            expect(clone.a1).toBe('attr 1');
            expect(clone.a2).toBe(2);
        });

        it('does not change target string-valued attribute if its counterpart is changed in the clone', function(){
            props.level = 'sea level';
            var clone = props.clone();
            clone.level = '100 m';
            expect(clone.level).toBe('100 m');
            expect(props.level).toBe('sea level');
        });

        it('does not change string-valued attribute in the clone if its counterpart is changed in the target', function(){
            props.module = 'book';
            var clone = props.clone();
            props.module = 'article';
            expect(clone.module).toBe('book');
            expect(props.module).toBe('article');
        });

        it('copies methods of the target', function(){
            props.m1 = function(){return 'this is method 1';};
            props.m2 = function(){return 'this is method 2';};
            var clone = props.clone();
            expect(clone.m1()).toBe('this is method 1');
            expect(clone.m2()).toBe('this is method 2');
        });
        it('does not change method of the target if its clone counterpart is changed', function(){
            props.m1 = function(){return 'this is method 1';};
            var clone = props.clone();
            clone.m1 = function(){return 'modified method';};
            expect(clone.m1()).toBe('modified method');
            expect(props.m1()).toBe('this is method 1');
        });
        it('does not change method of the clone if its counterpart in the target is changed', function(){
            props.m1 = function(){return 'this is method 1';};
            var clone = props.clone();
            props.m1 = function(){return 'modified method';};
            expect(props.m1()).toBe('modified method');
            expect(clone.m1()).toBe('this is method 1');
        });
        it('calls "clone" method if an attribute has that method', function(){
            props.m1 = {clone: function(){return null;}};
            spyOn(props.m1, 'clone');
            props.clone();
            expect(props.m1.clone).toHaveBeenCalled();
        });
        it('assignes value of "clone" method if an attribute has that method', function(){
            props.m1 = {clone: function(){return null;}};
            spyOn(props.m1, 'clone').and.returnValue('clone of m1');
            var clone = props.clone();
            expect(clone.m1).toBe('clone of m1');
        });

        it('uses "getCore" to clone properties', function(){
            spyOn(props, 'getCore');
            props.clone();
            expect(props.getCore).toHaveBeenCalled();
        });

        it('fills the core with "getCore" of the target', function(){
            spyOn(props, 'getCore').and.returnValue({1: 'first', 'second': 2});
            var clone = props.clone();
            expect(clone.getProperty(1)).toBe('first');
            expect(clone.getProperty('second')).toBe(2);
        });
    });

    describe('Controls whether the property has been set', function(){
        it('returns false if the key is not present', function(){
            spyOn(props, 'hasProperty').and.returnValue(false); // turns out that no one key is present
            expect(props.hasSet('a property')).toBe(false);
        });

        it('returns true if the key is present and optional parameter is not provided', function(){
            spyOn(props, 'hasProperty').and.returnValue(true); // turns out that any key is present
            expect(props.hasSet('a property')).toBe(true);
        });

        it('returns true if the key is present and its value is not among values to ignore', function(){
            spyOn(props, 'hasProperty').and.returnValue(true);              // turns out that any key is present
            spyOn(props, 'getProperty').and.callFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('property', ['none', '0', 'to ignore'])).toBe(true);
        });

        it('returns false if the key is present and its value is among values to ignore', function(){
            spyOn(props, 'hasProperty').and.returnValue(true);              // turns out that any key is present
            spyOn(props, 'getProperty').and.callFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('src', ['to ignore', 'src-value'])).toBe(false);
        });

        it('returns true if the key is present and the second parameter is given as a string', function(){
            spyOn(props, 'hasProperty').and.returnValue(true);              // turns out that any key is present
            spyOn(props, 'getProperty').and.callFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('src', 'to ignore, src-value')).toBe(true);
        });
    });

    describe('Toggles the property', function(){
        it('sets the property if it is not set and the second argument is not given', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').and.returnValue(false);
            props.toggleProperty(propName, 'to be set');
            expect(props.getProperty(propName)).toBe('to be set');
        });
        it('sets the property if it is not set and the second argument is provided ', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').and.returnValue(false);
            props.toggleProperty(propName, 'to be set', 'not-value');
            expect(props.getProperty(propName)).toBe('to be set');
        });

        it('sets the property to be equal to the second argument if the key has been set', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').and.returnValue(true);
            props.toggleProperty(propName, 'to be set', 'not-value');
            expect(props.getProperty(propName)).toBe('not-value');
        });

        it('drops the property if it is set and the second argument is not given', function(){
            var propName = 'dumbProp';
            props.setProperty(propName, 'dumb value');
            props.toggleProperty(propName, 'to be set');
            expect(props.hasProperty(propName)).toBe(false);
        });

    });


    describe('Loads attributes from the argument', function(){
        var attr0, attr1, attr2;
        beforeEach(function(){
            var node0 = document.createElement('div');
            var node1 = document.createElement('div');
            var node2 = document.createElement('div');

            node1.setAttribute('width', '21em');
            node1.setAttribute('class', 'hidden');
            node1.setAttribute('border', '9px');

            node2.setAttribute('id', 'wrapper');
            node2.setAttribute('style', 'padding: 12px; font-size: 4em; color: #001234;');
            node2.setAttribute('data-marker', 'line');

            attr0 = node0.attributes;
            attr1 = node1.attributes;
            attr2 = node2.attributes;
        });
        it('does not change existing properties if argument is empty', function(){
            props.setProperty('test', 'first');
            props.setProperty('media', 'paper');
            expect(props.propNum()).toBe(2);
            props.load(attr0);
            expect(props.propNum()).toBe(2);
            expect(props.getProperty('test')).toBe('first');
            expect(props.getProperty('media')).toBe('paper');
        });

        it('adds properties if argument has only "new" ones ', function(){
            props.setProperty('test', 'second');
            props.setProperty('media', 'paper');
            expect(props.propNum()).toBe(2);
            props.load(attr1);
            expect(props.propNum()).toBe(5);
            expect(props.getProperty('test')).toBe('second');
            expect(props.getProperty('media')).toBe('paper');
            expect(props.getProperty('width')).toBe('21em');
            expect(props.getProperty('class')).toBe('hidden');
            expect(props.getProperty('border')).toBe('9px');
        });

        it('overrides properties if argument has the same properties', function(){
            props.setProperty('width', '4%');
            props.setProperty('class', 'new');
            props.setProperty('border', 'none');
            expect(props.propNum()).toBe(3);
            props.load(attr1);
            expect(props.propNum()).toBe(3);
            expect(props.getProperty('width')).toBe('21em');
            expect(props.getProperty('class')).toBe('hidden');
            expect(props.getProperty('border')).toBe('9px');
        });

        it('overrides properties if argument has some properties in common', function(){
            props.setProperty('color', 'red');
            props.setProperty('class', 'old');
            props.setProperty('position', 'absolute');
            expect(props.propNum()).toBe(3);
            props.load(attr1);
            expect(props.propNum()).toBe(5);
            expect(props.getProperty('width')).toBe('21em');
            expect(props.getProperty('class')).toBe('hidden');
            expect(props.getProperty('border')).toBe('9px');
            expect(props.getProperty('color')).toBe('red');
            expect(props.getProperty('position')).toBe('absolute');
        });

        it('loads "style" key, if arguments contains styles', function(){
            expect(props.hasProperty('style')).toBe(false);
            props.load(attr2);
            expect(props.hasProperty('style')).toBe(true);
        });

        it('loads "style" key as an instance of Property', function(){
            expect(props.hasProperty('style')).toBe(false);
            props.load(attr2);
            expect(props.getProperty('style') instanceof Properties).toBe(true);
        });

        it('creates Properties instance with all properties inside style', function(){
            props.load(attr2);
            var stl = props.getProperty('style');
            expect(stl.getProperty('font-size')).toBe('4em');
            // IE transforms hex into rgb
            var color = stl.getProperty('color');
            expect(color === 'rgb(0, 18, 52)' || color === '#001234').toBe(true);
            expect(stl.getProperty('padding')).toBe('12px');
        });

        it('overrides style properties', function(){
            var tempProp = new Properties();
            tempProp.setProperty('font-family', 'Fancy');
            tempProp.setProperty('text-align', 'left');

            props.setProperty('style', tempProp);

            props.load(attr2);

            var stl = props.getStyles();

            expect(stl.propNum()).toBe(3);
            expect(stl.getProperty('font-size')).toBe('4em');
            // IE transforms hex into rgb
            var color = stl.getProperty('color');
            expect(color === 'rgb(0, 18, 52)' || color === '#001234').toBe(true);
            expect(stl.getProperty('padding')).toBe('12px');
        });

        it('overrides style properties', function(){
            var tempProp = new Properties();
            tempProp.setProperty('font-size', '10px');
            tempProp.setProperty('text-align', 'left');

            props.setProperty('style', tempProp);
            props.load(attr2);

            var stl = props.getStyles();
            expect(stl.propNum()).toBe(3);
            expect(stl.getProperty('font-size')).toBe('4em');
            // IE transforms hex into rgb
            var color = stl.getProperty('color');
            expect(color === 'rgb(0, 18, 52)' || color === '#001234').toBe(true);
            expect(stl.getProperty('padding')).toBe('12px');
        });

    });

    describe('Detects "style" key', function(){
        it('returns true, if key "style" is present', function(){
            props.setProperty('style', 'whatever');
            expect(props.hasStyles()).toBe(true);
        });
        it('returns false, if key "style" is not present', function(){
            props.dropProperty('style');
            expect(props.hasStyles()).toBe(false);
        });
    });

    describe('style setter/getter', function(){
        it('returns undefined if "style" is not present', function(){
            expect(props.getStyles()).not.toBeDefined();
        });
        it('returns an instance of Properties if "style" is present', function(){
            props.setStyles('whatever');
            expect(props.getStyles() instanceof Properties).toBe(true);
        });
        it('sets "style"', function(){
            props.setStyles('whatever: yes');
            var stl = props.getStyles();
            expect(stl.propNum()).toBe(1);
            expect(stl.getProperty('whatever')).toBe('yes');
        });
    });

    describe('has a method "setWidth" that', function(){
        it('sets attribute to 120 and style to "120px" if the argument is 120', function(){
            props.setWidth(120);
            expect(props.getProperty('width')).toBe(120);
            expect(props.getStyleProperty('width')).toBe('120px');
        });
        it('sets attribute to 120 and style to "120px" if the argument is "120"', function(){
            props.setWidth('120');
            expect(props.getProperty('width')).toBe(120);
            expect(props.getStyleProperty('width')).toBe('120px');
        });
        it('sets attribute to 120 and style to "120px" if the argument is "120px"', function(){
            props.setWidth('120px');
            expect(props.getProperty('width')).toBe(120);
            expect(props.getStyleProperty('width')).toBe('120px');
        });
        it('sets attribute to "120em" and style to "120em" if the argument is "120em"', function(){
            props.setWidth(120);
            expect(props.getProperty('width')).toBe(120);
            expect(props.getStyleProperty('width')).toBe('120px');
        });
    });

    describe('Loading properties from node attributes', function(){
        it('loads nothing if node has no attributes', function(){
            var n = document.createElement('span');
            props.loadNodeProperties(n);
            expect(props.propNum()).toBe(0);
        });
        it('loads single numeric attribute if the node has only that attribute', function(){
            var n = document.createElement('span');
            n.setAttribute('width', 200);
            props.loadNodeProperties(n);
            expect(props.propNum()).toBe(1);
            expect(props.getProperty('width')).toBe(200);
        });

        it('loads single string attribute if the node has only that attribute', function(){
            var n = document.createElement('span');
            n.setAttribute('media', 'screen');
            props.loadNodeProperties(n);
            expect(props.propNum()).toBe(1);
            expect(props.getProperty('media')).toBe('screen');
        });

        it('loads four attributes', function(){
            var n = document.createElement('span');
            n.setAttribute('media', 'screen');
            n.setAttribute('padding', 20);
            n.setAttribute('margin', '14%');
            n.setAttribute('width', 211);
            props.loadNodeProperties(n);
            expect(props.propNum()).toBe(4);
            expect(props.getProperty('media')).toBe('screen');
            expect(props.getProperty('padding')).toBe(20);
            expect(props.getProperty('margin')).toBe('14%');
            expect(props.getProperty('width')).toBe(211);
        });

        it('loads styles as object', function(){
            var n = document.createElement('span');
            n.setAttribute('style', 'screen: wide; port: 10;');
            props = new Properties();
            props.loadNodeProperties(n);
            expect(props.propNum()).toBe(1);
            expect(props.hasStyles()).toBe(true);
            expect(props.getStyles().propNum()).toBe(2);
            expect(props.getStyleProperty('screen')).toBe('wide');
        });
    });

    describe('Setting/getting border info', function(){
        it ('gets border information with "style: none" if no border is set', function(){
            var border = props.getBorder();
            expect(Object.keys(border).length).toBe(1);
            expect(border.style).toBe('none');
        });
        it ('gets full border information', function(){
            props.setBorder({width: 21, style: 'fancy', color: '#123456'});
            var border = props.getBorder();
            expect(Object.keys(border).length).toBe(3);
            expect(border.style).toBe('fancy');
            expect(border.width).toBe(21);
            expect(border.color).toBe('#123456');
        });
    });

    describe('has a method "template" that', function(){
        it('returns empty object if the core is not defined', function(){
            spyOn(props, 'getCore');
            expect(Object.keys(props.template()).length).toBe(0);
        });
        it('returns object with two keys if the core has two string-valued keys', function(){
            spyOn(props, 'getCore').and.returnValue({class: 'bottom', width: '345px'});
            var template = props.template();
            expect(Object.keys(template).length).toBe(2);
            expect(template.class).toBe('bottom');
            expect(template.width).toBe('345px');
        });
        it('returns object with three keys if the core has one string and two numeric keys', function(){
            spyOn(props, 'getCore').and.returnValue({padding: 32, class: 'footer', width: 945});
            var template = props.template();
            expect(Object.keys(template).length).toBe(3);
            expect(template.class).toBe('footer');
            expect(template.width).toBe(945);
            expect(template.padding).toBe(32);
        });
        it('ignores function-valued keys', function(){
            spyOn(props, 'getCore').and.returnValue({foo: function(){return;}, width: '345px'});
            var template = props.template();
            expect(Object.keys(template).length).toBe(1);
            expect(template.width).toBe('345px');
        });
        it('ignores array-valued keys', function(){
            spyOn(props, 'getCore').and.returnValue({foo: [1, 2, 3], width: '345px'});
            var template = props.template();
            expect(Object.keys(template).length).toBe(1);
            expect(template.width).toBe('345px');
        });

        it('ignores object-valued keys if they are not Properties instances', function(){
            spyOn(props, 'getCore').and.returnValue({foo: 2, master: {1: 'dumb'}});
            var template = props.template();
            expect(Object.keys(template).length).toBe(1);
            expect(template.foo).toBe(2);
        });

        it('calls itself in case a key corresponds to a Properties instance', function(){
            var prop2 = new Properties();
            spyOn(props, 'getCore').and.returnValue({foo: 2, master: prop2});
            spyOn(prop2, 'template').and.returnValue({});
            props.template();
            expect(prop2.template).toHaveBeenCalled();
        });

        it('does not insert the key if recursive call gives back an empty object', function(){
            var props2 = new Properties();
            spyOn(props, 'getCore').and.returnValue({target: '_self', style: props2});
            spyOn(props2, 'template').and.returnValue({});
            var template = props.template();
            expect(template.hasOwnProperty('style')).toBe(false);
        });
        it('inserts the key if recursive call gives back a non empty object', function(){
            var props2 = new Properties();
            var fakeTemplate = {'background': 'yellow', 'overflow': 'hidden'};
            spyOn(props, 'getCore').and.returnValue({target: '_self', foo: props2});
            spyOn(props2, 'template').and.returnValue(fakeTemplate);
            var template = props.template();
            expect(template.foo).toBe(fakeTemplate);
        });
    });
});

