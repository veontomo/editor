/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, EditorAdapter*/

describe('Editor adapter', function(){
	var adapter = new EditorAdapter();
	describe('has a setter and getter for attribute "_className" such that', function(){
		it('the getter returns string "EditorAdapter"', function(){
			expect(adapter.getName()).toBe('EditorAdapter');
		});
		it('the getter returns a string previously imposed by the setter', function(){
			adapter.setName('new name');
			expect(adapter.getName()).toBe('new name');
		});
		it('the setter throws an error if its argument is not a string', function(){
			var invalids = [2, 6.1, -2, -4.11, [1, 2], [], {}, {'load': 10}, function(){return 1;}];
			invalids.forEach(function(invalid){
			    expect(function(){
			        return adapter.setName(invalid);
			    }).toThrow(new Error('The name must be a string!'));
			});
		});
	});
	describe('has abstract method "toNativeRange" that', function(){
		it('throws an error if called directly and not from an inheriting class', function(){
			expect(function(){
				adapter.toNativeRange();
			}).toThrow(new Error('Method "toNativeRange" of class EditorAdapter must be overridden by inheriting class!'));
		});
	});
	describe('has abstract method "getEditorRanges" that', function(){
		it('throws an error if called directly and not from an inheriting class', function(){
			expect(function(){
				adapter.getEditorRanges();
			}).toThrow(new Error('Method "getEditorRanges" of class EditorAdapter must be overridden by inheriting class!'));
		});
	});
	describe('has abstract method "getEditorContent" that', function(){
		it('throws an error if called directly and not from an inheriting class', function(){
			expect(function(){
				adapter.getEditorContent();
			}).toThrow(new Error('Method "getEditorContent" of class EditorAdapter must be overridden by inheriting class!'));
		});
	});


	describe('has a method "getNativeRanges" that', function(){
		it('returns null if method getEditorRanges throws an error', function(){
			spyOn(adapter, 'getEditorRanges').and.callFake(function(){throw new Error('an error');});
			var result = adapter.getNativeRanges();
			expect(result).toBe(null);
		});

		it('returns null if method getEditorRanges returns null', function(){
			spyOn(adapter, 'getEditorRanges').and.returnValue(null);
			var result = adapter.getNativeRanges();
			expect(result).toBe(null);
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

		it('returns an array with outputs of "toNativeRange" method except when it throws an exception', function(){
			spyOn(adapter, 'toNativeRange').and.callFake(function(r){
				if (r === 'r2'){
					throw new Error('error');
				}
				return r + '_';
			});
			spyOn(adapter, 'getEditorRanges').and.returnValue(['r1', 'r2', 'r3']);
			var result = adapter.getNativeRanges();
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r1');
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r2');
			expect(adapter.toNativeRange).toHaveBeenCalledWith('r3');
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
			expect(result[0]).toBe('r1_');
			expect(result[1]).toBe('r3_');
		});


		it('returns an array with "toNativeRange" method being applied on the input parameter', function(){
			var foo = {};
			spyOn(adapter, 'getEditorRanges').and.returnValue(['anything']);
			spyOn(adapter, 'toNativeRange').and.callFake(function(){return foo;});
			var result = adapter.getNativeRanges();
			expect(adapter.toNativeRange).toHaveBeenCalledWith('anything');
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);
			expect(result[0]).toBe(foo);
		});

	});

	describe('has a method insertAt that', function(){
		it('throws an error if called directly and not from an inheriting class', function(){
			expect(function(){
				adapter.insertAt();
			}).toThrow(new Error('Method "insertAt" of class EditorAdapter must be overridden by inheriting class!'));
		});
	});

	describe('has a method removeNode that', function(){
		it('throws an error if called directly and not from an inheriting class', function(){
			expect(function(){
				adapter.removeNode();
			}).toThrow(new Error('Method "removeNode" of class EditorAdapter must be overridden by inheriting class!'));
		});
	});

});

