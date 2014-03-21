/*jslint plusplus: true, white: true */
/*global describe, it, xit, expect, spyOn, beforeEach, CKEDITOR,Selection */

describe('Selection-related functionality', function(){
  var sel, editor, selected;
  beforeEach(function(){
    editor = new CKEDITOR.editor();
    selected = new CKEDITOR.dom.selection(CKEDITOR.document);
  });
  describe('Selection::constructor()', function(){
    it('creates selection instance object if keyword "new" is missing', function(){
      expect(Selection(editor, selected) instanceof Selection).toBe(true);
    });
    it('throws an error if first argument is not a CKEDITOR.editor instance', function(){
      expect(function(){
        new Selection('aaa', selected);
      }).toThrow('The first argument must be a CKEDITOR.editor instance!');
    });

    it('throws an error if the second argument is not a CKEDITOR.dom.selection instance', function(){
      expect(function(){
        new Selection(editor, 'aaa');
      }).toThrow('The second argument must be a CKEDITOR.dom.selection instance!');
    });

    it('instantiates "editor" property', function(){
      sel = new Selection(editor, selected);
      expect(sel.editor).toBe(editor);
    });
   it('instantiates "selection" property', function(){
      sel = new Selection(editor, selected);
      expect(sel.selected).toBe(selected);
    });
  });

});


