/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Properties, PropertiesChild, window
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
        it('returns true if both key and value types are among allowed ones', function(){
            spyOn(props, 'getAllowedKeyTypes').andCallFake(function(){return ['string', 'number'];});
            spyOn(props, 'getAllowedValueTypes').andCallFake(function(){return ['object'];});
            expect(props.setProperty('a key', {1: 'good'})).toBe(true);
        });
        it('returns false if key type is not among allowed, but value is among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').andCallFake(function(){return ['number'];});
            spyOn(props, 'getAllowedValueTypes').andCallFake(function(){return ['string'];});
            expect(props.setProperty('class', 'value')).toBe(false);
        });
        it('returns false if key type is among allowed, but value is not among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').andCallFake(function(){return ['number'];});
            spyOn(props, 'getAllowedValueTypes').andCallFake(function(){return ['number'];});
            expect(props.setProperty(2, {})).toBe(false);
        });

        it('returns false if both key and value types are not among allowed', function(){
            spyOn(props, 'getAllowedKeyTypes').andCallFake(function(){return ['object'];});
            spyOn(props, 'getAllowedValueTypes').andCallFake(function(){return ['string'];});
            expect(props.setProperty('a string', 3)).toBe(false);
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
                    props.setMode(invalid);
                }).toThrow('Allowed values for mode are 0, 1.');
            });
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
            spyOn(props, 'getCore').andCallFake(function(){return {};});
            props.isEmpty();
            expect(props.getCore).toHaveBeenCalled();
        });
        it('returns true if "getCore" returns empty object', function(){
            spyOn(props, 'getCore').andCallFake(function(){return {};});
            expect(props.isEmpty()).toBe(true);
        });
        it('returns false if "getCore" returns single-record string-valued object', function(){
            spyOn(props, 'getCore').andCallFake(function(){return {key: 'value'};});
            expect(props.isEmpty()).toBe(false);
        });
        it('returns false if "getCore" returns single-record number-valued object', function(){
            spyOn(props, 'getCore').andCallFake(function(){return {prop: 2.98};});
            expect(props.isEmpty()).toBe(false);
        });
        it('returns false if "getCore" returns two-record object', function(){
            spyOn(props, 'getCore').andCallFake(function(){return {prop: 2.98, val: 'high'};});
            expect(props.isEmpty()).toBe(false);
        });
    });

    describe('Properties::suggestProperty(): sets property if it is not defined', function(){
        it('calls setProperty() method if a property is missing in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').andCallFake(function(){return false;});
            props.suggestProperty('a: 192; b: new');
            expect(props.setProperty).toHaveBeenCalledWith('a', '192');
            expect(props.setProperty).toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('a');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });
        it('does not call setProperty() method if a property is present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').andCallFake(function(){return true;});
            props.suggestProperty('hi: yes; b: new');
            expect(props.setProperty).not.toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).not.toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });

        it('calls setProperty() method only with keys not present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').andCallFake(function(key){return key === 'present' || key === 'present2';});
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
            spyOn(props, 'hasProperty').andCallFake(function(){return false;});
            props.suggestProperty({a: 192, b: 'new'});
            expect(props.setProperty).toHaveBeenCalledWith('a', 192);
            expect(props.setProperty).toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('a');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });
        it('does not call setProperty() method if a property is present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').andCallFake(function(){return true;});
            props.suggestProperty({hi: 'yes', b: 'new'});
            expect(props.setProperty).not.toHaveBeenCalledWith('hi', 'yes');
            expect(props.setProperty).not.toHaveBeenCalledWith('b', 'new');
            expect(props.hasProperty).toHaveBeenCalledWith('hi');
            expect(props.hasProperty).toHaveBeenCalledWith('b');
        });

        it('calls setProperty() method only with keys not present in the core', function(){
            spyOn(props, 'setProperty');
            spyOn(props, 'hasProperty').andCallFake(function(key){return key === 'present' || key === 'present2';});
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
            props.appendProperty('last: 10; class: super; last author: J.P.B.');
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('last')).toBe('10');
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
            props.setProperty('top pos', 2);
            props.setProperty('title', 'Gone with wind');
            props.appendProperty('last: 10; class: super; last author: J.P.B.');
            expect(props.getProperty('title')).toBe('Gone with wind');
            expect(props.getProperty('top pos')).toBe(2);
            expect(props.getProperty('last author')).toBe('J.P.B.');
            expect(props.getProperty('last')).toBe('10');
            expect(props.getProperty('class')).toBe('super');
        });


        it('overrides the property value', function(){
            props.setProperty('width', 'new value');
            expect(props.getProperty('width')).toBe('new value');
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
            spyOn(props, 'propNum').andCallFake(function(){return 0;});
            spyOn(props2, 'propNum').andCallFake(function(){return 1;});
            expect(props.isTheSameAs(props2)).toBe(false);
        });

        it('gives false, if the instances have lengths 2 and 4', function(){
            var props2 = new Properties();
            spyOn(props, 'propNum').andCallFake(function(){return 4;});
            spyOn(props2, 'propNum').andCallFake(function(){return 2;});
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
            spyOn(props.m1, 'clone').andCallFake(function(){return 'clone of m1';});
            var clone = props.clone();
            expect(clone.m1).toBe('clone of m1');
        });

        it('uses "getCore" to clone properties', function(){
            spyOn(props, 'getCore');
            props.clone();
            expect(props.getCore).toHaveBeenCalled();
        });

        it('fills the core with "getCore" of the target', function(){
            spyOn(props, 'getCore').andCallFake(function(){return {1: 'first', 'second': 2};});
            var clone = props.clone();
            expect(clone.getProperty(1)).toBe('first');
            expect(clone.getProperty('second')).toBe(2);
        });
    });

    describe('Controls whether the property has been set', function(){
        it('returns false if the key is not present', function(){
            spyOn(props, 'hasProperty').andCallFake(function(){return false;}); // turns out that no one key is present
            expect(props.hasSet('a property')).toBe(false);
        });

        it('returns true if the key is present and optional parameter is not provided', function(){
            spyOn(props, 'hasProperty').andCallFake(function(){return true;}); // turns out that any key is present
            expect(props.hasSet('a property')).toBe(true);
        });

        it('returns true if the key is present and its value is not among values to ignore', function(){
            spyOn(props, 'hasProperty').andCallFake(function(){return true;});              // turns out that any key is present
            spyOn(props, 'getProperty').andCallFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('property', ['none', '0', 'to ignore'])).toBe(true);
        });

        it('returns false if the key is present and its value is among values to ignore', function(){
            spyOn(props, 'hasProperty').andCallFake(function(){return true;});              // turns out that any key is present
            spyOn(props, 'getProperty').andCallFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('src', ['to ignore', 'src-value'])).toBe(false);
        });

        it('returns true if the key is present and the second parameter is given as a string', function(){
            spyOn(props, 'hasProperty').andCallFake(function(){return true;});              // turns out that any key is present
            spyOn(props, 'getProperty').andCallFake(function(boo){return boo + "-value";}); // generates dumb value
            expect(props.hasSet('src', 'to ignore, src-value')).toBe(true);
        });
    });

    describe('Toggles the property', function(){
        it('sets the property if it is not set and the second argument is not given', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').andCallFake(function(){return false;});
            props.toggleProperty(propName, 'to be set');
            expect(props.getProperty(propName)).toBe('to be set');
        });
        it('sets the property if it is not set and the second argument is provided ', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').andCallFake(function(){return false;});
            props.toggleProperty(propName, 'to be set', 'not-value');
            expect(props.getProperty(propName)).toBe('to be set');
        });

        it('sets the property to be equal to the second argument if the key has been set', function(){
            var propName = 'dumbProp';
            spyOn(props, 'hasSet').andCallFake(function(){return true;});
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

});

