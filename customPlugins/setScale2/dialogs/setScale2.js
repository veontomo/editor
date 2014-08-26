/*jslint plusplus: true, white: true */
/*global CKEDITOR, Image */
CKEDITOR.dialog.add( 'setScale2', function(editor) {
	return {
		// Basic properties of the dialog window: title, minimum size.
		title: 'impostare la larghezza',
		minWidth:  250,
		minHeight: 150,

		// Dialog window contents definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-general',
				label: 'Info generale',

				// The tab contents.
				elements: [{
					type: 'vbox',
					children: [{
						// Text input field for the image url.
						type: 'html',
						html: 'Inserire la larghezza di riferimento',
						style: 'padding: 1em'
					}, {
						type: 'hbox',
						widths: ['20%', '80%'],
						children: [{
							type: 'text',
							id: 'width',
							label: '',
							default: NEWSLETTER.maxWidth,
							inputStyle: "width: 5em;text-align:center"
						}, {
							type: 'html',
							html: 'px',
							style: 'text-align: left;'
						}]

					}]
				}]
			},
		],

		onShow: function(){
			this.setValueOf('tab-general', 'width', NEWSLETTER.maxWidth);
		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			var width = parseInt(this.getValueOf('tab-general', 'width'), 10);
			NEWSLETTER.setWidth(width);
		}
	};
});