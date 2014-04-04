/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Text */

describe('Text-related functionality', function(){
	var text;
	beforeEach(function(){
		text = new Text();
	});

	describe('Text: basic functionality', function(){
		it('adds keyword "new" if it is missing when an object is created', function(){
		    text = Text();
		    expect(text instanceof Text).toBe(true);
		});
	});

	describe('Text:getContent loads from the argument', function(){
		it('imposes the content property if the argument is a string', function(){
			text = new Text('a string');
			expect(text.getContent()).toBe('a string');
		});
		it('imposes the content property if the argument is a number', function(){
			text = new Text(23.9);
			expect(text.getContent()).toBe('23.9');
		});
		it('does not impose the content property if the argument is an object', function(){
			text = new Text({});
			expect(text.getContent()).toBe('');
		});
		it('does not impose the content property if the argument is an array', function(){
			text = new Text([]);
			expect(text.getContent()).toBe('');
		});
	});

	describe('Text:setContent(): sets the content', function(){
		it('imposes the content property if the argument is a string', function(){
			text.setContent('a string inside content');
			expect(text.getContent()).toBe('a string inside content');
		});
		it('imposes the content property if the argument is a number', function(){
			text.setContent(-33.9);
			expect(text.getContent()).toBe('-33.9');
		});
		it('does not impose the content property if the argument is an object', function(){
			text.setContent({'foo': 2});
			expect(text.getContent()).toBe('');
		});
		it('does not impose the content property if the argument is an array', function(){
			text.setContent([2, 4, '']);
			expect(text.getContent()).toBe('');
		});
	});


	describe('Text:toHtml(): returns the value of the content property', function(){
 		it('calls getContent() method', function(){
 			spyOn(text, 'getContent').andCallFake(function(){return 'text string';});
 			expect(text.toHtml()).toBe('text string');
 			expect(text.getContent).toHaveBeenCalled();
 		});
	});

	describe('Text::load(): loads content from the argument', function(){
		it('return false if the argument is missing', function(){
			expect(text.load()).toBe(false);
		});

		it('return false if the argument is a number, an array, a function, an object of non-DOM.Text type', function(){
			var invalids = [0, -1, 3.52, [], [0, 1], [''], ['string', 1], {}, {'prop': 1}];
			invalids.forEach(function(invalid){
				expect(text.load(invalid)).toBe(false);
			});
		});

		it('return true if the argument is an empty string', function(){
			expect(text.load('')).toBe(true);
		});

		it('return true if the argument is a non-empty string', function(){
			expect(text.load('non empty')).toBe(true);
		});

		it('return true if the argument is a DOM.Text', function(){
			var el = document.createTextNode('a text node');
			expect(text.load(el)).toBe(true);
		});

		it('calls setContent method if the argument is a string', function(){
			spyOn(text, 'setContent');
			text.load('a string');
			expect(text.setContent).toHaveBeenCalledWith('a string');
		});

		it('calls setContent method if the argument is a DOM.Text', function(){
			var el = document.createTextNode('a text node');
			spyOn(text, 'setContent');
			text.load(el);
			expect(text.setContent).toHaveBeenCalledWith('a text node');
		});

		it('does not call setContent() if the argument is a number, an array, a function, an object of non-DOM.Text type', function(){
			var invalids = [0, -1, 3.52, [], [0, 1], [''], ['string', 1], {}, {'prop': 1}];
			spyOn(text, 'setContent');
			invalids.forEach(function(invalid){
				text.load(invalid);
			});
			expect(text.setContent).not.toHaveBeenCalled();
		});

	});

	describe('Transfroms Text into a link', function(){
		var link;
		beforeEach(function(){
			link = new Link();
			link.setHref('www.pizzastasera.it');
			text.setContent('text content');
		});
		it('throws an error if the argument is a string, a number, an array, function or empty object', function(){
			var invalids = ['', 'string', 0, -34.21, [], [1, 'str', {}], {}];
			invalids.forEach(function(invalid){
				expect(function(){
					text.toLink(invalid);
				}).toThrow('The argument must be a Link instance!');
			});
		});
		it('throws an error if the argument is missing', function(){
			expect(function(){
				text.toLink();
			}).toThrow('The argument must be a Link instance!');
		});
		it('returns a Link instance if the argument is a Link', function(){
			expect(text.toLink(link) instanceof Link).toBe(true);
		});
		it('returns a link with url equal to that of the argument', function(){
			var link2 = text.toLink(link);
			expect(link2.getHref()).toBe('www.pizzastasera.it');
		});
		it('returns a link which content is a unique element of Text instance', function(){
			var link2 = text.toLink(link);
			expect(link2.content.elements.length).toBe(1);
			expect(link2.content.elements[0] instanceof Text).toBe(true);
		});
		it('returns a link which content is equal to the content of target object', function(){
			var link2 = text.toLink(link);
			expect(link2.content.elements[0].getContent()).toBe('text content');
		});


	});

});
