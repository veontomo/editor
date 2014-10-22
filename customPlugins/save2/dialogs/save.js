/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CDownload*/

CKEDITOR.dialog.add( 'saveDialog', function(editor) {

	/**
	 * Instance of {{#crossLink "Controller"}}Controller{{/crossLink}}
	 * @property       _controller
	 * @type           CDownload
	 * @private
	 */
	var _controller = new CDownload();

	/**
	 * Name of the plugin to which this dialog menu refers.
	 * @property    _pluginName
	 * @type        {String}
	 */
	var _pluginName = 'save2';

	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang[_pluginName].title,
		minWidth:  400,
		minHeight: 200,

		// Dialog window contents definition.
		contents: [
			{
				id: 'basic',
				elements: [{
					type: 'html',
					html: editor.lang[_pluginName].description,
					style: 'padding-top: 1em;padding-bottom:1em;'
				}, {
					type: 'text',
					id: 'filename',
					label: editor.lang[_pluginName].name,
					title: editor.lang[_pluginName].popup,
					inputStyle: 'width: 20em',
					// "default": _controller.appendTimeStamp()
				}]
			}
		],

		onShow: function(){
			// this.setValueOf('tab-general', 'filename', _controller.appendTimeStamp('template'));
		},

		onOk: function() {
			_controller.downloadRaw(this, editor);
		}
	};
});