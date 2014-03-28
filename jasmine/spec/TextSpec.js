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

});
