/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine,
	Content, Link, Ulist, Factory, Tag, Table, ListItem, OList, UList,
	Cell, Row, Registry, PlainText, Mapping, Node, window */

describe('Content-related functionality', function(){
	var c;
	beforeEach(function(){
		c = new Content();
	});

	describe('Content::constructor', function(){
		it('adds keyword "new" if it is missing when an object is created', function(){
		    var c2 = Content();
		    expect(c2 instanceof Content).toBe(true);
		});
	});

	describe('Content::className: class name', function(){
	    it('gives the name of the class', function(){
	        expect(c.getName()).toBe('Content');
	    });
	});


	describe('Content::length(): The number of elements:', function(){
		it('gives 0 for the empty Content instance', function(){
			expect(c.length()).toBe(0);
		});

		it('gives 1 for a unique element inside Content', function(){
			c.setElements([0]); // integer inside
			expect(c.length()).toBe(1);

			c.setElements([{}]); // object inside
			expect(c.length()).toBe(1);

			c.setElements(['a string']); // a string insdie
			expect(c.length()).toBe(1);

			c.setElements([['a', 'b', 21.6]]); // an array inside
			expect(c.length()).toBe(1);

			c.setElements([function(){return null;}]); // a function inside
			expect(c.length()).toBe(1);
		});

		it('gives 2 for a unique element of different types inside Content', function(){
			c.setElements([0, ['a']]);
			expect(c.length()).toBe(2);

			c.setElements([{'a': 1, 'b':'value', 'c': true}, 'sun']);
			expect(c.length()).toBe(2);

			c.setElements(['a string', 'another']);
			expect(c.length()).toBe(2);

			c.setElements([[], function(){return null;}]); // a function inside
			expect(c.length()).toBe(2);
		});
	});

	describe('Content::getElem(): gets the element:', function(){
		it('the very first element', function(){
			var obj = {'a': 'b'};
			c.setElements(['first elem']);
			expect(c.getElem(0)).toBe('first elem');
			c.setElements([453.29]);
			expect(c.getElem(0)).toBe(453.29);
			c.setElements([obj]);
			expect(c.getElem(0)).toBe(obj);
			c.setElements(['a', 2, ['array']]);
			expect(c.getElem(0)).toBe('a');

			c.setElements(['']);
			expect(c.getElem(0)).toBe('');

		});
		it('the very last element', function(){
			var obj = {'key': 4};
			c.setElements(['first elem', 'second']);
			expect(c.getElem(1)).toBe('second');
			c.setElements([453.29, 'a', 125, 'again', obj, '2']);
			expect(c.getElem(5)).toBe('2');
			c.setElements(['again', '']);
			expect(c.getElem(1)).toBe('');
		});
		it('a middle element', function(){
			var obj = {'key': 4};
			c.setElements([453.29, 'a', 125, '', 'again', obj, '2']);
			expect(c.getElem(1)).toBe('a');
			expect(c.getElem(2)).toBe(125);
			expect(c.getElem(3)).toBe('');
			expect(c.getElem(4)).toBe('again');
			expect(c.getElem(5)).toBe(obj);
			expect(c.getElem(6)).toBe('2');
		});


		it('returns null if element does not exist', function(){
			c.setElements([]);
			expect(c.getElem(0)).toBe(null);
			expect(c.getElem(4)).toBe(null);

			c.setElements([453.29, 'a', 125, 'again', {'key': 4}, '2']);
			expect(c.getElem(10)).toBe(null);
			expect(c.getElem(12)).toBe(null);
		});

		it('refers to the getElem when calling getFirst', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.setElements([]);
			c.getFirst();
			expect(c.getElem).toHaveBeenCalledWith(0);

			c.setElements(['string', 2344, '33']);
			c.getFirst();
			expect(c.getElem).toHaveBeenCalledWith(0);

		});

		it('returns null when calling getLast on empty array', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.setElements([]);
			var last = c.getLast();
			expect(c.getElem).not.toHaveBeenCalled();
			expect(last).toBe(null);
		});


		it('refers the getElem when calling getLast', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.setElements(['string', 2344, '33']);
			c.getLast();
			expect(c.getElem).toHaveBeenCalledWith(2);
		});
	});

	describe('Content::isEmpty(): is the content empty', function(){
		it('returns true if content.elements is empty', function(){
			expect(c.isEmpty()).toBe(true);
		});
		it('returns true if content.elements contains empty string', function(){
			c.setElements(['']);
			expect(c.isEmpty()).toBe(true);
		});
		it('returns true if content.elements contains html non-breaking space', function(){
			c.setElements(['&nbsp;']);
			expect(c.isEmpty()).toBe(true);
		});

		it('returns true if content.elements contains two empty strings', function(){
			c.setElements(['', '']);
			expect(c.isEmpty()).toBe(true);
		});
		it('returns false if content.elements contains a non-empty string', function(){
			c.setElements(['non empty']);
			expect(c.isEmpty()).toBe(false);
		});

		it('returns true if content.elements contains empty object', function(){
			c.setElements([{}]);
			expect(c.isEmpty()).toBe(true);
		});
		it('returns false if content.elements contains an object with properties', function(){
			c.setElements([{1: 'first', 2: 'second'}]);
			expect(c.isEmpty()).toBe(false);
		});
		it('returns false if content.elements contains an object that has isEmpty method that returns false', function(){
			var obj = {1: 'property 1', isEmpty: function(){return null;}, 'descr': 'nice'};
			spyOn(obj, 'isEmpty').andCallFake(function(){return false;});
			c.setElements([obj]);
			expect(c.isEmpty()).toBe(false);
			expect(obj.isEmpty).toHaveBeenCalled();
		});
		it('stop scanning at first element that returns false', function(){
			var obj1 = {isEmpty: function(){return null;}},
				obj2 = {isEmpty: function(){return null;}},
				obj3 = {isEmpty: function(){return null;}};
			spyOn(obj1, 'isEmpty').andCallFake(function(){return true;});
			spyOn(obj2, 'isEmpty').andCallFake(function(){return false;});
			spyOn(obj3, 'isEmpty');

			c.setElements([obj1, obj2, obj3]);
			expect(c.isEmpty()).toBe(false);
			expect(obj1.isEmpty).toHaveBeenCalled();
			expect(obj2.isEmpty).toHaveBeenCalled();
			expect(obj3.isEmpty).not.toHaveBeenCalled();
		});
	});

	describe('Content::isElemEmpty()', function(){
		it('returns false, if argument has method isEmpty() that returns false', function(){
			var foo = {isEmpty: function(){return false;}};
			expect(c.isElemEmpty(foo)).toBe(false);
		});
		it('returns true, if argument has method isEmpty() that returns true', function(){
			var foo = {isEmpty: function(){return true;}};
			expect(c.isElemEmpty(foo)).toBe(true);
		});

		it('returns true if argument is empty string', function(){
			expect(c.isElemEmpty('')).toBe(true);
		});

		it('returns true if argument is empty array []', function(){
			expect(c.isElemEmpty([])).toBe(true);
		});

		it('returns false if argument is [0]', function(){
			expect(c.isElemEmpty([0])).toBe(false);
		});

		it('returns false if argument is a string', function(){
			expect(c.isElemEmpty('abc')).toBe(false);
		});

		it('returns false if argument is an integer', function(){
			expect(c.isElemEmpty(0)).toBe(false);
			expect(c.isElemEmpty(93)).toBe(false);
			expect(c.isElemEmpty(-5)).toBe(false);
		});

		it('returns false if arg is a float number', function(){
			expect(c.isElemEmpty(0.893)).toBe(false);
			expect(c.isElemEmpty(9.3)).toBe(false);
			expect(c.isElemEmpty(-5.4)).toBe(false);
		});
		it('returns true if arg is an object without properties', function(){
			expect(c.isElemEmpty({})).toBe(true);
		});
		it('returns false if arg is an object with one property', function(){
			expect(c.isElemEmpty({'prop': 'present'})).toBe(false);
		});
	});

	describe('flushes the element array', function(){
		it('flushes the element array if it is empty', function(){
			expect(c.getElements().length).toBe(0);
			c.flush();
			expect(c.getElements().length).toBe(0);
		});
		it('flushes the element array if it is empty', function(){
			c.setElements([1, 'two']);
			expect(c.getElements().length).toBe(2);
			c.flush();
			expect(c.getElements().length).toBe(0);
		});
	});

	describe('element getter and setter', function(){
		var elements;
		it('the getter returns empty array if the instance is empty', function(){
			elements = c.getElements();
			expect(Array.isArray(elements)).toBe(true);
			expect(elements.length).toBe(0);
		});
		it('the getter returns single record array if the instance has one element', function(){
			var el = {};
			c.appendElem(el);
			elements = c.getElements();
			console.log(c);
			console.log(elements);
			expect(Array.isArray(elements)).toBe(true);
			expect(elements.length).toBe(1);
			expect(elements[0]).toBe(el);
		});

		it('the getter returns two record array if the instance has two elements', function(){
			var el1 = {}, el2 = {1: '1'};
			c.appendElem(el1);
			c.appendElem(el2);
			elements = c.getElements();
			expect(Array.isArray(elements)).toBe(true);
			expect(elements.length).toBe(2);
			expect(elements[0]).toBe(el1);
			expect(elements[1]).toBe(el2);
		});

		it('the getter returns an independent copy of the element array', function(){
			var el1 = {}, el2 = {1: '1'}, el3 = 'third';
			c.appendElem(el1);
			c.appendElem(el2);
			// retrieve the element array
			elements = c.getElements();
			// modify the element array
			elements[0] = el3;
			// assure that the original element array does not change
			expect(c.getElements()[0]).toBe(el1);
		});



	});

	describe('Content::appendElemIfNotEmpty()', function(){
		it('calls Content::appendElem(arg) if  Content::isElemEmpty(arg) returns false', function(){
			spyOn(c, 'appendElem');
			spyOn(c, 'isElemEmpty').andCallFake(function(){return false;});
			var arg = 'foo';
			c.appendElemIfNotEmpty(arg);
			expect(c.appendElem).toHaveBeenCalledWith(arg);
			expect(c.isElemEmpty).toHaveBeenCalledWith(arg);
		});
		it('does not call Content::appendElem(arg) if Content::isElemEmpty(arg) returns true', function(){
			spyOn(c, 'appendElem');
			spyOn(c, 'isElemEmpty').andCallFake(function(){return true;});
			var obj = 'foo';
			c.appendElemIfNotEmpty(obj);
			expect(c.appendElem).not.toHaveBeenCalled();
			expect(c.isElemEmpty).toHaveBeenCalledWith(obj);
		});
	});

	describe('Content::insertElemAt(): Inserts the element', function(){
		it('throws an error if the position is too big', function(){
			spyOn(c, 'length').andCallFake(function(){return 5;});
			expect(function(){
				c.insertElemAt(10, 'whatever');
			}).toThrow('Wrong index to insert the element at!');
		});

		it('throws an error if the position is negative', function(){
			expect(function(){
				c.insertElemAt(-1, 'whatever');
			}).toThrow('Wrong index to insert the element at!');
		});

		it('throws an error if the position is not integer', function(){
			expect(function(){
				c.insertElemAt(2.3, 'whatever');
			}).toThrow('Wrong index to insert the element at!');
		});

		it('inserts an object at the beginning', function(){
			var obj = {'key': 'value'};
			c.setElements([1, 'str', 2, 3]);
			c.insertElemAt(0, obj);
			expect(c.length()).toBe(5);
			expect(c.getElem(0)).toBe(obj);
			expect(c.getElem(1)).toBe(1);
			expect(c.getElem(2)).toBe('str');
			expect(c.getElem(3)).toBe(2);
			expect(c.getElem(4)).toBe(3);
		});

		it('inserts a string in the middle', function(){
			c.setElements([1, 'str', 2, 3]);
			c.insertElemAt(2, 'new string');
			expect(c.length()).toBe(5);
			expect(c.getElem(0)).toBe(1);
			expect(c.getElem(1)).toBe('str');
			expect(c.getElem(2)).toBe('new string');
			expect(c.getElem(3)).toBe(2);
			expect(c.getElem(4)).toBe(3);
		});

		it('calls Content::appendElem() when inserting at the end', function(){
			spyOn(c, 'length').andCallFake(function(){return 2;});
			spyOn(c, 'appendElem').andCallFake(function(){return null;});
			c.insertElemAt(2, 'whatever');
			expect(c.appendElem).toHaveBeenCalledWith('whatever');
		});

		it('appends element to an empty array', function(){
			c.setElements([]);
			c.appendElem('anything');
			expect(c.getElements().length).toBe(1);
			expect(c.getElem(0)).toBe('anything');
		});

		it('appends element to exisiting elements', function(){
			var obj1 = {'key': true},
				obj2 = {'col': 9292};
			c.setElements(['str', obj1, 23.56]);
			c.appendElem(obj2);
			expect(c.getElements().length).toBe(4);
			expect(c.getElem(0)).toBe('str');
			expect(c.getElem(1)).toBe(obj1);
			expect(c.getElem(2)).toBe(23.56);
			expect(c.getElem(3)).toBe(obj2);
		});

		it('appends elements of the argument if it is a Content instance', function(){
			var c2 = new Content();
			c.appendElem('elem 1 of content 1');
			c2.appendElem('elem 1 of content 2');
			c2.appendElem('elem 2 of content 2');
			c.appendElem(c2);
			var elements = c.getElements();
			expect(elements.length).toBe(3);
			expect(elements[0]).toBe('elem 1 of content 1');
			expect(elements[1]).toBe('elem 1 of content 2');
			expect(elements[2]).toBe('elem 2 of content 2');
		});
	});

	describe('Content::dropElemAt(): drops element at given position', function(){
		it('throws an error if the position index is too big', function(){
			spyOn(c, 'length').andCallFake(function(){return 2;});
			expect(function(){
				c.dropElemAt(20);
			}).toThrow('No element is found at the given position!');
		});

		it('throws an error if the position index is negative', function(){
			expect(function(){
				c.dropElemAt(-1);
			}).toThrow('No element is found at the given position!');
		});

		it('throws an error if the position index is not integer', function(){
			expect(function(){
				c.dropElemAt(3.2);
			}).toThrow('No element is found at the given position!');
		});


		it('drops the first element', function(){
			c.setElements(['first', 1, '49', 'last']);
			var elem = c.dropElemAt(0);
			expect(c.length()).toBe(3);
			expect(elem).toBe('first');
			expect(c.getElem(0)).toBe(1);
			expect(c.getElem(1)).toBe('49');
			expect(c.getElem(2)).toBe('last');
		});
		it('drops the last element', function(){
			c.setElements(['first', 1, '49', -29, 'last']);
			var elem = c.dropElemAt(4);
			expect(c.length()).toBe(4);
			expect(elem).toBe('last');
			expect(c.getElem(0)).toBe('first');
			expect(c.getElem(1)).toBe(1);
			expect(c.getElem(2)).toBe('49');
			expect(c.getElem(3)).toBe(-29);
		});

		it('drops a middle element', function(){
			c.setElements(['first', 1, '49', 233.2, 'last']);
			var elem = c.dropElemAt(2);
			expect(c.length()).toBe(4);
			expect(elem).toBe('49');
			expect(c.getElem(0)).toBe('first');
			expect(c.getElem(1)).toBe(1);
			expect(c.getElem(2)).toBe(233.2);
			expect(c.getElem(3)).toBe('last');
		});
	});

	describe('Content::dropFirst(): drops first element', function(){
		it('calls Content::dropElemAt(0)', function(){
			spyOn(c, 'dropElemAt');
			c.dropFirst();
			expect(c.dropElemAt).toHaveBeenCalledWith(0);
		});
	});

	describe('Content::dropLast(): drops last element', function(){
		it('if the Content has no elements, no call to Content::dropElemAt() is performed', function(){
			spyOn(c, 'dropElemAt');
			spyOn(c, 'length').andCallFake(function(){return 0;});
			c.dropLast();
			expect(c.dropElemAt).not.toHaveBeenCalled();
		});

		it('if the Content has one element, calls Content::dropElemAt(0)', function(){
			spyOn(c, 'dropElemAt');
			spyOn(c, 'length').andCallFake(function(){return 1;});
			c.dropLast();
			expect(c.dropElemAt).toHaveBeenCalledWith(0);
		});
		it('if the Content has ten elements, calls Content::dropElemAt(9)', function(){
			spyOn(c, 'dropElemAt');
			spyOn(c, 'length').andCallFake(function(){return 10;});
			c.dropLast();
			expect(c.dropElemAt).toHaveBeenCalledWith(9);
		});
	});

	describe('Content::trim(): drops last elem if it is empty', function(){
		it('removes empty element, if it is the only element', function(){
			var obj = {'isEmpty': function(){return true;}};
			c.setElements([obj]);
			c.trim();
			expect(c.getElements().length).toBe(0);
		});
		it('does not remove element, if it is not empty', function(){
			var obj = {'isEmpty': function(){return false;}};
			c.setElements([obj]);
			c.trim();
			expect(c.getElements().length).toBe(1);
			expect(c.getElem(0)).toBe(obj);
		});

		it('does not remove element, if it is empty, but comes first', function(){
			var obj = {'isEmpty': function(){return true;}};
			c.setElements([obj, "string"]);
			c.trim();
			expect(c.getElements().length).toBe(2);
			expect(c.getElem(0)).toBe(obj);
			expect(c.getElem(1)).toBe("string");
		});


		it('does not remove element, if it is empty, but comes in middle', function(){
			var obj = {'isEmpty': function(){return true;}};
			c.setElements([2, obj, "string"]);
			c.trim();
			expect(c.getElements().length).toBe(3);
			expect(c.getElem(0)).toBe(2);
			expect(c.getElem(1)).toBe(obj);
			expect(c.getElem(2)).toBe("string");
		});

		it('removes two empty elements, if they are at the end', function(){
			var obj1 = {'isEmpty': function(){return true;}},
				obj2 = {'isEmpty': function(){return true;}};
			c.setElements([2, "string", obj1, obj2]);
			c.trim();
			expect(c.getElements().length).toBe(2);
			expect(c.getElem(0)).toBe(2);
			expect(c.getElem(1)).toBe("string");
		});

		it('removes nested empty element of the the first nested element', function(){
			var c2 = new Content(),
				obj1 = {'isEmpty': function(){return true;}},
				obj2 = {'isEmpty': function(){return true;}};
			c2.setElements(['c2: e1', 'c2: e2', obj2]);
			c.setElements([c2, obj1]);
			c.trim();
			expect(c.length()).toBe(1);
			expect(c.getElem(0).length()).toBe(2);
			expect(c.getElem(0).getElem(0)).toBe('c2: e1');
			expect(c.getElem(0).getElem(1)).toBe('c2: e2');
		});

		it('removes nested empty element of the second nested element', function(){
			var c2 = new Content(),
				obj1 = {'isEmpty': function(){return false;}},
				obj2 = {'isEmpty': function(){return true;}};
			c2.setElements(['c2: e1', 'c2: e2', obj2]);
			c.setElements([obj1, c2]);
			c.trim();
			expect(c.length()).toBe(2);
			expect(c.getElem(0)).toBe(obj1);
			expect(c.getElem(1).length()).toBe(2);
			expect(c.getElem(1).getElem(0)).toBe('c2: e1');
			expect(c.getElem(1).getElem(1)).toBe('c2: e2');
		});
	});

	describe('Content::toHtml(): generate html representation', function() {
	    var content, elem, htmlContent;
	    beforeEach(function() {
	        elem = {};
	        content = new Content();
	    });

	    it('Produces empty string if "elements" property is empty', function() {
	        content.setElements([]);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe('string');
	        expect(htmlContent).toEqual('');
	    });

	    it('Produces a string if content contains a number ', function() {
	        content.setElements([19.2]);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toEqual('19.2');
	    });

	    it('Produces a string if content contains a string ', function() {
	        content.setElements(['content text']);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toEqual('content text');
	    });

	    it('Produces html comment if the content element is an Object without toHtml() method', function() {
	        content.setElements([elem]);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('<!-- no html representation -->');
	    });

	    it('Produces html comment if the content element is an Object with toHtml() method', function() {
	    	elem = {foo: 1, toHtml: function(){return 'elem representation';}};
	        content.setElements([elem]);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('elem representation');
	    });


	    it('Produces a string if content contains a number and a string', function() {
	        content.setElements([23.73, 'what a beautiful day']);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe('string');
	        expect(htmlContent).toEqual('23.73what a beautiful day');
	    });

	    it('Produces a string if one of the elements has no toHtml property', function() {
	        content.setElements(['.', elem, 'how are you?']);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('.<!-- no html representation -->how are you?');
	    });
	    it('Produces a string if all elements have html representation', function() {
	    	elem = {foo: [1,2,3], toHtml: function(){return 'elem str';}};
	        content.setElements(['waiting for the Sun', elem, 'how are you?']);
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('waiting for the Sunelem strhow are you?');
	    });
	});

	describe('Content::toText(): generates text representation of the content', function(){
        it('returns empty string for a tag without elements', function(){
            c.setElements([]);
            expect(c.toText()).toBe('');
        });

        it('returns string if only this string is present in elements', function(){
            c.setElements(['dumb string']);
            expect(c.toText()).toBe('dumb string');
        });

	        it('returns "stringified" number if only that number is present in elements', function(){
            c.setElements([92]);
            expect(c.toText()).toBe('92');
        });

        it('returns concatention of two strings ', function(){
            c.setElements(['dumb string', 'second input']);
            expect(c.toText()).toBe('dumb stringsecond input');
        });

        it('returns empty string if the only element is an object with no toText() method', function(){
        	var fake = {};
        	expect(fake.hasOwnProperty('toText')).toBe(false);
        	c.setElements([fake]);
        	expect(c.toText()).toBe('');
        });


        it('calls toText() method of the unique object in the elements', function(){
        	var fake = {toText: function(){return null;}};
        	spyOn(fake, 'toText').andCallFake(function(){return 'fake text repr';});
        	c.setElements([fake]);
        	expect(c.toText()).toBe('fake text repr');
        	expect(fake.toText).toHaveBeenCalled();
        });
        it('ignores the object if it has no toText() method', function(){
        	var fake1 = {toText: function(){return null;}},
        		fake2 = {},
        		fake3 = {toText: function(){return null;}};
        	spyOn(fake1, 'toText').andCallFake(function(){return 'fake1 msg';});
        	spyOn(fake3, 'toText').andCallFake(function(){return 'fake3 str';});
        	c.setElements([fake1, fake2, fake3]);
        	expect(c.toText()).toBe('fake1 msgfake3 str');
        	expect(fake1.toText).toHaveBeenCalled();
        	expect(fake3.toText).toHaveBeenCalled();
        });
    });

	describe('Content::load(): loads the content' , function(){
		var root, e0, t1, e2, e3, t4, e00, e01, e20,
			e30, e31, e32, t33, t001, e200, e310, t320,
			map = new Mapping();
		//                    root
		//      ________________|_____________
		//     |      |      |         |      |
		//     e0     t1     e2        e3     t4
		//   __|__           |     ____|____________
		//  |     |          |    |    |     |      |
		// e00   e01        e20  e30  e31   e32    t33
		//  |                |         |     |
		// t001             e200      e310  t320
		beforeEach(function(){
			root = document.createElement('div');
			e0 = document.createElement('li');
			t1 = document.createTextNode('text 1');
			e2 = document.createElement('p');
			e3 = document.createElement('span');
			t4 = document.createTextNode('text 4');
			e00 = document.createElement('div');
			e01 = document.createElement('a');
			e20 = document.createElement('i');
			e30 = document.createElement('article');
			e31 = document.createElement('h1');
			e32 = document.createElement('div');
			t33 = document.createTextNode('text 33');
			t001 = document.createTextNode('text 001');
			e200 = document.createElement('div');
			e310 = document.createElement('span');
			t320 = document.createTextNode('text 320');
			root.appendChild(e0);
			root.appendChild(t1);
			root.appendChild(e2);
			root.appendChild(e3);
			root.appendChild(t4);
			e0.appendChild(e00);
			e0.appendChild(e01);
			e2.appendChild(e20);
			e3.appendChild(e30);
			e3.appendChild(e31);
			e3.appendChild(e32);
			e3.appendChild(t33);
			e00.appendChild(t001);
			e20.appendChild(e200);
			e31.appendChild(e310);
			e32.appendChild(t320);
			// realistic settings. They might be excessive for testing purposes, but they are perfectly valid ones
			map.add(function(el){return el !== undefined && el.nodeType === Node.TEXT_NODE;}, PlainText);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TD';}, Cell);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TABLE';}, Table);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TR';}, Row);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'A';}, Link);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'LI';}, ListItem);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'OL';}, OList);
			map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'UL';}, UList);
			map.setDefaultTarget(Tag);
			window.FACTORY = {};
			window.FACTORY.factory = new Factory(map);
		});
		describe('Reproduces the number of elements in the "content" property', function(){
			it('returns 1-element content if the input contains only TEXT_NODE', function(){
				console.log('Loading');
				c.load([t1]);
				expect(c.getElements().length).toBe(1);
			});

			it('returns 1-element content if the input contains only ELEMENT_NODE', function(){
				c.load([e32]);
				expect(c.getElements().length).toBe(1);
			});

			it('returns 3-element content if the input has one TEXT_NODE and two ELEMENT_NODEs', function(){
				c.load([e0, e3, t4]);
				expect(c.getElements().length).toBe(3);
			});


			it('creates correct Tag instance from a div element with no children', function(){
				c.load([e200]);
				expect(c.getElem(0) instanceof Tag).toBe(true);
				expect(c.getElem(0).getTag()).toBe('div');
				expect(c.getElem(0).getContent().length()).toBe(0);
			});
		});

		describe('Produces structure of the nested elements', function(){
			it('generates one element in the "content" if element node has an element node as a child', function(){
				c.load([e2]);
				expect(c.getElements().length).toBe(1);
				expect(c.getElem(0).getContent().getElements().length).toBe(1);
			});

			it('generates one element if element node has a text node as a child', function(){
				c.load([e32]);
				expect(c.getElements().length).toBe(1);
				expect(c.getElem(0).getContent().getElements().length).toBe(1);
			});

			it('generates two elements if element node has two element nodes as children', function(){
				c.load([e0]);
				expect(c.getElements().length).toBe(1);
				expect(c.getElem(0).getContent().getElements().length).toBe(2);
			});
			it('generates four elements if element node has three element nodes and one text node as children', function(){
				c.load([e3]);
				expect(c.getElements().length).toBe(1);
				expect(c.getElem(0).getContent().getElements().length).toBe(4);
			});
		});

		describe('Produces instances of required types', function(){
			it('creates ListItem instance if ListItem is among available classes', function(){
				c.load([e0]);
				expect(c.getElem(0) instanceof ListItem).toBe(true);
				expect(c.getElem(0).getTag()).toBe('li');
			});
			it('creates Text instance if Text is among available classes', function(){
				c.load([t4]);
				expect(c.getElem(0) instanceof PlainText).toBe(true);
				expect(c.getElem(0).getTag()).toBe('text');
			});
			it('creates default Tag instance if there is no element-specific classe among available ones', function(){
				c.load([e3]);
				expect(c.getElem(0) instanceof Tag).toBe(true);
				expect(c.getElem(0).getTag()).toBe('span');
			});
		});

		describe('Nested elements have correct types', function(){
			it('a list item has "div" and "a" children', function(){
				c.load([e0]);
				expect(c.getElem(0) instanceof ListItem).toBe(true);
				expect(c.getElem(0).getElem(0) instanceof Tag).toBe(true);
				expect(c.getElem(0).getElem(1) instanceof Link).toBe(true);
			} );
		});
	});

	describe('Content::stickTo(): appends children to the argument', function(){
		var el, c1, c2, c3;
		it('does not change the argument if it has no "appendChild()" method', function(){
			el = {'foo': 1};
			c.stickTo(el);
			expect(Object.keys(el).length).toBe(1);
			expect(el.foo).toBe(1);
		});
		it('appends children if they have "toNode()" method and the argument has appendChild()" method', function(){
			el = {'appendChild': function(){return null;}};
			spyOn(el, 'appendChild');
		    c1 = {'toNode': function(){return null;}};
		    c2 = {'toNode': function(){return null;}};
		    c3 = {'toNode': function(){return null;}};
		    c.setElements([c1, c2, c3]);
		    spyOn(c1, 'toNode').andCallFake(function(){return 'c1 node';});
		    spyOn(c2, 'toNode').andCallFake(function(){return 'c2 node';});
		    spyOn(c3, 'toNode').andCallFake(function(){return 'c3 node';});
		    c.stickTo(el);
		    expect(c1.toNode).toHaveBeenCalled();
		    expect(c2.toNode).toHaveBeenCalled();
		    expect(c3.toNode).toHaveBeenCalled();
		    expect(el.appendChild).toHaveBeenCalledWith('c1 node');
		    expect(el.appendChild).toHaveBeenCalledWith('c2 node');
		    expect(el.appendChild).toHaveBeenCalledWith('c3 node');
		});

		it('appends children if they have "toNode()" method and the argument has appendChild()" method', function(){
			el = {'appendChild': function(){return null;}};
			spyOn(el, 'appendChild');
		    c1 = {'toNode': function(){return null;}};
		    c2 = {'no-toNode-method': function(){return null;}};
		    c3 = {'toNode': function(){return null;}};
		    c.setElements([c1, c2, c3]);
		    spyOn(c1, 'toNode').andCallFake(function(){return 'c1 node';});
		    // spyOn(c2, 'toNode').andCallFake(function(){return 'c2 node';});
		    spyOn(c3, 'toNode').andCallFake(function(){return 'c3 node';});
		    c.stickTo(el);
		    expect(c1.toNode).toHaveBeenCalled();
		    // expect(c2.toNode).toHaveBeenCalled();
		    expect(c3.toNode).toHaveBeenCalled();
		    expect(el.appendChild).toHaveBeenCalledWith('c1 node');
		    expect(el.appendChild).not.toHaveBeenCalledWith('c2 node');
		    expect(el.appendChild).toHaveBeenCalledWith('c3 node');
		});
	});


	describe('Content::clone(): clone content', function(){
		it('gets an instance of content class', function(){
			expect(c.clone() instanceof Content).toBe(true);
		});
		it('calls "clone" methods on the object-values elements', function(){
			var c1, c2;
			c1 = {clone: function(){return null;}};
			c2 = {clone: function(){return null;}};
			spyOn(c1, 'clone');
			spyOn(c2, 'clone');
			c.setElements([c1, c2]);
			c.clone();
			expect(c1.clone).toHaveBeenCalled();
			expect(c2.clone).toHaveBeenCalled();
		});
		it('inserts output of "clone" methods into the cloned object', function(){
			var c1, c2;
			c1 = {clone: function(){return null;}};
			c2 = {clone: function(){return null;}};
			spyOn(c1, 'clone').andCallFake(function(){return 'clone of c1';});
			spyOn(c2, 'clone').andCallFake(function(){return 'clone of c2';});
			c.setElements([c2, c1]);
			var clone = c.clone();
			expect(clone.getElem(0)).toBe('clone of c2');
			expect(clone.getElem(1)).toBe('clone of c1');
		});

		it('inserts number-valued elements into the cloned object', function(){
			c.setElements([23, 3.98]);
			var clone = c.clone();
			expect(clone.getElem(0)).toBe(23);
			expect(clone.getElem(1)).toBe(3.98);
		});

		it('inserts string-valued elements into the cloned object', function(){
			c.setElements(['str', 'ciao']);
			var clone = c.clone();
			expect(clone.getElem(0)).toBe('str');
			expect(clone.getElem(1)).toBe('ciao');
		});

		it('does not insert object with no "clone" method', function(){
			var c1 = {'no-clone-method': true},
				c2Clone = {},
				c2 = {clone: function(){return c2Clone;}};
			c.setElements([c1, c2]);

			var clone = c.clone();
			expect(clone.getElements().indexOf(c1)).toBe(-1);
			expect(clone.getElements().indexOf(c2Clone) !== -1).toBe(true);
		});
	});

});
