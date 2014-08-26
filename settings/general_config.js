/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapper,
		Node, Image, CKEDITOR, ConverterFixed, ConverterElastic */
/**
 * Application configuration object.
 * @module    Config
 * @class     NEWSLETTER
 * @type      {Object}
 * @since     0.0.1
 * @author    A.Shcherbakov
 */
var NEWSLETTER = {};

/**
 * Default width, to be set to elements whose width can not be established.
 * @property    {String}     defaultWidth
 * @type        {String}
 */
Object.defineProperty(NEWSLETTER, 'defaultWidth', {
	value:    "500px",
	writable: true
});

/**
 * {{#crossLink "NEWSLETTER/maxWidth:property"}}maxWidth{{/crossLink}} getter.
 * @method    width
 * @return    {String}
 */
NEWSLETTER.width = function(){
	return NEWSLETTER.defaultWidth;
};

/**
 * Sets maximum width of element available inside editor window.
 *
 * This value is to be set to an element when it is failed to find its parent.
 * If w is a string, its value is imposed as default width. If it is a number,
 * default unit measure is appended to that number.
 *
 * @param   {Number|String}       w
 * @return  {void}
 *
 */
NEWSLETTER.setWidth = function(w){
	if (typeof w === 'string'){
		NEWSLETTER.defaultWidth = w;
	}
	if (typeof w === 'number'){
		NEWSLETTER.defaultWidth = w.toString() + NEWSLETTER.defaultUnitMeasure;
	}
};

/**
 * Default font size, to be set to elements whose width can not be established.
 * @property    {String}     defaultFontSize
 * @type        {String}
 */
Object.defineProperty(NEWSLETTER, 'defaultFontSize', {
	value:    "14px",
	writable: true
});

/**
 * {{#crossLink "NEWSLETTER/maxWidth:property"}}maxWidth{{/crossLink}} getter.
 * @method    fontsize
 * @return    {String}
 */
NEWSLETTER.fontsize = function(){
	return NEWSLETTER.defaultFontSize;
};


/**
 * Default unit of measurementze, to be set to elements whose width can not be established.
 * @property    {String}     defaultFontSize
 * @type        {String}
 */
Object.defineProperty(NEWSLETTER, 'defaultUnitMeasure', {
	value:    "px",
	writable: true
});

/**
 * {{#crossLink "NEWSLETTER/maxWidth:property"}}unitMeasure{{/crossLink}} getter.
 * @method    unitMeasure
 * @return    {String}
 */
NEWSLETTER.unitMeasure = function(){
	return NEWSLETTER.defaultUnitMeasure;
};

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
formatMapper.add(function(str){return typeof str === 'string' && str.toLowerCase() === 'elastic';}, ConverterElastic);
Object.defineProperty(NEWSLETTER, 'formatMapper', {
	value:    formatMapper,
	writable: false
});


NEWSLETTER.css = 'body {\
	background-color: #ffffff;\
	color: #000001;\
	line-height: normal;\
	text-align: center;\
	font-size: 13px;\
	font-family: Arial, sans-serif;\
	font-style: normal;\
	font-weight: normal;\
	padding: 0;\
	margin: 0;\
}\
\
tr:hover {\
	box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;\
}\
\
td:hover {\
	box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;\
}\
\
a:hover {\
	background-color: rgba(202, 234, 236, 0.5);\
}';

	CKEDITOR.addCss(NEWSLETTER.css);
