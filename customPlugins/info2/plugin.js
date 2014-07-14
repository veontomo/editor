/*jslint plusplus: true, white: true */
/*global CKEDITOR, CKHelper, LinkStyle, Helper, Link, Content */

// Register the plugin within the editor.
CKEDITOR.plugins.add('info2', {

	// Register the icons.
	icons: 'info2',

	// The plugin initialization logic goes inside this method.
	init: function( editor ) {

		// Define an editor command that opens our dialog.
		// editor.addCommand( 'info2', new CKEDITOR.dialogCommand( 'imageSimplified' ) );
		editor.addCommand('info2', {
			exec: function(editor){
				// console.log('inside info2 plugin');
				var body = editor.document.getBody().$;
				var stack = [body],
					top, topChildNodes, topLen, i,
					accum = 0;
				while (stack.length){
					accum++;
					// console.log(accum, ': stack length: ', stack.length);
					top = stack.pop();
					// console.log(top.nodeType === Node.ELEMENT_NODE ? "ELEMENT_NODE" : (top.nodeType === Node.TEXT_NODE ? "TEXT_NODE" : "OTHER"));

					// console.log('stack length after popping: ', stack.length);
					topChildNodes = top.childNodes;
					if (topChildNodes){
						topLen = topChildNodes.length;
						// console.log('top stack element has ' + topLen + ' elements');
						for (i = 0; i < topLen; i++){
							stack.push(topChildNodes.item(i));
						}
						// console.log('after pushing, stack has ' + stack.length + ' elements');
					}
					if (top.nodeType === Node.ELEMENT_NODE){
						console.log('' + accum + ': ' + top.tagName + ', width: ' + window.getComputedStyle(top).width);
					}

				}
				console.log(accum);
			}
		});


		// Create a toolbar button that executes the above command.
		editor.ui.addButton('info2', {

			// The text part of the button (if available) and tooptip.
			label: 'debug info',

			// The command to execute on click.
			command: 'info2',

			// The button placement in the toolbar (toolbar group name).
			toolbar: 'document'
		});

		// editor.addCommand('image2Cancel', {
		// 	exec: function(editor){
		// 		console.log('image cancel');
		// 		var startElem = editor.getSelection().getStartElement(),
		// 			elem = startElem.getAscendant('img', true);
		// 		elem.$.remove();
		// 	}
		// });



		// Register our dialog file. this.path is the plugin folder path.
		// CKEDITOR.dialog.add( 'imageSimplified', this.path + 'dialogs/info2.js' );

		// if (editor.contextMenu) {
		// 	editor.addMenuGroup('image2Group');

		// 	editor.addMenuItem('image2Edit', {
		// 		label: editor.lang.image.title,
		// 		icon: this.path + 'icons/image2edit.png',
		// 		command: 'info2',
		// 		group: 'image2Group'
		// 	});
		// 	editor.addMenuItem('image2Cancel', {
		// 		label: 'Eliminare immagine',
		// 		icon: this.path + 'icons/image2cancel.png',
		// 		command: 'image2Cancel',
		// 		group: 'image2Group'
		// 	});
		// 	editor.contextMenu.addListener(function(element) {
		// 		if (element.getAscendant('img', true)) {
		// 			return {
		// 				image2Edit: CKEDITOR.TRISTATE_OFF,
		// 				image2Cancel: CKEDITOR.TRISTATE_OFF,
		// 			};
		// 		}
		// 	});
		// }

	}
});
