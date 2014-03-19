/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global DOMParser, Node, flatten, Attributes, Style, Cell, Table, getProperty, TableRowStyle, Tag, Content */

/**
 * Represents selected elements in the editor window. The argument is of 
 * [CKEditor selection](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.selection "see official site") type.
 * @module    Helper
 * @class     Selection
 * @param     {CKEDITOR.dom.selection}  selection
 * @version   0.0.0
 * @author    A.Shcherbakov
 */
function Selection(selection) {
  "use strict";
  if (!(this instanceof Selection)) {
    return new Selection(selection);
  }
  /**
   * Type of the object. Return "Row" for the objects of this type.
   * @method  getType
   * @return {string}
   * @deprecated   in favour of getName()
   */
  this.getType = function(){
    return "Row";
  };

}