YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Attributes",
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
        "Helper",
        "HtmlElements",
        "Property",
        "String"
    ],
    "allModules": [
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
            "description": "Generates a string that can be used as id for the elements of the target string. This means that\nthe generated string must be not present among id of the elements of the target string. The argument\nserves as a hint to create the id: if the hint string is available as id, it will be returned. Otherwise,\na symbo from range 0-9, a-z will be appended to the hint string until it becomes a valid id."
        }
    ]
} };
});