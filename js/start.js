$(document).ready(function(){

	var editor = CKEDITOR.replace( 'editor', {
			customConfig: '../settings/editor_config.js',
		}
	);



	// once the editro is loaded, insert a table inside
	editor.on( 'instanceReady', function() {
		// inserting table
		var table = editor.document.createElement('table');
		var tr = new CKEDITOR.dom.element('tr');
		var td = new CKEDITOR.dom.element('td');
		table.append(tr);
		tr.append(td);
		td.setHtml('<br>cominci a scrivere qua<br><br><br><br><br><br><br>');
		editor.insertElement(table);
		table.focus();

        var borderWidth = 1; // impose by hand

		// calculating the widths
		var tableWidth = NEWSLETTER.width;
        var trWidth = tableWidth - 2*borderWidth; // table row width
        var tdWidth = trWidth; // table cell width

		// styles for the table
        var stylesTable = new TableAttributes();
        stylesTable.setWidth(tableWidth + 'px');
        stylesTable["border-width"] = borderWidth + 'px';
        stylesTable["border-color"] = '#cccccc';

		// styles for the row
        var stylesRow = new TableRowAttributes();
        stylesRow.setWidth(trWidth + 'px');
        
        // styles of the cell 
        var stylesCell = new TableCellAttributes();
        stylesCell.setWidth(tdWidth + 'px');

        // applying styles
		table.setAttribute('border', borderWidth);
		table.setAttribute('cellspacing', 0);
		table.setAttribute('cellpadding', 0);
		table.setAttribute('width', tableWidth);
		table.setAttribute('style', stylesTable.toString());

		tr.setAttribute('width', trWidth);
		tr.setAttribute('style', stylesRow.toString());

		td.setAttribute('width', tdWidth);
		td.setAttribute('style', stylesCell.toString());

		// applying inline styles
		table.setAttribute('style', stylesTable.toString());
		tr.setAttribute('style', stylesRow.toString());
		td.setAttribute('style', stylesCell.toString());

		// disabling default plugins by removing them from the context menu
		var menuItemsToRemove = ['table', 'tabledelete', 'link', 'unlink'];
		menuItemsToRemove.forEach(function(item){
			editor.removeMenuItem(item);
		})
	} );
})


