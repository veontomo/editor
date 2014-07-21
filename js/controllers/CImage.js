/*jslint plusplus: true, white: true */
/*global Unit, CKEDITOR, NEWSLETTER, Properties, ImageProperties, Helper, Selection, FACTORY, Content, Image */

/**
 * Link Controller.
 * @module    Controllers
 * @class     CImage
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
var CImage = {

	/**
	 * Inserts image into `editor`.
	 *
	 * It uses information inserted in the dialog menu.
	 * @method         insert
	 * @param          {Object}             context          context by means the variables are passed from view to the controller
	 * @param          {Object}             editor           instance of CKEDITOR
	 * @return         {void}
	 */
	insert: function(contenxt, editor){
		// removes eventual warning text
		CKEDITOR.document.getById('warning').setHtml('');
		// user input
		var textAlt = contenxt.getValueOf('tab-general', 'textAlt'),
			imageUrl = contenxt.getValueOf('tab-general', 'imageUrl');
		// creating image object
		var img = new Image(),
			imgObj, imgHtml;
		img.setOrigin(imageUrl);
		img.setProperty('alt', textAlt);
		img.setProperty('title', textAlt);
		imgHtml = img.toHtml();
		if (typeof imgHtml === 'string' && imgHtml.length > 0){
			imgObj = CKEDITOR.dom.element.createFromHtml(imgHtml);
			editor.insertElement(imgObj);
		}

	}
};