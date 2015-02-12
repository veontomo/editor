/*jslint plusplus: true, white: true */
/*global CKEDITOR, CLink, NEWSLETTER*/

/**
 * A customized CKEDITOR plugin to deal with operations on hyperlink.
 * @module    CKEditorPlugins
 * @class     LinkPlugin
 * @type      {Object}
 * @since     0.0.5
 * @author    A.Shcherbakov
 */
CKEDITOR.plugins.add('LinkPlugin', {

	// Register the icons.
	icons: 'LinkPlugin',

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

		 /*
		  Register dialog that inserts link.

		  File "linkMailDialog.js" contains definition of two dialogs:
		  "mailDialog" and "linkDialog".
		  These dialogs are defined in the same file bacause they are defined in terms of a
		  class "linkMailDialog" which is defined in that file.
		 */
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + '../linkMail/linkMailDialog.js');


		// Define an editor command that opens our dialog.
		// editor.addCommand(_pluginName + 'Dialog', new CKEDITOR.dialogCommand('linkDialog'));
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(){
				editor.openDialog(_pluginName + 'Dialog', function(){
					console.log(_target.hostLink);
					if (_target.hostLink){
						// _controller.fillInDialogWith(this, _target.hostLink);
						// reset the reference to the target element
						_target.hostLink = undefined;
						console.log(this instanceof CKEDITOR.dialog);
					}
				});
			}
		});

		editor.addCommand(_pluginName + 'Modify', {
			exec: function(e){
				var dialog = e.openDialog(_pluginName + 'Dialog');
				if (_target.hostLink){
					_controller.fillInDialogWithElementData(dialog, _target.hostLink);
					_target.hostLink = undefined;
				}
			}
		});




		editor.ui.addButton(_pluginName, {
			label: editor.lang.link.title,
			command: _pluginName + 'Dialog',
			toolbar: 'document',
		});
		editor.addCommand(_pluginName + 'Unlink', {
			exec: function(editor){
				// a link that triggers appearence of item "Unlink" in the context menu
				// is available as _target.hostLink
				// Remenber that the above mentioned link is not the only that might be
				// present in the selected text
				_controller.unlink(editor);
			}
		});

		if (editor.contextMenu) {
			editor.addMenuGroup(_pluginNameGroup);

			editor.addMenuItem(_pluginName + 'Unlink', {
				label: editor.lang.link.unlink,
				icon: this.path + 'icons/unlink.png',
				command: _pluginName + 'Unlink',
				group: _pluginNameGroup
			});

			editor.addMenuItem(_pluginName + 'Modify', {
				label: '--- modify link ---',
				icon: this.path + 'icons/unlink.png',
				command: _pluginName + 'Modify',
				group: _pluginNameGroup
			});

			editor.contextMenu.addListener(function(element) {
				var el = _controller.findRepresentativeAncestor(element);
				var menuObj = {};
				if (el) {
					_target.hostLink = el;
					menuObj[_pluginName + 'Unlink'] = CKEDITOR.TRISTATE_OFF;
					menuObj[_pluginName + 'Modify'] = CKEDITOR.TRISTATE_OFF;
					return menuObj;
				}
			});
		}
	}
});
