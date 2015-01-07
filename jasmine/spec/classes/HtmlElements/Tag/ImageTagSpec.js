/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, ImageTag, Content, Properties, jasmine, Tag */

describe('ImageTag-related functionality:', function() {
    var img, attr, validLink, invalidLink;

    beforeEach(function() {
        img = new ImageTag();
        attr = new Properties();
        validLink = 'http://localhost/projects/editor/images/Compact_spaces.png';
        invalidLink = 'http://www.aaa.ccc/img.jpg';
    });

    describe('ImageTag::constructor: inherits properly from getTag() class', function(){
        it('instance of ImageTag is an instance of getTag() as well', function(){
            expect(img instanceof Tag).toBe(true);
        });
        it('does not affect parent attr if it is changed in the child', function(){
            expect((new ImageTag()).foo).not.toBe(102);
            img.foo = 102;
            expect((new ImageTag()).foo).not.toBe(102);
            expect(img.foo).toBe(102);
        });

        it('adds keyword "new" if it is missing when an object is created', function(){
            img = ImageTag();
            expect(img instanceof ImageTag).toBe(true);
        });

        it('creates an ImageTag with empty content', function(){
            expect(img.length()).toBe(0);
        });

    });

    describe('ImageTag::className: class name', function(){
        it('gives the name of the class', function(){
            expect(img.getName()).toBe('ImageTag');
        });
    });

    describe('ImageTag::getTag(): getTag() name', function(){
        it('returns ImageTag getTag()', function(){
            expect(img.getTag()).toBe('img');
        });
    });

    xdescribe('Sets ImageTag origin', function(){
        it('sets "src" attribute if url points to a valid ImageTag', function(){
            img = new ImageTag();
            img.setOrigin(validLink);
            var src = img.getOrigin();
            expect(src).toBe(validLink);
        });

        it('does not set "src" attribute if url points to an invalid ImageTag', function(){
            img = new ImageTag();
            img.setOrigin(invalidLink);
            expect(img.getOrigin()).not.toBe(invalidLink);
        });

        it('does not set "src" attribute if url is empty after dropping protocol', function(){
            var url = img.getOrigin(),
                newUrl = 'whatever';
            expect(url).not.toBe(newUrl);
            spyOn(img, 'dropProtocol').and.returnValue('');
            img.setOrigin(newUrl);
            expect(img.getOrigin()).toBe(url);
        });


    });

    describe('ImageTag::getOrigin(): gets source', function(){
        it('calls Attribute::getProperty() to retrieve ImageTag source', function(){
            spyOn(attr, 'getProperty').and.returnValue('file-ImageTag-is-here');
            img.setProperties(attr);
            expect(img.getOrigin()).toBe('file-ImageTag-is-here');
            expect(attr.getProperty).toHaveBeenCalledWith('src');
        });
    });

    xdescribe('Automatically derives ImageTag width', function(){
        it('gets zero width if src is not set', function(){
            expect(img.getOrigin() === undefined || img.getOrigin() === null).toBe(true);
            expect(img.getWidth()).toBe(0);
        });
        it('gets width if src is set', function(){
            img.setOrigin(validLink);
            expect(img.getWidth()).toBe(582);
        });
    });

    xdescribe('Automatically derive ImageTag height', function(){
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
            spyOn(img, 'getOrigin').and.returnValue();
            expect(img.toHtml()).toBe('');
        });
        it('produces empty string, if getOrigin() returns null', function(){
            spyOn(img, 'getOrigin').and.returnValue(null);
            expect(img.toHtml()).toBe('');
        });
        it('produces empty string, if getOrigin() returns empty string', function(){
            spyOn(img, 'getOrigin').and.returnValue('');
            expect(img.toHtml()).toBe('');
        });

        it('calls opening and close tag methods if getOrigin() returns non-empty string', function(){
            spyOn(img, 'getOrigin').and.returnValue('a-link');
            spyOn(img, 'openingTag').and.returnValue('<open>');
            spyOn(img, 'closingTag').and.returnValue('<close>');
            expect(img.toHtml()).toBe('<open><close>');
        });

    });

 });

