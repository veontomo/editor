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






	 var _pluginName = 'ImagePlugin';

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
		title: editor.lang[_pluginName].title,
		minWidth:  400,
		minHeight: 200,

		// Dialog window contents definition.
		contents: [
			{
				id:    'mainTab',
				label:  editor.lang[_pluginName].generalInfo,

				// The tab contents.
				elements: [
					{
						// Text input field for the image url.
						type: 'text',
						id: 'imageUrl',
						label: editor.lang.common.url,
						validate: function(){
							var isValid = _controller.validateUrl(this.getValue());
							if (!isValid){
								// console.log(this.getDialog());
								_controller.setDialogField(this.getDialog(), {tabId: 'mainTab', elemId: 'warning', value: editor.lang.image2.invalidUrl});
							}
							return isValid;
						},
						default: ''
					},
					{
						type: 'html',
						id: 'warning',
						html: ' ',
						style: 'color: red'
					},
					{
						// alternative text
						type: 'text',
						id: 'textAlt',
						label: editor.lang[_pluginName].alternativeAndTitle,
						default: ''
					},
				]
			},
		],

		onShow: function(){
			_controller.setDialogHtmlField(this, {tabId: 'mainTab', elemId: 'warning', value: '&nbsp;'});
			_controller.onShow(this, editor);
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			_controller.onOk(this, editor);
		}
	};
};

CKEDITOR.dialog.add('ImagePluginDialog', ImageDialog);