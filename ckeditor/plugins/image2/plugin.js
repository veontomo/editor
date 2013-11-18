// Register the plugin within the editor.
CKEDITOR.plugins.add( 'image2', {

	// Register the icons.
	icons: 'image2',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog.
		editor.addCommand( 'image2', new CKEDITOR.dialogCommand( 'imageSimplified' ) );


		// Create a toolbar button that executes the above command.
		editor.ui.addButton( 'image2', {

			// The text part of the button (if available) and tooptip.
			label: editor.lang.common.image,

			// The command to execute on click.
			command: 'image2',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});



		// Register our dialog file. this.path is the plugin folder path.
		CKEDITOR.dialog.add( 'imageSimplified', this.path + 'dialogs/image2.js' );

	}
});
