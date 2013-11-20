$(document).ready(function(){

	var editor = CKEDITOR.replace( 'editor', {
			customConfig: '../settings/editor_config.js',
		}
	);

	// once the editro is loaded, insert a table inside
	editor.on( 'instanceReady', function() {
		// inserting table
		var elem = editor.document.createElement('table');
		var tr = new CKEDITOR.dom.element('tr');
		var td = new CKEDITOR.dom.element('td');
		elem.append(tr);
		tr.append(td);
		editor.insertElement(elem);

		// adjusting the styles of the table as whole
        var stylesTable = new TableAttributes();
        stylesTable.setWidth(NEWSLETTER.width);
        stylesTable["border-width"] = "1px";

		// adjusting the styles of the row 
        var stylesRow = new TableRowAttributes();
        stylesRow.setWidth(NEWSLETTER.width)
        
        // adjusting the styles of the cell 
        var stylesCell = new TableCellAttributes();
        stylesCell.setWidth(NEWSLETTER.width)

        // applying attributes
		elem.setAttribute('border', 0);
		elem.setAttribute('style', stylesTable.toString());
		tr.setAttribute('style', stylesRow.toString());
		td.setAttribute('style', stylesCell.toString());
	} );
})


