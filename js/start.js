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
		td.setHtml('<br><br><br><br><br><br><br><br>');
		editor.insertElement(elem);

		// adjusting the styles of the table as whole
        var stylesTable = new TableAttributes();
        stylesTable.setWidth(NEWSLETTER.width + 'px');
        stylesTable["border-width"] = '1px';
        stylesTable["border-color"] = '#f0f0e0';

		// adjusting the styles of the row 
        var stylesRow = new TableRowAttributes();
        stylesRow.setWidth(NEWSLETTER.width + 'px');
        
        // adjusting the styles of the cell 
        var stylesCell = new TableCellAttributes();
        stylesCell.setWidth(NEWSLETTER.width + 'px');

        // applying attributes
		elem.setAttribute('border', 0);
		elem.setAttribute('cellspacing', 0);
		elem.setAttribute('cellpadding', 0);
		elem.setAttribute('width', NEWSLETTER.width);
		tr.setAttribute('width', NEWSLETTER.width);
		td.setAttribute('width', NEWSLETTER.width);

		// applying inline styles
		elem.setAttribute('style', stylesTable.toString());
		tr.setAttribute('style', stylesRow.toString());
		td.setAttribute('style', stylesCell.toString());
	} );
})


