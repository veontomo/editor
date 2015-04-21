/*jslint white: false */
/*jslint plusplus: true, white: true */
/*global ImageProperties, Content, Tag, Element */

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
    this.setProperties(prop);

    /**
     * Sets `src` property of ImageTag {{#crossLink "Tag/_properties:property"}}_properties{{/crossLink}}.
     * @method         setOrigin
     * @param          {String}             url
     * @return         {void}
     */
    this.setOrigin = function(url) {
        var protocol = this.getProtocol(url);
        if (allowedProtocols.indexOf(protocol) === -1) {
            console.log('protocol ' + protocol + ' is not supported!');
            return;
        }
        this.setProperty('src', url);
    };

    /**
     * Drops protocol name from `url`. Everything until the first occurence of '://' will be removed (inclusively).
     * @method         dropProtocol
     * @param          {String}             url
     * @return         {String}
     */
    this.dropProtocol = function(url) {
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
    this.getProtocol = function(url) {
        var delimiter = '://',
            pattern = '^[^' + delimiter + ']+' + delimiter,
            re = new RegExp(pattern, 'gi'),
            needle = url.match(re);
        if (Array.isArray(needle) && typeof needle[0] === 'string') {
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
    this.getOrigin = function() {
        return this.getProperty('src');
    };

    /**
     * Gets ImageTag height. It is read from {{#crossLink "Tag/attributes:property"}}attributes{{/crossLink}}.
     * It is set along with `src` attribute in {{#crossLink "ImageTag/setOrigin:method"}}setOrigin{{/crossLink}}
     * method.
     * @method         getHeight
     * @return         {Integer}
     */
    this.getHeight = function() {
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
    this.toHtml = function() {
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
    this.template = function() {
        var info = {
            name: 'img',
            root: {
                src: this.getOrigin(),
                // width:         this.getWidth(),
                // height:        this.getHeight(),
                alt: this.getProperty('alt'),
                title: this.getProperty('title'),
            }
        };
        return info;
    };

    /**
     * Load template and sets width and height according to actual image dimensions.
     * @method         loadTemplate
     * @param          {Object}        tmpl       template
     * @return         {void}
     * @since          0.2.6
     */
    this.loadTemplate = function(tmpl) {
        this.loadProperTemplate(tmpl);
        var key1 = 'root',
            key2 = 'src';
        if (tmpl && tmpl.hasOwnProperty(key1)) {
            if (tmpl[key1] && tmpl[key1].hasOwnProperty(key2)) {
                this.setOrigin(tmpl[key1][key2]);
            }
        }
    };

    /**
     * Sets image height.
     *
     * Sets "height" property as an attribute and as inline property.
     * @method         _setHeight
     * @param          {Number}        h
     * @since          0.2.6
     * @private
     */
    var _setHeight = function(h) {
        var heightKey = 'height';
        this.setProperty(heightKey, h);
        this.setStyleProperty(heightKey, h.toString() + 'px');
    }.bind(this);

    /**
     * Sets image dimensions.
     * @method         setDimensions
     * @param          {Object}        obj     json-like object with numeric-valued keys "width" and "height"
     * @since          0.2.6
     */
    this.setDimensions = function(obj) {
        var widthKey = 'width',
            heightKey = 'height';
        if (obj.hasOwnProperty(widthKey) && obj.hasOwnProperty(heightKey)) {
            this.setWidth(obj[widthKey]);
            var height = parseInt(obj.hasOwnProperty(heightKey), 10);
            if (typeof height === 'number') {
                _setHeight(height);
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
ImageTag.prototype.characteristicFunction = function(n) {
    return (n instanceof Element) && n.tagName.toLowerCase() === 'img';
};
