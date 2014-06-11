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
	this.setStyles(new ImageStyles());

	/**
	 * Sets `src` property of image {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}
	 * if `url` corresponds to an image with non zero width and height. In this case, `height` and
	 * `width` properties are set in {{#crossLink "Tag/styles:property"}}styles{{/crossLink}} and
	 * {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * @method         setOrigin
	 * @param          {String}             url
	 * @return         {void}
	 */
	// this.setOrigin = function(url){
	// 	var urlWithoutProtocol = this.dropProtocol(url),
	// 		url2 = 'http://' + urlWithoutProtocol;
	// 	var timeStart = new Date(),
	// 		timeLimit = 5000,
	// 		currentTime,
	// 		imgWidth, imgHeight, imgElem;
	// 	if (typeof urlWithoutProtocol === 'string' && urlWithoutProtocol.length > 0){
	// 		var httpRequest;
	// 		if (window.XMLHttpRequest) {
	// 			httpRequest = new XMLHttpRequest();
	// 		} else if (window.ActiveXObject) {
	// 		    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	// 		}
	// 		// httpRequest.onreadystatechange = function(){
	// 		//   console.log("READY");
	// 		//   // console.log(httpRequest.responseText);
	// 		//   temp = 'new value';
	// 		//   console.log('temp =: ' + temp);

	// 		// };

	// 		/**
	// 		 * httpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	// 		 */
	// 		// httpRequest.open('GET', url2, false);
	// 		// httpRequest.send(null);
	// 		// console.log(	httpRequest.responseText);
	// 		// console.log(httpRequest);
	// 		imgElem = document.createElement('img');
	// 		imgElem.setAttribute('src', url2);
	// 		currentTime = new Date();
	// 		imgWidth =  imgElem.naturalWidth;
	// 		imgHeight = imgElem.naturalHeight;
	// 		while (!(imgWidth > 0 && imgHeight > 0)){
	// 			imgElem = document.createElement('img');
	// 			imgElem.setAttribute('src', url2);
	// 			imgWidth =  imgElem.naturalWidth;
	// 			imgHeight = imgElem.naturalHeight;
	// 			currentTime = new Date();
	// 			if (currentTime - timeStart > timeLimit){
	// 				console.log('time limit is achieved...');
	// 				break;
	// 			}

	// 		}

	// 		// if (ns.imgWidth > 0 && ns.imgHeight > 0){
	// 		this.setAttrProperty('src', url2);
	// 		this.setAttrProperty('width', imgWidth);
	// 		this.setAttrProperty('height', imgHeight);
	// 		this.setWidth(imgWidth);
	// 		this.setStyleProperty('height', imgHeight);

	// 		// elemFound.parentNode.removeChild(elemFound);
	// 		// }
	// 	}
	// };
	this.setOrigin = function(url){
		var protocol = this.getProtocol(url);
		if (allowedProtocols.indexOf(protocol) !== -1){
			var img = document.createElement('img'),
				imgWidth, imgHeight;
			img.src = url;
			imgWidth = img.width;
			imgHeight = img.height;
			if (typeof imgWidth === 'number' && imgWidth > 0 && typeof imgHeight === 'number' && imgHeight > 0){
				this.setAttrProperty('src', url);
				this.setAttrProperty('width', imgWidth);
				this.setWidth(imgWidth);
				this.setStyleProperty('height', imgHeight);
				this.setAttrProperty('height', imgHeight);
			}
		} else {
			console.log('protocol ' + protocol + ' is not supported!');
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
		return this.getAttrProperty('src');
	};

	/**
	 * Gets image height. It is read from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
	 * It is set along with `src` attribute in {{#crossLink "Image/setOrigin:method"}}setOrigin{{/crossLink}}
	 * method.
	 * @method         getHeight
	 * @return         {Integer}
	 */
	this.getHeight = function(){
		return this.getAttrProperty('height') || 0;
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
