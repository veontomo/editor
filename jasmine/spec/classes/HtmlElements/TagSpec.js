/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, PlainText, Properties, Content, Link, window, Node, Commen, TagChild */

describe('Tag class', function() {
    var tag, tagProps, content;
    beforeEach(function() {
        tagProps = new Properties();
        tag = new Tag();
        content = new Content();
    });

    describe('has a constuctor that', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            tag = Tag();
            expect(tag instanceof Tag).toBe(true);
        });
    });


    describe('has Properties setter and getter that', function(){
        it('return an instance of Properties class', function(){
            expect(tag.getProperties() instanceof Properties).toBe(true);
        });

        it('retrieves previously imposed properties', function(){
            var prop = new Properties();
            prop.setProperty('aaa', 'xxx');
            tag.setProperties(prop);
            var detectedProp = tag.getProperties();
            expect(detectedProp.propNum()).toBe(1);
            expect(detectedProp.getProperty('aaa')).toBe('xxx');
        });
    });

    describe('has Content setter and getter that', function(){
        it('return an instance of Content class', function(){
            expect(tag.getContent() instanceof Content).toBe(true);
        });
        it('sets content if the argument is a Content instance', function(){
            tag.setElements(['1', '2', '3']);
            var cntn = tag.getContent();
            expect(cntn.length()).toBe(3);
            expect(cntn.getElem(0)).toBe('1');
            expect(cntn.getElem(1)).toBe('2');
            expect(cntn.getElem(2)).toBe('3');
        });

        it('sets content if the argument is a Content instance', function(){
            tag.setElements(['1', '2', '3']);
            var cntn = tag.getContent();
            expect(cntn.length()).toBe(3);
            expect(cntn.getElem(0)).toBe('1');
            expect(cntn.getElem(1)).toBe('2');
            expect(cntn.getElem(2)).toBe('3');
        });

        it('converts the argument into a Content instance', function(){
            tag.setContent('content');
            var cntn = tag.getContent();
            expect(cntn instanceof Content).toBe(true);
            expect(cntn.length()).toBe(1);
            expect(cntn.getElem(0)).toBe('content');
        });
    });

    describe('has a method "flushContent" that', function(){
        it('flushes content of empty Tag instance', function(){
            expect(tag.getContent().length()).toBe(0);
            tag.flushContent();
            expect(tag.getContent().length()).toBe(0);
        });

        it('flushes content of non-empty Tag instance', function(){
            content.setElements(['first', 'second']);
            tag.setContent(content);
            expect(tag.getContent().length()).toBe(2);
            tag.flushContent();
            expect(tag.getContent().length()).toBe(0);
        });

    });


    describe('has Tag setter and getter that', function(){
        it('transforms argument into a string if a number is given', function(){
            tag.setTag(34);
            expect(tag.getTag()).toBe('34');
        });
        it('sets tags if the argument is a string', function(){
            tag.setTag('customTag');
            expect(tag.getTag()).toBe('customTag');
        });
        it('does not change tag if the argument is missing', function(){
            tag.setTag('tag-name');
            tag.setTag();
            expect(tag.getTag()).toBe('tag-name');
        });
    });

    describe('has a name getter that', function(){
        it('gives the class name', function(){
            expect(tag.getName()).toBe('Tag');
        });
    });

    describe('has a method "getWidth"  that', function(){
        it('calls "getWidth()" method on its "property"', function(){
            var props = new Properties();
            spyOn(tag, 'getProperties').and.returnValue(props);
            spyOn(props, 'getWidth').and.returnValue('width result');
            expect(tag.getWidth()).toBe('width result');
            expect(props.getWidth).toHaveBeenCalled();
        });
    });

    describe('Getting absolute value of width', function(){
        it('returns undefined if width is undefined', function(){
            expect(tag.getWidth()).not.toBeDefined();
            expect(tag.getWidthValue()).not.toBeDefined();
        });
        it('returns undefined if width is a pure string', function(){
            tag.setStyleProperty('width', 'large');
            expect(tag.getWidthValue()).not.toBeDefined();
        });
        it('returns zero if width if it is set to zero', function(){
            tag.setStyleProperty('width', 0);
            expect(tag.getWidthValue()).toBe(0);
        });
        it('returns width if it is set to an integer', function(){
            tag.setStyleProperty('width', 5);
            expect(tag.getWidthValue()).toBe(5);
        });
        it('returns width if it is set to a float', function(){
            tag.setStyleProperty('width', 93.4);
            expect(tag.getWidthValue()).toBe(93.4);
        });
        it('returns 13 if it is set to a "13em"', function(){
            tag.setStyleProperty('width', "13em");
            expect(tag.getWidthValue()).toBe(13);
        });
        it('returns 84.1 if it is set to a "84.1px"', function(){
            tag.setStyleProperty('width', "84.1px");
            expect(tag.getWidthValue()).toBe(84.1);
        });
        it('returns 0 if it is set to a "0%"', function(){
            tag.setStyleProperty('width', "0%");
            expect(tag.getWidthValue()).toBe(0);
        });
        it('returns 9.21 if it is set to a "9.21 pt"', function(){
            tag.setStyleProperty('width', "9.21 pt");
            expect(tag.getWidthValue()).toBe(9.21);
        });
    });

    describe('Tag::setWidth(): sets width of the object', function(){
        var stl, attr;
        beforeEach(function(){
            stl = {setWidth: function(){return null;}};      // mock
            attr = {setProperty: function(){return null;}};  // mock
            spyOn(stl, 'setWidth');
            spyOn(attr, 'setProperty');
            spyOn(tag, 'getStyles').and.returnValue(stl);
            spyOn(tag, 'getProperties').and.returnValue(attr);
        });
        it('does not call any method if no argument is given', function(){
            tag.setWidth();
            expect(stl.setWidth).not.toHaveBeenCalled();
            expect(attr.setProperty).not.toHaveBeenCalled();
        });
        it('sets the width (final check)', function(){
            var tag2 = new Tag();
            tag2.setWidth('12.1em');
            expect(tag2.getWidth()).toBe('12.1em');
        });
    });

    describe('Tag::getElem(): gets element from "content" property', function(){
        it('calls Content::getElem method when retrieving element', function(){
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(content, 'getElem').and.returnValue(null);
            tag.getElem('whatever');
            expect(content.getElem).toHaveBeenCalledWith('whatever');
        });
    });

    describe('appendElem(): appends element to the content', function(){
        it('appends element to empty content', function(){
            expect(tag.getContent().getElements().length).toBe(0);
            var obj = {clone: function(){return obj;}};
            tag.appendElem(obj);
            expect(tag.getElem(0)).toBe(obj);
        });
        it('appends element to content with one element', function(){
            tag.appendElem('first element');
            expect(tag.getContent().getElements().length).toBe(1);
            var el = 'another element';
            tag.appendElem(el);
            expect(tag.getContent().getElements().length).toBe(2);
            expect(tag.getElem(1)).toBe(el);
        });
        it('appends element to content with two element', function(){
            tag.appendElem(1);
            tag.appendElem(2);
            expect(tag.getContent().getElements().length).toBe(2);
            var el = 'another element';
            tag.appendElem(el);
            expect(tag.getContent().getElements().length).toBe(3);
            expect(tag.getElem(2)).toBe(el);
        });

        it('does not change elements that were present in the content before appending', function(){
            tag.appendElem('first element');
            tag.appendElem('second element');
            tag.appendElem(3);
            expect(tag.getElem(0)).toBe('first element');
            expect(tag.getElem(1)).toBe('second element');
            expect(tag.getElem(2)).toBe(3);
            tag.appendElem({});
            expect(tag.getElem(0)).toBe('first element');
            expect(tag.getElem(1)).toBe('second element');
            expect(tag.getElem(2)).toBe(3);
        });
    });

    describe('Gets html tag header', function(){
        var prop;
        beforeEach(function(){
            prop = {toString: function(){return '';}};
            spyOn(tag, 'getProperties').and.returnValue(prop);
        });
        it('gets string like <tag> for a tag with empty properties', function(){
            spyOn(tag, 'getTag').and.returnValue('stubname');
            expect(tag.openingTag()).toBe('<stubname>');
        });
        it('gets string like <div attr="1" width="92"> if properties are not empty', function(){
            spyOn(tag, 'getTag').and.returnValue('div');
            spyOn(prop, 'toString').and.returnValue('"tag properties"');
            expect(tag.openingTag()).toBe('<div "tag properties">');
        });

    });

    describe('Gets html tag footer', function(){
        it('gets string like </tag> for a tag with empty styles and attributes', function(){
            spyOn(tag, 'getTag').and.returnValue('stubname');
            expect(tag.closingTag()).toBe('</stubname>');
        });
    });



    describe('Getting property "elements" of the content', function(){
        it('calls "getContent()" on the target', function(){
            spyOn(tag, 'getContent');
            tag.getElements();
            expect(tag.getContent).toHaveBeenCalled();
        });
        it('returns "getElements()" of the "getContent" output', function(){
            var obj = {getElements: function(){return 'elements';}};
            spyOn(tag, 'getContent').and.returnValue(obj);
            expect(tag.getElements()).toBe('elements');
            expect(tag.getContent).toHaveBeenCalled();
        });

    });

    describe('Setting elements', function(){
        it('does not change the content if no argument is given', function(){
            var obj = {};
            tag.appendElem(obj);
            expect(tag.getElements().length).toBe(1);
            expect(tag.getElements()[0]).toBe(obj);
            tag.setElements();
            expect(tag.getElements().length).toBe(1);
            expect(tag.getElements()[0]).toBe(obj);
        });
        it('imposes content if one element array is given', function(){
            var obj = 'foo';
            tag.setElements([obj]);
            expect(tag.getElements().length).toBe(1);
            expect(tag.getElements()[0]).toBe(obj);
        });

        it('imposes content if two element array is given', function(){
            var el1 = 'foo',
                el2 = 333;
            tag.setElements([el1, el2]);
            expect(tag.getElements().length).toBe(2);
            expect(tag.getElements()[0]).toBe(el1);
            expect(tag.getElements()[1]).toBe(el2);
        });
    });


    describe('Dropping specific property from the attributes', function(){
        var prop;
        beforeEach(function(){
            prop = new Properties();
            prop.setProperty('a1', 'v1');
            prop.setProperty('a2', 'v2');
            tag.setProperties(prop);
        });
        it('drops exisiting property', function(){
            tag.dropProperty('a1');
            expect(tag.getProperty('a1')).not.toBeDefined();
        });
        it('returns property if it exists', function(){
            expect(tag.dropProperty('a2')).toBe('v2');
        });
        it('does not change attributes if it has no property with requested name', function(){
            expect(prop.propNum()).toBe(2);
            tag.dropProperty('key that does not exist');
            prop = tag.getProperties();
            expect(prop.propNum()).toBe(2);
            expect(prop.getProperty('a1')).toBe('v1');
            expect(prop.getProperty('a2')).toBe('v2');
        });
        it('returns property if it exists', function(){
            expect(tag.dropProperty('a2')).toBe('v2');
        });
    });




    describe('getProperty(): retrieves property', function(){
        it('calls cell method "getProperties()"', function(){
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            tag.getProperty('a property');
            expect(tag.getProperties).toHaveBeenCalled();
        });
        it('calls getProperty() method on the object style', function(){
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            spyOn(tagProps, 'getProperty');
            tag.getProperty('a property');
            expect(tagProps.getProperty).toHaveBeenCalledWith('a property');
        });
        it('returns output of getProperty() method of the object style', function(){
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            spyOn(tagProps, 'getProperty').and.returnValue('fake property value');
            expect(tag.getProperty('a property')).toBe('fake property value');
        });
    });

    describe('setAttrProperty(): sets style property', function(){
        it('sets attribute property', function(){
            tag.setProperty('class', 'hidden');
            expect(tag.getProperty('class')).toBe('hidden');
        });
    });



    describe('getFirst(): gets first element of the content', function(){
        it('calls Content::getFirst method when retrieving first element', function(){
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(content, 'getFirst').and.returnValue(null);
            tag.getFirst();
            expect(content.getFirst).toHaveBeenCalled();
        });
    });

    describe('getLast(): gets last element of the content', function(){
        it('calls Content::getLast method when retrieving last element', function(){
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(content, 'getLast').and.returnValue(null);
            tag.getLast();
            expect(content.getLast).toHaveBeenCalled();
        });
    });

    describe('Inserting element at given position', function(){
        var el1, el2, el3, needle;
        beforeEach(function(){
            el1 = 'first';
            el2 = 332;
            el3 = 'string';
            needle = 'insert me';
            tag.setElements([el1, el2, el3]);
        });
        it('insert element at the beginning', function(){
            tag.insertElemAt(0, needle);
            expect(tag.getElements()[0]).toBe(needle);
        });
        it('insert element at the end', function(){
            tag.insertElemAt(3, needle);
            expect(tag.getElements()[3]).toBe(needle);
        });
        it('insert element in the middle', function(){
            tag.insertElemAt(2, needle);
            expect(tag.getElements()[2]).toBe(needle);
        });


    });

    describe('Tag::length(): gives the number of elements in the content', function(){
        it('calls Content::length method when retrieving length', function(){
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(content, 'length').and.returnValue('content length');
            expect(tag.length()).toBe('content length');
            expect(content.length).toHaveBeenCalled();
        });
    });

    describe('Tag::dropElemAt(): drops element in the given position from the content', function(){
        it('does not change the content if the argument is missing', function(){
            var el1 = 'first', el2 = 2.9, el3 = {};
            tag.setElements([el1, el2, el3]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);
            // trying to drop
            tag.dropElemAt();
            cntn = tag.getElements();
            // re-control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);
        });
        it('returns undefined if the argument is missing', function(){
            expect(tag.dropElemAt()).not.toBeDefined();
        });
        it('does not change the content if the argument corresponds to no element in the content', function(){
            var el1 = 'first elem', el2 = 18.3;
            tag.setElements([el1, el2]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(2);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);

            // trying to drop
            tag.dropElemAt(23);
            cntn = tag.getElements();
            // re-control the state
            expect(cntn.length).toBe(2);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
        });

        it('returns undefined if the argument corresponds to no element in the content', function(){
            tag.appendElem('foo elem');
            expect(tag.getElements().length).toBe(1);
            expect(tag.dropElemAt(2)).not.toBeDefined();
        });

        it('drops the first element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {};
            tag.setElements([el1, el2, el3]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);

            // trying to drop
            tag.dropElemAt(0);
            cntn = tag.getElements();

            // re-control the state
            expect(cntn.length).toBe(2);
            expect(cntn[0]).toBe(el2);
            expect(cntn[1]).toBe(el3);
        });
        it('returns the first element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {};
            tag.setElements([el1, el2, el3]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);

            expect(tag.dropElemAt(0)).toBe(el1);
        });


        it('drops the last element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {}, el4 = 'last';
            tag.setElements([el1, el2, el3, el4]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(4);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);
            expect(cntn[3]).toBe(el4);

            // trying to drop
            tag.dropElemAt(3);
            cntn = tag.getElements();

            // re-control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);
        });

        it('returns the last element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {};
            tag.setElements([el1, el2, el3]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);

            expect(tag.dropElemAt(2)).toBe(el3);
        });


        it('drops a middle element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {}, el4 = 'last';
            tag.setElements([el1, el2, el3, el4]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(4);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);
            expect(cntn[3]).toBe(el4);

            // trying to drop
            tag.dropElemAt(1);
            cntn = tag.getElements();

            // re-control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el3);
            expect(cntn[2]).toBe(el4);
        });
        it('returns a middle element', function(){
            var el1 = 'first', el2 = 2.9, el3 = {};
            tag.setElements([el1, el2, el3]);
            var cntn = tag.getElements();
            // control the state
            expect(cntn.length).toBe(3);
            expect(cntn[0]).toBe(el1);
            expect(cntn[1]).toBe(el2);
            expect(cntn[2]).toBe(el3);

            expect(tag.dropElemAt(1)).toBe(el2);
        });
    });

    describe('has a method "toHtml" that', function(){
        it('calls method "toNode"', function(){
            var el = document.createElement('span');
            spyOn(tag, 'toNode').and.returnValue(el);
            tag.toHtml();
            expect(tag.toNode).toHaveBeenCalled();
        });

        it('returns value of "innerHTML" property of "toNode" output', function(){
            var fakeEl = {innerHTML: 'html repr'};
            spyOn(tag, 'toNode').and.returnValue(fakeEl);
            expect(tag.toHtml()).toBe('html repr');
        });

    });

    describe('Appending style to the tag', function(){
        it('appends style to the object', function(){
            var stl = {'uniqueKey': 'uniqueValue'};
            tag.appendStyle(stl);
            expect(tag.getStyleProperty('uniqueKey')).toBe('uniqueValue');
        });
    });

    describe('Appending attributes to the tag', function(){
        it('appends attributes to the object', function(){
            var prop = {'uniqueKey': 'uniqueValue'};
            tag.appendProperties(prop);
            expect(tag.getProperty('uniqueKey')).toBe('uniqueValue');
        });
    });


    describe('append style to the element at given position:', function(){
        it('calls appendStyleToElemAt() method on the content', function(){
            var el1 = new Tag(),
                el2 = new Tag();
            tag.setElements([el1, el2]);
            tag.appendStyleToElemAt(1, {'hidden': 2});
            expect(tag.getElem(1).getStyleProperty('hidden')).toBe(2);
        });
    });

    describe('Tag::toText(): generates text representation of the tag', function(){
        it('calls Content::toText() method', function(){
            spyOn(content, 'toText').and.returnValue('content text');
            spyOn(tag, 'getContent').and.returnValue(content);
            expect(tag.toText()).toBe('content text');
            expect(content.toText).toHaveBeenCalled();
        });
    });

    describe('Drops the first item from its elements', function(){
        var el1, el2;
        beforeEach(function(){
            el1 = 1;
            el2 = 'second';
        });
        it('drops first element of two-element content', function(){
            tag.setElements([el1, el2]);
            tag.dropFirst();
            var els = tag.getElements();
            expect(els.length).toBe(1);
            expect(els[0]).toBe(el2);
        });
        it('drops unique element of content', function(){
            tag.setElements([el2]);
            tag.dropFirst();
            expect(tag.getElements().length).toBe(0);
        });
        it('tolerates empty content', function(){
            tag.setElements([]);
            tag.dropFirst();
            expect(tag.getElements().length).toBe(0);
        });
    });

    describe('Drops the last item from its elements', function(){
        var el1, el2;
        beforeEach(function(){
            el1 = 1;
            el2 = 'second';
        });
        it('drops last element of two-element content', function(){
            tag.setElements([el1, el2]);
            tag.dropLast();
            var els = tag.getElements();
            expect(els.length).toBe(1);
            expect(els[0]).toBe(el1);
        });
        it('drops unique element of content', function(){
            tag.setElements([el2]);
            tag.dropLast();
            expect(tag.getElements().length).toBe(0);
        });
        it('tolerates empty content', function(){
            tag.setElements([]);
            tag.dropLast();
            expect(tag.getElements().length).toBe(0);
        });

    });

    describe('Tag::isEmpty(): decides whether the tag is empty', function(){
        it('returns false if properties are empty while content is not empty', function(){
            spyOn(tagProps, 'isEmpty').and.returnValue(false);
            spyOn(content, 'isEmpty').and.returnValue(true);
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            expect(tag.isEmpty()).toBe(false);
        });
        it('returns false if content is empty while properties - not', function(){
            spyOn(tagProps, 'isEmpty').and.returnValue(true);
            spyOn(content, 'isEmpty').and.returnValue(false);
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            expect(tag.isEmpty()).toBe(false);
        });

        it('returns false if properties and content are not empty', function(){
            spyOn(tagProps, 'isEmpty').and.returnValue(false);
            spyOn(content, 'isEmpty').and.returnValue(false);
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            expect(tag.isEmpty()).toBe(false);
        });

        it('returns true if properties and content are empty', function(){
            spyOn(tagProps, 'isEmpty').and.returnValue(true);
            spyOn(content, 'isEmpty').and.returnValue(true);
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            expect(tag.isEmpty()).toBe(true);
        });

    });


    describe('Tag::appendElemIfNotEmpty(): appends element if it is not empty', function(){
        var emptyTag, nonEmptyTag;
        beforeEach(function(){
            emptyTag = new Tag();
            nonEmptyTag = new Tag();
            nonEmptyTag.appendElem('element 1');
        });

        it('appends a string to a non-empty tag', function(){
            nonEmptyTag.appendElemIfNotEmpty('a string');
            expect(nonEmptyTag.length()).toBe(2);
            expect(nonEmptyTag.getElem(1)).toBe('a string');
        });

        it('appends a string to an empty tag', function(){
            emptyTag.appendElemIfNotEmpty('a string');
            expect(emptyTag.length()).toBe(1);
            expect(emptyTag.getElem(0)).toBe('a string');
        });


    });

    describe('Setting the name of the class', function(){
        it('does not change the name if the argument is missing', function(){
            var name = tag.getName();
            tag.setName();
            expect(tag.getName()).toBe(name);
        });

        it('sets the name if it is a string', function(){
            var name = tag.getName(),
                newName = 'newClassName';
            expect(name).not.toBe(newName);
            tag.setName(newName);
            expect(tag.getName()).toBe(newName);
        });

        it('does not change the name if the argument is a number, array, function or object', function(){
            var name = tag.getName(),
                invalidNames = [0, 12, 98.9, [], [2], ['aa', 4], {}, {key: 1}];
            invalidNames.forEach(function(invalid){
                tag.setName(invalid);
                expect(tag.getName()).toBe(name);
            });
        });


    });

    describe('Tag::clone(): generates a clone of the instance', function(){
        it('creates an instance of Tag class', function(){
            expect(tag.clone() instanceof Tag).toBe(true);
        });
        it('creates an instance of a class that inherits from Tag and has "className" property', function(){
            window.TagChild = function(){
                Tag.call(this);
                this.setName('TagChild');
            };
            TagChild.prototype = Object.create(Tag.prototype);

            var tagChild = new TagChild();
            expect(tagChild.clone() instanceof TagChild).toBe(true);
        });

        it('creates a Tag instance if target "className" property corresponds to no class', function(){
            tag.setName('no such class');
            expect(tag.clone() instanceof Tag).toBe(true);
        });
        it('copies attribute values of the target', function(){
            tag.prop1 = 'property 1';
            tag.prop2 = 2;
            var clone = tag.clone();
            expect(clone.prop1).toBe('property 1');
            expect(clone.prop2).toBe(2);
        });
        it('does not change target string-valued attribute if its counterpart is changed in the clone', function(){
            tag.level = 'sea level';
            var clone = tag.clone();
            clone.level = '100 m';
            expect(clone.level).toBe('100 m');
            expect(tag.level).toBe('sea level');
        });

        it('does not change string-valued attribute in the clone if its counterpart is changed in the target', function(){
            tag.module = 'book';
            var clone = tag.clone();
            tag.module = 'article';
            expect(clone.module).toBe('book');
            expect(tag.module).toBe('article');
        });

        it('copies methods of the target', function(){
            tag.m1 = function(){return 'this is method 1';};
            tag.m2 = function(){return 'this is method 2';};
            var tagClone = tag.clone();
            expect(tagClone.m1()).toBe('this is method 1');
            expect(tagClone.m2()).toBe('this is method 2');
        });
        it('does not change method of the target if its clone counterpart is changed', function(){
            tag.m1 = function(){return 'this is method 1';};
            var clone = tag.clone();
            clone.m1 = function(){return 'modified method';};
            expect(clone.m1()).toBe('modified method');
            expect(tag.m1()).toBe('this is method 1');
        });
        it('does not change method of the clone if its counterpart in the target is changed', function(){
            tag.m1 = function(){return 'this is method 1';};
            var clone = tag.clone();
            tag.m1 = function(){return 'modified method';};
            expect(tag.m1()).toBe('modified method');
            expect(clone.m1()).toBe('this is method 1');
        });
        it('calls "clone" method if an attribute has that method', function(){
            tag.m1 = {clone: function(){return null;}};
            spyOn(tag.m1, 'clone');
            tag.clone();
            expect(tag.m1.clone).toHaveBeenCalled();
        });
        it('assignes value of "clone" method if an attribute has that method', function(){
            tag.m1 = {clone: function(){return null;}};
            spyOn(tag.m1, 'clone').and.returnValue('clone of m1');
            var clone = tag.clone();
            expect(clone.m1).toBe('clone of m1');
        });
        it('clones text content', function(){
            tag.setElements(['first', 'second']);
            var clone = tag.clone();
            expect(clone.length()).toBe(2);
            expect(clone.getElem(0)).toBe('first');
            expect(clone.getElem(1)).toBe('second');
        });
    });


    describe('Tag::toNode(): transforms element into a DOM.Element', function(){
        beforeEach(function(){
            tag.setTag('mdk');
            spyOn(tag, 'getContent').and.returnValue(content);
            spyOn(tag, 'getProperties').and.returnValue(tagProps);
            // spyOn(tag, 'getStyles').and.returnValue(tagStyle);

        });
        it('return DOM element with tag equal to the "tag" property', function(){
            expect(tag.toNode().tagName).toBe('MDK');
        });
        it('calls "decorateElement" on the style to set styles', function(){
            // spyOn(tagStyle, 'decorateElement');
            tag.toNode();
            pending();
            // expect(tagStyle.decorateElement).toHaveBeenCalled();
        });
        it('calls "stickTo" on content to append children', function(){
            spyOn(content, 'stickTo');
            tag.toNode();
            expect(content.stickTo).toHaveBeenCalled();
        });
        it('transorms a realistic tag into node', function(){
            tag = new Tag();
            tag.setTag('a');
            tag.setContent(new PlainText('link text'));
            var node = tag.toNode();
            expect(typeof node).toBe('object');
            expect(node.nodeType).toBe(Node.ELEMENT_NODE);
            expect(node.tagName).toBe('A');
            expect(node.childNodes.length).toBe(1);
            expect(node.firstChild.nodeType).toBe(Node.TEXT_NODE);
            expect(node.firstChild.nodeValue).toBe('link text');

        });

    });

    describe('Sets title to the tag', function(){
        it('sets title attribute if the argument is not empty string', function(){
            tag.setTitle('tag title');
            expect(tag.getProperty('title')).toBe('tag title');
        });
        it('does not set title attribute if the argument is an empty string', function(){
            tag.setTitle('');
            expect(tag.getProperty('title')).not.toBeDefined();
        });
        it('removes previously imposed value (if any) of attribute "title" if the argument is an empty string', function(){
            tag.setTitle('title to be wiped off');
            tag.setTitle('');
            expect(tag.getProperty('title')).not.toBeDefined();
        });
        it('does not set attribute "title" if the argument is a number, function, array or object', function(){
            var invalids = [0, 1, -2, 4.1, -3.7, function(){return null;}, [], [0], [1, 4, -3.21], {}];
            invalids.forEach(function(invalid){
                var tag2 = new Tag();
                tag2.setTitle(invalid);
                expect(tag.getProperty('title')).not.toBeDefined();
            });
        });
        it('removes previously imposed value (if any) of attribute attribute "title" if the argument is a number, function, array or object', function(){
            var invalids = [0, 1, -2, 4.1, -3.7, function(){return null;}, [], [0], [1, 4, -3.21], {}];
            invalids.forEach(function(invalid){
                var tag2 = new Tag();
                tag2.setTitle("old title");
                tag2.setTitle(invalid);
                expect(tag.getProperty('title')).not.toBeDefined();
            });
        });
    });

    xdescribe('Shrinking the width of element', function(){
        it('leaves the target unchanged if argument is missing', function(){
            tag.setWidth(87.6);
            tag.shrinkBy();
            expect(tag.getWidth()).toBe(87.6);
        });

        it('shrinks if target and argument have the same unit of measurements', function(){
            tag.setWidth('24.1em');
            tag.shrinkBy('8em');
            expect(tag.getProperty('width')).toBe(16.1);

        });

        it('throws an error if target and argument have different unit of measurements', function(){
            tag.setWidth('24.1cm');
            expect(function(){
                return tag.shrinkBy('12px');
            }).toThrow(new Error('Can not shrink: units of measurement do not coincide.'));
        });

        it('shrinks if target is dimensionless and argument has no dimension', function(){
            tag.setWidth(24.1);
            tag.shrinkBy(4);
            expect(tag.getProperty('width')).toBe(20.1);
        });

        it('shrinks if target and argument are both dimensionless', function(){
            tag.setWidth(87.6);
            tag.shrinkBy(4);
            expect(tag.getProperty('width')).toBe(83.6);
        });

        it('does not set target "width" attribute if it is originally not set', function(){
            tag.dropProperty('width');
            expect(tag.hasProperty('width')).toBe(false);
            tag.shrinkBy(3);
            expect(tag.hasProperty('width')).toBe(false);
        });

    });

    describe('Imposing styles to all children', function(){
        var tag2;
        beforeEach(function(){
            tag = new Tag();
            tag2 = new Tag();
        });

        it('does not append any element if initially there are no children', function(){
            expect(tag.length()).toBe(0);
            tag.setStylePropertyToAll('class', 'hidden');
            expect(tag.length()).toBe(0);
        });

        it('does not append any element if initially there is one child', function(){
            tag2 = new Tag();
            tag.appendElem(tag2);
            expect(tag.length()).toBe(1);
            tag.setStylePropertyToAll('class', 'hidden');
            expect(tag.length()).toBe(1);
        });

        it('sets style of unique child element', function(){
            tag2 = new Tag();
            tag.appendElem(tag2);
            tag.setStylePropertyToAll('class', 'hidden');
            expect(tag.getFirst().getStyleProperty('class')).toBe('hidden');
        });

        it('sets style of three child elements', function(){
            tag2 = new Tag();
            var tag3 = new Tag(),
                tag4 = new Tag();
            tag.appendElem(tag2);
            tag.appendElem(tag3);
            tag.appendElem(tag4);
            tag.setStylePropertyToAll('class', 'hidden');
            expect(tag.getElem(0).getStyleProperty('class')).toBe('hidden');
            expect(tag.getElem(1).getStyleProperty('class')).toBe('hidden');
            expect(tag.getElem(2).getStyleProperty('class')).toBe('hidden');
        });
    });

    describe('Imposing styles to a range of children', function(){
        var tag2, tag3, tag4, tag5;
        beforeEach(function(){
            tag2 = new Tag('div');
            tag3 = new Tag('span');
            tag4 = new Tag('img');
            tag5 = new Tag('h1');
        });

        it('does not throw any error if the range is an array', function(){
            expect(tag.length()).toBe(0);
            expect(function(){
                return tag.setStylePropertyOfRange('class', 'hidden', [1, 2, 3]);
            }).not.toThrow(new Error('Range must be an array!'));
        });

        it('does not throw any error if the range is a null', function(){
            expect(tag.length()).toBe(0);
            expect(function(){
                return tag.setStylePropertyOfRange('class', 'hidden', null);
            }).not.toThrow(new Error('Range must be an array!'));
        });

        it('does not throw any error if the range is undefined', function(){
            expect(tag.length()).toBe(0);
            expect(function(){
                return tag.setStylePropertyOfRange('class', 'hidden');
            }).not.toThrow(new Error('Range must be an array!'));
        });

        it('sets inline styles to elements 0 and 2 if the range is [0, 2]', function(){
            tag.appendElem(tag2);
            tag.appendElem(tag3);
            tag.appendElem(tag4);
            tag.appendElem(tag5);
            tag.setStylePropertyOfRange('display', 'visible', [2, 0]);
            expect(tag.getElem(0).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(1).hasStyleProperty('display')).toBe(false);
            expect(tag.getElem(2).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(3).hasStyleProperty('display')).toBe(false);
        });

        it('sets inline styles to all elements if range is null', function(){
            tag.appendElem(tag2);
            tag.appendElem(tag3);
            tag.appendElem(tag4);
            tag.setStylePropertyOfRange('display', 'visible', null);
            expect(tag.getElem(0).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(1).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(2).getStyleProperty('display')).toBe('visible');
        });

        it('sets inline styles to all elements if the range is not defined', function(){
            tag.appendElem(tag2);
            tag.appendElem(tag3);
            tag.appendElem(tag4);
            tag.appendElem(tag5);
            tag.setStylePropertyOfRange('display', 'visible');
            expect(tag.getElem(0).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(1).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(2).getStyleProperty('display')).toBe('visible');
            expect(tag.getElem(3).getStyleProperty('display')).toBe('visible');
        });
    });

    describe('Getting common style properties of multiple elements', function(){
        var tag2 = new Tag(),
            tag3 = new Tag(),
            tag4 = new Tag(),
            tag5 = new Tag(),
            tag6 = new Tag(),
            tag7 = new Tag();

        beforeEach(function(){
            tag2.setStyleProperty('padding', '10px');
            tag3.setStyleProperty('padding', '20px');
            tag4.setStyleProperty('width',   '10px');
            tag5.setStyleProperty('padding', '10px');
            tag6.setStyleProperty('padding', '10px');
            tag7.setStyleProperty('padding', '30px');
            tag.appendElem(tag2);
            tag.appendElem(tag3);
            tag.appendElem(tag4);
            tag.appendElem(tag5);
            tag.appendElem(tag6);
            tag.appendElem(tag7);
        });

        it('throws an error if the range is given as a string, object, function or number', function(){
            var invalids = ['', 'a string', {}, {key: 3}, function(){}, function(x){return x;}, 0, 1, 2.3];
            invalids.forEach(function(invalid){
                expect(function(){
                    return tag.getStylePropertyOfRange('margin', invalid);
                }).toThrow(new Error('Range must be an array!'));
            });
        });

        it('does not throw any error if the range is null', function(){
            expect(function(){
                return tag.getStylePropertyOfRange('margin', null);
            }).not.toThrow(new Error('Range must be an array!'));
        });

        it('does not throw any error if the range is not defined', function(){
            expect(function(){
                return tag.getStylePropertyOfRange('padding');
            }).not.toThrow(new Error('Range must be an array!'));
        });

        it('returns null if the range is an empty array', function(){
            expect(tag.getStylePropertyOfRange('padding', [])).toBe(null);
        });

        it('returns the property value if the range contains just one non-negative number', function(){
            expect(tag.getStylePropertyOfRange('padding', [1])).toBe('20px');
        });

        it('returns the property value if the range contains just one negative number', function(){
            expect(tag.getStylePropertyOfRange('padding', [-1])).toBe('30px');
        });


        it('returns the property value if the range corresponds to elements having the same value of the property', function(){
            expect(tag.getStylePropertyOfRange('padding', [0, 3, 4])).toBe('10px');
        });

        it('returns the property value if the range corresponds to elements having the same value of the property (II)', function(){
            expect(tag.getStylePropertyOfRange('padding', [0, -2, 3])).toBe('10px');
        });


        it('returns null if the range corresponds to elements with different values of the property', function(){
            expect(tag.getStylePropertyOfRange('padding', [4, 5])).toBe('10px');
        });

    });

    describe('has a method "loadIntoElement" that', function(){
        it('makes the argument have target\'s attributes if initially it has no attributes', function(){
            var el = document.createElement('span');
            tag = new Tag('div');
            tag.setProperty('class', 'best');
            tag.setProperty('width', '321px');
            tag.setProperty('id', 'x');
            tag.loadIntoElement(el);
            expect(el.getAttribute('class')).toBe('best');
            expect(el.getAttribute('width')).toBe('321px');
            expect(el.getAttribute('id')).toBe('x');
        });

        it('overrides element\'s attributes by the target ones', function(){
            var el = document.createElement('span');
            el.setAttribute('class', 'original class');
            el.setAttribute('id', 'spanId');

            tag = new Tag('div');
            tag.setProperty('class', 'best');
            tag.setProperty('id', 'x');

            tag.loadIntoElement(el);
            expect(el.getAttribute('class')).toBe('best');
            expect(el.getAttribute('id')).toBe('x');
        });

        it('does not set attributes if the argument is a text node', function(){
            var el = document.createTextNode('this is a text node');

            tag = new Tag('div');
            tag.setProperty('class', 'best');
            tag.setProperty('id', 'x');

            tag.loadIntoElement(el);
            expect(el instanceof Text).toBe(true);
        });

        it('makes the argument have target\'s style attributes if initially it has no attributes', function(){
            var el = document.createElement('span');
            tag = new Tag('div');
            tag.setStyleProperty('padding', '20em');
            tag.setStyleProperty('margin', '32pt');
            tag.loadIntoElement(el);

            expect(el.style.padding).toBe('20em');
            expect(el.style.margin).toBe('32pt');
        });


    });

    describe('has a method "template" that', function(){
        var template;
        describe('manage key "tag" in the followig way:', function(){
            it('does not include key "tag" if the tagName() method returns nothing', function(){
                spyOn(tag, 'getTag');
                template = tag.template();
                expect(template.hasOwnProperty('tag')).toBe(false);
            });

            it('includes key "tag" if the tagName() method returns "span"', function(){
                spyOn(tag, 'getTag').and.returnValue('span');
                template = tag.template();
                expect(template.tag).toBe('span');
            });
        });
        describe('manage key "root" in the followig way:', function(){
            it('does not include key "root" if the getProperty() method returns nothing', function(){
                spyOn(tag, 'getProperties');
                template = tag.template();
                expect(template.hasOwnProperty('root')).toBe(false);
            });

            it('uses getCore() method in order to retrieve key-value pairs of the property', function(){
                var prop = new Properties();
                spyOn(prop, 'getCore');
                spyOn(tag, 'getProperties').and.returnValue(prop);
                template = tag.template();
                expect(prop.getCore).toHaveBeenCalled();
            });

            it('does not include output of getCore() method if it has no keys', function(){
                var prop = new Properties();
                spyOn(prop, 'getCore').and.returnValue({});
                spyOn(tag, 'getProperties').and.returnValue(prop);
                tag = new Tag();
                template = tag.template();
                expect(template.hasOwnProperty('root')).toBe(false);
            });
            it('includes output of getCore() method if it has two keys', function(){
                var prop = new Properties();
                prop.setProperty('class', 'media');
                prop.setProperty('margin', '10px');
                spyOn(tag, 'getProperties').and.returnValue(prop);
                template = tag.template();
                expect(template.root.class).toBe('media');
                expect(template.root.margin).toBe('10px');
            });
        });
        describe('manage key "children" in the following way:', function(){
            it('does not include key "children" if the getContent() method returns nothing', function(){
                spyOn(tag, 'getContent');
                template = tag.template();
                expect(template.hasOwnProperty('children')).toBe(false);
            });
            it('uses template() method of the to retrieve key-value pairs of the property', function(){
                content = new Content();
                spyOn(content, 'template');
                spyOn(tag, 'getContent').and.returnValue(content);
                template = tag.template();
                expect(content.template).toHaveBeenCalled();
            });
            it('does not include output of template() method if it is an empty array', function(){
                content = new Content();
                spyOn(content, 'template').and.returnValue([]);
                spyOn(tag, 'getContent').and.returnValue(content);
                template = tag.template();
                expect(template.hasOwnProperty('children')).toBe(false);
            });
            it('does not include output of template() method if it is not array (i.e. a string)', function(){
                content = new Content();
                spyOn(content, 'template').and.returnValue('a string, not array');
                spyOn(tag, 'getContent').and.returnValue(content);
                template = tag.template();
                expect(template.hasOwnProperty('children')).toBe(false);
            });
            it('includes output of template() method if it is an array with three elements', function(){
                content = new Content();
                var fakeContentTemplate = [{}, {}, {}];
                spyOn(content, 'template').and.returnValue(fakeContentTemplate);
                spyOn(tag, 'getContent').and.returnValue(content);
                template = tag.template();
                expect(template.children).toBe(fakeContentTemplate);
            });

        });
    });

    describe('has a method "loadTemplate" that', function(){
        beforeEach(function(){
            tag.setProperties({width: '3984em', color: 'navy', padding: 12});
            expect(tag.getProperties().propNum()).toBe(3);
        });
        it('does not change tag\'s properties if the template has no "root" key', function(){
            tag.loadTemplate({width: '1px'});
            expect(tag.getProperties().propNum()).toBe(3);
            expect(tag.getProperty('width')).toBe('3984em');
            expect(tag.getProperty('color')).toBe('navy');
            expect(tag.getProperty('padding')).toBe(12);
        });
        it('adds properties that were not present intitially', function(){
            tag.loadTemplate({root: {
                margin: '43pt',
                background: 'red'
            }});
            expect(tag.getProperty('margin')).toBe('43pt');
            expect(tag.getProperty('background')).toBe('red');
        });

        it('overrides properties that were present intitially', function(){
            tag.loadTemplate({root: {
                width: '43pt',
                background: 'red'
            }});
            expect(tag.getProperty('width')).toBe('43pt');
        });
        it('does not modify tag\'s properties that are not present in the template', function(){
            tag.loadTemplate({root: {
                id: 'logo',
                color: 'red'
            }});
            expect(tag.getProperty('width')).toBe('3984em');
            expect(tag.getProperty('padding')).toBe(12);
        });
        it('does not add extra properties if the template contains only those present initially in the tag ', function(){
            tag.loadTemplate({root:
                {
                    padding: '9%',
                    color: 'red'
                }
            });
            expect(tag.getProperties().propNum()).toBe(3);
        });
        it('calls method "setContent" if the content is defiend', function(){
            spyOn(tag, 'getContent').and.returnValue(new Content());
            spyOn(tag, 'setContent');
            tag.loadTemplate({root: {id: 'logo', color: 'red'}, children: ['an fictitios array']});
            expect(tag.setContent).toHaveBeenCalled();
        });
        it('calls method "loadTemplateBunch" on the content if it is defined', function(){
            var fakeContent = new Content();
            spyOn(tag, 'getContent').and.returnValue(fakeContent);
            spyOn(fakeContent, 'loadTemplateBunch');
            tag.loadTemplate({root: {id: 'logo', color: 'red'}, children: ['an fictitios array']});
            expect(fakeContent.loadTemplateBunch).toHaveBeenCalled();
        });
        it('calls method "extractChildTemplates" to get child templates', function(){
            var fakeContent = new Content();
            var fakeArr = [];
            spyOn(tag, 'getContent').and.returnValue(fakeContent);
            spyOn(tag, 'extractChildTemplates').and.returnValue(fakeArr);
            tag.loadTemplate({root: {id: 'logo', color: 'red'}, children: ['an fictitios array']});
            expect(tag.extractChildTemplates).toHaveBeenCalled();
        });
        it('calls method "loadTemplateBunch" with output of "extractChildTemplates" method', function(){
            var fakeContent = new Content();
            var fakeArr = [];
            spyOn(tag, 'getContent').and.returnValue(fakeContent);
            spyOn(tag, 'extractChildTemplates').and.returnValue(fakeArr);
            spyOn(fakeContent, 'loadTemplateBunch');
            tag.loadTemplate({root: {id: 'logo', color: 'red'}, children: ['anything']});
            expect(fakeContent.loadTemplateBunch).toHaveBeenCalledWith(fakeArr);
            expect(tag.extractChildTemplates).toHaveBeenCalled();
        });



    });

    describe('has a method "extractProperTemplate" that', function(){
        it('returns an empty object if the template has no "root" key', function(){
            var t = tag.extractProperTemplate({foo: 1, boo: 2});
            expect(Object.keys(t).length).toBe(0);
        });
        it('returns an object with key "root" equal to the one in the template', function(){
            var tRoot = {width: 'large', 'anything': true};
            var t = tag.extractProperTemplate({root: tRoot});
            expect(t).toBe(tRoot);
        });
    });

    describe('has a method "extractChildTemplates" that', function(){
        it('returns an empty array if the template has no "children" key', function(){
            var t = tag.extractChildTemplates({foo: 1, boo: 2});
            expect(Object.keys(t).length).toBe(0);
        });
        it('returns an object with key "children" equal to the one in the template', function(){
            var childrenTemplates = [{}, {}, {}],
                template = {children: childrenTemplates};
            var t = tag.extractChildTemplates(template);
            expect(t).toBe(childrenTemplates);
        });
    });


});