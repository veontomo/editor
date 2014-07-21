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
	insert: function(context, editor){
		// user input
		var textAlt = context.getValueOf('tab-general', 'textAlt'),
			imageUrl = context.getValueOf('tab-general', 'imageUrl');
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
	},

	/**
	 * Loads information about image into dialog menu if the selection contains image.
	 * @method         load
	 * @param          {Object}             context          context by means the variables are passed from view to the controller
	 * @param          {Object}             editor           instance of CKEDITOR
	 * @return         {void}
	 */
	load: function(context, editor){
		var startElem = editor.getSelection().getStartElement();
		if (startElem && startElem.getName() === 'img'){
			var imageUrl = startElem.getAttribute('src'),
				alt = startElem.getAttribute('alt');
			context.setValueOf('tab-general', 'imageUrl', imageUrl || '');
			context.setValueOf('tab-general', 'textAlt', alt || '');
		} else {
			console.log('there is NO image: controller');
		}
	},


	/**
	 * Validator for url in the dialog menu.
	 *
	 * <span style="color: red">To do</span>: for the moment, the method has side effect: it shows some info in case the validation fails.
	 * @method         validateUrl
	 * @param          {String}             value
	 * @param          {Object}             editor           instance of CKEDITOR
	 * @return         {Boolean}
	 */
	validateUrl: function(value, editor){
		var isOk = typeof value === 'string' && value.trim().length > 0;
		if (!isOk){
			var warningField = CKEDITOR.document.getById('warning');
			warningField.setHtml(editor.lang.common.invalidValue);
		}
		return isOk;
	}
};