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
   * Selected elements.
   * @property {CKEDITOR.dom.selection}  selected
   */
  this.selected = selected;

  /**
   * Array of range instances corresponding to the selection.
   * Alias for [selection.getRanges()](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection-method-getRanges).
   * @property {Array}   ranges
   * @type     {Array}
   */
  this.ranges = selected.getRanges();

  /**
   * Returns an array of the form [[elem00, elem01, ...], [elem10, ele11, ...], ...]. Each element of the array corresponds
   * to the elements inside the {{#crossLink "Selection/ranges:property"}}ranges{{#crossLink}} property of the selection.
   * In other words, each element of {{#crossLink "Selection/getNodes:method"}}getNodes(){{/crossLink}}
   * reflects the structure of {{#crossLink "Selection/ranges:property"}}ranges{{/crossLink}} that is an array of
   * [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instances.
   * @method getNodes
   * @return {Array}   array of arrays of nodes in the selection. The inner array corresponds to the simply-connected
   *                   DOM nodes in the selection.
   */
  this.getNodes = function(){
    return null;
  }
}