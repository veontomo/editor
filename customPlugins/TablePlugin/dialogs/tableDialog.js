/*jslint plusplus: true, white: true */
/*global CKEDITOR, Document, Table, NEWSLETTER, CTable, dhtmlXColorPicker */

/**
 * Returns dialog window for creating a new table.
 *
 * @module        Dialogs
 * @class         TableDialog
 * @param         {Object}        editor      instance of CKEDITOR
 * @return        {Object}        dialog definition
 * @since         0.0.6
 */
function TableDialog(editor) {

    /**
     * Instance of {{#crossLink "Controller"}}Controller{{/crossLink}}.
     * @property       {CTable}        _controller
     * @type           {CTable}
     * @private
     */
    var _controller = new CTable();
    _controller.setEditorAdapter(NEWSLETTER.editorAdapter);

    /**
     * Configures {{#crossLink "TableDialog/_controller:property"}}_controller{{/crossLink}}.
     * @method  constructor
     * @since   0.2.0
     */
    (function() {
        var worker = new Document();
        worker.setFactory(NEWSLETTER.factory);
        _controller.setWorker(worker);
    }());


    /**
     * Name of the plugin the current dialog belongs to.
     * @property       {String} _pluginName
     * @type           {String}
     * @private
     * @since          0.2.0
     */
    var _pluginName = 'TablePlugin';

    /**
     * Location of the directory containing plugin icons.
     * @property      {String}        _iconsDir
     * @type          {String}
     * @since         0.2.0
     * @private
     */
    var _iconsDir = NEWSLETTER.customPluginDir + _pluginName + '/dialogs/icons/';

    /**
     * Style for text input fields for numbers.
     * @property {String} _inputNumberStyle
     * @type     {String}
     * @private
     */
    var _inputNumberStyle = 'min-width: 3em; width: 5em; max-width: 7em; text-align: center;';

    /**
     * Style for text input fields for choosing colors.
     * @property       {String}        _inputColorStyle
     * @type           {String}
     * @private
     */
    var _inputColorStyle = 'min-width: 6em; width: 6em; max-width: 6em; text-align: center;';

    /**
     * Style for icons representing borders between columns and rows.
     * @property {String} _borderIconStyle
     * @type     {String}
     * @private
     */
    var _borderIconStyle = 'width: 15px; height: 15px;';


    /**
     * id of the page with column weights
     * @property {String} COLUMN_WEIGHT_PAGE_ID
     * @since  0.2.8
     * @private
     */
    var COLUMN_WEIGHT_PAGE_ID = 'columnWeight';

    /**
     * Color picker (JavaScript ColorPicker).
     *
     * dhtmlxColorPicker is open source GPL v2 and Free License [JavaScript component](http://dhtmlx.com/docs/products/dhtmlxColorPicker/)
     * for easy color selection.
     *
     * @property       {dhtmlXColorPicker} _colorPicker
     * @private
     * @since  0.0.6
     */
    var _colorPicker = new dhtmlXColorPicker();

    /**
     * {{#crossLink "TableDialog/_colorPicker:property"}}_colorPicker{{/crossLink}} initializer.
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


    /**
     * Creates a new tab in the dialog window with input fields to insert weight
     * factors for the column widths.
     *
     * This function is executed each time the value of a dialog input field to which this
     * function is "assigned" changes.
     *
     * @method         drawInputCells
     * @property       {Object}        el
     * @return         {void}
     * @since          0.2.8
     * @private
     */
    var drawInputCells = function(el) {
    	console.log('drawInputCells', el, el.sender);
        try {
            var dialog = this.getDialog(),
                lastColNum = parseInt(el.data.value, 10),
                children = [],
                child,
                i;
            dialog.hidePage(COLUMN_WEIGHT_PAGE_ID);
            if (isNaN(lastColNum) || lastColNum <= 2) {
            	// changing input value in this way triggers
            	// recursive calls
                // this.setValue("1");
                return;
            }

            for (i = 1; i < lastColNum + 1; i++) {
                child = {
                    type: 'text',
                    id: 'colWeight' + i,
                    label: editor.lang[_pluginName].columnNo + ' ' + i,
                    inputStyle: 'min-width: 3em; width: 5em; text-align: center; margin: 0.2em',
                };
                children.push(child);
            }
            var colWeigthTab = {
                id: COLUMN_WEIGHT_PAGE_ID,
                label: editor.lang[_pluginName].colWeightLabel,
                elements: [{
                    'type': 'html',
                    'html': editor.lang[_pluginName].colWeightDescr,
                }, {
                    'type': 'hbox',
                    'children': children
                }]
            };
            this.getDialog().addPage(colWeigthTab);
            this.getDialog().selectPage(COLUMN_WEIGHT_PAGE_ID);
        } catch (e) {
            console.log(e.name + ' occurred when retrieving number of columns: ' + e.message);
        }
    };

    /**
     * Removes (if any) input field resposible for column widths.
     * @param          {CKEDITOR.dialog}    dialog
     * @method         dropInputCells
     * @return         {void}
     * @since          0.0.6
     */
    var dropInputCells = function(dialog) {
        dialog.hidePage(COLUMN_WEIGHT_PAGE_ID);
    };

    /**
     * It takes the content of input field that invoked this function and converts
     * it into a number. If the convertion fails, 1 is used. The result of the conversion
     * is then substituted into the input field.
     * @method         asNumber
     * @return         {void}
     * @since          0.0.6
     */
    var asNumber = function() {
        var input = this.getValue(),
            num = parseInt(input, 10),
            result = input !== undefined && num.toString() === input;
        if (!result) {
            this.setValue(isNaN(num) ? '1' : num.toString());
        }
    };

    /**
     * Binds element that invoked this method with specific text input field: if the elements invokes this function,
     * the value of target text input field gets modified.
     *
     * If the element invokes this function and target text input field value is not positive,
     * then this field recieves value 1.
     *
     * Invoking element must have `target` key to be set to a three-element array
     * <code>[tabId, elementId, defaultValue]</code>
     * where `tabId` and `elemId` chracterize location of the target element and `defaultValue`
     * is value that is suggested for the target.
     *
     * @method         suggestValue
     * @return         {void}
     * @since          0.0.6
     */
    var suggestValue = function() {
        if (!this.getValue()) {
            return;
        }
        var target = this.target;
        if (!target) {
            return;
        }
        var elem = this.getDialog().getContentElement(target[0], target[1]);
        if (!elem) {
            return;
        }
        var value = parseInt(elem.getValue(), 10);
        if (!(value > 0)) {
            elem.setValue(target[2]);
        }
    };

    /**
     * Returns html tag to insert icon.
     * @method         iconName
     * @param          {String}             fileName  icon file name. It should be located in "table2/icons" folder of the
     *                                      custom plugin folder.
     * @param          {String}             title
     * @return         {String}
     * private
     * @since          0.2.0
     */

    var _iconTag = function(fileName, title) {
        if (typeof fileName === 'string' && fileName.trim()) {
            var titleText = '',
                path = _iconsDir + fileName;
            titleText = ' title="' + (title || fileName) + '"';
            return '<img src="' + path + '"' + titleText + '/>';
        }
    };

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


    var dialogWindow = {
        // Basic properties of the dialog window: title, minimum size.
        title: editor.lang.table.title,
        minWidth: 500,
        minHeight: 300,

        // Dialog window contents definition.
        contents: [{
            id: 'table',
            label: editor.lang[_pluginName].overallTable,
            elements: [{
                type: 'text',
                label: editor.lang[_pluginName].background,
                title: editor.lang[_pluginName].backgroundDescr,
                id: 'background',
                default: '#FFFFFF',
                customcolors: true,
                inputStyle: _inputColorStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].padding,
                title: editor.lang[_pluginName].paddingDescr,
                id: 'padding',
                default: '0',
                inputStyle: _inputNumberStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].margin,
                title: editor.lang[_pluginName].marginDescr,
                id: 'margin',
                default: '0',
                inputStyle: _inputNumberStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].borderColor,
                title: editor.lang[_pluginName].borderColorDescr,
                id: 'border-color',
                default: '#000001',
                inputStyle: _inputColorStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].borderWidth,
                title: editor.lang[_pluginName].borderWidthDescr,
                id: 'border-width',
                default: '0',
                inputStyle: _inputNumberStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].rowNum,
                title: editor.lang[_pluginName].rowNumDescr,
                id: 'rows',
                default: '1',
                onChange: asNumber,
                inputStyle: _inputNumberStyle
            }, {
                type: 'text',
                label: editor.lang[_pluginName].cellNum,
                title: editor.lang[_pluginName].cellNumDescr,
                id: 'columns',
                default: '1',
                onChange: drawInputCells,
                inputStyle: _inputNumberStyle
            }]
        }, {
            id: 'rows',
            label: editor.lang[_pluginName].rows,
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'text',
                    label: editor.lang[_pluginName].padding,
                    title: editor.lang[_pluginName].paddingDescr,
                    id: 'padding',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].margin,
                    title: editor.lang[_pluginName].marginDescr,
                    id: 'margin',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].frameColor,
                    title: editor.lang[_pluginName].frameColorDescr,
                    id: 'frame-color',
                    inputStyle: _inputColorStyle
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].frameWidth,
                    title: editor.lang[_pluginName].frameWidthDescr,
                    id: 'frame-width',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].rowBorderColor,
                    title: editor.lang[_pluginName].rowBorderDescr,
                    id: 'border-color',
                    inputStyle: _inputColorStyle,
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].rowBorderWidth,
                    title: editor.lang[_pluginName].rowBorderDescr,
                    id: 'border-width',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'hbox',
                    widths: ['2em', '2em', 'auto'],
                    children: [{
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('upper.gif', editor.lang[_pluginName].borderFirst)
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderFirst,
                            id: 'borderFirst',
                            default: false,
                            onChange: suggestValue,
                            target: ['rows', 'border-width', '1']
                        }]
                    }, {
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('middleHor.gif', editor.lang[_pluginName].borderMiddle)
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderMiddle,
                            id: 'borderMiddle',
                            default: false,
                            onChange: suggestValue,
                            target: ['rows', 'border-width', '1']
                        }]
                    }, {
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('lower.gif', editor.lang[_pluginName].borderLast)
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderLast,
                            id: 'borderLast',
                            default: false,
                            onChange: suggestValue,
                            target: ['rows', 'border-width', '1']
                        }]
                    }]
                }]
            }]
        }, {
            id: 'cells',
            label: editor.lang[_pluginName].cells,
            elements: [{
                type: 'vbox',
                children: [{
                    type: 'text',
                    label: editor.lang[_pluginName].padding,
                    title: editor.lang[_pluginName].paddingDescr,
                    id: 'padding',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].margin,
                    title: editor.lang[_pluginName].marginDescr,
                    id: 'margin',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].borderColor,
                    title: editor.lang[_pluginName].borderColorDescr,
                    id: 'border-color',
                    default: '#000001',
                    inputStyle: _inputColorStyle
                }, {
                    type: 'text',
                    label: editor.lang[_pluginName].borderWidth,
                    title: editor.lang[_pluginName].borderWidthDescr,
                    id: 'border-width',
                    default: '0',
                    inputStyle: _inputNumberStyle,
                    onChange: asNumber
                }, {
                    type: 'hbox',
                    widths: ['2em', '2em', 'auto'],
                    children: [{
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('left.gif', editor.lang[_pluginName].borderFirst),
                            style: _borderIconStyle
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderFirst,
                            id: 'borderFirst',
                            default: false,
                            onChange: suggestValue,
                            target: ['cells', 'border-width', '1']
                        }]
                    }, {
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('middleVer.gif', editor.lang[_pluginName].borderMiddle)
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderMiddle,
                            id: 'borderMiddle',
                            default: false,
                            onChange: suggestValue,
                            target: ['cells', 'border-width', '1']
                        }]
                    }, {
                        type: 'vbox',
                        children: [{
                            type: 'html',
                            html: _iconTag('right.gif', editor.lang[_pluginName].borderLast)
                        }, {
                            type: 'checkbox',
                            label: '',
                            title: editor.lang[_pluginName].borderlast,
                            id: 'borderLast',
                            default: false,
                            onChange: suggestValue,
                            target: ['cells', 'border-width', '1']
                        }]
                    }]
                }]
            }]
        }],

        /**
         * Binding {{#crossLink "TableDialog/_colorPicker:property"}}_colorPicker{{/crossLink}}
         * to color-related input text fields.
         * @method     onLoad
         * @return     {void}
         */
        onLoad: function() {
            // ui text input elements to which the color picker should be appended
            // format: tabId: [pageId1, pageId2, ...]
            var colorInputFields = {
                'table': ['background', 'border-color'],
                'rows': ['frame-color', 'border-color'],
                'cells': ['border-color'],
            };
            _appendColorPickerToBunch(this, colorInputFields);
        },



        /**
         * The function to execute when the dialog is loaded (executed every time the dialog is opened).
         *
         * @method    onShow
         * @return    {void}
         */
        onShow: function() {},

        /**
         * The function to execute when the dialog is confirmed.
         *
         * @method    onShow
         * @return    {void}
         */
        onOk: function() {
            var params = {
                'target': _controller.getExtra(this),
                'selection': _controller.getEditorSelection(editor)
            };
            _controller.onOk(this, editor, params);
            dropInputCells(this);
        }
    };
    return dialogWindow;
}


CKEDITOR.dialog.add('TablePluginDialog', TableDialog);
