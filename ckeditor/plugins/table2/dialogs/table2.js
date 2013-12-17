CKEDITOR.dialog.add('table2Dialog', function(editor) {
    var INPUTCOLWIDTHNAME = 'widthCol';
    // adds input fields to set the widths of the table columns
    var drawColumns = function() {
            var element = CKEDITOR.document.getById('columnWidthTable');
            var title = CKEDITOR.document.getById('columnWidthTableTitle')
            title.setHtml('');
            var children = element.getChildren();
            var length = children.count();
            for (var i = 0; i < length; i++) {
                children.getItem(i).remove();
            };

            var colWidthInput = new CKEDITOR.dom.element('table');
            var tr = new CKEDITOR.dom.element('tr');
            colWidthInput.append(tr);
            var colNum =  this.getDialog().getValueOf('info', 'tblCols');
            if(colNum > 1){
                for (var i = 0; i < colNum; i++) {
                    var td = new CKEDITOR.dom.element('td');
                    var inputField = new CKEDITOR.dom.element('input');
                    inputField.setAttribute('type', 'text');
                    inputField.setAttribute('id', INPUTCOLWIDTHNAME + i);
                    inputField.setAttribute('width', '50');
                    inputField.setAttribute('class', 'cke_dialog_ui_input_text');
                    td.append(inputField);
                    tr.append(td);
                }; 
                element.append(colWidthInput);
                title.setHtml('Fattori con i quali le colonne contribuiscono<br>nella larghezza della tabella:');
                console.log(editor.getSelection().getStartElement().getComputedStyle('width'));

            };
            
        };

    var parentWidth = function(){
        var rawWidth = editor.getSelection().getStartElement().getComputedStyle('width');
        // validateWidth()  function is defined in js/helpers.js
        return validateWidth(rawWidth);
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
                children: [ {
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
        onOk: function() {
            console.log('inside onOk: isnserting table of width ' + parentWidth());
            
            var dialog = this;

            // user input
            var rows = dialog.getValueOf('info', 'tblRows');
            var cols = dialog.getValueOf('info', 'tblCols');
            var borderWidth = dialog.getValueOf('info', 'borderWidth');
            var borderWidthRow = dialog.getValueOf('info', 'borderWidthRow');
            var spaceBtwRows = dialog.getValueOf('info', 'spaceBtwRows');

            // read inserted values 
            var colWidths = [];
            for (var i = 0; i < cols; i++) {
                // in fact, this check is needed only when the user does not change the default number of the table rows
                var inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
                colWidths[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
            }

            var isFramed = borderWidthRow > 0; // whether each row should be framed


            // calculating widths
            //var parent = table.getParent();
            var tableWidth = parseFloat(parentWidth());//isNaN(parent.$.width) ? NEWSLETTER.width : parent.$.width;
            var trWidth = tableWidth - 2 * borderWidth;
            var tdWidth = columnWidths(trWidth, colWidths); // array of column widths
            console.log('calculated parameters: tableWidth ' + tableWidth + ', borderWidth ' + borderWidth + ', trWidth ' + trWidth + ', tdWidth ' + tdWidth);
            
            // defining styles
            var stylesTable = new TableAttributes();
            if(borderWidth > 0){
                stylesTable['border-width'] = borderWidth + 'px';
                stylesTable['border-color'] = 'rgb(0, 0, 0)';

            }
            stylesTable.setWidth(tableWidth + 'px');
            
            stylesTable['border-spacing'] = '0px ' + spaceBtwRows + 'px';

            //////////
            var table = new Table();
            var tableStyle = new TableAttributes();
            var rowStyle = new TableRowAttributes();

            tableStyle.setWidth(tableWidth);
            rowStyle.setWidth(trWidth);
            var contentLine = [], cellStyles = [];
            for(var i = 0; i < cols; i++){
                contentLine.push(new Content());
                var tableCellAttr = new TableCellAttributes();
                tableCellAttr.setWidth(tdWidth[i]);
                cellStyles.push(tableCellAttr);
            }

            table.style = tableStyle;
            table.rowStyle = rowStyle;
            

            if(isFramed){
                table.cellStyles = [rowStyle];
                // setting props of the nested table
                var nested = new Table();
                var nestedStyle = new TableAttributes();
                nestedStyle["border-width"] = borderWidthRow + 'px';
                nestedStyle.setWidth(trWidth);
                nestedStyle["border-color"] = "rgb(0, 0, 0)";
                var nestedRowStyle = new TableRowAttributes();
                nestedRowStyle.setWidth(trWidth - 2 * borderWidthRow);
                var nestedCellStyles = cellStyles;
                var nestedContent = contentLine;

                nested.style = nestedStyle;
                nested.rowStyle = nestedRowStyle;
                nested.cellStyles = nestedCellStyles;
                nested.content.push(nestedContent);

                for(var i = 0; i < rows; i++){
                    table.content.push([nested]);
                }

            }else{
                table.cellStyles = cellStyles;
                for(var i = 0; i < rows; i++){
                    table.content.push(contentLine);
                }
                
            }
            var tableHtml = table.toHtml();
            
            var tableElem = CKEDITOR.dom.element.createFromHtml(tableHtml);
            editor.insertElement(tableElem);

//             var table = new CKEDITOR.dom.element('table');
// //            editor.insertElement(table);
            

//             //////////


//             var stylesRow = new TableRowAttributes();
//             stylesRow.setWidth(trWidth + 'px');

//             // applying styles
//             /*table.setAttribute('width', tableWidth);
//             table.setAttribute('border', borderWidth);
//             table.setAttribute('cellspacing', 0);
//             table.setAttribute('cellpadding', 0);*/
//             table.setAttribute('style', stylesTable.toString());

//             for (var r = 0; r < rows; r++) {
//                 var tr = new CKEDITOR.dom.element('tr');
//                 tr.setAttribute('width', trWidth);
//                 tr.setAttribute('style', stylesRow.toString());
//                 table.append(tr);
//                 if (isFramed) {
//                     // the border should be present around the rows, that means that each row of the original cell 
//                     // should be single-cell block inside which there should be another table (with the border)
//                     // containing the requested cells.
//                     var td2 = new CKEDITOR.dom.element('td');
//                     tr.append(td2);
//                     var table2 = new CKEDITOR.dom.element('table');
//                     td2.append(table2);
//                     var tr2 = new CKEDITOR.dom.element('tr'); // the forthcoming cells are to be appended to this element
//                     table2.append(tr2);

//                     // calculating widths of the newly created elements
//                     var td2Width = trWidth;
//                     var table2Width = td2Width;
//                     var tr2Width = table2Width - 2 * borderWidthRow;

//                     // styles of the newly created elements
//                     var stylesCell2 = new TableCellAttributes();
//                     stylesCell2.setWidth(td2Width + 'px');
//                     stylesCell2['border-width'] = borderWidthRow + 'px';
//                     stylesCell2['border-color'] = 'rgb(0, 0, 0)';

//                     var stylesTable2 = new TableAttributes();
//                     stylesTable2.setWidth(table2Width + 'px');
//                     stylesTable2['border-width'] = borderWidthRow + 'px';
//                     stylesTable2['border-color'] = 'rgb(0, 0, 0)';
// /*                  stylesTable2['margin-top'] = spaceBtwRows + 'px';
//                     stylesTable2['margin-bottom'] = stylesTable2['margin-top'];
//                     stylesTable2['cell-spacing'] = '0px ' + spaceBtwRows + 'px';*/
//                     stylesTable2['border-collapse'] = 'collapse';


//                     var stylesRow2 = new TableRowAttributes();
//                     stylesRow2.setWidth(tr2Width + 'px');

//                     // applying styles
//                     td2.setAttribute('width', td2Width);
//                     td2.setAttribute('style', stylesCell2.toString());

//                     table2.setAttribute('width', table2Width);
// /*                    table2.setAttribute('border', borderWidthRow);
//                     table2.setAttribute('cellspacing', 0);
//                     table2.setAttribute('cellpadding', 0);*/
//                     table2.setAttribute('style', stylesTable2.toString());

//                     tr2.setAttribute('width', tr2Width);
//                     tr2.setAttribute('style', stylesRow2.toString());
//                 } else {
//                     // if the board around the rows is not requested, then just duplicate the table row variable 
//                     // and append the forthcoming cells to this element
//                     var tr2 = tr;
//                     var tr2Width = trWidth;
//                 }

//                 var cellWidths = columnWidths(tr2Width, colWidths);

//                 for (var c = 0; c < cols; c++) {
//                     var td = new CKEDITOR.dom.element('td');
//                     var stylesCellNew = new TableCellAttributes();
//                     stylesCellNew.setWidth(cellWidths[c] + 'px');
//                     td.setAttribute('width', cellWidths[c]);
//                     td.setAttribute('style', stylesCellNew.toString());
//                     td.setHtml('&#164;');
//                     tr2.append(td);
//                 };
//             };
        },

        onShow: function(){
            
            
        }
    };
});