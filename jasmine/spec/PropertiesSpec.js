/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Property
 */

describe('Properties-related functionality', function(){
    var props;
    beforeEach(function(){
        props = new Properties();
    });

    describe('setProperty(): property setter', function(){
        it('returns false, if no argument is given', function(){
            expect(props.setProperty()).toBe(false);
        });
        it('returns false if only one argument is given', function(){
           expect(props.setProperty('a')).toBe(false);
        });
        it('returns true if string-string pair is given', function(){
           expect(props.setProperty('a', 'value')).toBe(true);
        });
        it('returns true if string-number pair is given', function(){
           expect(props.setProperty('class', 2)).toBe(true);
        });
        it('returns true if number-string pair is given', function(){
           expect(props.setProperty(4, 'value')).toBe(true);
        });
        it('returns true if number-number pair is given', function(){
           expect(props.setProperty(8.9, 16)).toBe(true);
        });
        it('returns false if string-function pair is given', function(){
           expect(props.setProperty('class', function(){return null;})).toBe(false);
        });
        it('returns false if string-object pair is given', function(){
           expect(props.setProperty('class', {})).toBe(false);
        });
        it('returns false if number-function pair is given', function(){
           expect(props.setProperty(34, function(){return null;})).toBe(false);
        });
        it('returns false if number-object pair is given', function(){
           expect(props.setProperty(9, {})).toBe(false);
        });
        it('returns false if function-string pair is given', function(){
          expect(props.setProperty(function(){return null;}, 'class')).toBe(false);
        });
        it('returns false if object-string pair is given', function(){
          expect(props.setProperty({}, 'module')).toBe(false);
        });
        it('returns false if function-number pair is given', function(){
          expect(props.setProperty(function(){return null;}, -4)).toBe(false);
        });
        it('returns false if object-number pair is given', function(){
          expect(props.setProperty({}, 64)).toBe(false);
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
            props['dummyAttribute'] = 'inside properties class';
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
            expect(props.className).toBe('Properties');
        });

        it('populates properties from a string input', function(){
            props = new Properties('a:10; color: some color; another-attr: un altro valore; bivalued: 1px 3px');
            expect(props.getProperty('a')).toBe('10');
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


    describe('Properties::setFactory(): imposes factory', function(){
        var factory,
            invalides = ['', 'string', [], [1], ['ciao'], 3, -10, 0];
        beforeEach(function(){
            factory = new Factory();
        });
        it('returns false for string, array, number', function(){
            invalides.forEach(function(invalid){
                expect(props.setFactory(invalid)).toBe(false);
            });
        });
        it('returns true, if a factory instance is given', function(){
            expect(props.setFactory(factory)).toBe(true);
        });
        it('sets "factory" property', function(){
            props.setFactory(factory);
            expect(props.factory).toBe(factory);
        });
        it('does not change "factory" property if the argument is not a Factory instance', function(){
            var factoryValue = props.factory;
            invalides.forEach(function(invalid){
                props.setFactory(invalid);
                expect(props.factory).toBe(factoryValue);
            });
        });
    });


    xdescribe('Property::appendProperty(): appends property', function(){
        it('appends Object to an empty property', function(){
            propEmpty.appendProperty({'new': 10, 'class': 'highest', 'fun': function(a){return a;}, 'last author': 'J.P.B.'});
            expect(propEmpty['last author']).toBe('J.P.B.');
            expect(propEmpty.new).toBe(10);
            expect(propEmpty.class).toBe('highest');
            expect(propEmpty.hasOwnProperty('fun')).toBe(false);
        });

        it('appends a string to an empty property', function(){
            propEmpty.appendProperty('last: 10; class: super; last author: J.P.B.');
            expect(propEmpty['last author']).toBe('J.P.B.');
            expect(propEmpty.last).toBe(10);
            expect(propEmpty.class).toBe('super');
        });

        it('appends Object to a non-empty property', function(){
            propEmpty['visited last'] = 'today';
            propEmpty.name = 'Rome';
            propEmpty.appendProperty({'new': 10, 'class': 'highest', 'fun': function(a){return a;}, 'last author': 'J.P.B.'});
            expect(propEmpty.name).toBe('Rome');
            expect(propEmpty['visited last']).toBe('today');
            expect(propEmpty['last author']).toBe('J.P.B.');
            expect(propEmpty.new).toBe(10);
            expect(propEmpty.class).toBe('highest');
            expect(propEmpty.hasOwnProperty('fun')).toBe(false);
        });

        it('appends a string to an empty property', function(){
            propEmpty['top pos'] = 2;
            propEmpty.title = 'Gone with wind';
            propEmpty.appendProperty('last: 10; class: super; last author: J.P.B.');
            expect(propEmpty.title).toBe('Gone with wind');
            expect(propEmpty['top pos']).toBe(2);
            expect(propEmpty['last author']).toBe('J.P.B.');
            expect(propEmpty.last).toBe(10);
            expect(propEmpty.class).toBe('super');
        });


        it('overrides the property value', function(){
            propEmpty.width = 'new value';
            propEmpty.width = 'new value';
            expect(propEmpty.width).toBe('new value');
        });
    });

    xdescribe('Property::length(): get the number of properties', function(){
        it('gives zero for empty Property instance', function(){
            expect(propEmpty.propNum()).toBe(0);
        });
        it('gives one for Property instance with one property', function(){
            propEmpty.name = 'alignment';
            expect(propEmpty.propNum()).toBe(1);
        });
        it('gives one for Property instance with one property', function(){
            propEmpty.name = 'alignment';
            expect(propEmpty.propNum()).toBe(1);
        });

        it('gets zero for a Property instance without properties', function(){
            expect(propEmpty.propNum()).toBe(0);
        });
        it('gets one for a Property instance with just one property', function(){
            propEmpty['funny property'] = 'value';
            expect(propEmpty.propNum()).toBe(1);
        });
        it('gets zero for a Property instance with just one method', function(){
            propEmpty.turnOn = function(){return null;};
            expect(propEmpty.propNum()).toBe(0);
        });

        it('gets one for a Property instance with just one property and one method', function(){
            propEmpty.one = 32.86;
            propEmpty['deep inside'] = function(){return null;};
            expect(propEmpty.propNum()).toBe(1);
        });
        it('gets one for a Property instance with just one property and two methods', function(){
            propEmpty.one = 32.86;
            propEmpty['deep inside'] = function(){return null;};
            propEmpty.turnOn = function(){return 'turned on';};
            expect(propEmpty.propNum()).toBe(1);
        });
        it('gets two for a Property instance with two properties', function(){
            propEmpty.one = 32.86;
            propEmpty['funny property'] = {};
            expect(propEmpty.propNum()).toBe(2);
        });
        it('gets two for a Property instance with two properties and two methods', function(){
            propEmpty.one = 32.86;
            propEmpty['funny property'] = {};
            propEmpty.turnOn = function(){return 'turned on';};
            propEmpty['prepare-online'] = function(){return {'prepare': true};};
            expect(propEmpty.propNum()).toBe(2);
        });
    });

    xdescribe('Property::isTheSameAs(): compares property', function(){
        it('gives true when comparing an empty method with itself', function(){
            expect(propEmpty.isTheSameAs(propEmpty)).toBe(true);
        });
        it('gives true when comparing a non-empty method with itself', function(){
            props.func = function(foo){ return foo;};
            expect(props.isTheSameAs(props)).toBe(true);
        });

        it('gives true, if both styles have no properties', function(){
            var st = {};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });
        it('gives true, if both styles have no properties and target props has a method', function(){
            var st = {};
            propEmpty.turnOn = function(){return 'turned on';};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });
        it('gives true, if props has no properties and argument has a method', function(){
            var st = {};
            st.turnOn = function(){return 'turned on';};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });

        it('gives false, if target props has one property and argument does not', function(){
            var st = {};
            propEmpty.props = 72;
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });

        it('gives true, if target props and argument have the same properties and values', function(){
            var st = {'props': 72, 'width': 'large'};
            propEmpty.props = 72;
            propEmpty.width = 'large';
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });

        it('gives false, if target props and argument have the same properties but different values', function(){
            var st = {'props': 72, 'width': 'large'};
            propEmpty.props = 0;
            propEmpty.width = 'large';
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });
        it('gives false, if the argument has one property more', function(){
            var st = {'props': 72, 'width': 'large', 'prop2': 21, 'color': 'blue'};
            propEmpty.props = 72;
            propEmpty.width = 'large';
            propEmpty.prop2 = 21;
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });

        it('gives false, if the target has one property more', function(){
            var st = {'props': 72, 'width': 'large', 'color': 'blue'};
            propEmpty.props = 72;
            propEmpty.width = 'large';
            propEmpty.prop2 = 21;
            propEmpty.color = 'blue';
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });
    });

    xdescribe('Property::summary(): gives object with key-value of the properties', function(){
        it('gives an empty object, if there are no properties set', function(){
            var summary = propEmpty.summary();
            expect(Object.keys(summary).length).toBe(0);
        });
        it('gives an object with one string-valued record, if the value is a string', function(){
            propEmpty.bold = 'yes';
            var summary = propEmpty.summary();
            expect(summary.bold).toBe('yes');
        });
        it('gives an object with one number-valued record, if the value is a number', function(){
            propEmpty.font = 221;
            var summary = propEmpty.summary();
            expect(summary.font).toBe(221);
        });
        it('does not enroll methods in the summary', function(){
            propEmpty.print = function(){return 1;};
            propEmpty.age = 'adult';
            var summary = propEmpty.summary();
            expect(summary.hasOwnProperty('print')).toBe(false);
        });
        it('enrolls properties in the summary, if methods are present', function(){
            propEmpty.print = function(){return 1;};
            propEmpty.age = 'adult';
            var summary = propEmpty.summary();
            expect(summary.hasOwnProperty('age')).toBe(true);
        });
        it('does not enroll object-valued properties in the summary', function(){
            propEmpty.level = {'foo': 1};
            var summary = propEmpty.summary();
            expect(summary.hasOwnProperty('level')).toBe(false);
        });
    });

});

