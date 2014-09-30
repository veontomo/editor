/*jslint plusplus: true, white: true */
/*global Cell, Row, Table, ListItem, UList, OList, Link, PlainText, Tag, Factory, Mapper,
		Node, Image, CKEDITOR, ConverterFixed, ConverterElastic */
/**
 * Singleton containing configuration settings. Some of the properties are write-protected.
 *
 * @module    Config
 * @class     NEWSLETTER
 * @type      {Object}
 * @since     0.0.1
 * @author    A.Shcherbakov
 */
var NEWSLETTER = (function(){

	/**
	 * Singlet instance.
	 * @property   {Object}     _instance
	 * @private
	 */
	var _instance;

	/**
	 * Intializes the singlet instance.
	 * @method     _init
	 * @private
	 */
	var _init = function(){

		// an object that will be returned after filling in with required properties
		var _output = {};

		/**
		 * Default width, to be set to elements whose width can not be established.
		 * @property    {String}     defaultWidth
		 * @type        {String}
		 * @default 	"500px"
		 */
		_output.defaultWidth = '500px';

		/**
		 * {{#crossLink "NEWSLETTER/defaultWidth:property"}}defaultWidth{{/crossLink}} getter.
		 * @method    width
		 * @return    {String}
		 */
		_output.width = function(){
			return this.defaultWidth;
		};

		/**
		 * Fonts to be added to those already present in the editor.
		 *
		 * Object keys are to be displayed in the toolbar combo box, while thier
		 * values are to be used for 'font-family' attribute.
		 * @property {Object} additionalFonts
		 * @type     {Object}
		 * @default  {'Calibri': 'Calibri, sans-serif'}
		 */
		_output.additionalFonts = {'Calibri': 'Calibri, sans-serif'};

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
		_output.setWidth = function(w){
			if (typeof w === 'string'){
				this.defaultWidth = w;
			}
			if (typeof w === 'number'){
				this.defaultWidth = w.toString() + this.defaultUnitMeasure;
			}
		};


		/**
		 * Default font size, to be set to elements whose width can not be established.
		 * @property    {String}     defaultFontSize
		 * @type        {String}
		 * @default     "14px"
		 */
		_output.defaultFontSize = '14px';

		/**
		 * {{#crossLink "NEWSLETTER/defaultFontSize:property"}}defaultFontSize{{/crossLink}} getter.
		 * @method    fontsize
		 * @return    {String}
		 */
		_output.fontsize = function(){
			return this.defaultFontSize;
		};


		/**
		 * Default unit of measurement, to be applied to elements whose width can not be established.
		 * @property    {String}     defaultUnitMeasure
		 * @type        {String}
		 */
		_output.defaultUnitMeasure = 'px';


		/**
		 * {{#crossLink "NEWSLETTER/defaultUnitMeasure:property"}}defaultUnitMeasure{{/crossLink}} getter.
		 * @method    unitMeasure
		 * @return    {String}
		 */
		_output.unitMeasure = function(){
			return this.defaultUnitMeasure;
		};


		/**
		 * Name of the marker attribute to be used in order to mark tag elements.
		 * @property  {String}     marker-name
		 * @type      {String}
		 * @final
		 */
		Object.defineProperty(_output, 'marker-name', {
			value:    'data-marker',   // an attribute to mark objects
			writable: false            // protect from overwrite
		});

		/**
		 * Name of custom plugin directory. It is supposed that this directory is a sibling
		 * of directory in which CKEDITOR resides ("ckeditor/").
		 * @property  {String} customPluginDir
		 * @final
		 */
		Object.defineProperty(_output, 'customPluginDir', {
			value: CKEDITOR.basePath.substr(0, CKEDITOR.basePath.indexOf('ckeditor/')) + 'customPlugins/',
			writable: false
		});

		/**
		 * A {{#crossLink "Mapper"}}Mapper{{/crossLink}} to establish relations between html tags and corresponding classes.
		 * @property {Mapper} _tagMapper
		 * @private
		 */
		var _tagMapper = new Mapper();
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.TEXT_NODE;}, PlainText);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TD';}, Cell);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TABLE';}, Table);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'TR';}, Row);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'A';}, Link);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'LI';}, ListItem);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'OL';}, OList);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'UL';}, UList);
		_tagMapper.add(function(el){return el !== undefined && el.nodeType === Node.ELEMENT_NODE && el.tagName === 'IMG';}, Image);
		_tagMapper.setDefaultTarget(Tag);

		/**
		 * Factory to produce instances of {{#crossLink "Tag"}}Tag{{/crossLink}} class.
		 *
		 * This factory is configured in such a way that its {{#crossLink "Factory/_mapping:property"}}_mapping{{/crossLink}}
		 * is set to {{#crossLink "NEWSLETTER/_tagMapper:property"}}_tagMapper{{/crossLink}}.
		 * @property {Factory} factory
		 * @final
		 */
		Object.defineProperty(_output, 'factory', {
			value:    new Factory(_tagMapper),
			writable: false
		});


		/**
		 * Maps format identifier (string description) to class that performs required actions.
		 *
		 * Converters {{#crossLink "ConverterFixed"}}ConverterFixed{{/crossLink}} and
		 * {{#crossLink "ConverterElastic"}}ConverterElastic{{/crossLink}} are registered for this mapper.
		 * @property  {Mapper} _formatMapper
		 * @private
		 */
		var _formatMapper = new Mapper();
		_formatMapper.add(function(str){return typeof str === 'string' && str.toLowerCase() === 'fixed';}, ConverterFixed);
		_formatMapper.add(function(str){return typeof str === 'string' && str.toLowerCase() === 'elastic';}, ConverterElastic);

		/**
		 * Maps format identifier (string description) to class that performs required actions.
		 *
		 * Its value is set to {{#crossLink "NEWSLETTER/_formatMapper:property"}}_formatMapper{{/crossLink}} and
		 * is write-protected.
		 * @property  {Mapper} formatMapper
		 * @final
		 */
		Object.defineProperty(_output, 'formatMapper', {
			value:    _formatMapper,
			writable: false
		});

		/**
		 * Base styles that are applied when saving the editor content.
		 * It is a css-like formatted string, i.e. `h1 {color: red; position: absolute;}`
		 *
		 * @property    {String}       cssBase
		 * @since       0.0.6
		 * @final
		 */
		Object.defineProperty(_output, 'cssBase', {
			value:    'body {background-color: #ffffff; color: #000001; line-height: normal; text-align: center; font-size: 13px; font-family: Arial, sans-serif; font-style: normal; font-weight: normal; width: ' + _output.width() + ';}',
			writable: false
		});

		/**
		 * Styles that are applied to the content of the editor only and not to a saved content.
		 * It is a css-like formatted string, i.e. `h1 {color: red; position: absolute;}`
		 *
		 * @property    {String}       cssEditor
		 * @since       0.0.6
		 * @final
		 */
		Object.defineProperty(_output, 'cssEditor', {
			value: 'body{padding: 0em; margin: 1em;}\
				tr:hover {box-shadow: 0.05em 0.0em 0.5em 0.05em #758E9D;}\
				td:hover {box-shadow: 0.05em 0.05em 0.2em 0.05em #5F6E76;}\
				a:hover {background-color: rgba(95, 110, 118, 0.2);}\
				a {color: ; font-weight: normal}',
			writable: false
		});




		return _output;
	};

	if (_instance === undefined){
		_instance = _init();
	}
	return _instance;
}());