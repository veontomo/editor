/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapper,
		Node, Image, CKEDITOR, ConverterFixed, ConverterElastic */
/**
 * Object containing configuration settings.
 *
 * @module    Config
 * @class     NEWSLETTER
 * @type      {Object}
 * @since     0.0.1
 * @author    A.Shcherbakov
 */
var NEWSLETTER = {

	/**
	 * Default width, to be set to elements whose width can not be established.
	 * @property    {String}     defaultWidth
	 * @type        {String}
	 * @default 	'500px'
	 */
	defaultWidth: '500px',

	/**
	 * {{#crossLink "NEWSLETTER/defaultWidth:property"}}defaultWidth{{/crossLink}} getter.
	 * @method    width
	 * @return    {String}
	 */
	width: function(){
		return this.defaultWidth;
	},

	/**
	 * Sets maximum width of element available inside editor window.
	 *
	 * This value is to be set to an element when it is failed to find its parent.
	 * If w is a string, its value is imposed as default width. If it is a number,
	 * default unit measure is appended to that number.
	 * @method  setWidth
	 * @param   {Number|String}       w
	 * @return  {void}
	 */
	setWidth: function(w){
		if (typeof w === 'string'){
			this.defaultWidth = w;
		}
		if (typeof w === 'number'){
			this.defaultWidth = w.toString() + this.defaultUnitMeasure;
		}
	},


	/**
	 * Default font size, to be set to elements whose width can not be established.
	 * @property    {String}     defaultFontSize
	 * @type        {String}
	 * @default     '14px'
	 */
	defaultFontSize: '14px',

	/**
	 * {{#crossLink "NEWSLETTER/defaultFontSize:property"}}defaultFontSize{{/crossLink}} getter.
	 * @method    fontsize
	 * @return    {String}
	 */
	fontsize: function(){
		return this.defaultFontSize;
	},


	/**
	 * Default unit of measurement, to be applied to elements whose width can not be established.
	 * @property    {String}     defaultUnitMeasure
	 * @type        {String}
	 */
	defaultUnitMeasure: 'px',


	/**
	 * {{#crossLink "NEWSLETTER/defaultUnitMeasure:property"}}defaultUnitMeasure{{/crossLink}} getter.
	 * @method    unitMeasure
	 * @return    {String}
	 */
	unitMeasure: function(){
		return this.defaultUnitMeasure;
	},

	/**
	 * Base styles that are applied when saving the editor content.
	 * It is a css-like formatted string, i.e. `h1 {color: red; position: absolute;}`
	 *
	 * @property    {String}       cssBase
	 * @since       0.0.6
	 *
	 */
	cssBase: 'body {background-color: #ffffff; color: #000001; line-height: normal; text-align: center; font-size: 13px; font-family: Arial, sans-serif; font-style: normal; font-weight: normal; padding: 0; margin: 0;}\
			 a {color: blue;}',

	/**
	 * Styles that are applied to the content of the editor only and not to a saved content.
	 * It is a css-like formatted string, i.e. `h1 {color: red; position: absolute;}`
	 *
	 * @property    {String}       cssEditor
	 * @since       0.0.6
	 */
	cssEditor: 'tr:hover {box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;}\
				td:hover {box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;}\
				a:hover {background-color: rgba(0, 234, 236, 0.5);}',

};

/*  ****** IMMUTABLE VARIABLES (constants)   ****** */

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