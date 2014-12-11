/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach*/

describe('Editor adapter', function(){
	var adapter = new EditorAdapter();

	describe('has a method "getNativeRanges" that', function(){
		it('returns null if method getEditorRanges returns null', function(){
			spyOn(adapter, 'getEditorRanges').and.returnValue(null);
			var result = adapter.getNativeRanges();
			expect(result).not.toBeDefined();
		});
		it('returns an empty array if the editor ranges is an empty array', function(){
			spyOn(adapter, 'getEditorRanges').and.returnValue([]);
			var result = adapter.getNativeRanges();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(0);
		});

		it('returns an array with "toNativeRange" method being applied on each element of "getEditorRanges" output', function(){
			spyOn(adapter, 'toNativeRange').and.callFake(function(r){return r + '_';});
			spyOn(adapter, 'getEditorRanges').and.returnValue(['r1', 'r2', 'r3']);
			var result = adapter.getNativeRanges();
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
			spyOn(adapter, 'getEditorRanges').and.returnValue(['anything']);
			spyOn(adapter, 'toNativeRange').and.callFake(function(r){return foo;});
			var result = adapter.getNativeRanges();
			expect(adapter.toNativeRange).toHaveBeenCalledWith('anything');
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);
			expect(result[0]).toBe(foo);
		});

	});
});

