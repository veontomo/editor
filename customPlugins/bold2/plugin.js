//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection, EHToolbar*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('bold2', {

	// Register the icons.
	icons: 'bold2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		var pluginName = 'bold2',
			property = {
				name: 'font-weight',
				value: 'bold',
				altValue: 'normal'
			};

		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, {
			exec: function(editor){
				var	selection = new Selection(editor);
				// console.log(selection);
				selection.switchDeepestChildStyle(property);
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.bold,
			// The command to execute on click.
			command: pluginName,
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2, 1',
		});

		// attaching events for highlighting plugin button in case the cursor
		// is situated inside the element that is bold
		editor.on('contentDom', function() {
			EHToolbar.registerEvent(editor,  property, pluginName);
		});


	}
});