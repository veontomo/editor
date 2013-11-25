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
						// Text input field for the file name.
						type: 'text',
						id: 'filename',
						label: editor.lang.common.name,

						// Validation checking whether the field is not empty.
						default: "template.html"
					},
				]
			},
		],

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			var fileName = this.getValueOf( 'tab-general', 'filename' );
			var editorContent = editor.document.getBody().getHtml();
			var fileContent = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n" + 
				editorContent +  "\n</body></html>";
			$.post('php/saveDraft.php', 
				{'data': fileContent, 'filename': fileName}, 
					function(filename){
						console.log("data sent and file name is recieved: " + filename);
						$(location).attr('href', 'php/downloadFile.php?filename='+filename); 
				}
			)
		}
	};
});