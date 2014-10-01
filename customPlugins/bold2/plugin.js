//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('bold2', {

	// Register the icons.
	icons: 'bold2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {

		var pluginName = 'bold2';

		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, {
			exec: function(editor){
				var	selection = new Selection(editor);
				// console.log(selection);
				selection.switchDeepestChildStyle('font-weight', 'bold', 'normal');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.bold,
			// The command to execute on click.
			command: 'bold2',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2, 1',
		});

		editor.on('contentDom', function() {
			var editable = editor.editable();
		    editable.attachListener(editor.document, 'mousedown', function() {
		    	console.log('listener inside bold plugin');
		    	EHToolbar.highlight(editor, 'font-weight', 'normal', editor.ui.get(pluginName)._.id);
		    });
		});


	}
});