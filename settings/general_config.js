/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapping, Node */
var NEWSLETTER = {};
Object.defineProperty(NEWSLETTER, 'maxWidth', {
	value:    500,             // massima largezza di tabella
	writable: false            // protect from overwrite
});
Object.defineProperty(NEWSLETTER, 'marker-name', {
	value:    'data-marker',   // an attribute to mark objects
	writable: false            // protect from overwrite
});


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
map.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'IMG';}, Image);
map.setDefaultTarget(Tag);


var FACTORY = {};
// it is possible to use Factory methods to modify FACTORY.factory
// but it is prohibited to remove Factory.factory attribute
Object.defineProperty(FACTORY, 'factory', {
	value:    new Factory(map),
	writable: false
});