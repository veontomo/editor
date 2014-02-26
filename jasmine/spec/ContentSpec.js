/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell, Tag, Row */

describe('Content-related functionality', function(){
	var c;
	beforeEach(function(){
		c = new Content();
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
		});
		it('the very last element', function(){
			var obj = {'key': 4};
			c.elements = ['first elem', 'second'];
			expect(c.getElem(1)).toBe('second');
			c.elements = [453.29, 'a', 125, 'again', obj, '2'];
			expect(c.getElem(5)).toBe('2');
		});
		it('a middle element', function(){
			var obj = {'key': 4};
			c.elements = [453.29, 'a', 125, 'again', obj, '2'];
			expect(c.getElem(1)).toBe('a');
			expect(c.getElem(2)).toBe(125);
			expect(c.getElem(3)).toBe('again');
			expect(c.getElem(4)).toBe(obj);
			expect(c.getElem(5)).toBe('2');
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


});
