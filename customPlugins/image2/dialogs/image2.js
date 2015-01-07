/*jslint plusplus: true, white: true */
/*global CKEDITOR, CImage, Document, NEWSLETTER */

/**
* A dialog for image insertion.
*
* @module      Dialogs
* @class       ImageDialog
* @since       0.1.0
* @author      A.Shcherbakov
* @uses        CImage
* @uses        Document
*/
var ImageDialog = function(editor) {
	/**
	 * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
	 * @property  {CImage}     _controller
	 * @type      {CImage}
	 * @private
	 */
	var _controller = new CImage();
	_controller.setEditorAdapter(NEWSLETTER.editorAdapter);

	/**
	 * {{#crossLink "ImageDialog/_controller:property"}}_controller{{/crossLink}} configurator.
	 * @method  anonymous
	 * @return  {void}
	 * @since   0.1.0
	 * @private
	 */
	(function(){
	    var worker = new Document();
	    worker.setFactory(NEWSLETTER.factory);
	    _controller.setWorker(worker);
	}());

	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.common.image,
		minWidth:  400,
		minHeight: 200,

		// Dialog window contents definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-general',
				label: 'Info generale',

				// The tab contents.
				elements: [
					{
						// Text input field for the image url.
						type: 'text',
						id: 'imageUrl',
						label: editor.lang.common.url,
						validate: function(){
							return _controller.validateUrl(this.getValue(), editor);
						},
						default: ''
					},
					{
						type: 'html',
						html: '<div id="warning" style="color:red;"></div>'
					},
					{
						// alternative text
						type: 'text',
						id: 'textAlt',
						label: editor.lang.image2.alternativeAndTitle,
						default: ""
					},
				]
			},
		],

		onShow: function(){
			_controller.onShow(this, editor);
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			// removes eventual warning text
			CKEDITOR.document.getById('warning').setHtml('');
			_controller.insert(this, editor);
		}
	};
};

CKEDITOR.dialog.add('imageSimplified', ImageDialog);