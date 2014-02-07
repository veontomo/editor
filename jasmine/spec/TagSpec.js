/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Tag, Style, Attributes, Content, Table */

describe('Tag-related functionality:', function() {
    var tag, tagStyle, tagAttr, content;
    beforeEach(function() {
        tagStyle = new Style();
        tagAttr = new Attributes();
        tag = new Tag();
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
        content = new Content();
        tag.content = content;
        spyOn(content, 'getElem').andCallFake(function(){return null;});
        tag.getElem('whatever');
        expect(content.getElem).toHaveBeenCalledWith('whatever');
    });

    it('calls Content::getFirst method when retrieving first element', function(){
        content = new Content();
        tag.content = content;
        spyOn(content, 'getFirst').andCallFake(function(){return null;});
        tag.getFirst();
        expect(content.getFirst).toHaveBeenCalled();
    });

    it('calls Content::getLast method when retrieving last element', function(){
        content = new Content();
        tag.content = content;
        spyOn(content, 'getLast').andCallFake(function(){return null;});
        tag.getLast();
        expect(content.getLast).toHaveBeenCalled();
    });

    it('calls Content::insertElemAt method when inserting element', function(){
        content = new Content();
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
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            delete tag.name;
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });
        it('if tag name is empty', function(){
            spyOn(tagStyle, 'toString').andCallFake(function(){return 'styles of the tag';});
            spyOn(tagAttr, 'toString').andCallFake(function(){return 'attributes of the tag';});
            spyOn(content, 'toHtml').andCallFake(function(){return 'html representation of the content';});
            tag.style = tagStyle;
            tag.attr = tagAttr;
            tag.content = content;
            delete tag.name;
            expect(tag.toHtml()).toBe('<!-- tag name is missing -->');
        });
    });
});