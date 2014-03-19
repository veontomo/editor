/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Selection */

describe('Selection-related functionality', function(){
  describe('Selection::constructor()', function(){
    it('creates selection instance object if keyword "new" is missing', function(){
      var sel = Selection();
      expect(sel instanceof Selection).toBe(true);
    });
  });
});


