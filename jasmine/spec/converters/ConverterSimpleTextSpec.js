/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, ConverterSimpleText */

describe ('Converter to plain text format', function(){
	var c;
    beforeEach(function(){
    	c = new ConverterSimpleText();
    });

    describe('Elaborates single node document', function () {
        describe('Elaborates text nodes', function(){
            it('does not modify text node content', function(){
                var t = document.createTextNode('this is a simple text node');
                var t2 = c.convert(t);
                expect(t2.nodeValue).toBe('this is a simple text node');
            });
        });

        describe('Elaborates image nodes', function(){
            it('converts img tags into text node using alternative text', function(){
                var img  = document.createElement('img');
                img.setAttribute('alt', 'alternative text');
                img.setAttribute('title', 'popup text');
                var node = c.convert(img);
                expect(node.nodeType).toBe(Node.TEXT_NODE);
                expect(node.nodeValue).toBe('alternative text');
            });

            it('converts img tags into text node using title attribute if alternative text is not provided', function(){
                var img  = document.createElement('img');
                img.setAttribute('title', 'popup text');
                var node = c.convert(img);
                expect(node.nodeType).toBe(Node.TEXT_NODE);
                expect(node.nodeValue).toBe('popup text');
            });
        });

        describe('Eaborates links', function(){
            it('converts a link into plain text', function(){
                var link = document.createElement('a');
                link.setAttribute('href', 'www.test.com');
                link.innerHTML = 'this is a link';
                var link2 = c.convert(link);
                expect(link2.nodeType).toBe(Node.TEXT_NODE);
                expect(link2.nodeValue).toBe('this is a link');
            });
        });






    });



});


