/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Dom, Node */

describe('Dom-specific functionality', function(){
    var dom;
    beforeEach(function(){
        dom = new Dom();
    });


    xdescribe('Content', function(){
        it('is set to Node', function(){
            var el = document.createElement('span');
            dom.setContent(el);
            expect(dom.getContent()).toBe(el);
        });

        it('is not set if argument is a string, array, number, non-Node object or function', function(){
            var invalids = ['a string', '', [], [1, 2, 3], 0, -3, 2.45, {}, {foo: 'bar'}, function(a){return a;}];
            invalids.forEach(function(invalid){
                var d = new Dom();
                expect(d.getContent()).toBe(undefined);
                dom.setContent(invalid);
                expect(d.getContent()).toBe(undefined);
            });
        });

    });

    describe('Getting common parent', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31, m00, m10, m11;
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
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;
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

    describe('Finds mentor node', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;

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

        it('returns null if mentor does not exist', function(){
            expect(dom.getMentor('width', e30)).not.toBeDefined();
        });

        it('returns node itself if has the property imposed', function(){
            expect(dom.getMentor('block', e30)).toBe(e30);
        });

        it('returns the parent node if it has the property imposed', function(){
            expect(dom.getMentor('block', e10)).toBe(e00);
        });

        it('returns the parent node of text node if it has the property imposed', function(){
            expect(dom.getMentor('block', t31)).toBe(e21);
        });
    });




    describe('Finds style in the ascendants', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, t25, e30, t31;

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
            var stl1 = 'class: media; padding: 5em;',
                stl2 = 'size: biggest; padding: 31px;';
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
            expect(dom.getInheritedStyleProp('padding', e30, e00)).toBe('5em');
        });

        it('returns the value of the attribute if the element has this property and limit node is not set', function(){
            expect(dom.getInheritedStyleProp('padding', e30)).toBe('5em');
        });

        it('returns the node style property if the limit node is equal to the node', function(){
            expect(dom.getInheritedStyleProp('padding', e11, e11)).toBe('31px');
        });

        it('returns null if the node has no style property if the limit node is equal to the node', function(){
            expect(dom.getInheritedStyleProp('padding', e23, e23)).not.toBeDefined();
        });

        it('returns parent node style property which when the parent is the limit node', function(){
            expect(dom.getInheritedStyleProp('padding', t31, e21)).toBe('31px');
        });

        it('returns parent node style property if the limit node is not set', function(){
            expect(dom.getInheritedStyleProp('padding', t31)).toBe('31px');
        });

        it('returns style property of one of the parents if the limit node is not a parent of the start node', function(){
            expect(dom.getInheritedStyleProp('padding', t22, e11)).toBe('5em');
        });


    });


    describe('Toggles element style properties', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31;

//                                     e00
//          ____________________________|________
//         |                                     |
//        e10 (font: bold)                  e11 (block: narrow)
//    _____|_______________________________      |_________
//   |     |                      |    |   |     |         |
//  t20   e21 (width: large)     t22  e23 t24   e25    e26 (font: normal)
//      ___|___
//     |       |
//     e30    t31

        beforeEach(function(){
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            t20 = document.createTextNode('text node 2.0');
            e21 = document.createElement('div21');
            t22 = document.createTextNode('text node 2.2');
            e23 = document.createElement('div21');
            t24 = document.createTextNode('text node 2.4');
            e25 = document.createElement('div25');
            e26 = document.createElement('div26');
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
            e11.appendChild(e25);
            e11.appendChild(e26);
            e10.setAttribute('style', 'font-weight: bold;');
            e26.setAttribute('style', 'font-weight: normal;');
            e11.setAttribute('style', 'block: narrow;');
            e21.setAttribute('style', 'width: 100em;');
        });

        it('sets "width" to alternative value if the element has it set to primary value', function(){
            dom.toggleElementStyle(e21, 'width', '100em', '300em');
            var stl = e21.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '300em';
            })).toBe(true);
        });

        it('sets "width" to primary value if the element has it different from primary value', function(){
            dom.toggleElementStyle(e21, 'width', '50px', '200px');
            var stl = e21.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '50px';
            })).toBe(true);
        });

        it('sets "font" to alternative value if the element inherites "font" to  primary value"', function(){
            dom.toggleElementStyle(e30, 'font-weight', 'bold', 'normal');
            var stl = e30.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });

         it('sets "font" to primary value if the element inherites "font" to not a primary value', function(){
            dom.toggleElementStyle(e30, 'font-weight', 'normal', 'anything');
            var stl = e30.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });
    });



    describe('Creates an element node from a text one with a "toggled" style property', function(){
        var e00, e10, e11, t20, e21, t22, e23, t24, e25, e26, e30, t31;

//                                     e00
//          ____________________________|________
//         |                                     |
//        e10 (font: bold)                  e11 (block: narrow)
//    _____|_______________________________      |_________
//   |     |                      |    |   |     |         |
//  t20   e21 (width: large)     t22  e23 t24   e25    e26 (font: normal)
//      ___|___
//     |       |
//     e30    t31

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
            e25 = document.createElement('div25');
            e26 = document.createElement('div26');
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
            e11.appendChild(e25);
            e11.appendChild(e26);
            e10.setAttribute('style', 'font-weight: bold;');
            e26.setAttribute('style', 'font-weight: normal;');
            e11.setAttribute('style', 'block: narrow;');
            e21.setAttribute('style', 'width: 20px;');
        });

        it('creates an element node with "width" set to secondary value if the text node inherited "width" is equal to primary value', function(){
            var n = dom.createToggledElemFromText(t31, 'width', '20px', '600px'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '600px';
            })).toBe(true);
        });

        it('creates an element node with "width" set to primary value if text node inherited "width" is different from primary value', function(){
            var n = dom.createToggledElemFromText(t31, 'width', '300em', '20em'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'width' && tmp[1].trim() === '300em';
            })).toBe(true);
        });

        it('creates an element node with "font-weight" set to alternative value if the text node inherited "font-weight" is equal to primary value', function(){
            var n = dom.createToggledElemFromText(t22, 'font-weight', 'bold', '600');
            var stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === '600';
            })).toBe(true);
        });

        it('creates an element node with "font-weight" set to primary value if the text element inherited "font-weight" is different from primary value', function(){
            var n = dom.createToggledElemFromText(t22, 'font-weight', 'normal', 'large'),
                stl = n.getAttribute('style'),
                arr = stl.split(';');
            expect(arr.some(function(str){
                var tmp = str.split(':');
                return tmp.length === 2 && tmp[0].trim() === 'font-weight' && tmp[1].trim() === 'normal';
            })).toBe(true);
        });

        it('creates an element whose text representation is the original text node', function(){
            var n = dom.createToggledElemFromText(t22, 'font-weight', 'normal', 'large');
            expect(n.childNodes.length).toBe(1);
            expect(n.firstChild.nodeValue).toBe(t22.nodeValue);
        });
    });

    describe('Gets complement nodes', function(){
        var e00, e10, e11, e20, e21, e22, e23, e24, e30, e31, e32, e33, e34, e40,
            e41, e50, e51, e60, e61, e62, e63;
//                                                   e00
//                        ____________________________|________
//                       |                                     |
//                      e10                                   e11
//            ___________|________                             |_________
//           |           |       |                             |         |
//          e20         e21     e22                           e23       e24
//      _____|____    ___|___
//      |    |    |  |       |
//     e30  e31  e32 e33    e34
//                   |       |
//                  e40     e41
//          _________|
//         |         |
//        e50       e51
//     ____|      ___|___
//    |    |     |       |
//   e60  e61   e62     e63
//
        beforeEach(function(){
            dom = new Dom();
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            e20 = document.createElement('div20');
            e21 = document.createElement('div21');
            e22 = document.createElement('div22');
            e23 = document.createElement('div23');
            e24 = document.createElement('div24');
            e30 = document.createElement('div30');
            e31 = document.createElement('div31');
            e32 = document.createElement('div32');
            e33 = document.createElement('div33');
            e34 = document.createElement('div34');
            e40 = document.createElement('div40');
            e41 = document.createElement('div41');
            e50 = document.createElement('div50');
            e51 = document.createElement('div51');
            e60 = document.createElement('div60');
            e61 = document.createElement('div61');
            e62 = document.createElement('div62');
            e63 = document.createElement('div63');

            e00.appendChild(e10);
            e00.appendChild(e11);

            e10.appendChild(e20);
            e10.appendChild(e21);
            e10.appendChild(e22);
            e11.appendChild(e23);
            e11.appendChild(e24);

            e20.appendChild(e30);
            e20.appendChild(e31);
            e20.appendChild(e32);
            e21.appendChild(e33);
            e21.appendChild(e34);

            e33.appendChild(e40);
            e34.appendChild(e41);

            e40.appendChild(e50);
            e40.appendChild(e51);

            e50.appendChild(e60);
            e50.appendChild(e61);
            e51.appendChild(e62);
            e51.appendChild(e63);
        });

        it('returns empty array if start node and end node coincide', function(){
            var res = dom.complementNodes(e21, e21);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);
        });

        it('returns empty array if end node is a unique child of the start node', function(){
            var res = dom.complementNodes(e34, e41);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(0);

        });

        it('throws an error if the start node is not a parent of the end node', function(){
            expect(function(){
                return dom.complementNodes(e11, e40);
            }).toThrow(new Error("Start node must contain the end one!"));
        });

        it('returns array with two nodes if the start node has three children and the end node is one of them', function(){
            var res = dom.complementNodes(e20, e31);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e30) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
        });

        it('returns array containing a sibling of the end node and its "high level cousins"', function(){
            var res = dom.complementNodes(e10, e30);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(4);
            expect(res.indexOf(e31) !== -1).toBe(true);
            expect(res.indexOf(e32) !== -1).toBe(true);
            expect(res.indexOf(e21) !== -1).toBe(true);
            expect(res.indexOf(e22) !== -1).toBe(true);
        });

        it('does not loose any node even if path from start node to end node contains a node with unique child', function(){
            var res = dom.complementNodes(e21, e50);
            expect(Array.isArray(res)).toBe(true);
            expect(res.length).toBe(2);
            expect(res.indexOf(e51) !== -1).toBe(true);
            expect(res.indexOf(e34) !== -1).toBe(true);
        });
    });



    describe('Nailing style property', function(){
        var e00, e10, e11, e20, e21, e22, e23, e24, e30, e31, e32, e33, e34, e40,
            e41, e50, e51, e60, e61, e62, e63;
//                                                   e00
//                        ____________________________|________
//                       |                                     |
//                      e10  (font: nice)                     e11
//            ___________|_______                              |_________
//           |           |       |                             |         |
//          e20         e21     e22                           e23       e24
//      _____|____    ___|___
//      |    |    |  |       |
//     e30  e31  e32 e33    e34
//                   |       |
//                  e40     e41
//          _________|
//         |         |
//        e50       e51
//     ____|      ___|___
//    |    |     |       |
//   e60  e61   e62     e63
//
        beforeEach(function(){
            dom = new Dom();
            e00 = document.createElement('div00');
            e10 = document.createElement('div10');
            e11 = document.createElement('div11');
            e20 = document.createElement('div20');
            e21 = document.createElement('div21');
            e22 = document.createElement('div22');
            e23 = document.createElement('div23');
            e24 = document.createElement('div24');
            e30 = document.createElement('div30');
            e31 = document.createElement('div31');
            e32 = document.createElement('div32');
            e33 = document.createElement('div33');
            e34 = document.createElement('div34');
            e40 = document.createElement('div40');
            e41 = document.createElement('div41');
            e50 = document.createElement('div50');
            e51 = document.createElement('div51');
            e60 = document.createElement('div60');
            e61 = document.createElement('div61');
            e62 = document.createElement('div62');
            e63 = document.createElement('div63');

            e00.appendChild(e10);
            e00.appendChild(e11);

            e10.appendChild(e20);
            e10.appendChild(e21);
            e10.appendChild(e22);
            e11.appendChild(e23);
            e11.appendChild(e24);

            e20.appendChild(e30);
            e20.appendChild(e31);
            e20.appendChild(e32);
            e21.appendChild(e33);
            e21.appendChild(e34);

            e33.appendChild(e40);
            e34.appendChild(e41);

            e40.appendChild(e50);
            e40.appendChild(e51);

            e50.appendChild(e60);
            e50.appendChild(e61);
            e51.appendChild(e62);
            e51.appendChild(e63);
        });

        it('calls getMentor method to find out whether the style key is imposed', function(){
            spyOn(dom, 'getMentor');
            dom.nailStyleProperty(e34, 'whatever', 'primary', 'secondary');
            expect(dom.getMentor).toHaveBeenCalledWith('whatever', e34);
        });

        it('calls "setStyleProperty" with primary value of the style property on the target if it has no mentor', function(){
            spyOn(dom, 'getMentor');
            spyOn(dom, 'setStyleProperty');
            dom.nailStyleProperty(e50, 'src', 'primary', 'secondary');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e50, 'src', 'primary');
        });

        it('calls "setStyleProperty" with mentor (assuming it exists) inline style property value on all complement nodes', function(){
            spyOn(dom, 'getMentor').and.returnValue(e10);
            spyOn(dom, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(dom, 'dropStyleProperty');
            spyOn(dom, 'setStyleProperty');
            spyOn(dom, 'getStyleProperty').and.returnValue('nice');
            dom.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e50, 'font', 'nice');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e34, 'font', 'nice');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e20, 'font', 'nice');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e22, 'font', 'nice');
        });

        it('calls "dropStyleProperty" for mentor (assuming it exists) inline style property', function(){
            spyOn(dom, 'getMentor').and.returnValue(e10);
            spyOn(dom, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(dom, 'dropStyleProperty');
            spyOn(dom, 'setStyleProperty');
            dom.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(dom.dropStyleProperty).toHaveBeenCalledWith(e10, 'font');
        });

        it('calls "dropStyleProperty" on the mentor and "setStyleProperty" on the node, if complement node array is empty', function(){
            spyOn(dom, 'getMentor').and.returnValue(e21);
            spyOn(dom, 'complementNodes').and.returnValue([]);
            spyOn(dom, 'dropStyleProperty');
            spyOn(dom, 'setStyleProperty');
            dom.nailStyleProperty(e63, 'font', 'good', 'ugly');
            expect(dom.dropStyleProperty).toHaveBeenCalledWith(e21, 'font');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e63, 'font', 'good');
        });



        it('calls "setStyleProperty" with primary inline style property value on target node if mentor exists', function(){
            spyOn(dom, 'getMentor').and.returnValue(e10);
            spyOn(dom, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(dom, 'setStyleProperty');
            spyOn(dom, 'getStyleProperty').and.returnValue('nice'); // mentor inline style
            dom.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e51, 'font', 'good');
        });

        it('calls "setStyleProperty" with secondary inline style property value on target node if mentor style property is equal to primary', function(){
            spyOn(dom, 'getMentor').and.returnValue(e10);
            spyOn(dom, 'complementNodes').and.returnValue([e50, e34, e20, e22]);
            spyOn(dom, 'setStyleProperty');
            spyOn(dom, 'getStyleProperty').and.returnValue('good'); // mentor inline style
            dom.nailStyleProperty(e51, 'font', 'good', 'ugly');
            expect(dom.setStyleProperty).toHaveBeenCalledWith(e51, 'font', 'ugly');
        });
    });

    describe('Managing inline style property of nodes', function(){
    var e0, e1, t2, e3, e4;
//                    e0 (font: nice; color: red)           e4 (size: 5)
//            ___________|_______
//           |           |       |
//          e1          t2     e3 (width: big; border: 2)
//
        beforeEach(function(){
            e0 = document.createElement('div0');
            e1 = document.createElement('div1');
            t2 = document.createTextNode('text node');
            e3 = document.createElement('div3');
            e4 = document.createElement('div4');

            e0.setAttribute('style', 'font-size: 20px; padding: 20em');
            e3.setAttribute('style', 'width: 200px; border: 2');
            e4.setAttribute('style', 'padding: 5em');

            e0.appendChild(e1);
            e0.appendChild(t2);
            e0.appendChild(e3);
        });

        describe('Getting property', function(){
            it('returns undefined if asked about a text node', function(){
                expect(dom.getStyleProperty(t2, 'whatever')).not.toBeDefined();
            });

            it('returns undefined if the node does not have that property', function(){
                expect(dom.getStyleProperty(e3, 'height')).not.toBeDefined();
            });

            it('returns undefined if the node does not have any property', function(){
                expect(dom.getStyleProperty(e1, 'height')).not.toBeDefined();
            });

            it('returns property value if the node has that property', function(){
                expect(dom.getStyleProperty(e0, 'padding')).toBe('20em');
            });
        });

        describe('Deleting property', function(){
            it('returns false if the argument does not support attributes (like a text node)', function(){
                expect(dom.dropStyleProperty(t2, 'any')).toBe(false);
            });

            it('returns false if the argument does not have that property', function(){
                expect(dom.dropStyleProperty(e3, 'excellence')).toBe(false);
            });

            it('returns false if the argument has no inline style properties', function(){
                expect(dom.dropStyleProperty(e1, 'width')).toBe(false);
            });

            it('returns true if the argument has required inline style property', function(){
                expect(dom.dropStyleProperty(e3, 'width')).toBe(true);
            });

            it('removes the required inline style property if the argument has that property', function(){
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
                dom.dropStyleProperty(e0, 'font-size');
                expect(e0.getAttribute('style').indexOf('font-size')).toBe(-1);
            });

            it('does not remove other inline style properties', function(){
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
                dom.dropStyleProperty(e0, 'padding');
                expect(e0.getAttribute('style').indexOf('font-size')).not.toBe(-1);
            });

            it('removes \"style\" attribute if after deleting requested key it remains empty', function(){
                expect(e4.getAttribute('style').indexOf('padding')).not.toBe(-1);
                dom.dropStyleProperty(e4, 'padding');
                expect(e4.getAttribute('style')).toBe(null);
            });
        });

        describe('Setting property', function(){
            it('return node itself (modified) if the target is an element node', function(){
                var n = dom.setStyleProperty(e3, 'color', 'blue');
                expect(n.nodeType).toBe(Node.ELEMENT_NODE);
                expect(n.isEqualNode(e3)).toBe(true);
            });

            it('returns a wrapping node if the target is a text node', function(){
                var n = dom.setStyleProperty(t2, 'color', 'blue');
                expect(n.nodeType).toBe(Node.ELEMENT_NODE);
            });

            it('appends the property to the node with inline style', function(){
                dom.setStyleProperty(e0, 'position', 'absolute');
                var styles = e0.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'position' && tmp[1].trim() === 'absolute';
                    });
                expect(res).toBe(true);
            });

            it('sets the property to the node without inline style', function(){
                dom.setStyleProperty(e1, 'position', 'absolute');
                var styles = e1.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'position' && tmp[1].trim() === 'absolute';
                    });
                expect(res).toBe(true);
            });


            it('overrides the property of the node', function(){
                dom.setStyleProperty(e0, 'color', 'green');
                var styles = e0.getAttribute('style').split(';'),
                    // splitting style in pieces and look for the presence of "position: absolute"
                    isPresentNew = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'green';
                    }),
                    isPresentOld = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'red';
                    });
                expect(isPresentNew).toBe(true);
                expect(isPresentOld).toBe(false);
            });

            it('sets inline property of the wrapping node when calling on a text node', function(){
                var n = dom.setStyleProperty(t2, 'color', 'blue');
                var styles = n.getAttribute('style').split(';'),
                    res = styles.some(function(record){
                        var tmp = record.split(':');
                        return tmp.length === 2 && tmp[0].trim() === 'color' && tmp[1].trim() === 'blue';
                    });
                expect(res).toBe(true);

            });

            it('inserts wrapping node in the DOM at place of the text node', function(){
                var n = dom.setStyleProperty(t2, 'color', 'blue');
                expect(n.nextSibling).toBe(e3);
                expect(n.previousSibling).toBe(e1);
                expect(n.firstChild.nodeValue).toBe('text node');

            });


        });
    });

    describe('Switching class attributes', function(){
        it('creates class attribute if no class attribute is present', function(){
            var el = document.createElement('div');
            dom.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('new_class');
        });

        it('switches class attribute if the element has only that class attribute', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'old_class');
            dom.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('new_class');
        });

        it('appends class attribute if the element has other class attributes and no secondary-switch', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'some_other_class another-one');
            dom.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('some_other_class another-one new_class');
        });

        it('leaves class attribute unchanged if it is already set to primary-switch', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'class1');
            dom.switchClassProperty(el, 'class1', 'class2');
            expect(el.getAttribute('class')).toBe('class1');
        });

        it('replaces the secondary-switch class attribute if the element has other attributes', function(){
            var el = document.createElement('div');
            el.setAttribute('class', 'some_other_class old_class another-one');
            dom.switchClassProperty(el, 'new_class', 'old_class');
            expect(el.getAttribute('class')).toBe('some_other_class new_class another-one');
        });
    });

    describe('Getting inherited properties', function(){
        var n00, n10, n11, n20, n21, n22, n23, n30, n31, m00, m10, m11;
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

        it('returns a Properties instance if the scope is not set', function(){
            var prop = dom.getInheritedProperties(n11);
            expect(prop instanceof Properties).toBe(true);
        });

        it('returns a Properties instance if the node is  within the scope', function(){
            var prop = dom.getInheritedProperties(n11, n00);
            expect(prop instanceof Properties).toBe(true);
        });

        it('returns a Properties instance if the node is not within the scope', function(){
            var prop = dom.getInheritedProperties(n11, n10);
            expect(prop instanceof Properties).toBe(true);
        });


        it('returns current node properties if the scope is not set', function(){
            n30.setAttribute('class', 'media');
            var prop = dom.getInheritedProperties(n30);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('class')).toBe('media');;
        });

        it('returns current node properties if the node is not scope node descendant', function(){
            n21.setAttribute('data-user', 'content');
            var prop = dom.getInheritedProperties(n21, n11);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('data-user')).toBe('content');

        });

        it('returns properties if the node is within scope', function(){
            n30.setAttribute('style', 'padding: 23em;margin: 5px;');
            n21.setAttribute('href', 'a link');
            n10.setAttribute('src', 'image.jpg');
            n00.setAttribute('color', 'red');
            var prop = dom.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(4);        // 'style', 'href', 'src' and 'color'
            expect(prop.getProperty('color')).toBe('red');
            expect(prop.getProperty('src')).toBe('image.jpg');
            expect(prop.getProperty('href')).toBe('a link');
            expect(prop.getStyleProperty('padding')).toBe('23em');
            expect(prop.getStyleProperty('margin')).toBe('5px');
        });

        it('considers nodes up to the root if the scope is not set', function(){
            n30.setAttribute('style', 'padding: 23em;margin: 5px;');
            n21.setAttribute('href', 'a link');
            n10.setAttribute('src', 'image.jpg');
            n00.setAttribute('color', 'red');
            var prop = dom.getInheritedProperties(n30);
            expect(prop.propNum()).toBe(4);        // 'style', 'href', 'src' and 'color'
            expect(prop.getProperty('color')).toBe('red');
            expect(prop.getProperty('src')).toBe('image.jpg');
            expect(prop.getProperty('href')).toBe('a link');
            expect(prop.getStyleProperty('padding')).toBe('23em');
            expect(prop.getStyleProperty('margin')).toBe('5px');
        });


        it('assignes the first occurence of attributes', function(){
            n21.setAttribute('font-size', '12px');
            n10.setAttribute('font-size', '2em;');
            var prop = dom.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(1);
            expect(prop.getProperty('font-size')).toBe('12px');
        });

        it('assignes the first occurence of styles', function(){
            n21.setAttribute('style', 'font-weight: bold');
            n10.setAttribute('style', 'font-weight: normal');
            var prop = dom.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(1);
            expect(prop.getStyleProperty('font-weight')).toBe('bold');
        });

        it('assignes the first occurence of multiple styles', function(){
            n21.setAttribute('style', 'color: red; width: 20em');
            n21.setAttribute('text-align', 'center');
            n21.setAttribute('src', 'local');
            n10.setAttribute('style', 'width: 100px; font-weight: normal');
            n10.setAttribute('title', 'tag title');
            n10.setAttribute('src', 'external');

            var prop = dom.getInheritedProperties(n30, n00);
            expect(prop.propNum()).toBe(4);
            expect(prop.getProperty('text-align')).toBe('center');
            expect(prop.getProperty('src')).toBe('local');
            expect(prop.getProperty('title')).toBe('tag title');
            expect(prop.getStyleProperty('width')).toBe('20em');
            expect(prop.getStyleProperty('color')).toBe('red');
            expect(prop.getStyleProperty('font-weight')).toBe('normal');
        });




    });


});