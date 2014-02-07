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
            "description": "Transforms a row-html string into a Row object. It is supposed that the string to process is of the\nfollowing form: <tr ... > ... </tr>. Inside the tag, there might be elements \"td\" that will be\nprocessed one by one by function String::createCellFromHtml()."
        }
    ]
} };
});