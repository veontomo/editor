/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ImageStyles, Content, Tag */

/**
 * Represents an image.
 * @module          HtmlElements
 * @class           Image
 * @constructor
 */
function Image() {
	"use strict";
	if (!(this instanceof Image)) {
		return new Image();
	}
	// inherit tag properties
	Tag.call(this);

	var allowedProtocols = ['http', 'https'];

	/**
	 * Re-set private properties defined in parent class {{#crossLink "Tag"}}Tag{{/crossLink}}:
	 * <ol><li>
	 * {{#crossLink "Tag/tag:property"}}tag{{/crossLink}} to be "img"
	 * </li><li>
	 * {{#crossLink "Tag/className:property"}}className{{/crossLink}} to be "Image"
	 * </li><li>
	 * {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} to be
	 * {{#crossLink "ImageStyles"}}ImageStyles{{/crossLink}}
	 * </li></ol>
	 * @method         constructor
	 */
	this.setTag('img');
	this.setName('Image');
	this.setProperties(new ImageStyles());

	/**
	 * Sets `src` property of image {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * if `url` corresponds to an image with non zero width and height. In this case, `height` and
	 * `width` properties are set in {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * @method         setOrigin
	 * @param          {String}             url
	 * @return         {void}
	 */
	this.setOrigin = function(url){
		var protocol = this.getProtocol(url);
		if (allowedProtocols.indexOf(protocol) !== -1){
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
		} else {
			// console.log('protocol ' + protocol + ' is not supported!');
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
	 * Gets "src" property of image {{#crossLink "Attributes"}}attribute{{/crossLink}} inherited from
	 * {{#crossLink "Tag"}}Tag{{/crossLink}} class.
	 * @method         getOrigin
	 * @return         {String}
	 */
	this.getOrigin = function(){
		// console.log('get origin: ' + this.getAttributes());
		return this.getProperty('src');
	};

	/**
	 * Gets image height. It is read from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * It is set along with `src` attribute in {{#crossLink "Image/setOrigin:method"}}setOrigin{{/crossLink}}
	 * method.
	 * @method         getHeight
	 * @return         {Integer}
	 */
	this.getHeight = function(){
		return this.getProperty('height') || 0;
	};

	/**
	 * Returns html representation of the instance if
	 * {{#crossLink "Image/getOrigin:method"}}getOrigin(){{/crossLink}} returns non-empty string.
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
}
Image.prototype = Object.create(Tag.prototype);
