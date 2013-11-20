/*var editorContent = CKEDITOR.instances.editor.document.getBody().getHtml();
$.post('php/saveDraft.php', 
	{'data': editorContent}, 
		function(filename){
			console.log("data sent and file name is recieved: " + filename);
			$(location).attr('href', 'php/downloadFile.php?filename='+filename); 
	}
)
*//**
 * The abbr dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
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

						// Validation checking whether the field is not empty.
						default: ""
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

			// user input
			var textAlt = dialog.getValueOf('tab-general', 'textAlt');
			var imageUrl = dialog.getValueOf('tab-general', 'imageUrl');

			var elem = editor.document.createElement('img');
			elem.setAttribute('alt', textAlt);
			elem.setAttribute('src', imageUrl);

			// Calculate image width and height. This block should stay after "src" attribute is assigned.
			var imH = elem.$.height;
			var imW = elem.$.width;

			elem.setAttribute('width', imW);
			elem.setAttribute('height', imH);

			// Defining inline image styles
			var stylesImage = new ImageAttributes();
			stylesImage.width = imW + "px";
			stylesImage.height = imH + "px";
			elem.setAttribute('style', stylesImage.toString());

			// Inserts the element at the editor caret position.
			editor.insertElement(elem);		
		}
	};
});