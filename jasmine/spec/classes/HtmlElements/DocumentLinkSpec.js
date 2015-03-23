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
    });

    xdescribe('has a method "insertLinkAt" method that', function(){
        it('throws an error if the first argument is not an Element instance', function() {
            var invalids = [null, undefined, 0, 1, -1, 4.21, -21.98, '', 'string', [], [5, 3, 16], {}, {foo: 1}];
            invalids.forEach(function(invalid){
                expect(function(){
                    doc.insertLinkAt(invalid);
                }).toThrow(new Error('The first argument must be an Element instance!'));
            });
        });

        it('returns a copy of the scope node if the position is not a Range instance', function() {
            var invalids = [null, undefined, 0, 1, -1, 4.21, -21.98, '', 'string', [], [5, 3, 16], {}, {foo: 1}];
            invalids.forEach(function(invalid){
                var result = doc.insertLinkAt(div1, invalid, aTemplate.template());
                expect(div1.isEqualNode(result)).toBe(true);
                expect(result === div1).toBe(false);
            });
        });

        it('returns a copy of the scope node if method "insertAt" throws an error', function() {
             var cursorPos = new Range();
            cursorPos.setStart(span1, 1);
            cursorPos.collapse(true);
            spyOn(doc, 'insertAt').and.callFake(function(){throw new Error('an error');});
            var result = doc.insertLinkAt(div1, cursorPos, aTemplate.template());
            expect(div1.isEqualNode(result)).toBe(true);
            expect(result === div1).toBe(false);
        });

        it('does not create nested links', function(){
            pending();
            var cursorPos = new Range();
            cursorPos.setStart(a3, 1);
            cursorPos.collapse(true);
            var result = doc.insertLinkAt(span1, cursorPos, aTemplate.template());
            expect(result).isInstanceOf(Element);
            expect(result.childNodes.length).toBe(3);
            expect(result.childNodes[0].isEqualNode(a1)).toBe(true);
            expect(result.childNodes[2].isEqualNode(span2)).toBe(true);

            expect(result.childNodes[1]).isInstanceOf(Element);
            expect(result.childNodes[1].tagName.toLowerCase()).toBe('div');
            expect(result.childNodes.length).toBe(4);
            expect(result.childNodes[0].isEqualNode(a1)).toBe(true);
            expect(result.childNodes[2].isEqualNode(div1)).toBe(true);



        });

        it('inserts a link node at given position', function() {
            pending();
            var cursorPos = new Range();
            cursorPos.setStart(span1, 1);
            cursorPos.collapse(true);
            var result = doc.insertLinkAt(span1, cursorPos, aTemplate.template());
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
    });
});