function Table(){
	this.cols = 1;
	this.rows = 1;
}

function PlainTable(){
	this.width = "0px";
	this.style = new TableAttributes();

}

PlainTable.prototype = new Table();


function FramedTable(){
	

}

FramedTable.prototype = new PlainTable();