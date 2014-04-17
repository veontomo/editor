/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, Tag, Styles, Attributes, Content, Link, window, Node, Commen, TagChild */

describe('Tag-related functionality:', function() {
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


    describe('Tag properties', function(){
        it('sets styles of the tag', function(){
            tagStyle.modular = 'frequency';
            tagStyle['hot spot'] = 'outside';
            tagStyle.next = '12 March 2014';
            tag.style = tagStyle;
            expect(tag.style.modular).toBe('frequency');
            expect(tag.style['hot spot']).toBe('outside');
            expect(tag.style.next).toBe('12 March 2014');
        });

        it('sets attributes of the tag', function(){
            tagAttr.pipelines = 'embryonic';
            tagAttr['look a likes'] = -98.876;
            tagAttr.signposted = 'attired';
            tag.attr = tagAttr;
            expect(tag.attr.pipelines).toBe('embryonic');
            expect(tag.attr['look a likes']).toBe(-98.876);
            expect(tag.attr.signposted).toBe('attired');
        });
    });

    describe('Tag::getName(): gets html tag name', function(){
        it('gets a string-valued property', function(){
            tag.tag = 'customTag';
            expect(tag.getName()).toBe('customTag');
        });
    });

    describe('Tag::setAttr(): sets attribute', function(){
        it('sets a string as an attribute', function(){
            tag.setAttr('whatever');
            expect(tag.attr).toBe('whatever');
        });
        it('sets an object as an attribute', function(){
            var obj = {};
            tag.setAttr(obj);
            expect(tag.attr).toBe(obj);
        });
    });

    describe('Tag::className: class tag', function(){
        it('gives the tag of the class', function(){
            expect(tag.className).toBe('Tag');
        });
    });

    describe('Tag::getWidth(): retrieves the width value from the style', function(){
        it('returns number if the value has measurment unit "px"', function(){
            tagStyle.setProperty('width', '20px');
            tag.style = tagStyle;
            expect(tag.getWidth()).toBe(20);
        });
        it('returns a string if the value has measurment unit "em"', function(){
            tagStyle.setProperty('width', '231em');
            tag.style = tagStyle;
            expect(tag.getWidth()).toBe('231em');
        });
    });

    describe('Tag::setWidth(): sets width of the object', function(){
        it('throws an error if width parameter is not provided', function(){
            expect(function(){
                tag.setWidth();
            }).toThrow('Width value is not set!');
        });

        it('throws an error if width parameter is empty string', function(){
            expect(function(){
                tag.setWidth('');
            }).toThrow('Width value is not set!');
        });
        it('sets arbitrary string as width', function(){
            spyOn(tag.style, 'setWidth');
            tag.setWidth('whatever');
            expect(tag.style.setWidth).toHaveBeenCalledWith('whatever');
            expect(tag.attr.width).toBe('whatever');
        });
        it('sets zero width', function(){
            spyOn(tag.style, 'setWidth');
            tag.setWidth(0);
            expect(tag.style.setWidth).toHaveBeenCalledWith(0);
            expect(tag.attr.width).toBe(0);
        });

        it('sets integer width', function(){
            spyOn(tag.style, 'setWidth');
            tag.setWidth(29);
            expect(tag.style.setWidth).toHaveBeenCalledWith(29);
            expect(tag.attr.width).toBe(29);
        });

        it('sets fractional width', function(){
            spyOn(tag.style, 'setWidth');
            tag.setWidth(2.9);
            expect(tag.style.setWidth).toHaveBeenCalledWith(2.9);
            expect(tag.attr.width).toBe(2.9);
        });

        it('sets a string with unit of measurment width', function(){
            spyOn(tag.style, 'setWidth');
            tag.setWidth('72px');
            expect(tag.style.setWidth).toHaveBeenCalledWith('72px');
            expect(tag.attr.width).toBe('72px');
        });
    });

    describe('Tag::getElem(): gets element from "content" property', function(){
        it('calls Content::getElem method when retrieving element', function(){
            tag.content = content;
            spyOn(content, 'getElem').andCallFake(function(){return null;});
            tag.getElem('whatever');
            expect(content.getElem).toHaveBeenCalledWith('whatever');
        });
    });

    describe('Tag::appendElem(): appends element to the content', function(){
        it('calls Content::appendElem method when appending an element', function(){
            tag.content = content;
            spyOn(content, 'appendElem').andCallFake(function(){return null;});
            tag.appendElem('whatever');
            expect(content.appendElem).toHaveBeenCalledWith('whatever');
        });
    });

    describe('Tag::getFirst(): get first element of the content', function(){
        it('calls Content::getFirst method when retrieving first element', function(){
            tag.content = content;
            spyOn(content, 'getFirst').andCallFake(function(){return null;});
            tag.getFirst();
            expect(content.getFirst).toHaveBeenCalled();
        });
    });

    describe('Tag::getLast(): get last element of the content', function(){
        it('calls Content::getLast method when retrieving last element', function(){
            tag.content = content;
            spyOn(content, 'getLast').andCallFake(function(){return null;});
            tag.getLast();
            expect(content.getLast).toHaveBeenCalled();
        });
    });

    describe('Tag::insertElemAt() inserts element at given position', function(){
        it('calls Content::insertElemAt method when inserting element', function(){
            tag.content = content;
            spyOn(content, 'insertElemAt').andCallFake(function(){return null;});
            tag.insertElemAt('location', 'element to insert');
            expect(content.insertElemAt).toHaveBeenCalledWith('location', 'element to insert');
        });
    });

    describe('Tag::appendElem(): appends element to the content', function(){
        it('calls Content::appendElem method when retrieving element', function(){
            content = new Content();
            tag.content = content;
            spyOn(content, 'appendElem').andCallFake(function(){return null;});
            tag.appendElem('element to insert');
            expect(content.appendElem).toHaveBeenCalledWith('element to insert');
        });
    });

    describe('Tag::length(): gives the number of elements in the content', function(){
        it('calls Content::length method when retrieving length', function(){
            spyOn(content, 'length').andCallFake(function(){return 'content length';});
            tag.content = content;
            expect(tag.length()).toBe('content length');
            expect(content.length).toHaveBeenCalled();
        });
    });

    describe('Tag::droopElemAt(): drops element in the given position from the content', function(){
        it('calls Content::dropElemAt method when removing element', function(){
            spyOn(content, 'dropElemAt');
            tag.content = content;
            tag.dropElemAt(764);
            expect(content.dropElemAt).toHaveBeenCalledWith(764);
        });
    });

    describe('creates html representation of the tag', function(){
        it('if style and attributes are present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.tag = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if style is present, attributes - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.tag = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if attributes are present, style - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.tag = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag>html representation of the content</htmltag>');
        });

        it('if both style and attributes are not present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.tag = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag>html representation of the content</htmltag>');
        });

        it('if content is empty', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return '';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.tag = 'htmltag';
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
            tag.style = tagStyle;
            tag.appendStyle('style to append');
            expect(tagStyle.appendStyle).toHaveBeenCalledWith('style to append');
        });
    });

    describe('append style to the element:', function(){
        it('Throws an error if element does not exist', function(){
            spyOn(tag, 'getElem').andCallFake(function(){return null;});
            expect(function(){
                tag.appendStyleToElemAt('any', "whatever");
            }).toThrow('Can not append style to requested element.');
            expect(tag.getElem).toHaveBeenCalledWith('any');
        });
        it('Throws an error if element exists, but has no style property', function(){
            expect(function(){
                spyOn(tag, 'getElem').andCallFake(function(){return {};});
                tag.appendStyleToElemAt(4, "whatever");
            }).toThrow('Can not append style to requested element.');
            expect(tag.getElem).toHaveBeenCalledWith(4);
        });
        it('calls append Style method on a middle tag of the tag', function(){
            var tag1 = new Tag(),
                tag2 = new Tag(),
                tag3 = new Tag(),
                tag4 = new Tag();
            spyOn(tag1, 'appendStyle');
            spyOn(tag2, 'appendStyle');
            spyOn(tag3, 'appendStyle');
            spyOn(tag4, 'appendStyle');
            tag.content.elements = [tag1, tag2, tag3, tag4];
            tag.appendStyleToElemAt(2, "whatever");
            expect(tag1.appendStyle).not.toHaveBeenCalled();
            expect(tag2.appendStyle).not.toHaveBeenCalled();
            expect(tag3.appendStyle).toHaveBeenCalledWith("whatever");
            expect(tag4.appendStyle).not.toHaveBeenCalled();
        });

        // it('calls append Style method on the first tag of the tag', function(){
        //     spyOn(cell1, 'appendStyle');
        //     spyOn(cell2, 'appendStyle');
        //     spyOn(cell3, 'appendStyle');
        //     tag.content.elements = [cell1, cell2, cell3];
        //     tag.appendStyleToElemAt(0, "whatever");
        //     expect(cell1.appendStyle).toHaveBeenCalledWith("whatever");
        //     expect(cell2.appendStyle).not.toHaveBeenCalled();
        //     expect(cell3.appendStyle).not.toHaveBeenCalled();
        // });

        // it('calls append Style method on the last tag of the tag', function(){
        //     spyOn(cell1, 'appendStyle');
        //     spyOn(cell2, 'appendStyle');
        //     spyOn(cell3, 'appendStyle');
        //     spyOn(cell4, 'appendStyle');
        //     tag.content.elements = [cell1, cell2, cell3, cell4];
        //     tag.appendStyleToElemAt(3, "whatever");
        //     expect(cell1.appendStyle).not.toHaveBeenCalled();
        //     expect(cell2.appendStyle).not.toHaveBeenCalled();
        //     expect(cell3.appendStyle).not.toHaveBeenCalled();
        //     expect(cell4.appendStyle).toHaveBeenCalledWith("whatever");
        // });
    });

    describe('Tag::toText(): generates text representation of the tag', function(){
        it('calls Content::toText() method', function(){
            spyOn(content, 'toText').andCallFake(function(){return 'content text';});
            tag.content = content;
            expect(tag.toText()).toBe('content text');
            expect(content.toText).toHaveBeenCalled();
        });
    });

    describe('Tag::dropFirst(): drops the first item from its elements', function(){
        it('calls Content::dropFirst()', function(){
            spyOn(content, 'dropFirst');
            tag.content = content;
            tag.dropFirst();
            expect(content.dropFirst).toHaveBeenCalled();
        });
    });

    describe('Tag::dropLast(): drops the last item from its elements', function(){
        it('calls Content::dropLast()', function(){
            spyOn(content, 'dropLast');
            tag.content = content;
            tag.dropLast();
            expect(content.dropLast).toHaveBeenCalled();
        });
    });

    describe('Tag::isEmpty(): decides whether the tag is empty', function(){
        it('returns false if attr.toString() returns non-empty string', function(){
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'dumb string';});
            tag.attr = tagAttr;
            expect(tag.isEmpty()).toBe(false);
            expect(tagAttr.toString).toHaveBeenCalled();
        });
        it('returns false if style.toString() returns non-empty string', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'dumb string';});
            tag.style = tagStyle;
            expect(tag.isEmpty()).toBe(false);
            expect(tagStyle.toString).toHaveBeenCalled();
        });
        it('returns false if content.isEmpty returns false', function(){
            spyOn(content, 'isEmpty').andCallFake(function(){return false;});
            tag.content = content;
            expect(tag.isEmpty()).toBe(false);
            expect(content.isEmpty).toHaveBeenCalled();
        });

        it('returns true if attr.toString() and style.toString() returns empty string, and content.isEmpty returns true', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            tag.attr = tagAttr;
            tag.style = tagStyle;
            tag.content = content;
            expect(tag.isEmpty()).toBe(true);
            expect(tagAttr.toString).toHaveBeenCalled();
            expect(tagStyle.toString).toHaveBeenCalled();
            expect(content.isEmpty).toHaveBeenCalled();
        });
    });

    describe('Tag::trim(): trim the tag content', function(){
        it('calls Content::trim() on Tag::content', function(){
            spyOn(content, 'trim');
            tag.content = content;
            tag.trim();
            expect(content.trim).toHaveBeenCalled();
        });
    });

    describe('Tag::appendElemIfNotEmpty(): appends element if it is not empty', function(){
        it('calls Content::appendElemIfNotEmpty()', function(){
            spyOn(content, 'appendElemIfNotEmpty');
            tag.content = content;
            var foo = 'foo';
            tag.appendElemIfNotEmpty(foo);
            expect(content.appendElemIfNotEmpty).toHaveBeenCalledWith(foo);
        });
    });

    describe('Tag::clone(): generates a clone of the instance', function(){
        it('creates an instance of Tag class', function(){
            console.log('tag::clone');
            expect(tag.clone() instanceof Tag).toBe(true);
        });
        it('creates an instance of a class that inherits from Tag and has "className" pproperty', function(){
            window.TagChild = function(){
                Tag.call(this);
                this.className = "TagChild";
            };
            TagChild.prototype = Object.create(Tag.prototype);

            var tagChild = new TagChild();
            expect(tagChild.clone() instanceof TagChild).toBe(true);
        });

        it('creates a Tag instance if target "className" property corresponds to no class', function(){
            tag.className = 'no such class';
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
        });

        it('does not call "load" methods, if the argument is missing', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load();
            expect(tag.content.load).not.toHaveBeenCalled();
            expect(tag.attr.load).not.toHaveBeenCalled();
            expect(tag.style.load).not.toHaveBeenCalled();
        });

        it('returns false, if the argument is missing', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            expect(tag.load()).toBe(false);
        });


        it('sets "tag" property', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load(root);
            expect(tag.tag).toBe('custom');
        });


        it('does not call "load" methods, if the argument has non-ELEMENT nodeType', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load({'nodeType': 'any non element node type'});
            expect(tag.content.load).not.toHaveBeenCalled();
            expect(tag.attr.load).not.toHaveBeenCalled();
            expect(tag.style.load).not.toHaveBeenCalled();
        });

        it('returns "true", if all "load" methods return "true"', function(){
            spyOn(tag.content, 'load').andCallFake(function(){return true;});
            spyOn(tag.attr, 'load').andCallFake(function(){return true;});
            spyOn(tag.style, 'load').andCallFake(function(){return true;});
            expect(tag.load(e0)).toBe(true);
        });

        it('returns "false", if all "load" methods return "false"', function(){
            spyOn(tag.content, 'load').andCallFake(function(){return false;});
            spyOn(tag.attr, 'load').andCallFake(function(){return false;});
            spyOn(tag.style, 'load').andCallFake(function(){return false;});
            expect(tag.load(e0)).toBe(false);
        });

        it('returns "false", if "content.load" method return "false", and the others - "true"', function(){
            spyOn(tag.content, 'load').andCallFake(function(){return false;});
            spyOn(tag.attr, 'load').andCallFake(function(){return true;});
            spyOn(tag.style, 'load').andCallFake(function(){return true;});
            expect(tag.load(t1)).toBe(false);
        });
        it('returns "false", if "attr.load" method return "false", and the others - "true"', function(){
            spyOn(tag.content, 'load').andCallFake(function(){return true;});
            spyOn(tag.attr, 'load').andCallFake(function(){return false;});
            spyOn(tag.style, 'load').andCallFake(function(){return true;});
            expect(tag.load(e2)).toBe(false);
        });
        it('returns "false", if "style.load" method return "false", and the other - "true"', function(){
            spyOn(tag.content, 'load').andCallFake(function(){return true;});
            spyOn(tag.attr, 'load').andCallFake(function(){return true;});
            spyOn(tag.style, 'load').andCallFake(function(){return false;});
            expect(tag.load(e0)).toBe(false);
        });

        it('calls method to set attributes', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load(root);
            expect(tag.attr.load).toHaveBeenCalledWith(root.attributes);
        });

        it('calls method to set the style', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load(root);
            expect(tag.style.load).toHaveBeenCalledWith(root.attributes);
        });

        it('calls a method to load content', function(){
            spyOn(tag.content, 'load');
            spyOn(tag.attr, 'load');
            spyOn(tag.style, 'load');
            tag.load(root);
            expect(tag.content.load).toHaveBeenCalledWith([e0, t1, e2]);
        });

    });

    describe('Tag::toNode(): transforms element into a DOM.Element', function(){
        beforeEach(function(){
            tag.tag = 'meta';
        });
        it('return DOM element with tag equal to the "tag" property', function(){
            expect(tag.toNode().tagName).toBe('META');
        });
        it('calls "decorateElement" on the style to set styles', function(){
            spyOn(tag.style, 'decorateElement');
            tag.toNode();
            expect(tag.style.decorateElement).toHaveBeenCalled();
        });
        it('calls "decorateElement" on attr to set attributes', function(){
            spyOn(tag.attr, 'decorateElement');
            tag.toNode();
            expect(tag.attr.decorateElement).toHaveBeenCalled();
        });
        it('calls "stickTo" on content to append children', function(){
            spyOn(tag.content, 'stickTo');
            tag.toNode();
            expect(tag.content.stickTo).toHaveBeenCalled();
        });
    });

});