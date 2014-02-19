YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Attributes",
        "CKHelper",
        "Cell",
        "Content",
        "Helper",
        "ImageStyle",
        "LinkStyle",
        "List",
        "ListItem",
        "ListItemStyle",
        "ListStyle",
        "Property",
        "Row",
        "StringHelper",
        "Style",
        "Table",
        "TableAttributes",
        "TableCellStyle",
        "TableRowStyle",
        "TableStyle",
        "Tag",
        "Unit"
    ],
    "modules": [
        "CKHelper",
        "Helper",
        "HtmlElements",
        "Property",
        "String"
    ],
    "allModules": [
        {
            "displayName": "CKHelper",
            "name": "CKHelper",
            "description": "Collection of functions used by various plugins of the CKEditor."
        },
        {
            "displayName": "Helper",
            "name": "Helper",
            "description": "Represents a quantity divided in \"value\" and \"measure\"."
        },
        {
            "displayName": "HtmlElements",
            "name": "HtmlElements",
            "description": "Represents table."
        },
        {
            "displayName": "Property",
            "name": "Property",
            "description": "This class defines inline styles of html tags"
        },
        {
            "displayName": "String",
            "name": "String",
            "description": "Transforms a cell-html string into Cell object. It is supposed that the string to process is of the\nfollowing form: <td ... > ... </td>. Inside the tag, there might be other nodes. If they are recognized\nas a \"supported\" ones, the corresponding functions will be called to transform them into objects.\nFor the moment, the only supported element is \"Table\"."
        }
    ]
} };
});