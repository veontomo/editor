/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, Selection*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('selection', {

	// Register the icons.
	icons: 'selection',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('selection', {
			exec: function(editor){
				console.log('inside Selection plugin');
				var selected = editor.getSelection(),
					selection = new Selection(editor, selected),
					nodes = selection.selectedNodes;
				console.log('selection plugin: ', selection.test);
				// nodes.forEach(function(arr, ind1){
				// 	arr.forEach(function(node, ind){
				// 		if (node.type === CKEDITOR.NODE_TEXT){
				// 			node.setText(' ' + ind1 + ' ' + ind + ' ');
				// 		}
				// 		if (node.type === CKEDITOR.NODE_ELEMENT){
				// 			node.setHtml(' ' + ind1 + ' ' + ind + ' ');
				// 		}
				// 	});
				// });
				// CKHelper.insertList(editor, 'ol');
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton('selection', {
			// The text part of the button (if available) and tooptip.
			label: 'vedi cosa hai selezionato',
			// The command to execute on click.
			command: 'selection',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

	}
});