/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, PlainText, Factory, Link, TextChild, window */

describe('PlainText-related functionality', function(){
	var text;
	beforeEach(function(){
		text = new PlainText();
	});

	describe('PlainText: basic functionality', function(){
		it('adds keyword "new" if it is missing when an object is created', function(){
		    text = PlainText();
		    expect(text instanceof PlainText).toBe(true);
		});
	});

	describe('PlainText::className: class name', function(){
	    it('gives the name of the class', function(){
	        expect(text.getName()).toBe('PlainText');
	    });
	});

	describe('PlainText:getContent loads from the argument', function(){
		it('imposes the content property if the argument is a string', function(){
			text = new PlainText('a string');
			expect(text.getContent()).toBe('a string');
		});
		it('imposes the content property if the argument is a number', function(){
			text = new PlainText(23.9);
			expect(text.getContent()).toBe('23.9');
		});
		it('does not impose the content property if the argument is an object', function(){
			text = new PlainText({});
			expect(text.getContent()).toBe('');
		});
		it('does not impose the content property if the argument is an array', function(){
			text = new PlainText([]);
			expect(text.getContent()).toBe('');
		});
	});

	describe('PlainText:setContent(): sets the content', function(){
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

	describe('PlainText:toHtml(): returns the value of the content property', function(){
 		it('calls getContent() method', function(){
 			spyOn(text, 'getContent').and.returnValue('text string');
 			text.toHtml();
 			expect(text.getContent).toHaveBeenCalled();
 		});
 		it('returns the output of getContent() method, if it is an empty string', function(){
 			spyOn(text, 'getContent').and.returnValue('');
 			expect(text.toHtml()).toBe('');

 		});

 		it('returns the output of getContent() method, if it is a string', function(){
 			spyOn(text, 'getContent').and.returnValue('text string');
 			expect(text.toHtml()).toBe('text string');

 		});
		it('transforms getContent() output in string, if it is a number', function(){
 			spyOn(text, 'getContent').and.returnValue(329);
 			expect(text.toHtml()).toBe('329');
 		});
	});

	describe('PlainText::load(): loads content from the argument', function(){
		it('return false if the argument is missing', function(){
			expect(text.loadFromElement()).toBe(false);
		});

		it('return false if the argument is a number, an array, a function, an object of non-DOM.Text type', function(){
			var invalids = [0, -1, 3.52, [], [0, 1], [''], ['string', 1], {}, {'prop': 1}];
			invalids.forEach(function(invalid){
				expect(text.loadFromElement(invalid)).toBe(false);
			});
		});

		it('return true if the argument is an empty string', function(){
			expect(text.loadFromElement('')).toBe(true);
		});

		it('return true if the argument is a non-empty string', function(){
			expect(text.loadFromElement('non empty')).toBe(true);
		});

		it('return true if the argument is a DOM.Text', function(){
			var el = document.createTextNode('a text node');
			expect(text.loadFromElement(el)).toBe(true);
		});

		it('calls setContent method if the argument is a string', function(){
			spyOn(text, 'setContent');
			text.loadFromElement('a string');
			expect(text.setContent).toHaveBeenCalledWith('a string');
		});

		it('calls setContent method if the argument is a DOM.Text', function(){
			var el = document.createTextNode('a text node');
			spyOn(text, 'setContent');
			text.loadFromElement(el);
			expect(text.setContent).toHaveBeenCalledWith('a text node');
		});

		it('does not call setContent() if the argument is a number, an array, a function, an object of non-DOM.Text type', function(){
			var invalids = [0, -1, 3.52, [], [0, 1], [''], ['string', 1], {}, {'prop': 1}];
			spyOn(text, 'setContent');
			invalids.forEach(function(invalid){
				text.loadFromElement(invalid);
			});
			expect(text.setContent).not.toHaveBeenCalled();
		});
	});

	describe('PlainText::isEmpty(): whether the text tag is empty', function(){
		it('gives true, if "getContent" returns an empty string', function(){
			spyOn(text, 'getContent').and.returnValue('');
			expect(text.isEmpty()).toBe(true);
		});
		it('gives true, if "getContent" returns null', function(){
			spyOn(text, 'getContent').and.returnValue(null);
			expect(text.isEmpty()).toBe(true);
		});
		it('gives true, if "getContent" result is undefined', function(){
			spyOn(text, 'getContent').and.returnValue();
			expect(text.isEmpty()).toBe(true);
		});
		it('gives false, if "getContent" returns a space " "', function(){
			spyOn(text, 'getContent').and.returnValue(' ');
			expect(text.isEmpty()).toBe(false);
		});
		it('gives false, if "getContent" returns "a string"', function(){
			spyOn(text, 'getContent').and.returnValue('a string');
			expect(text.isEmpty()).toBe(false);
		});
	});

	describe('PlainText::toNode(): returns DOM.Text object', function(){
		it('returns empty text node if the target class has empty content', function(){
			spyOn(text, 'getContent').and.returnValue('');
			var el = text.toNode();
			expect(el.textContent).toBe('');
			expect(text.getContent).toHaveBeenCalled();
		});

		it('returns empty text node if the target class has non-empty content', function(){
			spyOn(text, 'getContent').and.returnValue('text node content');
			var el = text.toNode();
			expect(el.textContent).toBe('text node content');
			expect(text.getContent).toHaveBeenCalled();
		});

	});

	describe('PlainText::clone(): generates a clone of the instance', function(){
	    it('creates an instance of PlainText class if className is set to PlainText', function(){
	        expect(text.clone() instanceof PlainText).toBe(true);
	    });
	    it('creates an instance of PlainText class if className is set to non-existent class', function(){
	    	this.className = 'I do not exist';
	        expect(text.clone() instanceof PlainText).toBe(true);
	    });

	    it('creates an instance of a class that inherits from Tag and has "className" property', function(){
	        window.TextChild = function(){
	            PlainText.call(this);
	            this.className = 'TextChild';
	        };
	        TextChild.prototype = Object.create(PlainText.prototype);
	        var textChild = new TextChild();
	        expect(textChild.clone() instanceof TextChild).toBe(true);
	    });

	    it('creates an instance of a class that inherits from Tag and has improper "className" property', function(){
	        window.TextChild = function(){
	            PlainText.call(this);
	            this.className = 'TextChildThatDoesNotExist';
	        };
	        TextChild.prototype = Object.create(PlainText.prototype);
	        var textChild = new TextChild();
	        expect(textChild.clone() instanceof PlainText).toBe(true);
	        expect(textChild.clone() instanceof TextChild).toBe(false);
	    });

	    it('copies attribute values of the target', function(){
	        text.prop1 = 'property 1';
	        text.prop2 = 2;
	        var clone = text.clone();
	        expect(clone.prop1).toBe('property 1');
	        expect(clone.prop2).toBe(2);
	    });
	    it('does not change target string-valued attribute if its counterpart is changed in the clone', function(){
	        text.level = 'sea level';
	        var clone = text.clone();
	        clone.level = '100 m';
	        expect(clone.level).toBe('100 m');
	        expect(text.level).toBe('sea level');
	    });

	    it('does not change string-valued attribute in the clone if its counterpart is changed in the target', function(){
	        text.module = 'book';
	        var clone = text.clone();
	        text.module = 'article';
	        expect(clone.module).toBe('book');
	        expect(text.module).toBe('article');
	    });

	    it('copies methods of the target', function(){
	        text.m1 = function(){return 'this is method 1';};
	        text.m2 = function(){return 'this is method 2';};
	        var clone = text.clone();
	        expect(clone.m1()).toBe('this is method 1');
	        expect(clone.m2()).toBe('this is method 2');
	    });
	    it('does not change method of the target if its clone counterpart is changed', function(){
	        text.m1 = function(){return 'this is method 1';};
	        var clone = text.clone();
	        clone.m1 = function(){return 'modified method';};
	        expect(clone.m1()).toBe('modified method');
	        expect(text.m1()).toBe('this is method 1');
	    });
	    it('does not change method of the clone if its counterpart in the target is changed', function(){
	        text.m1 = function(){return 'this is method 1';};
	        var clone = text.clone();
	        text.m1 = function(){return 'modified method';};
	        expect(text.m1()).toBe('modified method');
	        expect(clone.m1()).toBe('this is method 1');
	    });
	    it('calls "clone" method if an attribute has that method', function(){
	        text.m1 = {clone: function(){return null;}};
	        spyOn(text.m1, 'clone');
	        text.clone();
	        expect(text.m1.clone).toHaveBeenCalled();
	    });
	    it('assignes value of "clone" method if an attribute has that method', function(){
	        text.m1 = {clone: function(){return null;}};
	        spyOn(text.m1, 'clone').and.returnValue('clone of m1');
	        var clone = text.clone();
	        expect(clone.m1).toBe('clone of m1');
	    });

	    it('uses "getCore" to clone the content', function(){
	        spyOn(text, 'getContent');
	        text.clone();
	        expect(text.getContent).toHaveBeenCalled();
	    });

	    it('fills the core with "getCore" of the target', function(){
	        spyOn(text, 'getContent').and.returnValue('content of the text node');
	        var clone = text.clone();
	        expect(clone.getContent()).toBe('content of the text node');
	    });
	});

	describe('has method characteristicFunction that', function(){
		it('is defined in the prototype', function(){
			expect(typeof PlainText.prototype.characteristicFunction).toBe('function');
		});
		it('returns true if the argument is an empty text node', function(){
			var t = document.createTextNode('');
			expect(PlainText.prototype.characteristicFunction(t)).toBe(true);
		});
		it('returns true if the argument is a non empty text node', function(){
			var t = document.createTextNode('I am not empty');
			expect(PlainText.prototype.characteristicFunction(t)).toBe(true);
		});
		it('returns false if the argument is a div node', function(){
			var d = document.createElement('div');
			expect(PlainText.prototype.characteristicFunction(d)).toBe(false);
		});
		it('returns false if the argument is a div node', function(){
			var d = document.createElement('div');
			expect(PlainText.prototype.characteristicFunction(d)).toBe(false);
		});
		it('returns false if the argument is missing', function(){
			expect(PlainText.prototype.characteristicFunction()).toBe(false);
		});
		it('returns false if the argument is a json object', function(){
			expect(PlainText.prototype.characteristicFunction({'a': 2, 'b': 1})).toBe(false);
		});
		it('returns false if the argument is an array', function(){
			expect(PlainText.prototype.characteristicFunction([1, 3, 'a'])).toBe(false);
		});
	});

});
