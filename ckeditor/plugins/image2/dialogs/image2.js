/*jslint plusplus: true, white: true */
/*global CKEDITOR, Image */
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
			var startElem = editor.getSelection().getStartElement();
			if (startElem && startElem.getName() === 'img'){
				var imageUrl = startElem.getAttribute('src'),
					alt = startElem.getAttribute('alt');
				this.setValueOf('tab-general', 'imageUrl', imageUrl || '');
				this.setValueOf('tab-general', 'textAlt', alt || '');
			} else {
				console.log('there is NO image');
			}

		},

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			// removes eventual warning text
			CKEDITOR.document.getById('warning').setHtml('');
			// user input
			var textAlt = this.getValueOf('tab-general', 'textAlt'),
				imageUrl = this.getValueOf('tab-general', 'imageUrl'),
				img = new Image(),
				imgObj, imgHtml;
			img.setOrigin(imageUrl);
			img.setAttrProperty('alt', textAlt);
			img.setAttrProperty('title', textAlt);
			imgHtml = img.toHtml();
			if (typeof imgHtml === 'string' && imgHtml.length > 0){
				imgObj = CKEDITOR.dom.element.createFromHtml(imgHtml);
				editor.insertElement(imgObj);
			}
		}
	};
});