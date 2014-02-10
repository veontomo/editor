/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global CKEDITOR, List, ListItem*/

// Register the plugin within the editor.
CKEDITOR.plugins.add('list2', {

	// Register the icons.
	icons: 'list2',

	// The plugin initialization logic goes inside this method.
	init: function(editor) {
		// Define an editor command that opens our dialog.
		editor.addCommand('list2Dialog', {
			exec: function(editor){
				var node = editor.getSelection(),
				    range = node.getRanges()[0],
				    list = new List(),
				    selectedStr, listObj, i, content, len, li, listHtml;
				list.name = 'ol';
				list.style['margin-left'] = 40;
			    if (!range.collapsed){
			    	if (range.startContainer.type === CKEDITOR.NODE_ELEMENT){
						selectedStr = range.startContainer.getHtml();
			    	} else {
			    		selectedStr = range.startContainer.getText();
			    	}
		        	content = selectedStr.inflate();
		        	len = content.length();
		        	for(i = 0; i < len; i++){
		        		li = new ListItem();
		        		li.appendElem(content.getElem(i));
		        		list.appendItem(li);
		        	}
			    } else {
			    	li = new ListItem();
			    	list.appendItem(li);
			    }
			    listHtml = list.toHtml();
			    listObj = CKEDITOR.dom.element.createFromHtml(listHtml);
			    editor.insertElement(listObj);
			    console.log(listObj);
			    listObj.getFirst().focus();
			}
		});
		// Create a toolbar button that executes the above command.
		editor.ui.addButton('List2', {
			// The text part of the button (if available) and tooptip.
			label: editor.lang.list.numberedlist,
			// The command to execute on click.
			command: 'list2Dialog',
			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// Register our dialog file. this.path is the plugin folder path.
		// CKEDITOR.dialog.add('list2Dialog', this.path + 'dialogs/list2.js');

		if (editor.contextMenu) {
			editor.addMenuGroup('list2Group');
			editor.addMenuItem('list2Item', {
				label: editor.lang.list.numberedlist,
				icon: this.path + 'icons/numberedList.png',
				command: 'list2Dialog',
				group: 'list2Group'
			});
			editor.contextMenu.addListener(function(element) {
				if (element.getAscendant('ol', true) || element.getAscendant('ul', true)) {
					return {
						list2Item: CKEDITOR.TRISTATE_OFF
					};
				}
			});
		}

	}
});