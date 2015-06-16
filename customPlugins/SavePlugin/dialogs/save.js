/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, CFile, AbstractDialog*/


/**
 * Dialog for saving and reading files.
 *
 * @module  Dialogs
 * @class   SaveDialog
 * @since   0.2.8
 */
function SaveDialog(editor) {
    "use strict";
    if (!(this instanceof SaveDialog)) {
        return new SaveDialog(editor);
    }
    AbstractDialog.call(this, editor);

    this.setController(new CFile());

    this.setPluginName('LinkPlugin');


    /**
     * A string to store plugin name.
     * @property  {String}     _pluginName
     * @private
     */
    var _pluginName = this.getPluginName();

    /**
     * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
     * @property  {CLink}     _controller
     * @type      {CLink}
     * @private
     */
    var _controller = this.getController();

    /**
     * A reference to a dialog.
     *
     * To be initialized in {{#crossLink "ImageDialog/onLoad:property"}}onLoad{{/crossLink}} method.
     * @property  {Object}     _pluginName
     * @private
     */
    var _dialog;


    return {
        title: editor.lang[_pluginName].title,
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'saveInfoTab',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'text',
                    id: 'fileName',
                    label: editor.lang[_pluginName].fileName,
                    title: editor.lang[_pluginName].fileNameDescr,
                    style: this.getTextInputStyle(),
                    "default": _controller.suggestFileName()
                }],
            }]
        }],


        /**
         * The function to execute when the dialog is displayed for the first time.
         *
         * @method     onLoad
         * @return     {void}
         */
        onLoad: function() {
        	_dialog = this;
        },

        onOk: function() {
            _controller.onOk(_dialog, editor);
        }
    };

}

SaveDialog.prototype = Object.create(AbstractDialog.prototype);

CKEDITOR.dialog.add('SavePluginDialog', SaveDialog);
