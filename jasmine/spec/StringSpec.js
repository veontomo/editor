/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Content*/
xdescribe('Method that converts strings into objects', function(){
	it('if the string does not contain html tags inside, a Content instance is created', function(){
		var obj1 = ''.inflate(),
			obj2 = 'string without tags'.inflate();
		expect(obj1 instanceof Content).toBe(true);
		expect(obj1.length()).toBe(1);
		expect(obj2 instanceof Content).toBe(true);
		expect(obj2.length()).toBe(1);
	});
});