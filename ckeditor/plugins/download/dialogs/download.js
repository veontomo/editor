/*global CKEDITOR, location
*/

CKEDITOR.dialog.add( 'downloadDialog', function(editor) {
	var timeNow = new Date(),
		templateName = 'template' + [
			timeNow.getFullYear(), 
			timeNow.getMonth() + 1, 
			timeNow.getUTCDate(), 
			timeNow.getUTCHours(), 
			timeNow.getUTCMinutes()
		].join('-') + '.html';
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
						"default": templateName
					}
				]
			}
		],

		onOk: function() {
			var fileName = this.getValueOf('tab-general', 'filename'),
				editorContent = editor.document.getBody().getHtml(),
				fileContent, sanitizedContent;
			sanitizedContent = editorContent.replace(/\t/g, ' ');
			fileContent = "<!DOCTYPE html>\n<html>\n<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\">\n</head>\n<body>\n" + 
				sanitizedContent +  "\n</body></html>";
			$.post('php/saveDraft.php', 
				{'data': fileContent, 'filename': fileName}, 
					function(filename){
						console.log("data sent and file name is recieved: " + filename);
						$(location).attr('href', 'php/downloadFile.php?filename=' + filename); 
				}
			);
		}
	};
});