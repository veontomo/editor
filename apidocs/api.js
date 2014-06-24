YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Attributes",
        "CKHelper",
        "Cell",
        "Content",
        "Dom",
        "Factory",
        "Helper",
        "Image",
        "ImageStyle",
        "Link",
        "LinkAttributes",
        "LinkStyles",
        "List",
        "ListItem",
        "ListItemStyles",
        "ListStyles",
        "Mapping",
        "OList",
        "PlainText",
        "Properties",
        "Row",
        "Selection",
        "StringHelper",
        "Styles",
        "Table",
        "TableAttributes",
        "TableCellStyles",
        "TableRowStyles",
        "TableStyles",
        "Tag",
        "UList",
        "Unit"
    ],
    "modules": [
        "CKHelper",
        "Helper",
        "HtmlElements",
        "Properties"
    ],
    "allModules": [
        {
            "displayName": "CKHelper",
            "name": "CKHelper",
            "description": "Represents selected elements in the editor window. The argument `ed` is a\n[CKEditor editor](http://docs.ckeditor.com/#!/api/CKEDITOR.editor \"see official site\")  instance."
        },
        {
            "displayName": "Helper",
            "name": "Helper",
            "description": "Collection of functions used by various plugins of the CKEditor."
        },
        {
            "displayName": "HtmlElements",
            "name": "HtmlElements",
            "description": "Represents a table cell. The argument is supposed to be passed to the \"content\" property."
        },
        {
            "displayName": "Properties",
            "name": "Properties",
            "description": "A general Property class. If the argument is an object, then its properties are copied\ninto Property instance. If the argument is a string, then it will be splitted according to\nthe pattern \"key: value;\" to populate object properties."
        }
    ]
} };
});