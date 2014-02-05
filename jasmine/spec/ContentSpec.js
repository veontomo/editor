/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Cell, Content, TableCellStyle, Attributes, Style, jasmine, appendStyleToCell */

describe('Content-related functionality', function(){
	var c;
	beforeEach(function(){
		c = new Content();
	});

	describe('The number of elements:', function(){
		it('gives 0 for the empty Content instance', function(){
			expect(c.length()).toBe(0);
		});

		it('gives 1 for a unique element of different types inside Content', function(){
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

	describe('Gets the element:', function(){
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

	describe('Inserts the element', function(){
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

	describe('drops element at given position', function(){
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


});