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
                    id: "txtBorder",
                    requiredContent: "table[border]",
                    label: editor.lang.table.border,
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

			var sel = editor.getSelection();
			sel.selectElement(sel.getStartElement());
			console.log(sel.parent);


			var dialog = this;
			var elem = editor.document.createElement('table');
			editor.insertElement(elem);
			var tr = new CKEDITOR.dom.element('tr');
			var td = new CKEDITOR.dom.element('td');
			elem.append(tr);
			tr.append(td);

		}
	};
});