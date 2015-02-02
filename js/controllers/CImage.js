/*jslint plusplus: true, white: true */
/*global Controller, ImageTag */

/**
 * Image controller.
 * @module    Controllers
 * @class     CImage
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
function CImage() {
	"use strict";
	if (!(this instanceof CImage)) {
	    return new CImage();
	}
	Controller.call(this);

	/**
	 * Inserts image into `editor`.
	 *
	 * It uses information inserted in the dialog menu.
	 * @method         onOk
	 * @param          {Object}             dialog         dialog by means the variables are passed from view to the controller
	 * @param          {Object}             editor         instance of editor
	 * @return         {void}
	 */
	this.onOk = function(dialog, editor){
		var adapter, doc, content, data, template, image, cursorPos, path, newContent;
		try {
			adapter = this.getEditorAdapter();
			content = adapter.getEditorContent(editor);
			cursorPos = adapter.getCursorPosition(editor);
			if (!cursorPos) {
				return;
			}
			doc = this.getWorker();
			path = doc.pathTo(cursorPos.startContainer, content);
			if (!path){
				return;
			}
			data = adapter.getDialogData(dialog, ['text']);
			template = adapter.dialogToTemplate.image(data);
			image = new ImageTag();
			image.loadFromTemplate(template);
			newContent = doc.insertNodeAt(content, path, cursorPos.startOffset, image.toNode());
			adapter.setEditorContent(editor, newContent);
		}
		catch (e){
			console.log(e);
		}
	};

	/**
	 * Loads information about image into dialog menu
	 * @method         onShow
	 * @param          {Object}             dialog          dialog by means the variables are passed from view to the controller
	 * @param          {Object}             editor          editor instance
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.onShow = function(dialog, editor){
		var doc, ranges, adapter, content, img, imgTag;
		adapter = this.getEditorAdapter();
		if (!adapter) {
		    return;
		}
		ranges = adapter.getNativeRanges(editor);
		content = adapter.getEditorContent(editor);
		try {
		    doc = this.getWorker();
		    doc.setContent(content);
		    doc.freezeSelection(ranges);
		    imgTag = doc.detectTag('img');
		    if (imgTag) {
		    	// console.log('image tag is found');
		    	img = new ImageTag();
		    	img.load(imgTag);
		    	// console.log(img.template());
		        adapter.fillInDialog(dialog, img.template(), 'image');
		    }
		} catch (e) {
		    console.log(e.name + ' occurred when filling in an image dialog window: ' + e.message);
		}
	};

	/**
	 * Removes an image that is the nearest ascendant of the cursor position.
	 * @method         removeImage
	 * @param          {Object}        editor
	 * @return         {void}
	 * @since          0.2.0
	 */
	this.removeImage = function(editor){
		var adapter = this.getEditorAdapter();
		if (!adapter) {
		    return;
		}
		var ranges = adapter.getNativeRanges(editor);
		var content = adapter.getEditorContent(editor);
		var doc = this.getWorker();
		doc.removeImagesFromRanges(ranges);
		adapter.setEditorContent(editor, content);
	};


	/**
	 * Validator for url in the dialog menu.
	 *
	 * <span style="color: red">To do</span>: for the moment, the method has side effect: it shows some info in case the validation fails.
	 * @method         validateUrl
	 * @param          {String}             value
	 * @param          {Object}             editor           instance of CKEDITOR
	 * @return         {Boolean}
	 */
	this.validateUrl = function(value, editor){
		var isOk = typeof value === 'string' && value.trim().length > 0;
		if (!isOk){
			var warningField = CKEDITOR.document.getById('warning');
			warningField.setHtml(editor.lang.common.invalidValue);
		}
		return isOk;
	};
}

CImage.prototype = Object.create(Controller.prototype);