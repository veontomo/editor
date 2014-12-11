/*jslint plusplus: true, white: true */
/*global */

/**
 * Implements "abstract" methods of class {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}}
 * Transforms [CKEDITOR](http://docs.ckeditor.com/#!/api/CKEDITOR) objects into native javascript one.
 * @class     CKEditorAdapter
 * @module    Adapters
 * @type      {Object}
 * @extends   {EditorAdapter}
 * @since     0.0.8
 * @author    A.Shcherbakov
 */
function CKEditorAdapter(){
	"use strict";
	if (!(this instanceof CKEditorAdapter)) {
		return new CKEditorAdapter();
	}
	EditorAdapter.call(this);

	/**
	 * Returns editor-specific representation of the ranges.
	 *
	 * It is supposed to be an array of editor-specific range instances. If for some reason it turns out
	 * that it is impossible to retrieve the ranges, `null` is returned.
	 * @method         getEditorRanges
	 * @param          {CKEDITOR.editor}    e         instance [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor)
	 * @return         {Array|Null}                   array of
	 *                                                [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range)
	 *                                                instances
	 * @throws         {Error}              If `e` is not [CKeditor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor) instance
	 * @since          0.1.0
	 */
	this.getEditorRanges = function(e){
		if (e instanceof CKEDITOR.editor){
			var selection = e.getSelection();
			if (selection){
				return selection.getRanges();
			}
		}
	};


	/**
	 * Converts editor-specific range `r` into a native javascript representation of
	 * [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) object.
	 * @method         toNativeRange
	 * @param          {CKEDITOR.dom.range}      r      [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range)
	 *                                                  instance
	 * @return         {Range}
	 * @since          0.1.0
	 * @throws         {Error} If `r` is not a [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instance
	 */
	this.toNativeRange = function(r){
		if (r instanceof CKEDITOR.dom.range){
			var range = document.createRange();
			var startOffset = r.startOffset,
				endOffset = r.endOffset,
				startContainer = r.startContainer,
				endContainer = r.endContainer;
			try {
				range.setEnd(endContainer.$, endOffset);
				range.setStart(startContainer.$, startOffset);
			} catch (e){
				console.log('Error (' + e.name + ') detected when setting up the range: ' + e.message);
			} finally {
				return range;
			}
		}

	};
}
CKEditorAdapter.prototype = Object.create(EditorAdapter.prototype);