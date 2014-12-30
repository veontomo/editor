/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Document, Element, Text, Link, Range */

var instanceOfMatcher = {
  isInstanceOf: function(util, customEqualityTesters) {
    return {
      compare: function(actual, expected) {
        return {'pass': (actual instanceof expected)};
      }
    };
  }
};


describe('Class "Document"', function() {
    var span1, a1, text1, div1, span2, p1, a2, text2, a3, ol1, li1, li2, text3,
        aTemplate, doc;
    beforeEach(function() {
   //          span1
   //    ________|___________
   //   |        |           |
   //   a1      div1        span2
   //   |        |        ___|___
   // text1     a3       |       |
   //         ___|___   p1       a2
   //        |       |           |
   //       ol1    text3       text2
   //      __|__
   //     |     |
   //    li1   li2
   //

        span1 = document.createElement('span');
        a1    = document.createElement('a');
        text1 = document.createTextNode('a text of link 1');
        div1  = document.createElement('div');
        span2 = document.createElement('span');
        p1    = document.createElement('p');
        a2    = document.createElement('a');
        text2 = document.createTextNode('a text of link 2');
        a3    = document.createElement('a');
        ol1   = document.createElement('ol');
        text3 = document.createTextNode('inner text node of link 3');
        li1   = document.createElement('li');
        li2   = document.createElement('li');

        span1.appendChild(a1);
        span1.appendChild(div1);
        span1.appendChild(span2);

        a1.appendChild(text1);

        div1.appendChild(a3);
        a3.appendChild(ol1);
        ol1.appendChild(li1);
        ol1.appendChild(li2);

        a3.appendChild(text3);

        span2.appendChild(p1);
        span2.appendChild(a2);
        a2.appendChild(text2);

        a1.setAttribute('href', 'www.test.com');
        a1.setAttribute('target', '_blank');

        span1.setAttribute('class', 'media');
        span1.style.color = 'red';
        span1.style.padding = '10px';
        span1.style.fontWeight = 'bold';
        span1.style.fontFamily = 'Comic, san-serif';

        span2.style.marginTop = '20em';
        span2.style.color = 'blue';

        aTemplate = new Link();
        aTemplate.setHref('www.job.com');
        aTemplate.setProperty('target', 'self');
        aTemplate.setProperty('title', 'link title');
        aTemplate.setContent('template text');

        doc = new Document();
        jasmine.addMatchers(instanceOfMatcher);
        console.log(span1.outerHTML);
    });

    describe('has a method convertToLink method that', function(){
        it('returns nothing if called without arguments', function() {
            expect(doc.convertToLinks()).not.toBeDefined();
        });

        it('returns a copy of the scope node if the selection is empty and cursor position is not provided', function() {
            var result = doc.convertToLinks(div1, [], null, aTemplate.template());
            expect(div1.isEqualNode(result)).toBe(true);
            expect(result === div1).toBe(false);
        });

        it('inserts a link node into at the cursor position if the selection is empty', function() {
            var cursorPos = new Range();
            cursorPos.setStart(span1, 1);
            cursorPos.collapse(true);
            var result = doc.convertToLinks(span1, [], cursorPos, aTemplate.template());
            console.log(result.outerHTML);
            expect(result).isInstanceOf(Element);
            expect(result.childNodes.length).toBe(4);
            expect(result.childNodes[0].isEqualNode(a1)).toBe(true);
            expect(result.childNodes[2].isEqualNode(div1)).toBe(true);

            var newElem = result.childNodes[1];
            expect(newElem.tagName.toLowerCase()).toBe('a');
            expect(newElem.getAttribute('href')).toBe('www.job.com');
            expect(newElem.getAttribute('target')).toBe('self');
            expect(newElem.getAttribute('title')).toBe('link title');
            expect(newElem.childNodes.length).toBe(1);
            expect(newElem.childNodes[0]).isInstanceOf(Text);
            expect(newElem.childNodes[0].nodeValue).toBe('template text');

            expect(result.childNodes[3].isEqualNode(span2)).toBe(true);

        });


        it('returns a template-fed link if the scope node is a link and the selection contains just that link', function() {
            var result = doc.convertToLinks(a1, [a1], null, aTemplate.template());

            expect(result).isInstanceOf(Element);
            expect(result.tagName().toLowerCase()).toBe('a');
            expect(result.getAttribute('href')).toBe('www.job.com');
            expect(result.getAttribute('target')).toBe('_self');
            expect(result.childNodes.length).toBe(1);
            expect(result.childNodes[0] instanceof Text).toBe(true);
            expect(result.childNodes[0].nodeValue).toBe('a text of the link');
        });

        it('modifies the link if all its text content is selected', function(){
            var result = doc.convertToLinks(span1, [text1], null, aTemplate.template());
            expect(result).isInstanceOf(Element);
            expect(result.childNodes.length).toBe(3);

            expect(result.childNodes[0]).isInstanceOf(Element);
            expect(result.childNodes[0].tagName().toLowerCase()).toBe('a');
            expect(result.childNodes[0].getAttribute('href')).toBe('www.job.com');
            expect(result.childNodes[0].getAttribute('target')).toBe('_self');
            expect(result.childNodes[0].childNodes.length).toBe(1);
            expect(result.childNodes[0].childNodes[0] instanceof Text).toBe(true);
            expect(result.childNodes[0].childNodes[0].value).toBe('a text of the link');

            expect(result.childNodes[1]).isInstanceOf(Element);
            expect(result.childNodes[1].isEqualNode(div1)).toBeD(true);

            expect(result.childNodes[2]).isInstanceOf(Element);
            expect(result.childNodes[2].isEqualNode(span2)).toBeD(true);
        });

        it('changes the whole hyperlink if it contains multiple elements even if just one element is selected', function(){
            var result = doc.convertToLinks(div1, [ol1], null, aTemplate.template());
            expect(result).isInstanceOf(Element);
            expect(result.getAttribute('href')).toBe('www.job.com');
            expect(result.getAttribute('target')).toBe('self');
            expect(result.getAttribute('title')).toBe('link title');
            expect(result.childNodes.length).toBe(2);
            expect(result.childNodes[0].isEqualNode(ol1)).toBe(true);
            expect(result.childNodes[1].isEqualNode(text3)).toBe(true);
            console.log('perform control over styles!');
        });

        it('appends all inherited properties to the element when converting it into a link', function(){
            var result = doc.convertToLinks(span1, [p1], null, aTemplate.template());
            expect(result).isInstanceOf(Element);
            expect(result.tagName).toBe('span');

            expect(result.childNodes.length).toBe(3);
            expect(result.childNodes[0].isEqualNode(a1)).toBe(true);
            expect(result.childNodes[1].isEqualNode(div1)).toBe(true);

            expect(result.childNodes[2]).isInstanceOf(Element);
            expect(result.childNodes[2].tagName).toBe('span');
            expect(result.childNodes[2].length).toBe(2);
            expect(result.childNodes[2].childNodes[0]).isInstanceOf(Element);
            var newLink = result.childNodes[2].childNodes[0];
            expect(newLink.tagName).toBe('a');
            expect(newLink.getAttribute('href')).toBe('www.job.com');
            expect(newLink.getAttribute('target')).toBe('self');
            expect(newLink.getAttribute('title')).toBe('link title');
            expect(newLink.style.color).toBe('blue');
            expect(newLink.style.marginTop).toBe('20em');
            expect(newLink.style.fontWeight).toBe('bold');
            expect(newLink.style.fontFamily).toBe('Comic, san-serif');

            expect(newLink.childNodes.length).toBe(1);
            expect(newLink.childNodes[0].isEqualNode(p1)).toBe(true);

            expect(result.childNodes[2].childNodes[1].isEqualNode(a2)).toBe(true);
        });
    });






});