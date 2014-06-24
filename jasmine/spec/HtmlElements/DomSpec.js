/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Dom */

describe('Getting common parent', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31, m00, m10, m11,
            dom;
//                    n00                                m00
//         ____________|_________                    _____|____
//         |                     |                   |         |
//        n10                   n11                 m10       m11
//   ______|______               |
//   |     |      |              |
//  n20   n21    n22            n23
//      ___|____
//      |       |
//     n30     n31
//
        beforeEach(function(){
            dom = new Dom();
            n00 = document.createElement('div00');
            n10 = document.createElement('div10');
            n11 = document.createElement('div11');
            n20 = document.createElement('div20');
            n21 = document.createElement('div21');
            n22 = document.createElement('div22');
            n23 = document.createElement('div23');
            n30 = document.createElement('div30');
            n31 = document.createElement('div31');
            m00 = document.createElement('div');
            m10 = document.createElement('div');
            m11 = document.createElement('div');
            n00.appendChild(n10);
            n00.appendChild(n11);
            n10.appendChild(n20);
            n10.appendChild(n21);
            n10.appendChild(n22);
            n21.appendChild(n30);
            n21.appendChild(n31);
            n11.appendChild(n23);
            m00.appendChild(m10);
            m00.appendChild(m11);
        });

        it('returns the first argument if it contains the second argument', function(){
            expect(dom.commonAncestor(n10, n31)).toBe(n10);
        });

        it('returns the second argument if it contains the first argument', function(){
            expect(dom.commonAncestor(n23, n00)).toBe(n00);
        });


        it('returns null if the nodes have no common parent', function(){
            expect(dom.commonAncestor(n23, m10)).toBe(null);
        });

        it('returns the common parent if the nodes are siblings of each other', function(){
            expect(dom.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the first argument is located deeper than the second', function(){
            expect(dom.commonAncestor(n21, n22)).toBe(n10);
        });

        it('returns the common parent if the second argument is located deeper than the first', function(){
            expect(dom.commonAncestor(n30, n23)).toBe(n00);
        });
    });

    describe('Finds proxy node', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31,
            dom;
//                    e00
//         ____________|_________
//         |                     |
//        e10                   e11
//   ______|______ ________      |
//   |     |      |    |   |     |
//  t20   e21    t22  e23 t24   t25
//      ___|____
//      |       |
//     e30     t31

        beforeEach(function(){
            dom = new Dom();
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            t25 = document.createTextNode('text node 2.5');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(t25);
        });

        it('gets proxy of an element node', function(){
            expect(dom.proxy(e21)).toBe(e21);
        });

        it('gets proxy of a text node without siblings', function(){
            expect(dom.proxy(t25)).toBe(e11);
        });

        it('gets proxy of a middle (among its siblings) text node', function(){
            expect(dom.proxy(t22)).toBe(t22);
        });

        it('gets proxy of the first (among its siblings) text node', function(){
            expect(dom.proxy(t20)).toBe(t20);
        });
        it('gets proxy of the last (among its siblings) text node', function(){
            expect(dom.proxy(t24)).toBe(t24);
        });
    });


    describe('Finds style in the ascendants', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31,
            dom;

//                             e00 (block: wide)
//         ____________________________|_________
//         |                                     |
//        e10                                   e11 (block: narrow)
//   ______|_______________________________      |
//   |     |                      |    |   |     |
//  t20   e21 (block: narrow)    t22  e23 t24   t25
//      ___|_________________
//      |                    |
//     e30 (block: wide)    t31

        beforeEach(function(){
            dom = new Dom();
            var stl1 = 'class: media; block: wide;',
                stl2 = 'size: biggest; block: narrow;';
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            t25 = document.createTextNode('text node 2.5');
            e30 = document.createElement('div30');
            t31 = document.createTextNode('text node 3.1');
            e00.appendChild(e10);
            e00.appendChild(e11);
            e10.appendChild(t20);
            e10.appendChild(e21);
            e10.appendChild(t22);
            e10.appendChild(e23);
            e10.appendChild(t24);
            e21.appendChild(e30);
            e21.appendChild(t31);
            e11.appendChild(t25);
            e00.setAttribute('style', stl1);
            e30.setAttribute('style', stl1);
            e11.setAttribute('style', stl2);
            e21.setAttribute('style', stl2);
        });

        it('returns the value of the attribute if the element has this property and limit node is set', function(){
            expect(dom.getInheritedStyleProp('block', e30, e00)).toBe('wide');
        });

        it('returns the value of the attribute if the element has this property and limit node is not set', function(){
            expect(dom.getInheritedStyleProp('block', e30)).toBe('wide');
        });

        it('returns the node style property if the limit node is equal to the node', function(){
            expect(dom.getInheritedStyleProp('block', e11, e11)).toBe('narrow');
        });

        it('returns null if the node has no style property if the limit node is equal to the node', function(){
            expect(dom.getInheritedStyleProp('block', e23, e23)).not.toBeDefined();
        });

        it('returns parent node style property which when the parent is the limit node', function(){
            expect(dom.getInheritedStyleProp('block', t31, e21)).toBe('narrow');
        });

        it('returns parent node style property if the limit node is not set', function(){
            expect(dom.getInheritedStyleProp('block', t31)).toBe('narrow');
        });

        it('returns style property of one of the parents if the limit node is not a parent of the start node', function(){
            expect(dom.getInheritedStyleProp('block', t22, e11)).toBe('wide');
        });






    });