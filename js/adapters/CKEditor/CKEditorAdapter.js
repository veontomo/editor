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
	 * Transforms [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instance
	 * into native javascript [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) one.
	 *
	 * If `r` is not a [CKEDITOR.dom.range](http://docs.ckeditor.com/#!/api/CKEDITOR.dom.range) instance,
	 * nothing is returned.
	 * @method         toNativeRange
	 * @param          {CKEDITOR.dom.range}      r
	 * @return         {Range}
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