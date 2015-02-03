/*jslint plusplus: true, white: true */
/*global CKEDITOR, CTextDecoration, NEWSLETTER, Document, EHToolbar */
/**
 * A customized CKEDITOR plugin to make selected text underlined.
 * @module    CKEditorPlugins
 * @class     Undeline2
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('underline2', {

	// Register the icons.
	icons: 'underline2',

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
		var pluginName = 'underline2';

		// Define an editor command that opens our dialog.
		editor.addCommand(pluginName, {
			exec: function(editor){
				_controller.convertToUnderlined(editor);
			}
		});

		// Create a toolbar button that executes the above command.
		editor.ui.addButton(pluginName, {
			// The text part of the button (if available) and tooltip.
			label: editor.lang.basicstyles.underline,
			// The command to execute on click.
			command: pluginName,
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'basicstyles2, 4'
		});

		// attaching events for highlighting plugin button in case the cursor
		// is situated inside the element that is stroken.
		editor.on('contentDom', function() {
			var property = {
					name: 'text-decoration',
					value: 'underline',
					altValue: 'none'
				};

			EHToolbar.registerEvent(editor, property, pluginName);
		});


	}
});