/*jslint plusplus: true, white: true */
/*global CKEDITOR, CImage, AbstractDialog */

/**
 * A dialog for image insertion.
 *
 * @module      Dialogs
 * @class       ImageDialog
 * @since       0.1.0
 * @author      A.Shcherbakov
 * @uses        CImage
 * @uses        Document
 */
function ImageDialog(editor) {
    "use strict";
    if (!(this instanceof ImageDialog)) {
        return new ImageDialog(editor);
    }
    AbstractDialog.call(this, editor);

    this.setController(new CImage());

    this.setPluginName('ImagePlugin');

    /**
     * Instance of {{#crossLink "CImage"}}CImage{{/crossLink}}
     * @property  {CImage}     _controller
     * @type      {CImage}
     * @private
     */
    var _controller = this.getController();

    /**
     * A string to store plugin name.
     * @property  {String}     _pluginName
     * @private
     */
    var _pluginName = this.getPluginName();

    /**
     * A reference to a dialog.
     *
     * To be initialized in {{#crossLink "ImageDialog/onLoad:property"}}onLoad{{/crossLink}} method.
     * @property  {Object}     _pluginName
     * @private
     */
    var _dialog;

    return {
        // Basic properties of the dialog window: title, minimum size.
        title: editor.lang[_pluginName].title,
        minWidth: 400,
        minHeight: 200,

        // Dialog window contents definition.
        contents: [{
            id: 'mainTab',
            label: editor.lang[_pluginName].generalInfo,

            // The tab contents.
            elements: [{
                // Text input field for the image url.
                type: 'text',
                id: 'imageUrl',
                label: editor.lang.common.url,
                validate: function() {
                    var isValid = _controller.validateUrl(this.getValue());
                    if (!isValid) {
                        // console.log(this.getDialog());
                        _controller.setDialogField(this.getDialog(), {
                            tabId: 'mainTab',
                            elemId: 'warning',
                            value: editor.lang.image2.invalidUrl
                        });
                    }
                    return isValid;
                },
                default: ''
            }, {
                type: 'html',
                id: 'warning',
                html: ' ',
                style: 'color: red'
            }, {
                // alternative text
                type: 'text',
                id: 'textAlt',
                label: editor.lang[_pluginName].alternativeAndTitle,
                default: ''
            }]
        }, ],

        /**
         * The function to execute when the dialog is displayed for the first time.
         *
         * @method     onLoad
         * @return     {void}
         */
        onLoad: function() {
            _dialog = this;
        },

        /**
         * The function to execute every time the dialog is displayed.
         *
         * @method     onLoad
         * @return     {void}
         */
        onShow: function() {
            _controller.setDialogHtmlField(_dialog, {
                tabId: 'mainTab',
                elemId: 'warning',
                value: '&nbsp;'
            });
            _controller.onShow(_dialog, editor);
        },

        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function() {
            var params = {
                'target': _controller.getExtra(_dialog),
            };
            _controller.onOk(_dialog, editor, params);
        }
    };
}

ImageDialog.prototype = Object.create(AbstractDialog.prototype);

CKEDITOR.dialog.add('ImagePluginDialog', ImageDialog);
