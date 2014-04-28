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
        it('calls Content::appendElem method when appending an element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'appendElem').andCallFake(function(){return null;});
            tag.appendElem('whatever');
            expect(content.appendElem).toHaveBeenCalledWith('whatever');
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

    describe('Tag::insertElemAt() inserts element at given position', function(){
        it('calls Content::insertElemAt method when inserting element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'insertElemAt').andCallFake(function(){return null;});
            tag.insertElemAt('location', 'element to insert');
            expect(content.insertElemAt).toHaveBeenCalledWith('location', 'element to insert');
        });
    });

    describe('Tag::appendElem(): appends element to the content', function(){
        it('calls Content::appendElem method when retrieving element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'appendElem').andCallFake(function(){return null;});
            tag.appendElem('element to insert');
            expect(content.appendElem).toHaveBeenCalledWith('element to insert');
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
        it('calls Content::dropElemAt method when removing element', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'dropElemAt');
            tag.dropElemAt(764);
            expect(content.dropElemAt).toHaveBeenCalledWith(764);
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

    describe('Tag::appendStyle(): appends style to the tag', function(){
        it('calls Style::appendStyle() to append style to the object', function(){
            spyOn(tagStyle, 'appendStyle').andCallFake(function(){return null;});
            spyOn(tag, 'getStyles').andCallFake(function(){return tagStyle;});
            tag.appendStyle('style to append');
            expect(tagStyle.appendStyle).toHaveBeenCalledWith('style to append');
        });
    });

    describe('append style to the element at given position:', function(){
        it('calls appendStyleToElemAt() method on the content', function(){
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            spyOn(content, 'appendStyleToElemAt');
            tag.appendStyleToElemAt(2, "whatever");
            expect(content.appendStyleToElemAt).toHaveBeenCalledWith(2, 'whatever');
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

    describe('Tag::dropFirst(): drops the first item from its elements', function(){
        it('calls Content::dropFirst()', function(){
            spyOn(content, 'dropFirst');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            tag.dropFirst();
            expect(content.dropFirst).toHaveBeenCalled();
        });
    });

    describe('Tag::dropLast(): drops the last item from its elements', function(){
        it('calls Content::dropLast()', function(){
            spyOn(content, 'dropLast');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            tag.dropLast();
            expect(content.dropLast).toHaveBeenCalled();
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

    describe('Tag::trim(): trim the tag content', function(){
        it('calls Content::trim() on Tag::content', function(){
            spyOn(content, 'trim');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            tag.trim();
            expect(content.trim).toHaveBeenCalled();
        });
    });

    describe('Tag::appendElemIfNotEmpty(): appends element if it is not empty', function(){
        it('calls Content::appendElemIfNotEmpty()', function(){
            spyOn(content, 'appendElemIfNotEmpty');
            spyOn(tag, 'getContent').andCallFake(function(){return content;});
            var foo = 'foo';
            tag.appendElemIfNotEmpty(foo);
            expect(content.appendElemIfNotEmpty).toHaveBeenCalledWith(foo);
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

        it('calls a method to load content', function(){
            spyOn(content, 'load');
            spyOn(tagAttr, 'load');
            spyOn(tagStyle, 'load');
            tag.load(root);
            expect(content.load).toHaveBeenCalledWith([e0, t1, e2]);
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