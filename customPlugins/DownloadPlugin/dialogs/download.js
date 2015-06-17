/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CFile, AbstractDialog */

/**
 * Dialog for downloading the editor content as a file.
 *
 * @module  Dialogs
 * @class   DownloadDialog
 */
function DownloadPluginDialog(editor){
	"use strict";
	if (!(this instanceof DownloadPluginDialog)) {
	    return new DownloadPluginDialog(editor);
	}
	AbstractDialog.call(this, editor);

	this.setController(new CFile());
	// previously: _controller = new CDownload();

	this.setPluginName('DownloadPlugin');

	var _controller = this.getController();

	var _dialog;

	return {
		// Basic properties of the dialog window: title, minimum size.
		title:     editor.lang[this.getPluginName()].title,
		minWidth:  400,
		minHeight: 200,

		// Dialog window contents definition.
		contents: [
			{
				// Definition of the Basic Settings dialog tab (page).
				id: 'tab-general',
				label: 'Info generale',

				// The tab contents.
				elements: [{
					type: 'text',
					id: 'filename',
					label: editor.lang.common.name,
				}, {
					// type: 'checkbox',
					// id: 'mode',
					// label: 'fluid'
					type: 'radio',
					   id: 'mode',
					   label: editor.lang[this.getPluginName()].format,
					   style: 'line-height: 2em;',
					   items: [['Fisso', 'fixed'], ['Elastico', 'elastic']],
					   'default': 'fixed',
				}]
			}
		],

		/**
		 * The function to execute when the dialog is displayed for the first time.
		 *
		 * Binds {{#crossLink "table2Dialog/_colorPicker:property"}}_colorPicker{{/crossLink}}
		 * to color-related input text fields.
		 * @method     onLoad
		 * @return     {void}
		 */
		onLoad: function() {
		    _dialog = this;
		},

		onShow: function(){
			_dialog.setValueOf('tab-general', 'filename', _controller.suggestFileName());
		},

		onOk: function() {
			_controller.downloadAsHtml(this, editor);
		}
	};
}

DownloadPluginDialog.prototype = Object.create(AbstractDialog.prototype);

CKEDITOR.dialog.add('DownloadPluginDialog', DownloadPluginDialog);