/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
/*CKEDITOR.dialog.add("linkSimplified", function (editor) {
    return {
        // Basic properties of the dialog window: title, minimum size.
        title: editor.lang.link.title,
        minWidth:  400,
        minHeight: 200,

        // Dialog window contents definition.
        contents: [
            {
                // Definition of the Basic Settings dialog tab (page).
                id: 'tab-general',
                label: 'Info generale',

                // The tab contents.
                elements: [
                    {
                        // Text input field for the image url.
                        type: 'text',
                        id: 'href',
                        label: editor.lang.common.url,

                        default: "http://"
                    },
                    {
                        // alternative text
                        type: 'checkbox',
                        id: 'underlined',
                        label: editor.lang.basicstyles.underline,

                        // Validation checking whether the field is not empty.
                        default: true
                    },
                ]
            },
        ],

        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function() {
            var dialog = this;
            // user input
            var link = dialog.getValueOf('tab-general', 'href');
            var underlined = dialog.getValueOf('tab-general', 'underlined');

            var stylesLink = new LinkAttributes();
            stylesLink["text-decoration"] = underlined ? 'underline' : 'none';

            var elem = editor.getSelection().getStartElement();
            var elemContent = elem.getHtml();
            console.log(elemContent);

            editor.insertHtml('<a href="' + link + '" style=" + stylesLink.toString() + ">' + elemContent + '</a>');
            /*elem.remove();*/
/*
        }
    };
});*/

CKEDITOR.dialog.add("linkSimplified", function(editor) {
    return {
        title: editor.lang.link.info,
        minWidth: 400,
        minHeight: 300,
        height: '20em',
        contents: [{
            id: 'tab-general',
            label: 'labelTab1',
            title: 'title tab 1',
            elements: [{
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'http://',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'href',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;'
                }]
            }, {
                type: 'hbox',
                widths: ['10%', '90%'],
                children: [{
                    type: 'html',
                    html: 'Testo',
                    style: 'padding-right: 0px; margin: 0; float: left; padding-top: 0.5em;'
                }, {
                    type: 'text',
                    id: 'text',
                    style: 'padding-left: 0px; margin: 0; float: left; width: 100%;'
                }]
            }, {
                type: 'html',
                html: editor.lang.link.styles + '<br>'
            }, {
                type: 'checkbox',
                id: 'underlined',
                label: editor.lang.basicstyles.underline,
                "default": true,
            }]
        }],

        onShow: function(){
            var sel = this.getParentEditor().getSelection().getNative();
            this.setValueOf('tab-general', 'text', sel);
        },

        onOk: function() {
            // user input
            var linkRaw = this.getValueOf('tab-general', 'href');
            var linkText = this.getValueOf('tab-general', 'text');
            var underlined = this.getValueOf('tab-general', 'underlined');

            var link = 'http://' + linkRaw.replace(/http:\/\//i, '');

            var stylesLink = new LinkAttributes();
            stylesLink["text-decoration"] = underlined ? 'underline' : 'none';
            var aTag = editor.document.createElement('a');
            aTag.setAttribute('href', link);
            aTag.setHtml(linkText);

/*            // what to insert into <a href=""> ... </a>
            var sel = this.getParentEditor().getSelection().getNative();
            var aTagContent = sel ? sel : link;
            console.log('aTagContent: ' + aTagContent);
            aTag.setHtml(aTagContent);
*/
            editor.insertElement(aTag);
        }
    };
});