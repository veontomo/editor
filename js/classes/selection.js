/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node */

/**
 * Represents selected elements in the editor window. The argument `editor` is a
 * [CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor "see official site") instance and
 * `selection` is a [CKEditor selection](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection "see official site") instance.
 * @module    Helper
 * @class     Selection
 * @param     {CKEDITOR.editor}         editor
 * @param     {CKEDITOR.dom.selection}  selection
 * @requires  CKEditor
 * @version   0.0.0
 * @author    A.Shcherbakov
 */
function Selection(editor, selection) {
  "use strict";
  if (!(this instanceof Selection)) {
    return new Selection(editor, selection);
  }

  if (!this.isEditor(editor)){
   throw new Error('The first argument must be a CKEDITOR.editor instance!');
  }

  /**
   * Instance of the editor containing the selection.
   * @property {CKEDITOR.editor}         editor
   */
  this.editor = editor;


  /**
   * The selection.
   * @property {CKEDITOR.dom.selection}  selection
   */
  this.selection = selection;

  /**
   * Ranges of the selection. Alias for [selection.getRanges()](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection-method-getRanges).
   *
   * @property {Array}          ranges        array of range instances corresponding to the selection
   */
  // this.ranges = typeof selection.getRanges === 'function' ? selection.getRanges() : [];
}