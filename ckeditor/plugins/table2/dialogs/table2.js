/**
 * The table2 dialog definition.
*/

CKEDITOR.dialog.add( 'table2Dialog', function(editor) {

	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.common.generalTab,
		minWidth:  300,
		minHeight: 300,

        // Dialog window contents definition.
        contents: [{
                id: "info",
                label: editor.lang.table.title,
                elements: [ {
                    type: "hbox",
                    widths: ['50%', '50%'],
                    styles: ["vertical-align:middle"],
                    children: [{
                        type: "text",
                        label: editor.lang.table.rows,
                        id: 'tblRows',
                        style: 'padding-top: 8em;float: right;padding-right: 0px; margin:0;',
                        "default": "3",
                        width: "20%"
                    }, {
                        type: "vbox",
                        children: [{
                            type: "text",
                            label: editor.lang.table.columns,
                            id: 'tblCols',
                            "default": "2",
                            width: "20%",

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
                        label: 'Bordo attorno alla tabella',
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
                }]
            }
        ],


		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
			var dialog = this;

            // user input
            var rows = dialog.getValueOf('info', 'tblRows');
            var cols = dialog.getValueOf('info', 'tblCols');
            var borderWidth = dialog.getValueOf('info', 'borderWidth'); 
            var borderWidthRow = dialog.getValueOf('info', 'borderWidthRow'); 
            var spaceBtwRows = dialog.getValueOf('info', 'spaceBtwRows'); 
            var isFramed = borderWidthRow > 0; // whether each row should be framed

			var table = new CKEDITOR.dom.element('table');
            table.setAttribute('border', borderWidth);
			editor.insertElement(table);

            var parent = table.getParent();
            var elemWidth = isNaN(parent.$.width) ? NEWSLETTER.width : parent.$.width;
            
            // defining styles
            var stylesTable = new TableAttributes();
            stylesTable.setWidth(elemWidth + "px");
            stylesTable["border-width"] = borderWidth + "px";
            stylesTable.margin = spaceBtwRows/2 + "px";

            var stylesRow   = new TableRowAttributes();
            stylesRow.setWidth(elemWidth + "px");


            var stylesCell = new TableCellAttributes();
            stylesCell.setWidth(elemWidth/cols + "px");

            table.setAttribute('width', elemWidth);
            table.setAttribute('style', stylesTable.toString());

            for (var r = 0; r < rows; r++) {
                var tr = new CKEDITOR.dom.element('tr');
                tr.setAttribute('width', elemWidth); // the row must be of the same width as the table's one it belongs to
                tr.setAttribute('style', stylesRow.toString());
                table.append(tr);

                if(isFramed){ 
                    // the border should be present around the rows, that means that each row of the original cell 
                    // should be single-cell block inside which there should be another table (with the border)
                    // containing the requested cells.
                    var td2 = new CKEDITOR.dom.element('td');
                    tr.append(td2);
                    var tbl2 = new CKEDITOR.dom.element('table');
                    td2.append(tbl2);
                    var tr2 = new CKEDITOR.dom.element('tr'); // the forthcoming cells are to be appended to this element
                    tbl2.append(tr2);

                    // creating and applying styles to the newly created elements
                    var stylesCell2   = new TableCellAttributes();
                    stylesCell2.setWidth(elemWidth + "px");
                    td2.setAttribute('style', stylesCell2.toString());

                    var stylesTable2   = new TableAttributes();
                    stylesTable2.setWidth(elemWidth + "px");
                    stylesTable2["border-width"] = borderWidthRow + "px";
                    tbl2.setAttribute('style', stylesTable2.toString());

                    var stylesRow2 = new TableRowAttributes();
                    stylesRow2.setWidth(elemWidth + 'px');
                    tr2.setAttribute('style', stylesRow2.toString());

                }else{
                    // if the board around the rows is not requested, then just duplicate the table row variable 
                    // and append the forthcoming cells to this element
                    var tr2 = tr;
                }

                for (var c = 0; c < cols; c++) {
                    var td = new CKEDITOR.dom.element('td');
                    td.setAttribute('width', elemWidth/cols); // !!! to be taken from the user input
                    td.setAttribute('style', stylesCell.toString());
                    td.setHtml('row ' + r + ', column ' + c + (isFramed ? '  framed' : '  no frame' ));
                    tr2.append(td);
                };
            };
		}
	};
});