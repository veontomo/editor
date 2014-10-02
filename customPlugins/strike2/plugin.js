/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection, EHToolbar*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('strike2', {

	// Register the icons.
	icons: 'strike2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		var pluginName = 'strike2',
			property = {
				name: 'text-decoration',
				value: 'line-through'
			};
		editor.addCommand(pluginName, {
			exec: function(editor){
				var	selection = new Selection(editor);
				selection.switchDeepestChildStyle(property.name, property.value, 'none');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.strike,
			// The command to execute on click.
			command: pluginName,
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2, 3'
		});

		// attaching events for highlighting plugin button in case the cursor
		// is situated inside the element that is stroken.
		editor.on('contentDom', function() {
			EHToolbar.registerEvent(editor,  property, pluginName);
		});


	}
});