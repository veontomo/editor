/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Image, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell, Tag, Table, Row, Link */

describe('Image-related functionality:', function() {
    var img, attr;

    beforeEach(function() {
        img = new Image();
        attr = new Attributes();
    });

    describe('Image::constructor: inherits properly from Tag() class', function(){
        it('instance of Image is an instance of Tag as well', function(){
            expect(img instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Image()).attr.width).not.toBe(102);
            img.attr.width = 102;
            expect((new Image()).attr.width).not.toBe(102);
            expect(img.attr.width).toBe(102);
        });
        it('does not affect parent style if it is changed in the child', function(){
            expect((new Image()).style.width).not.toBe('whatever');
            img.style.width = 'whatever';
            expect((new Image()).style.width).not.toBe('whatever');
            expect(img.style.width).toBe('whatever');
        });

        it('does not affect parent name property if it is changed in the child', function(){
            expect((new Tag()).tag).toBe(null);
            expect((new Image()).tag).toBe('img');
            img.tag = 'whatever';
            expect((new Tag()).tag).toBe(null);
            expect((new Image()).tag).toBe('img');
            expect(img.tag).toBe('whatever');
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            img = Image();
            expect(img instanceof Image).toBe(true);
        });

        it('creates an image with empty content', function(){
            expect(img.length()).toBe(0);
        });

    });

    describe('Image::className: class name', function(){
        it('gives the name of the class', function(){
            expect(img.className).toBe('Image');
        });
    });

    describe('Image::tag: tag name', function(){
        it('returns image tag', function(){
            expect(img.tag).toBe('img');
        });
    });

    describe('Image::setOrigin(): sets source', function(){
        it('calls Attribute::setProperty() to set the file source', function(){
            spyOn(attr, 'setProperty');
            img.attr = attr;
            img.setOrigin('path-to-image');
            expect(attr.setProperty).toHaveBeenCalledWith('src', 'path-to-image');
        });
    });

    describe('Image::getOrigin(): gets source', function(){
        it('calls Attribute::getProperty() to retrieve image source', function(){
            spyOn(attr, 'getProperty').andCallFake(function(){return 'file-image-is-here';});
            img.attr = attr;
            expect(img.getOrigin()).toBe('file-image-is-here');
            expect(attr.getProperty).toHaveBeenCalledWith('src');
        });
    });


 });

