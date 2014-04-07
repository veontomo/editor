/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, afterEach, Property
 */

describe('Property-related functionality', function(){
    var propEmpty, prop;
    beforeEach(function(){
        var pn;
        propEmpty = new Property();
        prop = new Property();
        for (pn in propEmpty){
            if(propEmpty.hasOwnProperty(pn) && (typeof propEmpty[pn] !== 'function')){
                delete propEmpty[pn];
            }
        }
    });

    describe('Property::constructor(): creates Property instance from argument', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            prop = Property();
            expect(prop instanceof Property).toBe(true);
        });

        it('populates properties from a string input', function(){
            var s = new Property('a:10; color: some color; another-attr: un altro valore; bivalued: 1px 3px');
            expect(s.hasOwnProperty('a')).toBe(true);
            expect(s.a).toBe(10);
            expect(s.hasOwnProperty('color')).toBe(true);
            expect(s.color).toBe('some color');
            expect(s.hasOwnProperty('another-attr')).toBe(true);
            expect(s['another-attr']).toBe('un altro valore');
            expect(s.hasOwnProperty('bivalued')).toBe(true);
            expect(s.bivalued).toBe('1px 3px');
        });

        it('populates properties from an object without methods inside', function(){
            var s = new Property({'a':10,
                'color': 'some color',
                'another-attr': 'un altro valore',
                'bool': true
            });
            expect(s.hasOwnProperty('a')).toBe(true);
            expect(s.a).toBe(10);
            expect(s.hasOwnProperty('color')).toBe(true);
            expect(s.color).toBe('some color');
            expect(s.hasOwnProperty('another-attr')).toBe(true);
            expect(s['another-attr']).toBe('un altro valore');
            expect(s.hasOwnProperty('bool')).toBe(false);
        });
        it('populates properties from an object with a method inside', function(){
           var s = new Property({'a':10,
               'color': 'some color',
               'another-attr': 'un altro valore',
               'func': function(){return 1;},
               'bool': true
           });
           expect(s.hasOwnProperty('a')).toBe(true);
           expect(s.a).toBe(10);
           expect(s.hasOwnProperty('color')).toBe(true);
           expect(s.color).toBe('some color');
           expect(s.hasOwnProperty('another-attr')).toBe(true);
           expect(s['another-attr']).toBe('un altro valore');
           expect(s.hasOwnProperty('func')).toBe(false);
           expect(s.hasOwnProperty('bool')).toBe(false);
        });
       it('populates properties from an object with two methods insides', function(){
           var s = new Property({'a':10,
               'color': 'some color',
               'another-attr': 'un altro valore',
               'func': function(){return 1;},
               'bool': true,
               'func2': function(a){return a;},
           });
           expect(s.hasOwnProperty('a')).toBe(true);
           expect(s.a).toBe(10);
           expect(s.hasOwnProperty('color')).toBe(true);
           expect(s.color).toBe('some color');
           expect(s.hasOwnProperty('another-attr')).toBe(true);
           expect(s['another-attr']).toBe('un altro valore');
           expect(s.hasOwnProperty('func')).toBe(false);
           expect(s.hasOwnProperty('func2')).toBe(false);
           expect(s.hasOwnProperty('bool')).toBe(false);
        });
    });

    describe('Property::appendProperty(): appends property', function(){
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

    describe('Property::length(): get the number of properties', function(){
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

    describe('Property::isTheSameAs(): compares property', function(){
        it('gives true when comparing an empty method with itself', function(){
            expect(propEmpty.isTheSameAs(propEmpty)).toBe(true);
        });
        it('gives true when comparing a non-empty method with itself', function(){
            prop.func = function(foo){ return foo;};
            expect(prop.isTheSameAs(prop)).toBe(true);
        });

        it('gives true, if both styles have no properties', function(){
            var st = {};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });
        it('gives true, if both styles have no properties and target prop has a method', function(){
            var st = {};
            propEmpty.turnOn = function(){return 'turned on';};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });
        it('gives true, if prop has no properties and argument has a method', function(){
            var st = {};
            st.turnOn = function(){return 'turned on';};
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });

        it('gives false, if target prop has one property and argument does not', function(){
            var st = {};
            propEmpty.prop = 72;
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });

        it('gives true, if target prop and argument have the same properties and values', function(){
            var st = {'prop': 72, 'width': 'large'};
            propEmpty.prop = 72;
            propEmpty.width = 'large';
            expect(propEmpty.isTheSameAs(st)).toBe(true);
        });

        it('gives false, if target prop and argument have the same properties but different values', function(){
            var st = {'prop': 72, 'width': 'large'};
            propEmpty.prop = 0;
            propEmpty.width = 'large';
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });
        it('gives false, if the argument has one property more', function(){
            var st = {'prop': 72, 'width': 'large', 'prop2': 21, 'color': 'blue'};
            propEmpty.prop = 72;
            propEmpty.width = 'large';
            propEmpty.prop2 = 21;
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });

        it('gives false, if the target has one property more', function(){
            var st = {'prop': 72, 'width': 'large', 'color': 'blue'};
            propEmpty.prop = 72;
            propEmpty.width = 'large';
            propEmpty.prop2 = 21;
            propEmpty.color = 'blue';
            expect(propEmpty.isTheSameAs(st)).toBe(false);
        });
    });

    describe('Property::summary(): gives object with key-value of the properties', function(){
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

