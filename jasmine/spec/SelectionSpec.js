/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, CKEDITOR,Selection */

describe('Selection-related functionality', function(){
  var sel, ed;
  beforeEach(function(){
    ed = new CKEDITOR.editor();
    sel = new CKEDITOR.dom.selection(CKEDITOR.document);
  });
  describe('Selection::constructor()', function(){
    it('creates selection instance object if keyword "new" is missing', function(){
      expect(Selection(ed, sel) instanceof Selection).toBe(true);
    });
    it('throws an error if first argument is not a CKEDITOR.editor instance', function(){
      expect(function(){
        var tmp = new Selection('aaa', sel);
      }).toThrow('The first argument must be a CKEDITOR.editor instance!');
    });

    xit('throws an error if the second argument is not a CKEDITOR.dom.selection instance', function(){
      expect(function(){
        var tmp = new Selection(ed, 'aaa');
      }).toThrow('The first argument must be a CKEDITOR.dom.selection instance!');
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


