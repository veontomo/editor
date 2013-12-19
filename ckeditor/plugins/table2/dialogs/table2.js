CKEDITOR.dialog.add('table2Dialog', function (editor) {
    var INPUTCOLWIDTHNAME = 'widthCol',
        drawColumns = function () {
            // adds input fields to set the widths of the table columns
            var element = CKEDITOR.document.getById('columnWidthTable'),
                title = CKEDITOR.document.getById('columnWidthTableTitle'),
                children,
                length,
                i,
                td,
                inputField,
                colWidthInput,
                tr,
                colNum;

            title.setHtml('');
            children = element.getChildren();
            length = children.count();
            for (i = 0; i < length; i++) {
                children.getItem(i).remove();
            }

            colWidthInput = new CKEDITOR.dom.element('table');
            tr = new CKEDITOR.dom.element('tr');
            colNum = this.getDialog().getValueOf('info', 'tblCols');
            colWidthInput.append(tr);
            if (colNum > 1) {
                for (i = 0; i < colNum; i++) {
                    td = new CKEDITOR.dom.element('td');
                    inputField = new CKEDITOR.dom.element('input');
                    inputField.setAttribute('type', 'text');
                    inputField.setAttribute('id', INPUTCOLWIDTHNAME + i);
                    inputField.setAttribute('width', '50');
                    inputField.setAttribute('class', 'cke_dialog_ui_input_text');
                    td.append(inputField);
                    tr.append(td);
                }
                element.append(colWidthInput);
                title.setHtml('Fattori con i quali le colonne contribuiscono<br>nella larghezza della tabella:');
            }

        };

    /**
     * Returns the width of the parent element available for its children.
     * 
     * available width = (element width) - (element left border width) - (element right border width) - (element left margin) - (element right margin)
     * 
     * The element width is supposed to be greater than zero and hence to have a unit of measurement (e.g. 'px'). 
     * If not set, widths of other attributes are equal to zero without unit of measurement. In this case one has to set the unit of measurement
     * equal to the element width.
     * @return Object    available width for the children as Unit object (with properties "value" and "measure")
     */
    var parentWidth = function () {
            var startElem = editor.getSelection().getStartElement();
            var rawWidth = new Unit(startElem.getComputedStyle('width'));
            var borderWidthL = new Unit(startElem.getComputedStyle('border-width-left'));
            var borderWidthR = new Unit(startElem.getComputedStyle('border-width-right'));
            var paddingL = new Unit(startElem.getComputedStyle('padding-left'));
            var paddingR = new Unit(startElem.getComputedStyle('padding-right'));
            if (borderWidthL.value === 0) {
                borderWidthL.measure = rawWidth.measure;
            }
            if (borderWidthR.value === 0) {
                borderWidthR.measure = rawWidth.measure;
            }
            if (paddingL.value === 0) {
                paddingL.measure = rawWidth.measure;
            }
            if (paddingR.value === 0) {
                paddingR.measure = rawWidth.measure;
            }
            output = rawWidth.sub(borderWidthL).sub(borderWidthR).sub(paddingL).sub(paddingR);
            return output;
        }


    return {
        // Basic properties of the dialog window: title, minimum size.
        title: editor.lang.common.generalTab,
        minWidth: 300,
        minHeight: 300,

        // Dialog window contents definition.
        contents: [{
            id: "info",
            label: editor.lang.table.title,
            elements: [{
                type: "hbox",
                widths: ['50%', '50%'],
                styles: ["vertical-align:middle"],
                children: [{
                    type: "text",
                    label: editor.lang.table.rows,
                    id: 'tblRows',
                    style: 'padding-top: 8em;margin-left:60%; margin-right: 0px;',
                    "default": "3",
                    width: "50%"
                }, {
                    type: "vbox",
                    children: [{
                        type: "text",
                        label: editor.lang.table.columns,
                        id: 'tblCols',
                        "default": '1',
                        width: "20%",
                        onChange: drawColumns
                    }, {
                        type: 'html',
                        'html': '<img src="images/spreadsheet.png" width="128" height="128">'
                    }]
                }]
            }, {
                type: 'hbox',
                widths: ['30%', '30%'],
                children: [{
                    type: 'text',
                    id: 'borderWidth',
                    label: 'Cornice',
                    "default": "0",
                    width: "40%"
                }, {
                    type: 'text',
                    label: 'Bordo attorno alle righe',
                    width: "40%",
                    id: 'borderWidthRow',
                    "default": "0"
                }, {
                    type: 'text',
                    label: 'Spazio tra le righe',
                    "default": "1",
                    id: 'spaceBtwRows',
                    width: "40%"
                }]
            }, {
                type: 'vbox',
                children: [{
                    type: 'html',
                    html: '<div id="columnWidthTableTitle"></div>'
                }, {
                    type: 'html',
                    widths: ['100%'],
                    html: '<div id="columnWidthTable"></div>'
                }]
            }]
        }],
        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function () {
            var dialog = this;

            // user input
            var rows = parseInt(dialog.getValueOf('info', 'tblRows'));
            var cols = parseInt(dialog.getValueOf('info', 'tblCols'));
            var borderWidth = parseInt(dialog.getValueOf('info', 'borderWidth'));
            var borderWidthRow = parseInt(dialog.getValueOf('info', 'borderWidthRow'));
            var spaceBtwRows = parseInt(dialog.getValueOf('info', 'spaceBtwRows'));

            // read inserted values 
            var colWidths = [];
            for (var i = 0; i < cols; i++) {
                // in fact, this check is needed only when the user does not change the default number of the table rows
                var inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
                colWidths[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
            }

            var isFramed = borderWidthRow > 0; // whether each row should be framed

            // calculating widths
            var tableWidth = parentWidth().value; // the width in px
            var trWidth = tableWidth - 2 * borderWidth;
            var spaceTop = parseInt(spaceBtwRows / 2); // padding-top for the rows (cast to integer)
            var spaceBottom = spaceBtwRows - spaceTop; // padding-bottom 
            var tdWidth = columnWidths(trWidth - 2 * borderWidthRow, colWidths); // array of column widths


            var table = new Table();
            var tableStyle = new TableAttributes();
            var rowStyle = new TableRowAttributes();

            tableStyle.setWidth(tableWidth);
            tableStyle["border-spacing"] = '0px 2px';

            rowStyle.setWidth(trWidth);
            var contentLine = [],
                cellStyles = [];
            for (var i = 0; i < cols; i++) {
                contentLine.push(new Content("&curren;"));
                var tableCellAttr = new TableCellAttributes();
                tableCellAttr.setWidth(tdWidth[i]);
                cellStyles.push(tableCellAttr);
            }

            if (borderWidth > 0) {
                tableStyle['border-width'] = borderWidth;
                tableStyle['border-color'] = '#000000';
            }


            if (isFramed) {
                table.cellStyles = [rowStyle];
                // setting props of the nested table
                var nested = new Table();
                var nestedStyle = new TableAttributes();
                nestedStyle["border-width"] = borderWidthRow;
                nestedStyle["border-color"] = "#000000";
                nestedStyle.setWidth(trWidth);
                nestedStyle["margin-top"] = spaceTop;
                nestedStyle["margin-bottom"] = spaceBottom;

                var nestedRowStyle = new TableRowAttributes();
                nestedRowStyle.setWidth(trWidth - 2 * borderWidthRow);
                nestedRowStyle["border-width"] = borderWidthRow;
                nestedRowStyle["border-color"] = "#000000";
                var nestedCellStyles = cellStyles;
                var nestedContent = contentLine;

                nested.style = nestedStyle;
                nested.rowStyle = nestedRowStyle;
                nested.cellStyles = nestedCellStyles;
                nested.content.push(nestedContent);

                for (var i = 0; i < rows; i++) {
                    table.content.push([nested]);
                }
            } else {
                rowStyle["margin-top"] = spaceTop;
                rowStyle["margin-bottom"] = spaceBottom;
                table.cellStyles = cellStyles;
                for (var i = 0; i < rows; i++) {
                    table.content.push(contentLine);
                }
            }

            table.style = tableStyle;
            table.rowStyle = rowStyle;

            var tableHtml = table.toHtml();

            var tableElem = CKEDITOR.dom.element.createFromHtml(tableHtml);
            editor.insertElement(tableElem);

        },

        onShow: function () {


        }
    };
});