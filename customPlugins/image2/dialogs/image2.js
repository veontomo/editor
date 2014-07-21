/*jslint plusplus: true, white: true */
/*global CKEDITOR, CImage */
CKEDITOR.dialog.add( 'imageSimplified', function(editor) {
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
							return CImage.validateUrl(this.getValue(), editor);
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
						label: editor.lang.image.alt + ' / ' + editor.lang.common.advisoryTitle,
						default: ""
					},
				]
			},
		],

		onShow: function(){
			CImage.load(this, editor);
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			// removes eventual warning text
			CKEDITOR.document.getById('warning').setHtml('');
			CImage.insert(this, editor);
		}
	};
});