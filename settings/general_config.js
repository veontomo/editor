/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapper,
		Node, Image, CKEDITOR, ConverterFixed, ConverterFluid */
/**
 * Application configuration.
 * @module    Config
 * @class     NEWSLETTER
 * @type      {Object}
 * @since     0.0.1
 * @author    A.Shcherbakov
 */
var NEWSLETTER = {};

/**
 * Imposes the scale and the maximum width (in pixels).
 * @property  {Number}     maxWidth
 * @type      {Number}
 */
Object.defineProperty(NEWSLETTER, 'maxWidth', {
	value:    500,             // massima largezza di tabella
	writable: true             // prohibit or allow overwrite
});

/**
 * Name of the marker attribute to be used in order to mark tag elements.
 * @property  {String}     marker-name
 * @type      {String}
 * @final
 */
Object.defineProperty(NEWSLETTER, 'marker-name', {
	value:    'data-marker',   // an attribute to mark objects
	writable: false            // protect from overwrite
});

/**
 * Name of custom plugin directory. It is supposed that this directory is a siblings
 * of directory in which CKEDITOR resides ("ckeditor/").
 * @property  {String} customPluginDir
 * @final
 */
Object.defineProperty(NEWSLETTER, 'customPluginDir', {
	value: CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf('ckeditor/')) + 'customPlugins/',
	writable: false
});

/**
 * Factory to produce instances of {{#crossLink "Tag"}}Tag{{/crossLink}} class.
 * @property {Factory} factory
 * @final
 */
// rules to be used when creating instances by means of Factory() class
var tagMapper = new Mapper();
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.TEXT_NODE;}, PlainText);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TD';}, Cell);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TABLE';}, Table);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TR';}, Row);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'A';}, Link);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'LI';}, ListItem);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'OL';}, OList);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'UL';}, UList);
tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'IMG';}, Image);
tagMapper.setDefaultTarget(Tag);
Object.defineProperty(NEWSLETTER, 'factory', {
	value:    new Factory(tagMapper),
	writable: false
});


/**
 * Maps format identifier (string description) to class that performs required actions.
 * @property  {Mapper} formatMapper
 * @final
 */
var formatMapper = new Mapper();
formatMapper.add(function(str){return typeof str === 'string' && str.toLowerCase() === 'fixed';}, ConverterFixed);
formatMapper.add(function(str){return typeof str === 'string' && str.toLowerCase() === 'fluid';}, ConverterFluid);
Object.defineProperty(NEWSLETTER, 'formatMapper', {
	value:    formatMapper,
	writable: false
});
