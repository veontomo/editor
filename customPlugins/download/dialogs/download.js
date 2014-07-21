/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CDownload*/

CKEDITOR.dialog.add( 'downloadDialog', function(editor) {
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
				elements: [
					{
						type: 'text',
						id: 'filename',
						label: editor.lang.common.name,
						"default": CDownload.appendTimeStamp()
					}
				]
			}
		],

		onShow: function(){
			this.setValueOf('tab-general', 'filename', CDownload.appendTimeStamp());
		},

		onOk: function() {
			CDownload.download(this, editor);
		}
	};
});