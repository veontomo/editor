/*jslint plusplus: true, white: true */
/*global describe, it, expect, spyOn, beforeEach, Selection */

describe('Selection-related functionality', function(){
  var sel;
  describe('Selection::constructor()', function(){
    it('creates selection instance object if keyword "new" is missing', function(){
      var ed = new CKEDITOR.editor();
      expect(Selection(ed, 'any') instanceof Selection).toBe(true);
    });
    xit('instantiates "editor" property', function(){
      sel = new Selection('editor', 'anything');
      expect(sel.editor).toBe('editor');
      console.log(sel.prototype.name);
    });
   xit('instantiates "editor" property', function(){
      sel = new Selection('anything', 'selection');
      expect(sel.selection).toBe('selection');
    });

  });
});


