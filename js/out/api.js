YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Attributes",
        "BorderStyle",
        "Cell",
        "Content",
        "FramedTable",
        "ImageStyle",
        "LinkStyle",
        "ListItemStyle",
        "ListStyle",
        "Row",
        "Style",
        "Table",
        "TableAttributes",
        "TableCellStyle",
        "TableRowStyle",
        "TableStyle",
        "TextStyle"
    ],
    "modules": [
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
        }
    ]
} };
});