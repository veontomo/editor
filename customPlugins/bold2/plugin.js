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

		// attaching events for highlighting plugin button in case the cursor
		// is situated inside the element that is bold
		editor.on('contentDom', function() {
			var editable = editor.editable(),
				buttonId = editor.ui.get(pluginName)._.id;
			// first type of events: moving the cursor by mouse
		    editable.attachListener(editor.document, 'mousedown', function() {
		    	EHToolbar.highlight(editor, 'font-weight', 'bold', buttonId);
		    	// should event propagate?
		    	return true;
		    });
		    // second type of events: pressing left, right, up or down arrow
		    editable.attachListener(editor.document, 'keydown', function(event) {
		        try {
		        	var key = event.data.$.key;
		        	// calling the event only if right, left, up or down arrow is pressed
		        	if (key === 'Left' || key === 'Right' || key === 'Down' || key === 'Up'){
		        		EHToolbar.highlight(editor, 'font-weight', 'bold',  buttonId);
		        	}
	     		} catch (e){
	     			console.log('Error (' + e.name + ') when listening to key press: ' + e.message);
	     		}
	     		// should event propagate?
	     		return true;
		    });

		});


	}
});