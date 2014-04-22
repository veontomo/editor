/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapping, Node */
var NEWSLETTER = {
	'maxWidth': 500, // massima largezza di tabella
	'marker-name': 'data-marker', // an attribute to mark objects
};


// rules to be used when creating instances by means of Factory() class
var map = new Mapping();
map.add(function(el){return el !== undefined && el.nodeType === Node.TEXT_NODE;}, PlainText);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TD';}, Cell);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TABLE';}, Table);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TR';}, Row);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'A';}, Link);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'LI';}, ListItem);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'OL';}, OList);
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'UL';}, UList);
map.setDefaultTarget(Tag);

var factory = new Factory();
factory.setMapping(map);

var FACTORY = {
	// factory: factory
};
// it is possible to use Factory methods to modify FACTORY.factory
// but it is prohibited to remove Factory.factory attribute
Object.defineProperty(FACTORY, 'factory', {
	value: factory,
	writable: false
});

