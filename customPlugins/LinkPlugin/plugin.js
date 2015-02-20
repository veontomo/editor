/*jslint plusplus: true, white: true */
/*global CKEDITOR, CLink, NEWSLETTER, Document*/

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


		// Define an editor command that opens the dialog and fills it in in case
		// there is a link among ancestors of the cursor position.
		editor.addCommand(_pluginName + 'Dialog', {
			exec: function(){
				var dialog = editor.openDialog(_pluginName + 'Dialog'),
					startElement = editor.getSelection().getStartElement(),
					parent;
				if (startElement){
					parent = _controller.findRepresentativeAncestor(startElement);
				}
				if (parent){
					_controller.saveExtra(dialog, parent);
					_controller.fillInDialogWithElementData(dialog, parent, 'link');
				}
			}
		});

		editor.addCommand(_pluginName + 'Modify', {
			exec: function(e){
				e.openDialog(_pluginName + 'Dialog', function(dialog){
					if (_target.hostLink){
						// wait until the dialog gets loaded completely
						// otherwise, an error occurs because the editor can already be
						// aware of the UI input elements, but they might not be present
						// in DOM so far
						dialog.on('show', function(){
							_controller.fillInDialogWithElementData(dialog, _target.hostLink, 'link');
							_controller.saveExtra(dialog, _target.hostLink);
							_target.hostLink = undefined;
						});
					}
				});
			}
		});




		editor.ui.addButton(_pluginName, {
			label: editor.lang.link.title,
			command: _pluginName + 'Dialog',
			toolbar: 'document',
		});

		 /*
		  Register dialog that inserts link.

		  File "linkMailDialog.js" contains definition of two dialogs:
		  "mailDialog" and "linkDialog".
		  These dialogs are defined in the same file bacause they are defined in terms of a
		  class "linkMailDialog" which is defined in that file.
		 */
		CKEDITOR.dialog.add(_pluginName + 'Dialog', this.path + '../LinkMailPlugin/linkMailDialog.js');

		editor.addCommand(_pluginName + 'Unlink', {
			exec: function(editor){
				// Remember that the link that has triggered context menu that might not be only one
				// present in the selected text inside the editor content
				_controller.unlink(editor, _target.hostLink);
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
				label: editor.lang.LinkMailPlugin.modify,
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
