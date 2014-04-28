/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Image, Content, Attributes, jasmine, Tag */

describe('Image-related functionality:', function() {
    var img, attr;

    beforeEach(function() {
        img = new Image();
        attr = new Attributes();
    });

    describe('Image::constructor: inherits properly from getTag()() class', function(){
        it('instance of Image is an instance of getTag() as well', function(){
            expect(img instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new Image()).foo).not.toBe(102);
            img.foo = 102;
            expect((new Image()).foo).not.toBe(102);
            expect(img.foo).toBe(102);
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
            expect(img.getName()).toBe('Image');
        });
    });

    describe('Image::getTag(): getTag() name', function(){
        it('returns image getTag()', function(){
            expect(img.getTag()).toBe('img');
        });
    });

    describe('Image::setOrigin(): sets source', function(){
        it('calls Attribute::setProperty() to set the file source', function(){
            spyOn(attr, 'setProperty');
            img.setAttributes(attr);
            img.setOrigin('path-to-image');
            expect(attr.setProperty).toHaveBeenCalledWith('src', 'path-to-image');
        });
    });

    describe('Image::getOrigin(): gets source', function(){
        it('calls Attribute::getProperty() to retrieve image source', function(){
            spyOn(attr, 'getProperty').andCallFake(function(){return 'file-image-is-here';});
            img.setAttributes(attr);
            expect(img.getOrigin()).toBe('file-image-is-here');
            expect(attr.getProperty).toHaveBeenCalledWith('src');
        });
    });
 });

