/*jslint plusplus: true, white: true */
/*global CKEDITOR, ImageStyle */
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
							var isOk = Boolean(this.getValue().trim());
							if (!isOk){
								var warningField = CKEDITOR.document.getById('warning');
								warningField.setHtml(editor.lang.common.invalidValue);
							}
							return isOk;
						},
						default: ""
					},
					{
						// alternative text
						type: 'html',
						html: '<div id="warning" style="color:red;"></div>'
					},

					{
						// alternative text
						type: 'text',
						id: 'textAlt',
						label: editor.lang.image.alt,

						// Validation checking whether the field is not empty.
						default: ""
					},


				]
			},
		],

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			var dialog = this;
			// removes eventual warning text			
			CKEDITOR.document.getById('warning').setHtml('');

			// user input
			var textAlt = dialog.getValueOf('tab-general', 'textAlt');
			var imageUrl = dialog.getValueOf('tab-general', 'imageUrl');

			var elem = editor.document.createElement('img');
			elem.setAttribute('alt', textAlt);
			elem.setAttribute('title', textAlt);
			elem.setAttribute('src', imageUrl);

			// Calculate image width and height. This block should stay after "src" attribute is assigned.
			var imH = elem.$.height;
			var imW = elem.$.width;

			if (!(imW && imH)) {
				alert('Non riesco a ricavare dimensioni dell\'immagine');
			}

			elem.setAttribute('width', imW);
			elem.setAttribute('height', imH);

			// Defining inlineimage styles
			var stylesImage = new ImageStyle();
			stylesImage.width = imW + "px";
			stylesImage.height = imH + "px";
			elem.setAttribute('style', stylesImage.toString());

			// Inserts the element at the editor caret position.
			editor.insertElement(elem);		
		}
	};
});