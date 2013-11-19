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

			var dialog = this;
			var elem = editor.document.createElement('table');
            elem.setAttribute('border', 1); // !!! to be taken from the user input

			editor.insertElement(elem);
            var parent = elem.getParent();
            var elemWidth = parent.$.width;

            elem.setAttribute('width', elemWidth);
/*            console.log( parent.getName() );*/

			var tr = new CKEDITOR.dom.element('tr');
            tr.setAttribute('width', elemWidth); // the row must be of the same width as the table's one it belongs to
			var td = new CKEDITOR.dom.element('td');
            td.setAttribute('width', elemWidth); // !!! to be taken from the user input
			elem.append(tr);
			tr.append(td);

            /*console.table(elem.$);*/

		}
	};
});