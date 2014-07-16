/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Image, Content, Attributes, jasmine, Tag */

describe('Image-related functionality:', function() {
    var img, attr, validLink, invalidLink;

    beforeEach(function() {
        img = new Image();
        attr = new Attributes();
        validLink = 'http://localhost/projects/editor/images/Compact_spaces.png';
        invalidLink = 'http://www.aaa.ccc/img.jpg';
    });

    describe('Image::constructor: inherits properly from getTag() class', function(){
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

    describe('Sets image origin', function(){
        it('sets "src" attribute if url points to a valid image', function(){
            img = new Image();
            img.setOrigin(validLink);
            var src = img.getOrigin();
            expect(src).toBe(validLink);
        });

        it('does not set "src" attribute if url points to an invalid image', function(){
            img = new Image();
            img.setOrigin(invalidLink);
            expect(img.getOrigin()).not.toBe(invalidLink);
        });

        it('does not set "src" attribute if url is empty after dropping protocol', function(){
            var url = img.getOrigin(),
                newUrl = 'whatever';
            expect(url).not.toBe(newUrl);
            spyOn(img, 'dropProtocol').andCallFake(function(){return '';});
            img.setOrigin(newUrl);
            expect(img.getOrigin()).toBe(url);
        });


    });

    describe('Image::getOrigin(): gets source', function(){
        it('calls Attribute::getProperty() to retrieve image source', function(){
            spyOn(attr, 'getProperty').andCallFake(function(){return 'file-image-is-here';});
            img.setProperties(attr);
            expect(img.getOrigin()).toBe('file-image-is-here');
            expect(attr.getProperty).toHaveBeenCalledWith('src');
        });
    });

    describe('Automatically derives image width', function(){
        it('gets zero width if src is not set', function(){
            expect(img.getOrigin() === undefined || img.getOrigin() === null).toBe(true);
            expect(img.getWidth()).toBe(0);
        });
        it('gets width if src is set', function(){
            img.setOrigin(validLink);
            expect(img.getWidth()).toBe(582);
        });
    });

    describe('Automatically derive image height', function(){
        it('gets zero height if src is not set', function(){
            expect(img.getOrigin() === undefined || img.getOrigin() === null).toBe(true);
            expect(img.getHeight()).toBe(0);
        });
        it('gets height if src is set', function(){
            img.setOrigin(validLink);
            expect(img.getHeight()).toBe(253);
        });

    });

    describe('Preparing url', function(){
        it('drops "http" protocol', function(){
            expect(img.dropProtocol('http://www.test.com')).toEqual("www.test.com");
        });
        it('drops "https" protocol', function(){
            expect(img.dropProtocol('https://www.test.com')).toEqual("www.test.com");
        });
        it('drops "ftps" protocol', function(){
            expect(img.dropProtocol('ftp://www.test.com')).toEqual("www.test.com");
        });
        it('leaves the string unchanged if it contains no ://', function(){
            expect(img.dropProtocol('www.test.com')).toEqual("www.test.com");
        });
        it('drops only the first instance before ://', function(){
            expect(img.dropProtocol('http://www.test.com://')).toEqual("www.test.com://");
        });
        it('leaves prarameters in url', function(){
            expect(img.dropProtocol('http://www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt')).toEqual('www.cercoagenti.it/homepage_vetrina.asp?vetrina/1746000004-1.txt');
        });

    });

    describe('Creates html representation', function(){
        it('produces empty string, if getOrigin() returns undefined', function(){
            spyOn(img, 'getOrigin').andCallFake(function(){});
            expect(img.toHtml()).toBe('');
        });
        it('produces empty string, if getOrigin() returns null', function(){
            spyOn(img, 'getOrigin').andCallFake(function(){return null;});
            expect(img.toHtml()).toBe('');
        });
        it('produces empty string, if getOrigin() returns empty string', function(){
            spyOn(img, 'getOrigin').andCallFake(function(){return '';});
            expect(img.toHtml()).toBe('');
        });

        it('calls opening and close tag methods if getOrigin() returns non-empty string', function(){
            spyOn(img, 'getOrigin').andCallFake(function(){return 'a-link';});
            spyOn(img, 'openingTag').andCallFake(function(){return '<open>';});
            spyOn(img, 'closingTag').andCallFake(function(){return '<close>';});
            expect(img.toHtml()).toBe('<open><close>');
        });

    });

 });

