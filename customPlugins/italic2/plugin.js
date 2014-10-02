//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection, EHToolbar*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('italic2', {

	// Register the icons.
	icons: 'italic2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		var pluginName = 'italic2',
			property = {
				name: 'font-style',
				value: 'italic',
				altValue: 'normal'
			};
		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, {
			exec: function(editor){
				var	selection = new Selection(editor);
				selection.switchDeepestChildStyle(property);
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.italic,
			// The command to execute on click.
			command: pluginName,
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2, 2'
		});

		// attaching events for highlighting plugin button in case the cursor
		// is situated inside the element that is italic
		editor.on('contentDom', function() {
			EHToolbar.registerEvent(editor, property, pluginName);
		});


	}
});