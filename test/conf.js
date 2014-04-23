/*jslint white: false */
/*jslint plusplus: true, white: true */

var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1,
  // array with file paths to class definitions
  fileSources = ['Helper.js',
    'Helper/Unit.js',
    'Properties.js',
    'Properties/Attributes.js',
    'Properties/Attributes/TableAttributes.js',
    'Properties/Attributes/LinkAttributes.js',

    'Properties/Styles.js',
    'Properties/Styles/TableStyles.js',
    'Properties/Styles/LinkStyles.js',
    'Properties/Styles/TableRowStyles.js',
    'Properties/Styles/TableCellStyles.js',
    'Properties/Styles/ImageStyles.js',
    'Properties/Styles/ListStyles.js',
    'Properties/Styles/ListItemStyles.js',

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

    'HtmlElements/Registry.js',
    'HtmlElements/Mapping.js',
    'HtmlElements/Factory.js',

    'HtmlElements/PlainText.js',

    'CKHelper.js',
    'CKHelper/Selection.js',
    'Helper/String.js',
  ],
  left = '../../jasmine/spec/', // string that should be prepended to each element of "fileSources"
                                // array in order to find corresponding specification file
  right = 'Spec',               // string that should be appended to file name of each element of the
                                // "fileSource" array
  fileSpec = fileSources.map(function(loc){
    return left + loc.replace(/\.js\b/, right + '.js');
  }),
  allFiles = fileSources.concat(fileSpec).concat('../../ckeditor/ckeditor.js').map(function(str){return str.replace(/\//g, path.sep);});


module.exports = function (config) {
  config.set({
    basePath: '../js/classes'.replace(/\//g, path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: allFiles,
    browsers: isWin ? ['Firefox', 'Chrome', 'IE'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    reporters: ['progress', 'coverage', 'spec'],
    preprocessors: { '**/*.js': 'coverage' },
    coverageReporter: {
      type : 'html',
      dir : '../../test/coverage'.replace(/\//g, path.sep),
    },
    singleRun: true
  });
};
