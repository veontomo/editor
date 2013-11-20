/**
 * The abbr dialog definition.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_sample_1
 */

// Our dialog definition.
CKEDITOR.dialog.add( 'table2Dialog', function(editor) {
	return {
		// Basic properties of the dialog window: title, minimum size.
		title: editor.lang.common.generalTab,
		minWidth:  300,
		minHeight: 150,

		// Dialog window contents definition.
contents: [{
        id: "info",
        label: editor.lang.table.title,
        elements: [{
            type: "hbox",
            widths: [null, null],
            styles: ["vertical-align:top"],
            children: [{
                type: "vbox",
                padding: 0,
                children: [{
                    type: "text",
                    id: "txtRows",
                    "default": 3,
                    label: editor.lang.table.rows,
                    required: !0,
                    controlStyle: "width:5em",
                }, {
                    type: "text",
                    id: "txtCols",
                    "default": 2,
                    label: editor.lang.table.columns,
                    required: !0,
                    controlStyle: "width:5em",
                }, {
                    type: "html",
                    html: "&nbsp;"
                }, {
                    type: "text",
                    id: "txtBorderWidth",
                    requiredContent: "table[border]",
                    "default": 1,
                    label: editor.lang.table.border + ' (' + editor.lang.table.widthPx + ')',
                    controlStyle: "width:3em",

                }]
            }, {
                type: "vbox",
                padding: 0,
                children: [{
                    type: "hbox",
                    widths: ["5em"],
                    children: [{
                        type: "text",
                        id: "txtWidth",
                        requiredContent: "table{width}",
                        controlStyle: "width:5em",
                        label: editor.lang.common.width,
                        title: editor.lang.common.cssLengthTooltip,
                    }]
                }]
            }]
        }]
    },
   
],

		// This method is invoked once a user clicks the OK button, confirming the dialog.
		onOk: function() {
		/*	console.table(editor.getSelection());*/
			var dialog = this;

            // user input
            var rows = dialog.getValueOf('info', 'txtRows');
            var cols = dialog.getValueOf('info', 'txtCols');
            var bordWidth = dialog.getValueOf('info', 'txtBorderWidth'); 
            alert('Tabella: ' + cols + ' colonne e ' + rows + ' righe, bordo ' + bordWidth);


			var elem = editor.document.createElement('table');
            elem.setAttribute('border', 0);
			editor.insertElement(elem);

            var parent = elem.getParent();
            var elemWidth = parent.$.width;
            
            // prepare style
            var stylesTable = new TableAttributes();
            stylesTable.setWidth(elemWidth + "px");
            stylesTable["border-width"] = bordWidth + "px";
            stylesTable["border-style"] = "solid";
            stylesTable["border-color"] = "#000000";

            var stylesRow   = new TableRowAttributes();
            stylesRow.setWidth(elemWidth + "px");

            var stylesCell = new TableCellAttributes();
            stylesCell.setWidth(elemWidth/cols + "px");

            
            /*var stylesTable = 'width:'+ elemWidth + 'px;min-width:' + elemWidth + 'px;max-width:' + elemWidth + 'px;border-width:' + bordWidth + 'px;border-style:solid;border-color:black;padding:0px;margin:0px;';*/
            /*var stylesRow   = 'width:'+ elemWidth + 'px;min-width:' + elemWidth + 'px;max-width:' + elemWidth + 'px;border-width:0px;border-style:solid;border-color:black;padding:0px;margin:0px;';*/
/*            var stylesCell  = 'width:'+ elemWidth/cols + 'px;min-width:' + elemWidth/cols + 'px;max-width:' + elemWidth/cols + 'px;border-width:0px;border-style:solid;border-color:black;padding:0px;margin:0px;';*/

            elem.setAttribute('width', elemWidth);
            elem.setAttribute('style', stylesTable.toString());

            for (var r = 0; r < rows; r++) {
                var tr = new CKEDITOR.dom.element('tr');
                tr.setAttribute('width', elemWidth); // the row must be of the same width as the table's one it belongs to
                tr.setAttribute('style', stylesRow.toString());
                elem.append(tr);
                for (var c = 0; c < cols; c++) {
                    var td = new CKEDITOR.dom.element('td');
                    td.setAttribute('width', elemWidth/cols); // !!! to be taken from the user input
                    td.setAttribute('style', stylesCell.toString())
                    tr.append(td);
                };
                
            };

/*			var tr = new CKEDITOR.dom.element('tr');
            tr.setAttribute('width', elemWidth); // the row must be of the same width as the table's one it belongs to
			var td = new CKEDITOR.dom.element('td');
            td.setAttribute('width', elemWidth); // !!! to be taken from the user input
			elem.append(tr);
			tr.append(td);
*/
            /*console.table(elem.$);*/

		}
	};
});