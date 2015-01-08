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
			doc = this.getWorker();
			adapter = this.getEditorAdapter();
			content = adapter.getEditorContent(editor);
			cursorPos = adapter.getCursorPosition(editor);
			data = adapter.getDialogData(dialog, ['text']);
			template = adapter.dialogToTemplate.image(data);
			image = new ImageTag();
			image.loadFromTemplate(template);
			// newContent = doc.insertNodeAt(content, pos, );
		}
		catch (e){
			console.log(e);
		}
		console.log(image.toHtml(), cursorPos);
		// try {
		//     doc = this.getWorker();
		//     doc.setContent(content);
		//     doc.freezeSelection(ranges);
		//     linkTag = doc.detectTag('a');
		//     if (linkTag) {
		//         link = new Link();
		//         link.load(linkTag);
		//         adapter.fillInDialog(dialog, link.template(), 'link');
		//     }
		// } catch (e) {
		//     console.log(e.name + ' occurred when detecting a link in the editor content: ' + e.message);
		// }

		// // user input
		// var textAlt = dialog.getValueOf('tab-general', 'textAlt'),
		// 	imageUrl = dialog.getValueOf('tab-general', 'imageUrl');
		// // creating image object
		// var img = new Image(),
		// 	imgObj, imgHtml;
		// img.setOrigin(imageUrl);
		// img.setProperty('alt', textAlt);
		// img.setProperty('title', textAlt);
		// imgHtml = img.toHtml();
		// if (typeof imgHtml === 'string' && imgHtml.length > 0){
		// 	imgObj = CKEDITOR.dom.element.createFromHtml(imgHtml);
		// 	editor.insertElement(imgObj);
		// }
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
		    // console.log(content.outerHTML);
		    // console.log(ranges);
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