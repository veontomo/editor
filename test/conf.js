/*jslint white: false */
/*jslint plusplus: true, white: true */

var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1,
  settingsFiles = [
        '../ckeditor/ckeditor.js',
        '../settings/general_config.js'
  ],
  // array with file paths to class definitions
  fileSources = [
    'classes/Helper.js',
    'classes/Helper/Unit.js',
    'classes/Properties.js',
    'classes/Properties/ImageProperties.js',
    'classes/Properties/LinkProperties.js',
    'classes/Properties/CellProperties.js',
    'classes/Properties/ListProperties.js',
    'classes/Properties/ListItemProperties.js',
    'classes/Properties/RowProperties.js',
    'classes/Properties/TableProperties.js',
    'classes/HtmlElements/Content.js',
    'classes/HtmlElements/Tag.js',
    'classes/HtmlElements/Tag/Table.js',
    'classes/HtmlElements/Tag/Cell.js',
    'classes/HtmlElements/Tag/Image.js',
    'classes/HtmlElements/Tag/Row.js',
    'classes/HtmlElements/Tag/List.js',
    'classes/HtmlElements/Tag/ListItem.js',
    'classes/HtmlElements/Tag/OList.js',
    'classes/HtmlElements/Tag/UList.js',
    'classes/HtmlElements/Tag/Link.js',
    'classes/HtmlElements/PlainText.js',
    'classes/HtmlElements/Document.js',
    'classes/HtmlElements/Dom.js',
    'classes/CKHelper.js',
    'classes/CKHelper/Selection.js',
    'classes/HtmlElements/Mapper.js',
    'classes/HtmlElements/Factory.js',
    'controllers/Controller.js',
    'converters/Converter.js',
    'converters/ConverterGeneral.js',
    'converters/ConverterFixed.js',
    'converters/ConverterElastic.js',
  ],

  left = '../jasmine/spec/', // string that should be prepended to each element of "fileSources"
                                // array in order to find corresponding specification file
  right = 'Spec',               // string that should be appended to file name of each element of the
                                // "fileSource" array
  fileSpec = fileSources.map(function(loc){
    return left + loc.replace(/\.js\b/, right + '.js');
  }),
  allFiles = fileSources.concat(fileSpec).concat(settingsFiles).map(function(str){return str.replace(/\//g, path.sep);});

  console.log(allFiles);

module.exports = function (config) {
  config.set({
    basePath: '../js/'.replace(/\//g, path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: allFiles,
    // browsers: isWin ? ['Firefox', 'Chrome', 'IE'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    browsers:  ['Firefox'],
    reporters: ['progress', 'coverage', 'spec'],
    preprocessors: { '**/*.js': 'coverage' },
    coverageReporter: {
      type : 'html',
      dir : '../statistics/jsCoverage'.replace(/\//g, path.sep),
    },
    singleRun: true
  });
};
