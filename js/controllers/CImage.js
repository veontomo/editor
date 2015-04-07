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

	//
	// Sets model corresponding to this controller.
	//
	this.setModel(ImageTag);

	/**
	 * Inserts image into `editor`.
	 *
	 * It uses information inserted in the dialog menu.
	 * @method         onOk
	 * @param          {Object}        dialog         dialog by means the variables are passed from view to the controller
	 * @param          {Object}        editor         instance of editor
     * @param          {Object}        params         [Optional]
	 * @return         {void}
	 * @since          0.2.5
	 */
	this.onOk = function(dialog, editor, params){
		var adapter, doc, content, dialogData, template,
		    image, cursorPos;
		try {
		    adapter = this.getEditorAdapter();
		    cursorPos = adapter.getCursorPosition(editor);
		    if (!cursorPos){
		        return;
		    }
		    doc = this.getWorker();
		    content = adapter.getEditorContent(editor);
		    dialogData = adapter.getDialogData(dialog);
		    template = adapter.dialogToTemplate(dialogData, 'img');
		    image = doc.createFromTemplate(template);
		    if (!image){
		    	return;
		    }
		    image = image.toNode();
		    if (params && params.img){
		        doc.replaceChild(image, params.img);
		    } else {
				doc.insertAt(cursorPos.startContainer, image, cursorPos.startOffset);
		    }
		    adapter.setEditorContent(editor, content);
		} catch (e) {
		    console.log(e.name + ' occurred when inserting image: ' + e.message);
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