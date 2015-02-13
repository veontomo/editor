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
		var adapter, doc, content, data, template, image, cursorPos;
		try {
			adapter = this.getEditorAdapter();
			doc = this.getWorker();
			content = adapter.getEditorContent(editor);
			cursorPos = adapter.getCursorPosition(editor);
			if (!cursorPos) {
				return;
			}

			data = adapter.getDialogData(dialog, ['text']);
			template = adapter.dialogToTemplate.image(data);
			image = new ImageTag();
			image.loadFromTemplate(template);
			doc.insertNodeAt(cursorPos.startContainer, image.toNode(),  cursorPos.startOffset);
			adapter.setEditorContent(editor, content);
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
		try {
			adapter = this.getEditorAdapter();
			ranges = adapter.getNativeRanges(editor);
			content = adapter.getEditorContent(editor);
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
		var adapter, content, doc, ranges;
		try {
			adapter = this.getEditorAdapter();
			ranges = adapter.getNativeRanges(editor);
			content = adapter.getEditorContent(editor);
			doc = this.getWorker();
			doc.clearRangesFromImages(ranges);
		} catch (e){
			console.log(e.name + ' occurred when removing images: ' + e.message);
			return;
		}
		adapter.setEditorContent(editor, content);
	};


	/**
	 * Validator for url in the dialog menu.
	 *
	 * @method         validateUrl
	 * @param          {String}             value
	 * @return         {Boolean}
	 */
	this.validateUrl = function(value){
		var isOk = typeof value === 'string' && value.trim().length > 0;
		return isOk;
	};

}

CImage.prototype = Object.create(Controller.prototype);