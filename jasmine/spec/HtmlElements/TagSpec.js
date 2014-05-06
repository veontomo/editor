/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Styles, Attributes, Content, Link, window, Node, Commen, TagChild */

describe('Tag-related functionality', function() {
    var tag, tagStyle, tagAttr, content;
    beforeEach(function() {
        tagStyle = new Styles();
        tagAttr = new Attributes();
        tag = new Tag();
        content = new Content();
    });

    describe('Tag::constuctor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            tag = Tag();
            expect(tag instanceof Tag).toBe(true);
        });
    });

    describe('Styles setter and getter', function(){
        it('is an instance of Styles class', function(){
            expect(tag.getStyles() instanceof Styles).toBe(true);
        });
        it('calls Styles constructor to set styles', function(){
            spyOn(window, 'Styles');
            tag.setStyles('anything');
            expect(window.Styles).toHaveBeenCalledWith('anything');
        });

        it('returns an instance of Styles after setting the styles', function(){
            tag.setStyles('anything');
            expect(tag.getStyles() instanceof Styles).toBe(true);
        });
    });

    describe('Attributes setter and getter', function(){
        it('is an instance of Attributes class', function(){
            expect(tag.getAttributes() instanceof Attributes).toBe(true);
        });
        it('calls Attributes constructor to set styles', function(){
            spyOn(window, 'Attributes');
            tag.setAttributes('anything');
            expect(window.Attributes).toHaveBeenCalledWith('anything');
        });

        it('returns an instance of Attributes after setting the Attributes', function(){
            tag.setAttributes('anything');
            expect(tag.getAttributes() instanceof Attributes).toBe(true);
        });
    });

    describe('Content setter and getter', function(){
        it('returns an instance of Content class', function(){
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

    describe('Clearing content of the Tag', function(){
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


    describe('Tag setter and getter', function(){
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

    describe('Name of the current class', function(){
        it('gives the class name', function(){
            expect(tag.getName()).toBe('Tag');
        });
    });

    describe('Tag::getWidth(): retrieves the width value from the style', function(){
        it('calls "getProperty()" method on its "styles"', function(){
            var stl = new Styles();
            spyOn(tag, 'getStyles').andCallFake(function(){return stl;});
            spyOn(stl, 'getProperty');
            tag.getWidth();
            expect(stl.getProperty).toHaveBeenCalledWith('width');
            expect(tag.getStyles).toHaveBeenCalled();
        });
        it('returns "getProperty()" output applied on its "styles"', function(){
            var stl = new Styles();
            spyOn(tag, 'getStyles').andCallFake(function(){return stl;});
            spyOn(stl, 'getProperty').andCallFake(function(){return 'width value';});
            expect(tag.getWidth()).toBe('width value');
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
            spyOn(tag, 'getStyles').andCallFake(function(){return stl;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return attr;});
        });
        it('does not call any method if no argument is given', function(){
            tag.setWidth();
            expect(stl.setWidth).wasNotCalled();
            expect(attr.setProperty).wasNotCalled();
        });
        it('calls style- and attribute-related methods if the argument is given', function(){
            var width = {};           // anything
            tag.setWidth(width);
            expect(stl.setWidth).toHaveBeenCalledWith(width);
            expect(attr.setProperty).toHaveBeenCalledWith('width', width);
        });
        it('sets the width (final check)', function(){
            var tag2 = new Tag();
            tag2.setWidth('12.1em');
            expect(tag2.getWidth()).toBe('12.1em');
        });
    });

    describe('Tag::getElem(): gets element from "content" property', function(){
        it('calls Content::getElem method when retrieving element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'getElem').andCallFake(function(){return null;});
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


    describe('Getting property "elements" of the content', function(){
        it('calls "getContent()" on the target', function(){
            spyOn(tag, 'getContent');
            tag.getElements();
            expect(tag.getContent).toHaveBeenCalled();
        });
        it('returns "getElements()" of the "getContent" output', function(){
            var obj = {getElements: function(){return 'elements';}};
            spyOn(tag, 'getContent').andCallFake(function(){return obj;});
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

    describe('getStyleProperty(): retrieves style property', function(){
        it('calls cell method "getStyles()"', function(){
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            tag.getStyleProperty('a property');
            expect(tag.getStyles).toHaveBeenCalled();
        });
        it('calls getProperty() method on the object style', function(){
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tagStyle, 'getProperty');
            tag.getStyleProperty('a property');
            expect(tagStyle.getProperty).toHaveBeenCalledWith('a property');
        });
        it('returns output of getProperty() method of the object style', function(){
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tagStyle, 'getProperty').andCallFake(function(){return 'fake property value';});
            expect(tag.getStyleProperty('a property')).toBe('fake property value');
        });
    });

    describe('setStyleProperty(): sets style property', function(){
        it('sets style property', function(){
            tag.setStyleProperty('a property', 'a value');
            expect(tag.getStyleProperty('a property')).toBe('a value');
        });
    });

    describe('Dropping specific property from the attributes', function(){
        var attr;
        beforeEach(function(){
            attr = new Attributes();
            attr.setProperty('a1', 'v1');
            attr.setProperty('a2', 'v2');
            tag.setAttributes(attr);
        });
        it('drops exisitng property', function(){
            tag.dropAttrProperty('a1');
            expect(tag.getAttrProperty('a1')).not.toBeDefined();
        });
        it('returns property if it exists', function(){
            expect(tag.dropAttrProperty('a2')).toBe('v2');
        });
        it('does not change attributes if it has no property with requested name', function(){
            expect(attr.propNum()).toBe(2);
            tag.dropAttrProperty('key that does not exist');
            attr = tag.getAttributes();
            expect(attr.propNum()).toBe(2);
            expect(attr.getProperty('a1')).toBe('v1');
            expect(attr.getProperty('a2')).toBe('v2');
        });
        it('returns property if it exists', function(){
            expect(tag.dropAttrProperty('a2')).toBe('v2');
        });
    });

    describe('Dropping specific property from the styles', function(){
        var stl;
        beforeEach(function(){
            stl = new Styles();
            stl.setProperty('a1', 'v1');
            stl.setProperty('a2', 'v2');
            tag.setStyles(stl);
        });
        it('drops exisitng property', function(){
            tag.dropStyleProperty('a1');
            expect(tag.getStyleProperty('a1')).not.toBeDefined();
        });
        it('returns property if it exists', function(){
            expect(tag.dropStyleProperty('a2')).toBe('v2');
        });
        it('does not change attributes if it has no property with requested name', function(){
            expect(stl.propNum()).toBe(2);
            tag.dropStyleProperty('key that does not exist');
            stl = tag.getStyles();
            expect(stl.propNum()).toBe(2);
            expect(stl.getProperty('a1')).toBe('v1');
            expect(stl.getProperty('a2')).toBe('v2');
        });
        it('returns property if it exists', function(){
            expect(tag.dropStyleProperty('a2')).toBe('v2');
        });
    });



    describe('getAttrProperty(): retrieves attribute property', function(){
        it('calls cell method "getAttributes()"', function(){
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            tag.getAttrProperty('a property');
            expect(tag.getAttributes).toHaveBeenCalled();
        });
        it('calls getProperty() method on the object style', function(){
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tagAttr, 'getProperty');
            tag.getAttrProperty('a property');
            expect(tagAttr.getProperty).toHaveBeenCalledWith('a property');
        });
        it('returns output of getProperty() method of the object style', function(){
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tagAttr, 'getProperty').andCallFake(function(){return 'fake property value';});
            expect(tag.getAttrProperty('a property')).toBe('fake property value');
        });
    });

    describe('setAttrProperty(): sets style property', function(){
        it('sets attribute property', function(){
            tag.setAttrProperty('class', 'hidden');
            expect(tag.getAttrProperty('class')).toBe('hidden');
        });
    });



    describe('getFirst(): gets first element of the content', function(){
        it('calls Content::getFirst method when retrieving first element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'getFirst').andCallFake(function(){return null;});
            tag.getFirst();
            expect(content.getFirst).toHaveBeenCalled();
        });
    });

    describe('getLast(): gets last element of the content', function(){
        it('calls Content::getLast method when retrieving last element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'getLast').andCallFake(function(){return null;});
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
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'length').andCallFake(function(){return 'content length';});
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

    describe('creates html representation of the tag', function(){
        it('if style and attributes are present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tag, 'getTag').andCallFake(function(){return 'htmltag';});
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if style is present, attributes - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tag, 'getTag').andCallFake(function(){return 'htmltag';});
            expect(tag.toHtml()).toBe('<htmltag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if attributes are present, style - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tag, 'getTag').andCallFake(function(){return 'htmltag';});
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag>html representation of the content</htmltag>');
        });

        it('if both style and attributes are not present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tag, 'getTag').andCallFake(function(){return 'htmltag';});
            expect(tag.toHtml()).toBe('<htmltag>html representation of the content</htmltag>');
        });

        it('if content is empty', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return '';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            spyOn(tag, 'getTag').andCallFake(function(){return 'htmltag';});
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag style="styles of the tag"></htmltag>');
        });


        it('if tag name is missing', function(){
            if (tag.hasOwnProperty('tag')){
                delete tag.tag;
            }
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });

        it('if tag name is empty', function(){
            tag.tag = '';
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });

        it('if tag name is null', function(){
            tag.tag = null;
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
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
            var attr = {'uniqueKey': 'uniqueValue'};
            tag.appendAttributes(attr);
            expect(tag.getAttrProperty('uniqueKey')).toBe('uniqueValue');
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
            spyOn(content, 'toText').andCallFake(function(){return 'content text';});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
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
        it('returns false if attributes are empty while content and styles - not', function(){
            spyOn(tagStyle, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tagAttr, 'isEmpty').andCallFake(function(){return false;});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            expect(tag.isEmpty()).toBe(false);
            expect(tagAttr.isEmpty).toHaveBeenCalled();
        });
        it('returns false if styles are empty while content and attributes - not', function(){
            spyOn(tagStyle, 'isEmpty').andCallFake(function(){return false;});
            spyOn(tagAttr, 'isEmpty').andCallFake(function(){return true;});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            expect(tag.isEmpty()).toBe(false);
            expect(tagStyle.isEmpty).toHaveBeenCalled();
        });
        it('returns false if content are empty while attributes and styles - not', function(){
            spyOn(tagStyle, 'isEmpty').andCallFake(function(){return false;});
            spyOn(tagAttr, 'isEmpty').andCallFake(function(){return true;});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            expect(tag.isEmpty()).toBe(false);
            expect(tagStyle.isEmpty).toHaveBeenCalled();
        });

        it('returns true attributes, styles and content are not empty', function(){
            spyOn(tagStyle, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tagAttr, 'isEmpty').andCallFake(function(){return true;});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            expect(tag.isEmpty()).toBe(true);
            expect(tagAttr.isEmpty).toHaveBeenCalled();
            expect(tagStyle.isEmpty).toHaveBeenCalled();
            expect(content.isEmpty).toHaveBeenCalled();
        });
    });


    xdescribe('Tag::appendElemIfNotEmpty(): appends element if it is not empty', function(){
        it('calls Content::appendElemIfNotEmpty()', function(){
            spyOn(content, 'appendElemIfNotEmpty');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            var foo = 'foo';
            tag.appendElemIfNotEmpty(foo);
            expect(content.appendElemIfNotEmpty).toHaveBeenCalledWith(foo);
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
            spyOn(tag.m1, 'clone').andCallFake(function(){return 'clone of m1';});
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


    describe('Tag::load(): populates properties from the argument', function(){
        var root, e0, t1, e2;
 //          root
 //  __________|____________
 // |          |            |
 // e0        t1           e2

        beforeEach(function(){
            root = document.createElement('custom');
            root.setAttribute('class', 'virtual');
            root.setAttribute('level', 2);
            root.setAttribute('style', 'color: green; margin: 32em;');
            e0 = document.createElement('div');
            t1 = document.createTextNode('hi there!');
            e2 = document.createElement('span');
            root.appendChild(e0);
            root.appendChild(t1);
            root.appendChild(e2);

            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
        });

        it('does not call "load" methods, if the argument is missing', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load();
            expect(content.load).not.toHaveBeenCalled();
            expect(tagAttr.load).not.toHaveBeenCalled();
            expect(tagStyle.load).not.toHaveBeenCalled();
        });

        it('returns false, if the argument is missing', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            expect(tag.load()).toBe(false);
        });


        it('sets "tag" property', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load(root);
            expect(tag.getTag()).toBe('custom');
        });


        it('does not call "load" methods, if the argument has non-ELEMENT nodeType', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load({'nodeType': 'any non element node type'});
            expect(content.load).not.toHaveBeenCalled();
            expect(tagAttr.load).not.toHaveBeenCalled();
            expect(tagStyle.load).not.toHaveBeenCalled();
        });

        it('returns "true", if all "load" methods return "true"', function(){
            spyOn(content, 'load').andCallFake(function(){return true;});
            spyOn(tagAttr, 'load').andCallFake(function(){return true;});
            spyOn(tagStyle, 'load').andCallFake(function(){return true;});
            expect(tag.load(e0)).toBe(true);
        });

        it('returns "false", if all "load" methods return "false"', function(){
            spyOn(content, 'load').andCallFake(function(){return false;});
            spyOn(tagAttr, 'load').andCallFake(function(){return false;});
            spyOn(tagStyle, 'load').andCallFake(function(){return false;});
            expect(tag.load(e0)).toBe(false);
        });

        it('returns "false", if "content.load" method return "false", and the others - "true"', function(){
            spyOn(content, 'load').andCallFake(function(){return false;});
            spyOn(tagAttr, 'load').andCallFake(function(){return true;});
            spyOn(tagStyle, 'load').andCallFake(function(){return true;});
            expect(tag.load(t1)).toBe(false);
        });
        it('returns "false", if "attr.load" method return "false", and the others - "true"', function(){
            spyOn(content, 'load').andCallFake(function(){return true;});
            spyOn(tagAttr, 'load').andCallFake(function(){return false;});
            spyOn(tagStyle, 'load').andCallFake(function(){return true;});
            expect(tag.load(e2)).toBe(false);
        });
        it('returns "false", if "style.load" method return "false", and the other - "true"', function(){
            spyOn(content, 'load').andCallFake(function(){return true;});
            spyOn(tagAttr, 'load').andCallFake(function(){return true;});
            spyOn(tagStyle, 'load').andCallFake(function(){return false;});
            expect(tag.load(e0)).toBe(false);
        });

        it('calls method to set attributes', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load(root);
            expect(tagAttr.load).toHaveBeenCalledWith(root.attributes);
        });

        it('calls method to set the style', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load(root);
            expect(tagStyle.load).toHaveBeenCalledWith(root.attributes);
        });


    });

    describe('Tag::toNode(): transforms element into a DOM.Element', function(){
        beforeEach(function(){
            tag.setTag('mdk');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(tag, 'getAttributes').andCallFake(function(){return tagAttr;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});

        });
        it('return DOM element with tag equal to the "tag" property', function(){
            expect(tag.toNode().tagName).toBe('MDK');
        });
        it('calls "decorateElement" on the style to set styles', function(){
            spyOn(tagStyle, 'decorateElement');
            tag.toNode();
            expect(tagStyle.decorateElement).toHaveBeenCalled();
        });
        it('calls "decorateElement" on attr to set attributes', function(){
            spyOn(tagAttr, 'decorateElement');
            tag.toNode();
            expect(tagAttr.decorateElement).toHaveBeenCalled();
        });
        it('calls "stickTo" on content to append children', function(){
            spyOn(content, 'stickTo');
            tag.toNode();
            expect(content.stickTo).toHaveBeenCalled();
        });
    });

});