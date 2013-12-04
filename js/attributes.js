/** 
* Produces a string of properties in inline-style fashion
* This function is supposed to be added to prototypes of different objects. 
* It takse into consideration only properties, methods are ignored.
* @return string 	a concatenation of substrings; each substring is of this format: "attribute:value;".
* @example "padding:0px;margin:10px;color:#ababab;"
*/
var toString =  function(){
    var styles = "";
    for(var key in this) {
        // avoid adding method to the output
        if((typeof this[key]) !== "function"){
            styles += key + ':'+ this[key] +';';
        }
    }
	return styles;
};

/**
* Sets width, min-width and max-width to the value given as the argument.
* This function is supposed to be added to prototypes of different objects.
* @param mixed w
* @return void
*/ 
var setMinMaxWidth  = function(w){
    this.width = w;
    this["max-width"] = this.width;
    this["min-width"] = this.width;
};

/** 
* Some data containers with default values of their attributes.
*/
function TextAttributes(){
    this["font-size"] = "12px";
	this.color = "#000000";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
TextAttributes.prototype.toString = toString;

function LinkAttributes(){
	this["text-decoration"] = "undeline";
	this["font-size"] = "12px";
	this.color = "blue";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
LinkAttributes.prototype.toString = toString;

function TableAttributes(){
	this["border-width"] = "1px";
	this["border-style"] = "solid";
	this["border-color"] = "#000000";
	this.padding = "0px";
	this.margin = "0px";
	this.width = "0px";
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableAttributes.prototype.toString = toString;
TableAttributes.prototype.setWidth = setMinMaxWidth;

function TableRowAttributes(){
	this["border-width"] = "0px";
	this["border-style"] = "solid";
	this["border-color"] = "#ffffff";
	this.padding = "0px";
	this.margin = "0px";
	this.width = "0px";
	this["max-width"] = this.width;
	this["min-width"] = this.width;
}
TableRowAttributes.prototype.toString = toString;
TableRowAttributes.prototype.setWidth = setMinMaxWidth;

function TableCellAttributes(){
	this["border-width"] = "0px";
	this["border-style"] = "solid";
	this["border-color"] = "#ffffff";
	this.padding = "0px";
	this.margin = "0px";
	this.width = "0px";
	this["max-width"] = this.width;
	this["min-width"] = this.width;
	this["vertical-align"] = "top";
	this["text-align"] = "justify";
}
TableCellAttributes.prototype.toString = toString;
TableCellAttributes.prototype.setWidth = setMinMaxWidth;

function ImageAttributes(){
	this["border-width"] = "0px";
	this["border-style"] = "solid";
	this["border-color"] = "#ffffff";
	this.padding = "0px";
	this.margin = "0px";
	this.width = "0px";
	this.height = "0px";
}
ImageAttributes.prototype.toString = toString;

function ListAttributes()  {
	this.padding = "0px";
	this.margin = "0px";
}
ListAttributes.prototype.toString = toString;

function ListItemAttributes()  {
	this["font-size"] = "12px";
	this.color = "#000000";
	this["font-weight"] = "0";
	this.padding = "0px";
	this.margin = "0px";
}
ListItemAttributes.prototype.toString = toString;
