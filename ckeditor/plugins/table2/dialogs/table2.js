/**
 * The table2 dialog definition.
*/

CKEDITOR.dialog.add( 'table2Dialog', function(editor) {
    var INPUTCOLWIDTHNAME = 'widthCol';
    // adds input fields to set the widths of the table columns
    var drawColumns = function(){
        var colWidthInput = new CKEDITOR.dom.element('table');
        var tr = new CKEDITOR.dom.element('tr');
        colWidthInput.append(tr);
        for (var i = 0; i < this.getDialog().getValueOf('info', 'tblCols') ; i++) {
            var td = new CKEDITOR.dom.element('td');
            var inputField = new CKEDITOR.dom.element('input');
            inputField.setAttribute('type', 'text');
            inputField.setAttribute('id', INPUTCOLWIDTHNAME + i);
            inputField.setAttribute('width', '50');
            inputField.setAttribute('class', 'cke_dialog_ui_input_text');
            td.append(inputField);
            tr.append(td);
        };
        var element = CKEDITOR.document.getById('addColumns');
        var children = element.getChildren();
        console.log(children.count());
        var length = children.count();
        for(var i = 0; i < length; i++){
            children.getItem(i).remove();
        }
        element.append(colWidthInput);
    };


    /**
    * transforms each element of the input array into a non-negative number. 
    * If an element is negative, its absolute value is used.
    * If an element fails to be converted to a number, it is substituted by zero.
    * Examples:  [1.1, 2.4, 2] -> [1.1, 2.4, 2],  
    *            ["4", -3, 3.2, "a"] -> [4, 3, 3.2, 0]
    * @param    arr      Array      array of numbers
    * @return            Array      array of numbers
    */
    var sanitize = function(arr){
        var sanitized = [];
        var len = arr.length;
        for(var i=0; i<len; i++){
            var tmp = parseFloat(arr[i]);
            sanitized[i] = isNaN(tmp) ? 0 : Math.abs(tmp);
        }
        return sanitized;
    };

    /**
    * calculates the sum the array elements. The elements are supposed to be numbers. Otherwise nothing is guaranteed.
    * @param arr    array of numbers
    * @return   number
    * Example: [1, 2, 2] -> 1 + 2 + 2 = 5
    */
    var trace = function(arr){
        var accum = 0;
        for(num in arr){
            accum = accum + arr[num];
        }
        return accum;
    };

    /**
    * normalizes the array. If all elements are equal to zero, then the elements are to be normallized uniformally.
    * If not all the elements are equal to zero, but the trace is equal to zero, then the input array is returned.
    * @param    Array   array of numbers
    * @return   Array   array of numbers 
    * Expectations: [1, 3, 4]       => [ 0.125, 0.375, 0.5 ]
    *               [2, 0, -1, -1]  => [ 2, 0, -1, -1 ]   
    *               [0, 0]          => [ 0.5, 0.5]
    */
    var normalize = function(arr){
        var total = trace(arr);
        var len = arr.length;
        var areAllZeroes = arr.every(function(elem){return elem === 0; });
        if(areAllZeroes){
            arr = arr.map(function(arg){ return 1;});
            total = len;
        }
        var result = []; 
        if(total === 0){
            result = arr;
        }else{
            for(var i = 0; i < len; i++){
                result[i] = arr[i]/total;
            }
        }
        return result;
    };


    /**
    * this function produces an array that is a result of a slicing of the first argument weighted with respect to the second one.
    * The elements of the second array are supposed to be non-negative numbers. 
    * Examples:  (10, [1, 2, 2]) -> [2, 4, 4],  
    *            (30, [4, 2, 3, 1]) -> [12, 6, 9, 3]
    * @param    overall     Number  a number to be splitted
    * @param    pieces      Array   array of weigths
    * @return   Array       array of numbers
    */
    var splitWeighted = function(overall, pieces){
        var norm = normalize(sanitize(pieces));
        var result = [];
        var len = norm.length;
        for (var i = 0; i < len; i++) {
            result[i] = overall*norm[i];
        }
        return result;
    };


    /**
    * rounds each elements of the array
    * @param arr    Array       array of numbers
    * @return       Array       array of integers    
    */
    var roundUp = function(arr){
        return arr.map(function(elem){
            return Math.round(elem);
        });
    };

    /**
    * composition of roundUp and splitWeighted
    */
    var columnWidths = function(overall, pieces){
        return roundUp(splitWeighted(overall, pieces));
    }

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

           
            // read inserted values 
            var colWidths = [];
            for(var i=0; i < cols; i++){
                // in fact, this check is needed only when the user does not change the default number of the table rows
                var inputField = CKEDITOR.document.getById(INPUTCOLWIDTHNAME + i);
                colWidths[i] = (inputField === null) ? 0 : parseFloat((inputField.getValue()));
            }
            
            var isFramed = borderWidthRow > 0; // whether each row should be framed

			var table = new CKEDITOR.dom.element('table');
			editor.insertElement(table);

            // calculating widths
            var parent = table.getParent();
            var tableWidth = isNaN(parent.$.width) ? NEWSLETTER.width : parent.$.width;
            var trWidth = tableWidth - 2 * borderWidth;
            var tdWidth = columnWidths(trWidth, colWidths); // array of column widths

            // defining styles
            var stylesTable = new TableAttributes();
            stylesTable.setWidth(tableWidth + "px");
            stylesTable["border-width"] = borderWidth + "px";
            
            var stylesRow   = new TableRowAttributes();
            stylesRow.setWidth(trWidth + "px");

/*            var stylesCell = new TableCellAttributes();
            stylesCell.setWidth(tdWidth + "px");
*/
            // applying styles
            table.setAttribute('width', tableWidth);
            table.setAttribute('border', borderWidth);
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
                    var td2Width = trWidth;
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
                    table2.setAttribute('border', borderWidthRow);
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

                var cellWidths = columnWidths(tr2Width, colWidths); // tr2Width/cols;

                for (var c = 0; c < cols; c++) {
                    var td = new CKEDITOR.dom.element('td');
                    var stylesCellNew = new TableCellAttributes();
                    stylesCellNew.setWidth(cellWidths[c] + 'px');
                    td.setAttribute('width', cellWidths[c]);
                    td.setAttribute('style', stylesCellNew.toString());
                    td.setHtml('riga ' + r + ', colonna ' + c + (isFramed ? ' con bordo' : ' senza bordo' ));
                    tr2.append(td);
                };
            };
		}
	};
});