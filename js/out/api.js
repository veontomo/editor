YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Attributes",
        "BorderStyle",
        "Cell",
        "Content",
        "ImageStyle",
        "LinkStyle",
        "List",
        "ListItem",
        "ListItemStyle",
        "ListStyle",
        "Row",
        "Style",
        "Table",
        "TableAttributes",
        "TableCellStyle",
        "TableRowStyle",
        "TableStyle",
        "Tag",
        "TextStyle",
        "createRowFromHtml",
        "createTableFromHtml",
        "createTagFromHtml",
        "generateId",
        "isFramedTable"
    ],
    "modules": [
        "HtmlElements",
        "String",
        "attributes",
        "helpers"
    ],
    "allModules": [
        {
            "displayName": "attributes",
            "name": "attributes",
            "description": "Produces a string of properties in inline-style fashion\nThis function is supposed to be added to prototypes of different objects.\nIt takse into consideration only properties, methods are ignored.\nIf attribite value is a number, the measurement unit will be appended."
        },
        {
            "displayName": "helpers",
            "name": "helpers",
            "description": "transforms each element of the input array into a non-negative number.\nIf an element is negative, its absolute value is used.\nIf an element fails to be converted to a number, it is substituted by zero."
        },
        {
            "displayName": "HtmlElements",
            "name": "HtmlElements",
            "description": "Represents table."
        },
        {
            "displayName": "String",
            "name": "String",
            "description": "Generates a string that can be used as id for the elements of the target string. This means that\nthe generated string must be not present among id of the elements of the target string. The argument\nserves as a hint to create the id: if the hint string is available as id, it will be returned. Otherwise,\na symbo from range 0-9, a-z will be appended to the hint string until it becomes a valid id."
        }
    ]
} };
});