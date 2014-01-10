/*global CKEDITOR, Unit, Table, columnWidths, Table, Row, Cell, TableStyle, TableRowStyle, 
TableCellStyle, Content, TableAttributes, NEWSLETTER
*/
CKEDITOR.dialog.add('table2Dialog', function (editor) {
    var INPUTCOLWIDTHNAME = 'widthCol',
        drawColumns = function () {
            // adds input fields to set the widths of the table columns
            var element = CKEDITOR.document.getById('columnWidthTable'),
                title = CKEDITOR.document.getById('columnWidthTableTitle'),
                children, length, i, td, inputField, colWidthInput, tr, colNum;

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
        },

        /**
         * Returns the width of the parent element available for its children.
         * 
         * available width = (element width) - (element left border width) - (element right border width) - (element left margin) - (element right margin)
         * 
         * The element width is supposed to be greater than zero and hence to have a unit of measurement (e.g. 'px'). 
         * If not set, widths of other attributes are equal to zero without unit of measurement. In this case one has to set the unit of measurement
         * equal to the element width.
         * @return integer    available width for the children as Unit object (with properties "value" and "measure")
         */
        parentWidth = function () {
            var startElem = editor.getSelection().getStartElement(),
                rawWidth = new Unit(startElem.getComputedStyle('width')),
                borderWidthL = new Unit(startElem.getComputedStyle('border-width-left')),
                borderWidthR = new Unit(startElem.getComputedStyle('border-width-right')),
                paddingL = new Unit(startElem.getComputedStyle('padding-left')),
                paddingR = new Unit(startElem.getComputedStyle('padding-right')),
                output;
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
            output.value = Math.round(output.value);
            return output;
        };


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
                    id: 'nestedBorderWidth',
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
            var dialog = this,
                // user input
                rows = parseInt(dialog.getValueOf('info', 'tblRows'), 10),
                cols = parseInt(dialog.getValueOf('info', 'tblCols'), 10),
                borderWidth = parseInt(dialog.getValueOf('info', 'borderWidth'), 10),
                nestedBorderWidth = parseInt(dialog.getValueOf('info', 'nestedBorderWidth'), 10),
                spaceBtwRows = parseInt(dialog.getValueOf('info', 'spaceBtwRows'), 10),

                // variables to be used in what follows
                i, table, tableWidth, tableElem, cellWidths, rowWidth, spaceTop, spaceBottom, isFramed, inputField, cellWeights, row, cell, cells, nestedTable, nestedRow, nestedRowWidth, nestedCell, tableStyle, rowStyle, cellStyle, nestedTableStyle, tableStr;

            // read inserted values 
            cellWeights = [];
            for (i = 0; i < cols; i++) {
                // in fact, this check is needed only when the user does not change the default number of the table rows
                inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
                cellWeights[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
            }

            // calculating widths
            tableWidth = Math.min(parentWidth().value, NEWSLETTER.maxWidth); // integer, the width in px
            rowWidth = tableWidth - 2 * borderWidth;
            spaceTop = parseInt(spaceBtwRows / 2, 10); // top white space for each row (cast to integer)
            spaceBottom = spaceBtwRows - spaceTop; // bottom white space for each row
            cellWidths = columnWidths(rowWidth - 2 * nestedBorderWidth, cellWeights); // array of column widths
            // prepare objects useful in what follows
            table = new Table();
            table.attr['data-marker'] = 'table';
            table.attr.border = borderWidth;

            tableStyle = new TableStyle();
            tableStyle.setWidth(tableWidth);
            if (borderWidth) {
                tableStyle['border-width'] = borderWidth;
                tableStyle['border-style'] = 'solid';
                tableStyle['border-color'] = '#000000';
            }

            table.style = tableStyle;
            // creating a row
            row = new Row();
            row.attr['data-marker'] = 'row';

            rowStyle = new TableRowStyle();
            rowStyle.setWidth(rowWidth);
            // rowStyle['margin-top'] = spaceTop;
            // rowStyle['margin-bottom'] = spaceBottom;
            row.style = rowStyle;

            if (nestedBorderWidth === 0) {
                for (i = 0; i < cols; i++) {
                    cell = new Cell('cell');

                    cellStyle = new TableCellStyle();
                    cellStyle.setWidth(cellWidths[i]);
                    delete cellStyle.padding;
                    cellStyle['padding-left'] = 0;
                    cellStyle['padding-right'] = 0;
                    cellStyle['padding-top'] = spaceTop;
                    cellStyle['padding-bottom'] = spaceBottom;
                    // console.log('cell for non-framed table: ');
                    // console.table(cellStyle);
                    cell.style = cellStyle;
                    row.cells.push(cell);
                }
            } else {
                cell = new Cell();

                cellStyle = new TableCellStyle();
                cellStyle.setWidth(rowWidth);
                delete cellStyle.padding;
                cellStyle['padding-left'] = nestedBorderWidth;
                cellStyle['padding-right'] = nestedBorderWidth;
                cellStyle['padding-top'] = spaceTop;
                cellStyle['padding-bottom'] = spaceBottom;
                // console.log('cell for framed table: ');
                // console.table(cellStyle);
                cell.style = cellStyle;

                nestedTable = new Table();
                nestedTable.attr.border = nestedBorderWidth;

                nestedTableStyle = new TableStyle();
                nestedTableStyle['border-width'] = nestedBorderWidth;
                nestedTableStyle['border-color'] = '#000000';
                nestedTableStyle['border-style'] = 'solid';
                nestedTableStyle['margin-top'] = spaceTop;
                nestedTableStyle['margin-bottom'] = spaceBottom;

                nestedTableStyle.setWidth(cell.styleProperty('width'));

                nestedTable.style = nestedTableStyle;

                nestedRow = new Row();
                nestedRowWidth = nestedTable.styleProperty('width') - 2 * nestedBorderWidth;
                nestedRow.setWidth(nestedRowWidth);

                for (i = 0; i < cols; i++) {
                    nestedCell = new Cell('nested cell');
                    nestedCell.setWidth(cellWidths[i]);
                    nestedRow.cells.push(nestedCell);
                }
                nestedTable.rows.push(nestedRow);
                cell.content.elements.push(nestedTable);
                row.cells.push(cell);
            }

            // duplicating the row
            for (i = 0; i < rows; i++) {
                table.rows.push(row);

            }
            // var tableStr = '<table cellpadding="0" cellspacing="0" data-marker="table" border="0" style="border-color: #FFFFFF;border-style: none;border-width: 0px;margin: 0px;padding: 0px;width: 500px;max-width: 500px;min-width: 500px;border-spacing: 0px 1px;"><tr data-marker="row" style="border-color: #FFFFFF;border-style: none;border-width: 0px;margin: 0px;padding: 0px;width: 500px;max-width: 500px;min-width: 500px;"><td style="border-color: #FFFFFF;border-style: none;border-width: 0px;padding: 0px;margin: 0px;width: 500px;max-width: 500px;min-width: 500px;vertical-align: top;padding-top: 0px;padding-bottom: 2px;">static cell</td></tr></table>';
            console.log(tableStr);
            tableStr = table.toHtml();

            tableElem = CKEDITOR.dom.element.createFromHtml(tableStr);
            editor.insertElement(tableElem);
            // assigning events 
            $(tableElem.$).find('td').hover(function () {
                $(this).css('box-shadow', '0.1em 0em 0.2em 0em #000000');
                return false;
            }, function () {
                var attr = $(this).attr('style'),
                    noShadow = attr.replace(/box-shadow:[^;]+;/i, '');
                $(this).attr('style', noShadow);
            });

        }
    };
});