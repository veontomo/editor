/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapper, Node, Image, CKEDITOR */
var NEWSLETTER = {};
Object.defineProperty(NEWSLETTER, 'maxWidth', {
	value:    500,             // massima largezza di tabella
	writable: true             // prohibit or allow overwrite
});
Object.defineProperty(NEWSLETTER, 'marker-name', {
	value:    'data-marker',   // an attribute to mark objects
	writable: false            // protect from overwrite
});

/**
 * Name of custom plugin directory. It is supposed that this directory is a siblings
 * of directory in which CKEDITOR resides ("ckeditor/").
 */
Object.defineProperty(NEWSLETTER, 'customPluginDir', {
	value: CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf('ckeditor/')) + 'customPlugins/',
	writable: false
});


// rules to be used when creating instances by means of Factory() class
var map = new Mapper();
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

// format dispatcher
// var fd = new FormatDispatcher();