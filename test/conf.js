/*jslint white: false */
/*jslint plusplus: true, white: true */

var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1,
  // array with file paths to class definitions
  fileSources = [
    // 'Helper.js',
    // 'Helper/Unit.js',

    // 'Properties.js',
    // 'Properties/CellProperties.js',
    // 'Properties/ImageProperties.js',
    // 'Properties/LinkProperties.js',
    // 'Properties/ListItemProperties.js',
    // 'Properties/ListProperties.js',
    // 'Properties/RowProperties.js',
    // 'Properties/TableProperties.js',

    // 'HtmlElements/Content.js',
    // 'HtmlElements/Document.js',
    // 'HtmlElements/Dom.js',
    // 'HtmlElements/Factory.js',
    // 'HtmlElements/Mapper.js',
    // 'HtmlElements/PlainText.js',
    // 'HtmlElements/Tag.js',


    // 'HtmlElements/Tag/Cell.js',
    // 'HtmlElements/Tag/Image.js',
    // 'HtmlElements/Tag/Link.js',
    // 'HtmlElements/Tag/List.js',
    // 'HtmlElements/Tag/ListItem.js',
    // 'HtmlElements/Tag/OList.js',
    // 'HtmlElements/Tag/Row.js',
    // 'HtmlElements/Tag/Table.js',
    // 'HtmlElements/Tag/UList.js',

    // 'CKHelper.js',
    // 'CKHelper/Selection.js',
    // 'Helper/String.js',

    'Helper.js',
    'Helper/Unit.js',
    'Properties.js',
    'Properties/ImageProperties.js',
    'Properties/LinkProperties.js',
    'Properties/CellProperties.js',
    'Properties/ListProperties.js',
    'Properties/ListItemProperties.js',
    'Properties/RowProperties.js',
    'Properties/TableProperties.js',
    'HtmlElements/Content.js',
    'HtmlElements/Tag.js',
    'HtmlElements/Tag/Table.js',
    'HtmlElements/Tag/Cell.js',
    'HtmlElements/Tag/Image.js',
    'HtmlElements/Tag/Row.js',
    'HtmlElements/Tag/List.js',
    'HtmlElements/Tag/ListItem.js',
    'HtmlElements/Tag/OList.js',
    'HtmlElements/Tag/UList.js',
    'HtmlElements/Tag/Link.js',
    'HtmlElements/PlainText.js',
    'HtmlElements/Document.js',
    'HtmlElements/Dom.js',
    'CKHelper.js',
    'CKHelper/Selection.js',
    'HtmlElements/Mapper.js',
    'HtmlElements/Factory.js',
  ],

  left = '../../jasmine/spec/classes/', // string that should be prepended to each element of "fileSources"
                                // array in order to find corresponding specification file
  right = 'Spec',               // string that should be appended to file name of each element of the
                                // "fileSource" array
  fileSpec = fileSources.map(function(loc){
    return left + loc.replace(/\.js\b/, right + '.js');
  }),
  allFiles = fileSources.concat(fileSpec).concat('../../ckeditor/ckeditor.js').map(function(str){return str.replace(/\//g, path.sep);});


module.exports = function (config) {
  config.set({
    basePath: '../js/classes/'.replace(/\//g, path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: allFiles,
    // browsers: isWin ? ['Firefox', 'Chrome', 'IE'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    browsers:  ['IE'],
    reporters: ['progress', 'coverage', 'spec'],
    preprocessors: { '**/*.js': 'coverage' },
    coverageReporter: {
      type : 'html',
      dir : '../../statistics/jsCoverage'.replace(/\//g, path.sep),
    },
    singleRun: true
  });
};
