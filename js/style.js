// inline styles
function TextAttributes(){
	this["font-size"] = "12px",
	this["color"] = "#000000",
	this["font-weight"] = "0",
	this["padding"] = "0px",
	this["margin"] = "0px"

};
TextAttributes.prototype.toString = function(){
	var summ = "";
	for(var key in a) {
	    summ += key + ': '+ a[key] +';';
	}
	return summ;
}

function LinkAttributes(){
	this["text-decoration"] = "undeline",
	this["font-size"] = "12px",
	this["color"] = "blue",
	this["font-weight"] = "0",
	this["padding"] = "0px",
	this["margin"] = "0px"
};
function TableAttributes(){
	this["border-width"] = "1px",
	this["border-style"] = "solid",
	this["border-color"] = "#000000",
	this["padding"] = "0px",
	this["margin"] = "0px",
	this["width"] = "0px",
	this["max-width"] = this["width"],
	this["min-width"] = this["width"]
};
function ImageAttributes(){
	this["border-width"] = "1px",
	this["border-style"] = "solid",
	this["border-color"] = "#000000",
	this["padding"] = "0px",
	this["margin"] = "0px",
	this["width"] = "0px",
	this["height"] = "0px";
}
function ListAttributes = {
	this["font-size"] = "12px",
	this["color"] = "#000000",
	this["font-weight"] = "0",
	this["padding"] = "0px",
	this["margin"] = "0px"
};



var TextStyles = new Object();
