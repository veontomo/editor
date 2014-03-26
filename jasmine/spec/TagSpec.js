/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Style, Attributes, Content, Table */

describe('Tag-related functionality:', function() {
    var tag, tagStyle, tagAttr, content;
    beforeEach(function() {
        tagStyle = new Style();
        tagAttr = new Attributes();
        tag = new Tag();
        content = new Content();
    });

    describe('Tag::constuctor()', function(){
        it('adds keyword "new" if it is missing when an object is created', function(){
            var tag2 = Tag();
            expect(tag2 instanceof Tag).toBe(true);
        });
    });

    it('sets styles of the tag', function(){
        tagStyle.modular = 'frequency';
        tagStyle['hot spot'] = 'outside';
        tagStyle.next = '12 March 2014';
        tag.style = tagStyle;
        expect(tag.style.modular).toBe('frequency');
        expect(tag.style['hot spot']).toBe('outside');
        expect(tag.style.next).toBe('12 March 2014');
    });

    it('gets width of the object from its style property', function(){
        tagStyle.width = '20px';
        tag.style = tagStyle;
        expect(tag.getWidth()).toBe(20);
        tagStyle.width = '231em';
        tag.style = tagStyle;
        expect(tag.getWidth()).toBe('231em');
    });

    describe('sets width of the object', function(){
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
            tag.setWidth('whatever');
            expect(tag.style.width).toBe('whatever');
            expect(tag.style['min-width']).toBe('whatever');
            expect(tag.style['max-width']).toBe('whatever');
            expect(tag.attr.width).toBe('whatever');
        });
        it('sets zero width', function(){
            tag.setWidth(0);
            expect(tag.style.width).toBe(0);
            expect(tag.style['min-width']).toBe(0);
            expect(tag.style['max-width']).toBe(0);
            expect(tag.attr.width).toBe(0);
        });

        it('sets integer width', function(){
            tag.setWidth(29);
            expect(tag.style.width).toBe(29);
            expect(tag.style['min-width']).toBe(29);
            expect(tag.style['max-width']).toBe(29);
            expect(tag.attr.width).toBe(29);
        });

        it('sets fractional width', function(){
            tag.setWidth(2.9);
            expect(tag.style.width).toBe(2.9);
            expect(tag.style['min-width']).toBe(2.9);
            expect(tag.style['max-width']).toBe(2.9);
            expect(tag.attr.width).toBe(2.9);
        });

        it('sets a string with unit of measurment width', function(){
            tag.setWidth('72px');
            expect(tag.style.width).toBe('72px');
            expect(tag.style['min-width']).toBe('72px');
            expect(tag.style['max-width']).toBe('72px');
            expect(tag.attr.width).toBe('72px');
        });
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

    it('calls Content::getElem method when retrieving element', function(){
        tag.content = content;
        spyOn(content, 'getElem').andCallFake(function(){return null;});
        tag.getElem('whatever');
        expect(content.getElem).toHaveBeenCalledWith('whatever');
    });

    it('calls Content::appendElem method when appending an element', function(){
        tag.content = content;
        spyOn(content, 'appendElem').andCallFake(function(){return null;});
        tag.appendElem('whatever');
        expect(content.appendElem).toHaveBeenCalledWith('whatever');
    });

    it('calls Content::getFirst method when retrieving first element', function(){
        tag.content = content;
        spyOn(content, 'getFirst').andCallFake(function(){return null;});
        tag.getFirst();
        expect(content.getFirst).toHaveBeenCalled();
    });

    it('calls Content::getLast method when retrieving last element', function(){
        tag.content = content;
        spyOn(content, 'getLast').andCallFake(function(){return null;});
        tag.getLast();
        expect(content.getLast).toHaveBeenCalled();
    });

    it('calls Content::insertElemAt method when inserting element', function(){
        tag.content = content;
        spyOn(content, 'insertElemAt').andCallFake(function(){return null;});
        tag.insertElemAt('location', 'element to insert');
        expect(content.insertElemAt).toHaveBeenCalledWith('location', 'element to insert');
    });

    it('calls Content::appendElem method when retrieving element', function(){
        content = new Content();
        tag.content = content;
        spyOn(content, 'appendElem').andCallFake(function(){return null;});
        tag.appendElem('element to insert');
        expect(content.appendElem).toHaveBeenCalledWith('element to insert');
    });

    it('calls Content::length method when retrieving length', function(){
        spyOn(content, 'length').andCallFake(function(){return 'content length';});
        tag.content = content;
        expect(tag.length()).toBe('content length');
        expect(content.length).toHaveBeenCalled();
    });

    it('calls Content::dropElemAt method when removing element', function(){
        spyOn(content, 'dropElemAt');
        tag.content = content;
        tag.dropElemAt(764);
        expect(content.dropElemAt).toHaveBeenCalledWith(764);
    });

    describe('creates html representation of the tag', function(){
        it('if style and attributes are present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.name = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if style is present, attributes - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.name = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag style="styles of the tag">html representation of the content</htmltag>');
        });

        it('if attributes are present, style - not', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.name = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag>html representation of the content</htmltag>');
        });

        it('if both style and attributes are not present', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return '';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return '';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.name = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag>html representation of the content</htmltag>');
        });

        it('if content is empty', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return '';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            tag.name = 'htmltag';
            expect(tag.toHtml()).toBe('<htmltag attributes of the tag style="styles of the tag"></htmltag>');
        });


        it('if tag name is missing', function(){
            if (tag.hasOwnProperty('name')){
                delete tag.name;
            }
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });

        it('if tag name is empty', function(){
            tag.name = '';
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });

        it('if tag name is null', function(){
            tag.name = null;
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });
    });

    it('calls Style::appendStyle() to append style to the object', function(){
        spyOn(tagStyle, 'appendStyle').andCallFake(function(){return null;});
        tag.style = tagStyle;
        tag.appendStyle('style to append');
        expect(tagStyle.appendStyle).toHaveBeenCalledWith('style to append');
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

    xdescribe('Tag::toLink(): converts tag into a link', function(){
        var link, tag2;
        beforeEach(function(){
            link = new Link();
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
        });
        it('returns unchanged copy of a tag if it is empty', function(){
            spyOn(tag, 'isEmpty').andCallFake(function(){return true;});
            tag2 = tag.toLink(link);
            expect(tag2).toBe(tag);
            expect(tag.isEmpty).toHaveBeenCalled();
        });
        it('returns a link which content contains only the tag if this tag has empty content', function(){
            spyOn(tag, 'isEmpty').andCallFake(function(){return false;});
            spyOn(content, 'isEmpty').andCallFake(function(){return true;});
            tag2 = tag.toLink(link);
            expect(tag2 instanceof Link).toBe(true);
            expect(tag2.attr).toBe(link.attr);
            expect(tag2.style).toBe(link.style);
            expect(tag2.content.elements.length).toBe(1);
            expect(tag2.content.elements[0]).toBe(tag);
            expect(tag.isEmpty).toHaveBeenCalled();
            expect(tag.content.isEmpty).toHaveBeenCalled();
        });
        it('con ');

    });

});