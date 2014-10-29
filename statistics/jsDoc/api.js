YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "CDownload",
        "CImage",
        "CKEDITOR",
        "CKHelper",
        "CLink",
        "CTable",
        "Cell",
        "CellProperties",
        "Content",
        "Controller",
        "Converter",
        "ConverterElastic",
        "ConverterFixed",
        "ConverterGeneral",
        "ConverterSimpleText",
        "Document",
        "Dom",
        "EHToolbar",
        "Factory",
        "Helper",
        "Image",
        "ImageProperties",
        "Link",
        "LinkDialog",
        "LinkProperties",
        "List",
        "ListItem",
        "ListItemProperties",
        "ListProperties",
        "Mapper",
        "NEWSLETTER",
        "OList",
        "PlainText",
        "Properties",
        "Row",
        "RowProperties",
        "Save",
        "Selection",
        "Table",
        "TableDialog",
        "TableProperties",
        "Tag",
        "UList",
        "Unit",
        "Worker",
        "table2ModifyDialog"
    ],
    "modules": [
        "CKHelper",
        "Config",
        "Controllers",
        "Converter",
        "Dialogs",
        "Document",
        "EventHandler",
        "Helper",
        "HtmlElements",
        "Plugins",
        "Properties"
    ],
    "allModules": [
        {
            "displayName": "CKHelper",
            "name": "CKHelper",
            "description": "Represents selected elements in the editor window. The argument `ed` is a\n[CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor \"see official site\")  instance."
        },
        {
            "displayName": "Config",
            "name": "Config",
            "description": "Configuration of CKEDITOR."
        },
        {
            "displayName": "Controllers",
            "name": "Controllers",
            "description": "Download Controller."
        },
        {
            "displayName": "Converter",
            "name": "Converter",
            "description": "Worker.\n\nAn object that applies certain action if some condition meets."
        },
        {
            "displayName": "Dialogs",
            "name": "Dialogs",
            "description": "Table dialog."
        },
        {
            "displayName": "Document",
            "name": "Document",
            "description": "This class is to deal with documents: parsing, converting, saving. Its functionality is similar\nto those of {{#crossLink \"Dom\"}}Dom{{/crossLink}}.\n\nThe difference between them: {{#crossLink \"Document\"}}Document{{/crossLink}} is a singleton,\nwhile {{#crossLink \"Dom\"}}Dom{{/crossLink}} is a function that accepts creation of multiple\ninstances."
        },
        {
            "displayName": "EventHandler",
            "name": "EventHandler",
            "description": "Object for managing toolbar events."
        },
        {
            "displayName": "Helper",
            "name": "Helper",
            "description": "Collection of functions used by various plugins of the CKEditor."
        },
        {
            "displayName": "HtmlElements",
            "name": "HtmlElements",
            "description": "Methods of this class convert one format in another."
        },
        {
            "displayName": "Plugins",
            "name": "Plugins",
            "description": "Plugin to save the editor window content."
        },
        {
            "displayName": "Properties",
            "name": "Properties",
            "description": "A general Property class. If the argument is an object, then its properties are copied\ninto Property instance. If the argument is a string, then it will be splitted according to\nthe pattern \"key: value;\" to populate object properties."
        }
    ]
} };
});