/*jslint plusplus: true, white: true */
/*global  Node */

/**
 * Dialog class.
 * @module    Dialogs
 * @class     AbstractDialog
 * @type      {Object}
 * @since     0.2.9
 * @author    A.Shcherbakov
 */
function AbstractDialog(e){
	"use strict";
	if (!(this instanceof AbstractDialog)) {
	    return new AbstractDialog(e);
	}

	/**
	 * Controller related to this dialog.
	 * @property       {Controller}       _controller     instance of {{#crossLink "Controller"}}Controller{{/crossLink}}
	 * @private
	 * @since          0.2.8
	 */
	var _controller;

	/**
	 * Editor adapter.
	 * @property     {EditorAdapter}    _adapter
	 * @private
	 * @since        0.2.8
	 */
	var _adapter;


	/**
	 * Plugin name.
	 * @property     {String}    _pluginName
	 * @private
	 * @since        0.2.8
	 */
	var _pluginName;

	/**
	 * Style for label fields (text in front of input fields).
	 * @property {String} _labelStyle
	 * @type     {String}
	 * @private
	 */
	var _textInputStyle = 'padding-left: 0px; margin: 0; float: left; width: 100%;';

	/**
	 * Style for warning fields.
	 * @property {String} _warningStyle
	 * @type     {String}
	 * @private
	 */
	var _warningStyle = 'color: #EE0000; font-size: 1.1em; font-weight: bold;';


	/**
	 * {{#crossLink "AbstractDialog/_controller:property"}}_controller{{/crossLink}} setter.
	 * @method  setController
	 * @param   {Controller} controller
	 * @since   0.2.8
	 */
	this.setController = function(controller){
		_controller = controller;
	};

	/**
	 * {{#crossLink "AbstractDialog/_controller:property"}}_controller{{/crossLink}} getter.
	 * @method  getController
	 * @return {Controller}
	 * @since  0.2.8
	 */
	this.getController = function(){
		return _controller;
	};

	/**
	 * {{#crossLink "AbstractDialog/_adapter:property"}}_adapter{{/crossLink}} setter.
	 * @method  setAdapter
	 * @param {EditorAdapter}   adapter  instance of {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}}
	 */
	this.setAdapter = function(adapter){
		_adapter = adapter;
	};


	/**
	 * {{#crossLink "AbstractDialog/_adapter:property"}}_adapter{{/crossLink}} getter.
	 * @method         getAdapter
	 * @return         {EditorAdapter}   adapter  instance of {{#crossLink "EditorAdapter"}}EditorAdapter{{/crossLink}}
	 */
	this.getAdapter = function(){
		return _adapter;
	};


	/**
	 * {{#crossLink "AbstractDialog/_pluginName:property"}}_pluginName{{/crossLink}} getter.
	 * @method  getPluginName
	 * @return {String}
	 * @since  0.2.8
	 */
	this.getPluginName = function(){
		return _pluginName;
	};

	/**
	 * {{#crossLink "AbstractDialog/_pluginName:property"}}_pluginName{{/crossLink}} setter.
	 * @method         getPluginName
	 * @param          {String}        name
	 * @since          0.2.8
	 */
	this.setPluginName = function(name){
		_pluginName = name;
	};


	/**
	 * {{#crossLink "AbstractDialog/_textInputStyle:property"}}_textInputStyle{{/crossLink}} getter.
	 * @method  getTextInputStyle
	 * @return {String}
	 */
	this.getTextInputStyle = function(){
		return _textInputStyle;
	};


	/**
	 * {{#crossLink "AbstractDialog/_textInputStyle:property"}}_textInputStyle{{/crossLink}} setter.
	 * @method  setTextInputStyle
	 * @param   {String}  style
	 */
	this.setTextInputStyle = function(style){
		_textInputStyle = style;
	};

	/**
	 * {{#crossLink "AbstractDialog/_warningStyle:property"}}_warningStyle{{/crossLink}} getter.
	 * @method  getTextInputStyle
	 * @return {String}
	 */
	this.getWarningStyle = function(){
		return _warningStyle;
	};


	/**
	 * {{#crossLink "AbstractDialog/_warningStyle:property"}}_warningStyle{{/crossLink}} setter.
	 * @method  setTextInputStyle
	 * @param   {String}  style
	 */
	this.setWarningStyle = function(style){
		_warningStyle = style;
	};








}