/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Content, Table*/
describe('Method that converts strings into objects', function(){
	it('inserts the target string into "elements" property, if there is no tag inside the string', function(){
		var obj1 = ''.inflate(),
			obj2 = 'string without tags'.inflate();
		expect(obj1 instanceof Content).toBe(true);
		expect(obj1.length()).toBe(0);
		expect(obj2 instanceof Content).toBe(true);
		expect(obj2.length()).toBe(1);
	});

	it('gets the correct number of the elements inside the string', function(){
		var obj = 'text<p>inside the paragraph</p>text again'.inflate();
		expect(obj.length()).toBe(3);
		obj = '<div>inside the<div>nested div inside div</div> paragraph</div><div>another div</div><span>span text</span>'.inflate();
		expect(obj.length()).toBe(3);
		expect(obj.getElem(0).length()).toBe(3);
		expect(obj.getElem(1).length()).toBe(1);
		expect(obj.getElem(2).length()).toBe(1);
	});

	it('gets the correct type of the nested elements', function(){
		var str = 'text<div><table><tr><td></td></td></table></div>',
			obj = str.inflate();
		expect(obj instanceof Content).toBe(true);
		expect(obj.length()).toBe(2);
		expect(obj.getElem(0)).toBe('text');
		expect(obj.getElem(1) instanceof Content).toBe(true);
		expect(obj.getElem(1).length()).toBe(1);
		expect(obj.getElem(1).getElem(0) instanceof Table).toBe(true);
	});





});