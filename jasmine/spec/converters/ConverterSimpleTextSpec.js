/*jslint plusplus: true, white: true */
/*global describe, it, expect, beforeEach, spyOn, ConverterSimpleText */

describe ('Converter to plain text format', function(){
	var c;
    beforeEach(function(){
    	c = new ConverterSimpleText();
    });

    describe('Elaborating single node document', function () {
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

    describe('Elaborating multi node documents', function(){
        pending();
        it('maintains nested tags', function(){
            var parent = document.createElement('div'),
                child1 = document.createElement('span'),
                child2 = document.createTextNode('text node content');
            parent.style.color = '#012345';
            child1.style['font-size'] = '10px';
            child1.innerHTML = 'span content';
            parent.appendChild(child1);
            parent.appendChild(child2);
            var n = c.convert(parent);
            expect(n.nodeType).toBe(Node.ELEMENT_NODE);
            console.log(n.outerHTML);
        });

        it('converts image tag inside div', function(){
            var parent = document.createElement('div'),
                img  = document.createElement('img');
            img.setAttribute('alt', 'alternative text');
            img.setAttribute('title', 'popup text');
            parent.appendChild(img);

            var node = c.convert(parent);
            expect(node.nodeType).toBe(Node.ELEMENT_NODE);
            expect(node.tagName.toLowerCase()).toBe('div');
            expect(node.childNodes.length).toBe(1);
            expect(node.childNodes[0].nodeType).toBe(Node.TEXT_NODE);
            expect(node.childNodes[0].nodeValue).toBe('alternative text');



        });
    });



});


