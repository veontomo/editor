/*jslint plusplus: true, white: true */
/*global CKEDITOR, Document, NEWSLETTER, CLink */

/**
 * Dialog for link insertion.
 *
 * @module  Dialogs
 * @class   LinkDialog
 */
function LinkDialog(editor) {
    "use strict";
    if (!(this instanceof LinkDialog)) {
        return new LinkDialog(editor);
    }
    AbstractDialog.call(this, editor);

    this.setController(new CLink());
    this.setAdapter(NEWSLETTER.editorAdapter);
    this.setPluginName('LinkPlugin');

    /**
     * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
     * @property  {CLink}     _controller
     * @type      {CLink}
     * @private
     */
    var _controller = this.getController();
    _controller.setEditorAdapter(NEWSLETTER.editorAdapter);

    /**
     * {{#crossLink "LinkMailDialog/_controller:property"}}_controller{{/crossLink}} configurator.
     * @method  anonymous
     * @return  {void}
     * @since   0.1.0
     * @private
     */
    // (function() {
    //     var worker = new Document();
    //     worker.setFactory(NEWSLETTER.factory);
    //     _controller.setWorker(worker);
    // }());

    // this.setWorker(new Document());
    // this.getWorker().setFactory(NEWSLETTER.factory);



    /**
     * Style for text input fields for choosing colors.
     * @property {String} _inputColorStyle
     * @type     {String}
     * @private
     */
    var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';


    /**
     * Style for label fields (text in front of input fields).
     * @property {String} _labelStyle
     * @type     {String}
     * @private
     */
    // var getTextInputStyle() = 'padding-left: 0px; margin: 0; float: left; width: 100%;';

    /**
     * Style for warning fields.
     * @property {String} _warningStyle
     * @type     {String}
     * @private
     */
    // var _warningStyle = 'color: #EE0000; font-size: 1.1em; font-weight: bold;';


    /**
     * Color picker (JavaScript ColorPicker).
     *
     * dhtmlxColorPicker is open source GPL v2 and Free License
     * [JavaScript component](http://dhtmlx.com/docs/products/dhtmlxColorPicker/)
     * for easy color selection.
     *
     * @property {dhtmlXColorPicker} _colorPicker
     * @private
     * @since  0.0.6
     */
    var _colorPicker = new dhtmlXColorPicker();

    /**
     * {{#crossLink "table2Dialog/_colorPicker:property"}}_colorPicker{{/crossLink}} initializer.
     *
     * `z-index` of the color picker is assigned a value that is greater than `z-index` of
     * the table dialog window. Without this assignment, the color picker dialog window is
     * located below the layer of the table dialog window and hence remains unreachable.
     *
     * There might be a better way to find dynamically what z-index it should be assigned.
     * For the moment, the table dialog window turns out to have z-index 10010 (found by
     * analyzing its html code).
     * @method  colorPeackerInit
     * @return {void}
     * @since  0.0.6
     */
    (function() {
        _colorPicker.attachEvent('onShow', function() {
            // console.log(this);
            var elem = this.base;
            elem.childNodes[0].style.zIndex = '10011';
        });
    }());

    var _pluginName = this.getPluginName();
    var _dialog;



    /**
     * Appends {{#crossLink "TableDialog/_colorPicker:property"}}color picker{{/crossLink}} instance
     * to many elements.
     *
     * The user elements are provided by means of the argument which should be given in the following format:
     * {tabId1: [pageId1, pageId2, ...], tabId2: [pageId1, pageId2, ...], ...}
     * @method         appendColorPickerToBunch
     * @param          {Object}        dialog
     * @param          {Object}        elements
     * @return         {void}
     * @since          0.2.1
     */
    var _appendColorPickerToBunch = function(dialog, elements) {
        var tab, ids, len, i, id;
        for (tab in elements) {
            if (elements.hasOwnProperty(tab)) {
                ids = elements[tab];
                len = ids.length;
                for (i = 0; i < len; i++) {
                    try {
                        id = dialog.getContentElement(tab, ids[i]).getInputElement().$.getAttribute('id');
                        _colorPicker.linkTo(id);
                    } catch (e) {
                        console.log(e.name + ' occurred when linking color picking dialog to input element (' + i + ' of tab ' + tab + '): ' + e.message);
                    }


                }
            }
        }
    };



    return {
        title: editor.lang[_pluginName].title,
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'linkInfoTab',
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'text',
                    id: 'href',
                    label: editor.lang[_pluginName].url,
                    title: editor.lang[_pluginName].urlDescr,
                    style: this.getTextInputStyle(),
                    validate: function() {
                        var isOk = Boolean(this.getValue().trim());
                        if (!isOk) {
                            _controller.setDialogHtmlField(this.getDialog(), {
                                tabId: 'linkInfoTab',
                                elemId: 'warning',
                                value: editor.lang[_pluginName].invalid
                            });
                        }
                        return isOk;
                    }
                }, {
                    type: 'html',
                    id: 'warning',
                    html: '&nbsp;',
                    style: this.getWarningStyle()
                }, {
                    type: 'text',
                    id: 'content',
                    label: editor.lang[_pluginName].content,
                    title: editor.lang[_pluginName].contentDescr,
                    style: this.getTextInputStyle(),
                }, {
                    type: 'text',
                    id: 'title',
                    label: editor.lang[_pluginName].title,
                    title: editor.lang[_pluginName].titleDescr,
                    style: this.getTextInputStyle(),
                }, {
                    type: 'checkbox',
                    id: 'isUnderlined',
                    label: editor.lang[_pluginName].underline,
                    title: editor.lang[_pluginName].underlineDescr,
                    'default': true,
                }, {
                    type: 'checkbox',
                    id: 'isTargetBlank',
                    label: editor.lang[_pluginName].target,
                    title: editor.lang[_pluginName].targetDescr,
                    "default": true,
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].color,
                    title: editor.lang[_pluginName].colorDescr,
                    id: 'color',
                    'default': '#0000FF',
                    customcolors: true,
                    inputStyle: _inputColorStyle
                }],
            }]
        }],


        /**
         * The function to execute when the dialog is displayed for the first time.
         *
         * Binds {{#crossLink "table2Dialog/_colorPicker:property"}}_colorPicker{{/crossLink}}
         * to color-related input text fields.
         * @method     onLoad
         * @return     {void}
         */
        onLoad: function() {
            // ui text input elements to which append color picker
            // format: tabId: [pageId1, pageId2, ...]
            var colorInputFields = {
                'linkInfoTab': ['color']
            };
            console.log("on load:", this);
            _dialog = this;
            _appendColorPickerToBunch(this, colorInputFields);
        },

        onCancel: function() {
            _controller.setDialogHtmlField(_dialog, {
                tabId: 'linkInfoTab',
                elemId: 'warning',
                value: '&nbsp;'
            });
        },

        onOk: function() {
            var params = {
                'target': _controller.getExtra(this),
                'selection': _controller.getEditorSelection(editor)
            };
            _controller.onOk(_dialog, editor, params);
        }
    };
}
LinkDialog.prototype = Object.create(AbstractDialog.prototype);


CKEDITOR.dialog.add('LinkPluginDialog', LinkDialog);
