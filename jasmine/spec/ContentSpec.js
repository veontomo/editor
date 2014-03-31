/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, jasmine, Content, Link, window */

describe('Content-related functionality', function(){
	var c;
	beforeEach(function(){
		c = new Content();
	});

	describe('Content::className: class name', function(){
	    it('gives the name of the class', function(){
	        expect(c.className).toBe('Content');
	    });
	});


	describe('Content::length(): The number of elements:', function(){
		it('gives 0 for the empty Content instance', function(){
			expect(c.length()).toBe(0);
		});

		it('gives 1 for a unique element inside Content', function(){
			c.elements = [0]; // integer inside
			expect(c.length()).toBe(1);

			c.elements = [{}]; // object inside
			expect(c.length()).toBe(1);

			c.elements = ['a string']; // a string insdie
			expect(c.length()).toBe(1);

			c.elements = [['a', 'b', 21.6]]; // an array inside
			expect(c.length()).toBe(1);

			c.elements = [function(){return null;}]; // a function inside
			expect(c.length()).toBe(1);
		});

		it('gives 2 for a unique element of different types inside Content', function(){
			c.elements = [0, ['a']];
			expect(c.length()).toBe(2);

			c.elements = [{'a': 1, 'b':'value', 'c': true}, 'sun'];
			expect(c.length()).toBe(2);

			c.elements = ['a string', 'another'];
			expect(c.length()).toBe(2);

			c.elements = [[], function(){return null;}]; // a function inside
			expect(c.length()).toBe(2);
		});
	});

	describe('Content::getElem(): gets the element:', function(){
		it('the very first element', function(){
			var obj = {'a': 'b'};
			c.elements = ['first elem'];
			expect(c.getElem(0)).toBe('first elem');
			c.elements = [453.29];
			expect(c.getElem(0)).toBe(453.29);
			c.elements = [obj];
			expect(c.getElem(0)).toBe(obj);
			c.elements = ['a', 2, ['array']];
			expect(c.getElem(0)).toBe('a');

			c.elements = [''];
			expect(c.getElem(0)).toBe('');

		});
		it('the very last element', function(){
			var obj = {'key': 4};
			c.elements = ['first elem', 'second'];
			expect(c.getElem(1)).toBe('second');
			c.elements = [453.29, 'a', 125, 'again', obj, '2'];
			expect(c.getElem(5)).toBe('2');
			c.elements = ['again', ''];
			expect(c.getElem(1)).toBe('');
		});
		it('a middle element', function(){
			var obj = {'key': 4};
			c.elements = [453.29, 'a', 125, '', 'again', obj, '2'];
			expect(c.getElem(1)).toBe('a');
			expect(c.getElem(2)).toBe(125);
			expect(c.getElem(3)).toBe('');
			expect(c.getElem(4)).toBe('again');
			expect(c.getElem(5)).toBe(obj);
			expect(c.getElem(6)).toBe('2');
		});


		it('returns null if element does not exist', function(){
			c.elements = [];
			expect(c.getElem(0)).toBe(null);
			expect(c.getElem(4)).toBe(null);

			c.elements = [453.29, 'a', 125, 'again', {'key': 4}, '2'];
			expect(c.getElem(10)).toBe(null);
			expect(c.getElem(12)).toBe(null);
		});

		it('refers to the getElem when calling getFirst', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.elements = [];
			c.getFirst();
			expect(c.getElem).toHaveBeenCalledWith(0);

			c.elements = ['string', 2344, '33'];
			c.getFirst();
			expect(c.getElem).toHaveBeenCalledWith(0);

		});

		it('returns null when calling getLast on empty array', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.elements = [];
			var last = c.getLast();
			expect(c.getElem).not.toHaveBeenCalled();
			expect(last).toBe(null);
		});


		it('refers the getElem when calling getLast', function(){
			spyOn(c, 'getElem').andCallFake(function(){return null;});
			c.elements = ['string', 2344, '33'];
			c.getLast();
			expect(c.getElem).toHaveBeenCalledWith(2);
		});
	});

	describe('Content::isEmpty(): is the content empty', function(){
		it('returns true if content.elements is empty', function(){
			expect(c.isEmpty()).toBe(true);
		});
		it('returns true if content.elements contains empty string', function(){
			c.elements = [''];
			expect(c.isEmpty()).toBe(true);
		});
		it('returns true if content.elements contains html non-breaking space', function(){
			c.elements = ['&nbsp;'];
			expect(c.isEmpty()).toBe(true);
		});

		it('returns true if content.elements contains two empty strings', function(){
			c.elements = ['', ''];
			expect(c.isEmpty()).toBe(true);
		});
		it('returns false if content.elements contains a non-empty string', function(){
			c.elements = ['non empty'];
			expect(c.isEmpty()).toBe(false);
		});

		it('returns true if content.elements contains empty object', function(){
			c.elements = [{}];
			expect(c.isEmpty()).toBe(true);
		});
		it('returns false if content.elements contains an object with properties', function(){
			c.elements = [{1: 'first', 2: 'second'}];
			expect(c.isEmpty()).toBe(false);
		});
		it('returns false if content.elements contains an object that has isEmpty method that returns false', function(){
			var obj = {1: 'property 1', isEmpty: function(){return null;}, 'descr': 'nice'};
			spyOn(obj, 'isEmpty').andCallFake(function(){return false;});
			c.elements = [obj];
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

			c.elements = [obj1, obj2, obj3];
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
			c.elements = [1, 'str', 2, 3];
			c.insertElemAt(0, obj);
			expect(c.length()).toBe(5);
			expect(c.getElem(0)).toBe(obj);
			expect(c.getElem(1)).toBe(1);
			expect(c.getElem(2)).toBe('str');
			expect(c.getElem(3)).toBe(2);
			expect(c.getElem(4)).toBe(3);
		});

		it('inserts a string in the middle', function(){
			c.elements = [1, 'str', 2, 3];
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
			c.elements = [];
			c.appendElem('anything');
			expect(c.elements.length).toBe(1);
			expect(c.elements[0]).toBe('anything');
		});

		it('appends element to exisiting elements', function(){
			var obj1 = {'key': true},
				obj2 = {'col': 9292};
			c.elements = ['str', obj1, 23.56];
			c.appendElem(obj2);
			expect(c.elements.length).toBe(4);
			expect(c.elements[0]).toBe('str');
			expect(c.elements[1]).toBe(obj1);
			expect(c.elements[2]).toBe(23.56);
			expect(c.elements[3]).toBe(obj2);
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
			c.elements = ['first', 1, '49', 'last'];
			var elem = c.dropElemAt(0);
			expect(c.length()).toBe(3);
			expect(elem).toBe('first');
			expect(c.getElem(0)).toBe(1);
			expect(c.getElem(1)).toBe('49');
			expect(c.getElem(2)).toBe('last');
		});
		it('drops the last element', function(){
			c.elements = ['first', 1, '49', -29, 'last'];
			var elem = c.dropElemAt(4);
			expect(c.length()).toBe(4);
			expect(elem).toBe('last');
			expect(c.getElem(0)).toBe('first');
			expect(c.getElem(1)).toBe(1);
			expect(c.getElem(2)).toBe('49');
			expect(c.getElem(3)).toBe(-29);
		});

		it('drops a middle element', function(){
			c.elements = ['first', 1, '49', 233.2, 'last'];
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
			c.elements = [obj];
			c.trim();
			expect(c.elements.length).toBe(0);
		});
		it('does not remove element, if it is not empty', function(){
			var obj = {'isEmpty': function(){return false;}};
			c.elements = [obj];
			c.trim();
			expect(c.elements.length).toBe(1);
			expect(c.elements[0]).toBe(obj);
		});

		it('does not remove element, if it is empty, but comes first', function(){
			var obj = {'isEmpty': function(){return true;}};
			c.elements = [obj, "string"];
			c.trim();
			expect(c.elements.length).toBe(2);
			expect(c.elements[0]).toBe(obj);
			expect(c.elements[1]).toBe("string");
		});


		it('does not remove element, if it is empty, but comes in middle', function(){
			var obj = {'isEmpty': function(){return true;}};
			c.elements = [2, obj, "string"];
			c.trim();
			expect(c.elements.length).toBe(3);
			expect(c.elements[0]).toBe(2);
			expect(c.elements[1]).toBe(obj);
			expect(c.elements[2]).toBe("string");
		});

		it('removes two empty elements, if they are at the end', function(){
			var obj1 = {'isEmpty': function(){return true;}},
				obj2 = {'isEmpty': function(){return true;}};
			c.elements = [2, "string", obj1, obj2];
			c.trim();
			expect(c.elements.length).toBe(2);
			expect(c.elements[0]).toBe(2);
			expect(c.elements[1]).toBe("string");
		});

		it('removes nested empty element of the the first nested element', function(){
			var c2 = new Content(),
				obj1 = {'isEmpty': function(){return true;}},
				obj2 = {'isEmpty': function(){return true;}};
			c2.elements = ['c2: e1', 'c2: e2', obj2];
			c.elements = [c2, obj1];
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
			c2.elements = ['c2: e1', 'c2: e2', obj2];
			c.elements = [obj1, c2];
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
	        content.elements = [];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe('string');
	        expect(htmlContent).toEqual('');
	    });

	    it('Produces a string if content contains a number ', function() {
	        content.elements = [19.2];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toEqual('19.2');
	    });

	    it('Produces a string if content contains a string ', function() {
	        content.elements = ['content text'];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toEqual('content text');
	    });

	    it('Produces html comment if the content element is an Object without toHtml() method', function() {
	        content.elements = [elem];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('<!-- no html representation -->');
	    });

	    it('Produces html comment if the content element is an Object with toHtml() method', function() {
	    	elem = {foo: 1, toHtml: function(){return 'elem representation';}};
	        content.elements = [elem];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('elem representation');
	    });


	    it('Produces a string if content contains a number and a string', function() {
	        content.elements = [23.73, 'what a beautiful day'];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe('string');
	        expect(htmlContent).toEqual('23.73what a beautiful day');
	    });

	    it('Produces a string if one of the elements has no toHtml property', function() {
	        content.elements = ['.', elem, 'how are you?'];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('.<!-- no html representation -->how are you?');
	    });
	    it('Produces a string if all elements have html representation', function() {
	    	elem = {foo: [1,2,3], toHtml: function(){return 'elem str';}};
	        content.elements = ['waiting for the Sun', elem, 'how are you?'];
	        htmlContent = content.toHtml();
	        expect(typeof htmlContent).toBe("string");
	        expect(htmlContent).toBe('waiting for the Sunelem strhow are you?');
	    });
	});

	describe('Content::toText(): generates text representation of the content', function(){
        it('returns empty string for a tag without elements', function(){
            c.elements = [];
            expect(c.toText()).toBe('');
        });

        it('returns string if only this string is present in elements', function(){
            c.elements = ['dumb string'];
            expect(c.toText()).toBe('dumb string');
        });

	        it('returns "stringified" number if only that number is present in elements', function(){
            c.elements = [92];
            expect(c.toText()).toBe('92');
        });

        it('returns concatention of two strings ', function(){
            c.elements = ['dumb string', 'second input'];
            expect(c.toText()).toBe('dumb stringsecond input');
        });

        it('returns empty string if the only element is an object with no toText() method', function(){
        	var fake = {};
        	expect(fake.hasOwnProperty('toText')).toBe(false);
        	c.elements = [fake];
        	expect(c.toText()).toBe('');
        });


        it('calls toText() method of the unique object in the elements', function(){
        	var fake = {toText: function(){return null;}};
        	spyOn(fake, 'toText').andCallFake(function(){return 'fake text repr';});
        	c.elements = [fake];
        	expect(c.toText()).toBe('fake text repr');
        	expect(fake.toText).toHaveBeenCalled();
        });
        it('ignores the object if it has no toText() method', function(){
        	var fake1 = {toText: function(){return null;}},
        		fake2 = {},
        		fake3 = {toText: function(){return null;}};
        	spyOn(fake1, 'toText').andCallFake(function(){return 'fake1 msg';});
        	spyOn(fake3, 'toText').andCallFake(function(){return 'fake3 str';});
        	c.elements = [fake1, fake2, fake3];
        	expect(c.toText()).toBe('fake1 msgfake3 str');
        	expect(fake1.toText).toHaveBeenCalled();
        	expect(fake3.toText).toHaveBeenCalled();
        });
    });

	describe('Content::toLink(): transforms each element of the content into a link', function(){
		var c2, link;
		beforeEach(function(){
			link = new Link();
			link.setHref('test_url');
		});
		it('throws an error if the argument is a Tag, Table, Row, ListItem, List, Content or Cell instance', function(){
			var classNames =  ["Tag", "Table", "Row", "ListItem", "List", "Content", "Cell"];
			classNames.forEach(function(name){
				var obj = new window[name]();
				expect(function(){
					c.toLink(obj);
				}).toThrow('The argument must be a Link instance!');
			});
		});
		it('does not throws an error if the argument is a Link instance', function(){
			expect(function(){
				c.toLink(new Link());
			}).not.toThrow('The argument must be a Link instance!');
		});
		it('throws an error if the argument is a number, a string, an array or an object', function(){
			var instances = [1, 0.93, -5, '', 'ciao', [], [32, 0.12, -1], {}, {'foo': 1}];
			instances.forEach(function(el){
				expect(function(){
					c.toLink(el);
				}).toThrow('The argument must be a Link instance!');
			});
		});

		it('return a copy of the target if it has empty content', function(){
			expect(c.elements.length).toBe(0);
			c2 = c.toLink(link);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(0);
		});
		it('calls toLink method on each element if they respond to "toLink()" method', function(){
			var el0 = {'toLink': function(){return 'result of toLink';}};
			c.elements = [el0];
			c2 = c.toLink(link);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(1);
			expect(c2.elements[0]).toBe('result of toLink');
		});
		it('converts a string-type element into a link', function(){
			var el0 = 'string elem';
			c.elements = [el0];
			c2 = c.toLink(link);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(1);
			expect(c2.elements[0] instanceof Link).toBe(true);
			expect(c2.elements[0].name).toBe(link.name);
			expect(c2.elements[0].style).toBe(link.style);
			expect(c2.elements[0].attr).toBe(link.attr);
			expect(c2.elements[0].content.elements.length).toBe(1);
			expect(c2.elements[0].content.elements[0]).toBe(el0);
		});
		it('does not changed the element if it is an array', function(){
			c.elements = [[1, 2]];
			c2 = c.toLink(link);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(1);
			expect(c2.elements[0].length).toBe(2);
			expect(c2.elements[0][0]).toBe(1);
			expect(c2.elements[0][1]).toBe(2);
		});
		it('does not change the number of the elements', function(){
			c.elements = [1, "string", {}, []];
			c2 = c.toLink(link);
			expect(c.elements.length).toBe(4);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(4);
		});
		it('creates a new Content instance if the target has string and objects elements', function(){
			var fake = {'toLink': function(){return null;}};
			spyOn(fake, 'toLink').andCallFake(function(){return 'fake to link';});
			c.elements = ['start', fake, 'end'];
			c2 = c.toLink(link);
			expect(c2 instanceof Content).toBe(true);
			expect(c2.elements.length).toBe(3);
			expect(c2.elements[0] instanceof Link).toBe(true);
			expect(c2.elements[1]).toBe('fake to link');
			expect(c2.elements[2] instanceof Link).toBe(true);
		});
	});

	describe('Content::load(): loads the content' , function(){
		var root, e0, t1, e2, e3, t4, e00, e01, e20, e30, e31, e32, t001, e200, e310, t320;
		beforeEach(function(){
			root = document.createElement('div');        //                    root
			e0 = document.createElement('div');          //      ________________|_____________
			t1 = document.createTextNode('text 1');      //     |      |      |         |      |
			e2 = document.createElement('p');            //     e0     t1     e2        e3     t4
			e3 = document.createElement('span');         //   __|__           |     ____|_____
			t4 = document.createTextNode('text 4');      //  |     |          |    |    |     |
			e00 = document.createElement('div');         //  e00  e01        e20  e30  e31   e32
			e01 = document.createElement('b');           //  |                |         |     |
			e20 = document.createElement('i');           // t001             e200      e310  t320
			e30 = document.createElement('article');
			e31 = document.createElement('h1');
			e32 = document.createElement('div');
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
			e00.appendChild(t001);
			e20.appendChild(e200);
			e31.appendChild(e310);
			e32.appendChild(t320);
		});

		it('returns true of the argument is empty or if it is an empty array', function(){
			expect(c.load()).toBe(true);
		});

		it('returns true of the argument is an empty array', function(){
			expect(c.load([])).toBe(true);
		});

		it('returns 1-element content if the input contains only TEXT_NODE', function(){
			c.load([t1]);
			expect(c.elements.length).toBe(1);
		});

		it('returns 1-element content if the input contains only ELEMENT_NODE', function(){
			c.load([e32]);
			expect(c.elements.length).toBe(1);
		});

		it('returns 3-element content if the input has one TEXT_NODE and two ELEMENT_NODEs', function(){
			c.load([e20, e3, t4]);
			expect(c.elements.length).toBe(3);
		});

		it('creates correct Tag instance from a div element with no children', function(){
			c.load([e200]);
			expect(c.elements[0] instanceof Tag).toBe(true);
			expect(c.elements[0].name).toBe('div');
			expect(c.elements[0].content.length()).toBe(0);
		});


	});


});
