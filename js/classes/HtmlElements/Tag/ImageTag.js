/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ImageProperties, Content, Tag */

/**
 * Represents an ImageTag.
 * @module          HtmlElements
 * @class           ImageTag
 * @constructor
 */
function ImageTag() {
	"use strict";
	if (!(this instanceof ImageTag)) {
		return new ImageTag();
	}
	// inherit tag properties
	Tag.call(this);

	var allowedProtocols = ['http', 'https'];

	console.log('creating image');

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "img"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "ImageTag"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "ImageStyles"}}ImageStyles{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('img');
	this.setName('ImageTag');
	var prop = new ImageProperties();
	console.log("seeting image properties: ", prop.toString());
	this.setProperties(prop);

	/**
	 * Sets `src` property of ImageTag {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * if `url` corresponds to an ImageTag with non zero width and height. In this case, `height` and
	 * `width` properties are set in {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * @method         setOrigin
	 * @param          {String}             url
	 * @return         {void}
	 */
	this.setOrigin = function(url){
		var protocol = this.getProtocol(url);
		if (allowedProtocols.indexOf(protocol) === -1){
			console.log('protocol ' + protocol + ' is not supported!');
			return;
		}
		var img = document.createElement('img'),
			imgWidth, imgHeight;
		img.src = url;
		imgWidth = img.width;
		imgHeight = img.height;
		if (typeof imgWidth === 'number' && imgWidth > 0 && typeof imgHeight === 'number' && imgHeight > 0){
			this.setProperty('src', url);
			this.setProperty('width', imgWidth);
			this.setWidth(imgWidth);
			this.setStyleProperty('height', imgHeight);
			this.setProperty('height', imgHeight);
		}
	};

	/**
	 * Drops protocol name from `url`. Everything until the first occurence of '://' will be removed (inclusively).
	 * @method         dropProtocol
	 * @param          {String}             url
	 * @return         {String}
	 */
	this.dropProtocol = function(url){
		var delimiter = '://',
		    pattern = '^[^' + delimiter + ']+' + delimiter,
		    re = new RegExp(pattern, 'gi');
		return url.replace(re, '');
	};

	/**
	 * Returns protocol corresponding to `url`: everything starting from the beginning of line until
	 * first occurence of '://' (exclusively).
	 * @method         getProtocol
	 * @param          {String}             url
	 * @return         {String}
	 */
	this.getProtocol = function(url){
		var delimiter = '://',
		    pattern = '^[^' + delimiter + ']+' + delimiter,
		    re = new RegExp(pattern, 'gi'),
		    needle = url.match(re);
		if (Array.isArray(needle) && typeof needle[0] === 'string'){
			return needle[0].replace(delimiter, '');
		}
		return null;
	};


	/**
	 * Gets "src" property of ImageTag {{#crossLink "Attributes"}}attribute{{/crossLink}} inherited from
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} class.
	 * @method         getOrigin
	 * @return         {String}
	 */
	this.getOrigin = function(){
		return this.getProperty('src');
	};

	/**
	 * Gets ImageTag height. It is read from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * It is set along with `src` attribute in {{#crossLink "ImageTag/setOrigin:method"}}setOrigin{{/crossLink}}
	 * method.
	 * @method         getHeight
	 * @return         {Integer}
	 */
	this.getHeight = function(){
		return this.getProperty('height') || 0;
	};

	/**
	 * Returns html representation of the instance if
	 * {{#crossLink "ImageTag/getOrigin:method"}}getOrigin(){{/crossLink}} returns non-empty string.
	 * Otherwise, returns empty string.
	 *
	 * Html representation consists of opening and closing tags that are output of methods
     * {{#crossLink "Tag/openingTag:method"}}openingTag{{/crossLink}} and
	 * {{#crossLink "Tag/closingTag:method"}}closingTag{{/crossLink}} correspondingly.
	 *
	 * This method overrides the parent one {{#crossLink "Tag/toHtml:method"}}toHtml{{/crossLink}}
	 * (since I could not consistently call a parent class method from a child one when the child
	 * class overrides the corresponding parent method.)
	 * @method         toHtml
	 * @return         {String}
	 */
	this.toHtml = function(){
		var orig = this.getOrigin();
		return (typeof orig === 'string' && orig.length > 0) ? this.openingTag() + this.closingTag() : '';
	};

	/**
	 * Image template: json object of image properties that parametrise the image. As required, overrides
	 * base class method {{#crossLink "Tag/template:method"}}Tag::template{{/crossLink}}.
	 *
	 * @method         template
	 * @return         {Object}
	 * @since          0.1.0
	 */
	this.template = function(){
		var info = {
			name: 'img',
			root: {
				src:           this.getOrigin(),
				// width:         this.getWidth(),
				// height:        this.getHeight(),
				alt:           this.getProperty('alt'),
				title:         this.getProperty('title'),
			}
		};
		return info;
	};

	/**
	 * Sets parameters from template `tmpl`.
	 * @method         loadFromTemplate
	 * @param          {Object}         tmpl
	 * @return         {void}
	 * @since          0.1.0
	 */
	this.loadFromTemplate = function(tmpl){
		console.log('loading from template', tmpl);
		var key;
		for (key in tmpl){
			if (tmpl.hasOwnProperty(key)){
				switch (key){
					case 'title':
						this.setProperty(key, tmpl[key]);
						break;
					case 'src':
						this.setOrigin(tmpl[key]);
						break;
					case 'alt':
						this.setProperty(key, tmpl[key]);
						break;
				}
			}
		}
	};
}

ImageTag.prototype = Object.create(Tag.prototype);

/**
 * {{#crossLink "ImageTag"}}ImageTag{{/crossLink}}'s class characteristic function.
 *
 * It returns `true` if the argument "corresponds" to an object which class Link is designed
 * to represent.
 * @method        characteristicFunction
 * @param         {Any}               n
 * @return        {Boolean}
 * @since         0.2.0
 */
ImageTag.prototype.characteristicFunction = function(n){
	return (n instanceof Element) && n.tagName.toLowerCase() === 'img';
};