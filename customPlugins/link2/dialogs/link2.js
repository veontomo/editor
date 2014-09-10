/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content, Selection, NEWSLETTER, FACTORY, CLink, dhtmlXColorPicker */

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    var warningFieldId = 'linkWarning',
        alt = true,
        _title = 'padding-bottom: 0.5em; padding-top: 1em',
        selection;          // global variable to pass info about selection

    /**
     * Style for text input fields for choosing colors.
     * @property {String} _inputColorStyle
     * @type     {String}
     * @private
     */
    var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';

        /**
         * Color picker (JavaScript ColorPicker).
         *
         * dhtmlxColorPicker is open source GPL v2 and Free License [JavaScript component](http://dhtmlx.com/docs/products/dhtmlxColorPicker/)
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


    return {
        title: editor.lang.link.info,
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'tab-general',
            label: 'labelTab1',
            title: 'title tab 1',
            elements: [{
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'http://',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;',
                }, {
                    type: 'text',
                    id: 'href_input_field',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
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
                    html: editor.lang.link2.text,
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'text',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    'default': 'descrizione del link'
                }]
            },
            {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: editor.lang.link2.title,
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'optionalTitle',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;',
                    'default': ''
                }]
            }, {
                type: 'html',
                html: '<div style="' + _title + '">' + editor.lang.link2.styleTitle + '</div>',
            }, {
                type: 'checkbox',
                id: 'underlined',
                label: editor.lang.link2.underline,
                "default": alt,
            }, {
                type: 'checkbox',
                id: 'target',
                label: editor.lang.link2.targetNew,
                "default": true,
            }, {
                type: 'text',
                label: editor.lang.link2.colordialog,
                id: 'linkColor',
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
                'tab-general':  ['linkColor']
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
            selection.absorbLink();
            CLink.fillInDialog(this, editor, selection);
        },

        onCancel: function(){
            CKEDITOR.document.getById(warningFieldId).setHtml('');
        },

        onOk: function(){
            CLink.convertToLinks(this, editor, selection);
        }
    };
});