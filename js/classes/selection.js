/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node */

/**
 * Represents selected elements in the editor window. The argument `editor` is a
 * [CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor "see official site") instance and
 * `selected` is a [CKEditor selection](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection "see official site") instance.
 * @module    Helper
 * @class     Selection
 * @param     {CKEDITOR.editor}         editor
 * @param     {CKEDITOR.dom.selection}  selected
 * @requires  CKEditor, CKHelper
 * @version   0.0.0
 * @author    A.Shcherbakov
 */
function Selection(editor, selected) {
  "use strict";
  if (!(this instanceof Selection)) {
    return new Selection(editor, selected);
  }
  if (!CKHelper.isEditor(editor)){
    throw new Error('The first argument must be a CKEDITOR.editor instance!');
  }
  if (!CKHelper.isSelection(selected)){
    throw new Error('The second argument must be a CKEDITOR.dom.selection instance!');
  }

  /**
   * Instance of the editor containing the selection.
   * @property {CKEDITOR.editor}         editor
   */
  this.editor = editor;


  /**
   * The selection.
   * @property {CKEDITOR.dom.selection}  selected
   */
  this.selected = selected;

  /**
   * Ranges of the selection. Alias for [selection.getRanges()](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection-method-getRanges).
   *
   * @property {Array}          ranges        array of range instances corresponding to the selection
   */
  this.ranges = selected.getRanges();
}