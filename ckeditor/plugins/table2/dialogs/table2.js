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
                        style: 'padding-top: 8em;margin-left:60%; margin-right: 0px;',
                        "default": "3",
                        width: "50%"
                    }, {
                        type: "vbox",
                        children: [{
                            type: "text",
                            label: editor.lang.table.columns,
                            id: 'tblCols',
                            "default": "2",
                            width: "20%",
                            onChange: function(){
                                console.log('tblCols is changed ' + this.getDialog().getValueOf('info', 'tblCols'));
                                var colWidthInput = new CKEDITOR.dom.element('table');
                                var td = new CKEDITOR.dom.element('td');
                                colWidthInput.append(td);
                                for (var i = 0; i < this.getDialog().getValueOf('info', 'tblCols') ; i++) {
                                    var tr = new CKEDITOR.dom.element('tr');
                                    td.append(tr);
                                    tr.setHtml('<input id="colWidth' + i + '"></input>');
                                };
                                console.log(this.getElement().find('#addColumns'));
                                // here one should somehow append element colWidthInput to the element #addColumns
                                /*this.getDialog().getElement().getFirst().insertElement(colWidthInput);*/


                            }

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
                    type: 'html',
                    widths: ['100%'],
                    html: '<div id="addColumns">' 

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
			editor.insertElement(table);



            // calculating widths
            var parent = table.getParent();
            var tablEwidth = isNaN(parent.$.width) ? NEWSLETTER.width : parent.$.width;
            var trWidth = tablEwidth - 2 * borderWidth; // table row width = table width - 2 * (border width)
            var tdWidth = trWidth/cols;

            // defining styles
            var stylesTable = new TableAttributes();
            stylesTable.setWidth(tablEwidth + "px");
            stylesTable["border-width"] = borderWidth + "px";
            
            var stylesRow   = new TableRowAttributes();
            stylesRow.setWidth(trWidth + "px");

            var stylesCell = new TableCellAttributes();
            stylesCell.setWidth(tdWidth + "px");

            // applying styles
            table.setAttribute('width', tablEwidth);
            table.setAttribute('border', 0);
            table.setAttribute('cellspacing', 0);
            table.setAttribute('cellpadding', 0);
            table.setAttribute('style', stylesTable.toString());

            for (var r = 0; r < rows; r++) {
                var tr = new CKEDITOR.dom.element('tr');
                tr.setAttribute('width', trWidth); 
                tr.setAttribute('style', stylesRow.toString());
                table.append(tr);

                if(isFramed){ 
                    // the border should be present around the rows, that means that each row of the original cell 
                    // should be single-cell block inside which there should be another table (with the border)
                    // containing the requested cells.
                    var td2 = new CKEDITOR.dom.element('td');
                    tr.append(td2);
                    var table2 = new CKEDITOR.dom.element('table');
                    td2.append(table2);
                    var tr2 = new CKEDITOR.dom.element('tr'); // the forthcoming cells are to be appended to this element
                    table2.append(tr2);

                    // calculating widths of the newly created elements
                    var td2Width = trWidth; // the 
                    var table2Width = td2Width;
                    var tr2Width = table2Width - 2 * borderWidthRow;

                    // styles of the newly created elements
                    var stylesCell2   = new TableCellAttributes();
                    stylesCell2.setWidth(td2Width + "px");

                    var stylesTable2   = new TableAttributes();
                    stylesTable2.setWidth(table2Width + "px");
                    stylesTable2['border-width'] = borderWidthRow + "px";
                    stylesTable2['margin-top'] = spaceBtwRows + 'px';
                    stylesTable2['margin-bottom'] = stylesTable['margin-top'];


                    var stylesRow2 = new TableRowAttributes();
                    stylesRow2.setWidth(tr2Width + 'px');


                    // applying styles
                    td2.setAttribute('width', td2Width);
                    td2.setAttribute('style', stylesCell2.toString());

                    table2.setAttribute('width', table2Width);
                    table2.setAttribute('border', 0);
                    table2.setAttribute('cellspacing', 0);
                    table2.setAttribute('cellpadding', 0);
                    table2.setAttribute('style', stylesTable2.toString());

                    tr2.setAttribute('width', tr2Width);
                    tr2.setAttribute('style', stylesRow2.toString());
                }else{
                    // if the board around the rows is not requested, then just duplicate the table row variable 
                    // and append the forthcoming cells to this element
                    var tr2 = tr;
                    var tr2Width = trWidth;
                }

                var cellWidth = tr2Width/cols;
                var stylesCellNew = new TableCellAttributes();
                stylesCellNew.setWidth(cellWidth + 'px');

                for (var c = 0; c < cols; c++) {
                    var td = new CKEDITOR.dom.element('td');
                    td.setAttribute('width', cellWidth);
                    td.setAttribute('style', stylesCellNew.toString());
                    td.setHtml('row ' + r + ', column ' + c + (isFramed ? '  framed' : '  no frame' ));
                    tr2.append(td);
                };
            };
		}
	};
});