/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Properties, Factory
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

    describe('Property::appendProperty(): appends property', function(){
        it('appends Object to an empty property', function(){
            props.appendProperty({'new': 10, 'class': 'highest', 'fun': function(a){return a;}, 'last author': 'J.P.B.'});
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



    xdescribe('Property::summary(): gives object with key-value of the properties', function(){
        it('gives an empty object, if there are no properties set', function(){
            var summary = props.summary();
            expect(Object.keys(summary).length).toBe(0);
        });
        it('gives an object with one string-valued record, if the value is a string', function(){
            props.bold = 'yes';
            var summary = props.summary();
            expect(summary.bold).toBe('yes');
        });
        it('gives an object with one number-valued record, if the value is a number', function(){
            props.font = 221;
            var summary = props.summary();
            expect(summary.font).toBe(221);
        });
        it('does not enroll methods in the summary', function(){
            props.print = function(){return 1;};
            props.age = 'adult';
            var summary = props.summary();
            expect(summary.hasOwnProperty('print')).toBe(false);
        });
        it('enrolls properties in the summary, if methods are present', function(){
            props.print = function(){return 1;};
            props.age = 'adult';
            var summary = props.summary();
            expect(summary.hasOwnProperty('age')).toBe(true);
        });
        it('does not enroll object-valued properties in the summary', function(){
            props.level = {'foo': 1};
            var summary = props.summary();
            expect(summary.hasOwnProperty('level')).toBe(false);
        });
    });

    describe('Properties::clone(): gives the property clone', function(){
        beforeEach(function(){
            props.factory = {'createInstanceOf': function(){return null;}};
        });

        it('returns null, if the factory is not set', function(){
            delete props.factory;
            expect(props.clone()).toBe(null);
        });

        it('returns null, if the instance has a class name that is not in the factory', function(){
            props.className = 'no such name';
            expect(props.clone()).toBe(null);
        });
        it('calls Factory::createInstanceOf() with its class name', function(){
            spyOn(props.factory, 'createInstanceOf');
            props.className = 'my name';
            props.clone();
            expect(props.factory.createInstanceOf).toHaveBeenCalledWith('my name');
        });

        it('returns an instance of what Factory::createInstanceOf() has returned', function(){
            function A (){return null;}
            var dummy = new A();
            spyOn(props.factory, 'createInstanceOf').andCallFake(function(){return dummy;});
            var obj = props.clone();
            expect(obj instanceof A).toBe(true);
        });
        it('clones core of the target', function(){
            var dummy = new Properties();
            props.factory = new Factory(new Registry({classes: [Properties]}));
            spyOn(props.factory, 'createInstanceOf').andCallFake(function(){return dummy;});
            dummy.setProperty('test', 21);
            dummy.setProperty('screen', 'hd');
            var clone = props.clone();
            expect(clone.getProperty('test')).toBe(21);
            expect(clone.getProperty('screen')).toBe('hd');
        });
        it('does not modify attribute value in the cloned object, if I change it in the target', function(){
            props.factory = new Factory(new Registry({classes: [Properties]}));
            props.setProperty('level', 10);
            var clone = props.clone();
            props.setProperty('level', 8);
            expect(clone.getProperty('level')).toBe(10);
            expect(props.getProperty('level')).toBe(8);
        });
        it('does not modify attribute value in the target, if I change it in the cloned object', function(){
            props.factory = new Factory(new Registry({classes: [Properties]}));
            props.setProperty('level', 10);
            var clone = props.clone();
            clone.setProperty('level', 8);
            expect(props.getProperty('level')).toBe(10);
            expect(clone.getProperty('level')).toBe(8);
        });




    });

});

