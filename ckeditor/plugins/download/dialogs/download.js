/*jslint white: false */
/*jslint plusplus: true, white: true */

/*global CKEDITOR, Helper, location */

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
				fileHeader, fileFooter, fileBody, fileContent, sanitizedContent,
				editorCss = CKEDITOR.getCss() || '',
				bodyCss = Helper.cssOfSelector('body', editorCss);
			if (bodyCss){
				bodyCss = ' style="' + bodyCss + '"';
			}

			sanitizedContent = Helper.specialChar(editorContent.replace(/\t/g, ' '));
			sanitizedContent = sanitizedContent.replace(/\s+(id|class)=\"[a-zA-Z0-9_ ]+?\"/g, '');
			fileHeader = "<!DOCTYPE html><html><head><meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\"></head><body>";
			fileBody = "<center><div" + bodyCss + ">" + sanitizedContent +  "</div></center>";
			fileFooter = "</body></html>";
			fileContent = fileHeader + fileBody + fileFooter;
			$.post('php/saveDraft.php',
				{'data': fileContent, 'filename': fileName},
					function(filename){
						// console.log("data sent and file name is recieved: " + filename);
						$(location).attr('href', 'php/downloadFile.php?filename=' + filename);
				}
			);
		}
	};
});