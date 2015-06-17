/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CDownload*/

CKEDITOR.dialog.add( 'DownloadPluginDialog', function(editor) {

	/**
	 * Instance of {{#crossLink "Controller"}}Controller{{/crossLink}}
	 * @property       _controller
	 * @type           CDownload
	 * @private
	 */
	var _controller = new CDownload();

	return {
		// Basic properties of the dialog window: title, minimum size.
		title: 'Scaricare il file',
		minWidth:  400,
		minHeight: 200,

		// Dialog window contents definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-general',
				label: 'Info generale',

				// The tab contents.
				elements: [{
					type: 'text',
					id: 'filename',
					label: editor.lang.common.name,
					"default": _controller.appendTimeStamp()
				}, {
					// type: 'checkbox',
					// id: 'mode',
					// label: 'fluid'
					type: 'radio',
					   id: 'mode',
					   label: 'Formato',
					   style: 'line-height: 2em;',
					   items: [['Fisso', 'fixed'], ['Elastico', 'elastic']],
					   'default': 'fixed',
				}]
			}
		],

		onShow: function(){
			this.setValueOf('tab-general', 'filename', _controller.appendTimeStamp('template'));
		},

		onOk: function() {
			_controller.downloadAsHtml(this, editor);
		}
	};
});