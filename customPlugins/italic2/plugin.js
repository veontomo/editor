//*jslint white: false */
/*jslint plusplus: true, white: true */
/*global NEWSLETTER,CKEDITOR, EHToolbar, CTextDecoration, Document*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('italic2', {

	// Register the icons.
	icons: 'italic2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		/**
		 * Instance of {{#crossLink "CTextDecoration"}}CTextDecoration{{/crossLink}}
		 * @property  {CTextDecoration}     _controller
		 * @type      {CTextDecoration}
		 * @private
		 */
		var _controller = new CTextDecoration();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		(function(){
		    var worker = new Document();
		    worker.setFactory(NEWSLETTER.factory);
		    _controller.setWorker(worker);
		}());

		var pluginName = 'italic2';
		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, {
			exec: function(editor){
				_controller.convertToItalics(editor);
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
			var	property = {
					name: 'font-style',
					value: 'italic',
					altValue: 'normal'
				};
			EHToolbar.registerEvent(editor, property, pluginName);
		});


	}
});