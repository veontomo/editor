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

			// Creates a new <abbr> element.
			var elem = editor.document.createElement('img');

			// Set element attribute and text, by getting the defined field values.
			elem.setAttribute('alt', dialog.getValueOf('tab-general', 'textAlt'));
			elem.setAttribute('src', dialog.getValueOf('tab-general', 'imageUrl'));
			elem.setAttribute('width', elem.$.width);
			elem.setAttribute('height', elem.$.height);

			// Inserts the element at the editor caret position.
			editor.insertElement(elem);		
		}
	};
});