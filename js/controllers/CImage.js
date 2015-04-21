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
		    cursorPos;
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
		    // the code below uses asynchronous request in order to
		    // determine image size.
		    // The current approach is ugly:
		    // 1. an auxiliary "img" tag is created
		    // 2. it is then assigned "src" attribute
		    // 3. then an asynchronous method waits until the image completes loading
		    // 4. once the image is loaded, its width and height are used to
		    var img = document.createElement('img');
		    img.src = template.root.src;
		    img.onload = function(){
		    	var image = doc.createFromTemplate(template),
		    		dim = {'width': img.width, 'height': img.height};
		    	image.setDimensions(dim);
			    if (!image){
			    	return;
			    }
			    image = image.toNode();

			    if (params && params.target){
			        doc.replaceChild(image, params.target);
			    } else {
					doc.insertAt(cursorPos.startContainer, image, cursorPos.startOffset);
			    }
			    adapter.setEditorContent(editor, content);

		    };
		} catch (e) {
		    console.log(e.name + ' occurred when inserting image: ' + e.message);
		}
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