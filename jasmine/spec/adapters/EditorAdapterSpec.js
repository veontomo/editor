/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach*/

describe('Editor adapter', function(){
	var adapter = new EditorAdapter();
	describe('has a method "toNativeRanges" that', function(){
		it('returns an empty array if no argument is given', function(){
			var result = adapter.toNativeRanges();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
		});
		it('returns an empty array if the input is an empty array', function(){
			var result = adapter.toNativeRanges([]);
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
		});

		it('returns an array with "toNativeRange" method being applied on each element of the input array', function(){
			spyOn(adapter, 'toNativeRange').and.callFake(function(r){return r + '_';});
			var result = adapter.toNativeRanges(['r1', 'r2', 'r3']);
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r1');
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r2');
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r3');
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(3);
			expect(result[0]).toBe('r1_');
			expect(result[1]).toBe('r2_');
			expect(result[2]).toBe('r3_');
		});

		it('returns an array with "toNativeRange" method being applied on the input parameter', function(){
			var foo = {};
			spyOn(adapter, 'toNativeRange').and.callFake(function(r){return foo;});
			var result = adapter.toNativeRanges('anything');
			expect(adapter.toNativeRange).toHaveBeenCalledWith('anything');
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);
			expect(result[0]).toBe(foo);
		});

	});
});

