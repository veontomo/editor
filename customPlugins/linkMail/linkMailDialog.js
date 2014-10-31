/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection, NEWSLETTER, FACTORY, CLink */

/**
* Unified dialog for link and e-mail insertion.
*
* @module  Dialogs
* @class   LinkDialog
*/
function linkMailDialog(editor, scheme) {

    /**
     * Instance of {{#crossLink "CLink"}}CLink{{/crossLink}}
     * @property  {CLink}     _controller
     * @type      {CLink}
     * @private
     */
    var _controller = new CLink();

    var warningFieldId = 'linkWarning',
        alt = true,
        _heading = 'padding: 1em; font-size: 1.1em; font-weight: bold;',
        selection;          // global variable to pass info about selection

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
    var _labelStyle = 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em; width: 3em;';

    /**
     * Style for label fields (text in front of input fields).
     * @property {String} _labelStyle
     * @type     {String}
     * @private
     */
    var _textInputStyle = 'padding-left: 0px; margin: 0; float: left; width: 100%;';

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
    (function(){
        _colorPicker.attachEvent('onShow', function(){
            // console.log(this);
            var elem = this.base;
            elem.childNodes[0].style.zIndex = '10011';
        });
    })();

    var _pluginName = 'linkMail';
    return {
        title: editor.lang[_pluginName][scheme + 'Title'],
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'linkInfoTab',
            label: 'labelTab1',
            elements: [{
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: editor.lang[_pluginName][scheme],
                    style: _labelStyle,
                }, {
                    type: 'text',
                    id: 'href',
                    style: _textInputStyle,
                    validate: function(){
                        var isOk = Boolean(this.getValue().trim());
                        if (!isOk){
                            var warningField = CKEDITOR.document.getById(warningFieldId);
                            warningField.setHtml(editor.lang.common.invalidValue); }
                        return isOk;
                    }
                }]
            },
            {
                type: 'html',
                html: '<div id="linkWarning" style="color:red;"></div>'
            },
            {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: editor.lang[_pluginName].text,
                    title: editor.lang[_pluginName][scheme + 'TextTitle'],
                    style: _labelStyle
                }, {
                    type: 'text',
                    id: 'text',
                    title: editor.lang[_pluginName][scheme + 'TextTitle'],
                    style: _textInputStyle,
                    'default': 'descrizione del link'
                }]
            },
            {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: editor.lang[_pluginName].title,
                    title: editor.lang[_pluginName].titleTitle,
                    style: _labelStyle
                }, {
                    type: 'text',
                    id: 'title',
                    title: editor.lang[_pluginName].titleTitle,
                    style: _textInputStyle,
                    'default': ''
                }]
            }, {
                type: 'html',
                style: _heading,
                html:  editor.lang[_pluginName].styleTitle,
            }, {
                type: 'checkbox',
                id: 'isUnderlined',
                label: editor.lang[_pluginName].underline,
                "default": alt,
            }, {
                type: 'checkbox',
                id: 'isNewWindow',
                label: editor.lang[_pluginName].targetNew,
                "default": true,
            }, {
                type: 'text',
                label: editor.lang[_pluginName].colordialog,
                id: 'color',
                'default': '#0000FF',
                customcolors: true,
                inputStyle: _inputColorStyle
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
        onLoad: function(){
            // ui text input elements to which append color picker
            // format: tabId: [pageId1, pageId2, ...]
            var colorInputFields = {
                'linkInfoTab':  ['color']
            };
            var tab, ids, len, i, id;
            for (tab in colorInputFields){
                ids = colorInputFields[tab];
                len = ids.length;
                for (i = 0; i < len; i++){
                    id = this.getContentElement(tab, ids[i]).getInputElement().$.getAttribute('id');
                    _colorPicker.linkTo(id);
                }
            }
        },

        /**
         * The function to execute when the dialog is loaded (executed every time the dialog is opened).
         *
         * Fills in link plugin dialog with selected (if any) link properties.
         * @method    onShow
         * @return    {void}
         */
        onShow: function() {
            selection = new Selection(editor);
            _controller.fillInDialogWithSelection(this, editor, selection);
        },

        onCancel: function(){
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function(){
            _controller.convertToLinks(this, editor, selection, scheme);
        }
    };
}

function linkDialog(editor){
  return linkMailDialog(editor, 'link');
}

function mailDialog(editor){
  return linkMailDialog(editor, 'mail');
}

CKEDITOR.dialog.add('mailDialog', mailDialog);

CKEDITOR.dialog.add('linkDialog', linkDialog);
