/*jslint plusplus: true, white: true */
/*global CKEDITOR, CLink, NEWSLETTER*/

/**
 * A customized CKEDITOR plugin to deal with operations on hyperlink.
 * @module    CKEditorPlugins
 * @class     Link2
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('link2', {

	// Register the icons.
	icons: 'link2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		/**
		 * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
		 * @property  {CLink}     _controller
		 * @type      {CLink}
		 * @private
		 */
		var _controller = new CLink();
		_controller.setEditorAdapter(NEWSLETTER.editorAdapter);
		/**
		 * A class that performs operations with editor window content.
		 * @property {Document} worker
		 * @type     {Document}
		 * @since    0.2.0
		 * @private
		 */
		var worker = new Document();
		worker.setFactory(NEWSLETTER.factory);
		_controller.setWorker(worker);

		/**
		 * Object containing elements on which context menu options have been triggered.
		 * @private
		 * @property   {Object}        _target
		 * @since      0.2.0
		 */
		var _target = {};

		/**
		 * Plugin name.
		 * @type       {String}
		 * @property   {String}        _pluginName
		 * @since      0.2.0
		 * @private
		 */
		var _pluginName = this.name;

		/**
		 * Name of the group to embrace the plugin functionality.
		 * @type       {String}
		 * @property   {String}        _pluginNameGroup
		 * @since      0.2.0
		 * @private
		 */
		 var _pluginNameGroup = _pluginName + 'Group';

		 /**
		 * Register dialog that inserts link.
		 *
		 * File "linkMailDialog.js" contains definition of two dialogs:
		 * "mailDialog" and "linkDialog".
		 * These dialogs are defined in the same file bacause they are defined in terms of a
		 * class "linkMailDialog" which is defined in that file.
		 */
		 CKEDITOR.dialog.add('linkDialog', this.path + '../linkMail/linkMailDialog.js');


		// Define an editor command that opens our dialog.
		editor.addCommand(_pluginName + 'link2', new CKEDITOR.dialogCommand('linkDialog'));
		editor.ui.addButton('link2', {
			label: editor.lang.link.title,
			command: _pluginName + 'link2',
			toolbar: 'document',
		});
		editor.addCommand(_pluginName + 'Unlink', {
			exec: function(editor){
				_controller.unlink(editor, _target.hostLink);
			}
		});

		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);

			editor.addMenuItem(_pluginName + 'Unlink', {
				label: editor.lang.link.unlink,
				icon: this.path + 'icons/unlink2.png',
				command: _pluginName + 'Unlink',
				group: _pluginNameGroup
			});
			editor.contextMenu.addListener(function(element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostLink = el;
					menuObj[_pluginName + 'Unlink'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	}
});
