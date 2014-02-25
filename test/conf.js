var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1;

module.exports = function (config) {
  config.set({
    basePath: '../js/classes'.replace('/', path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: [
      'helpers.js',
      'unit.js',
      'property.js',
      'attributes.js',
      'style.js',
      'content.js',
      'tag.js',
      'table.js',
      'cell.js',
      'row.js',
      'listItem.js',
      'list.js',
      'link.js',
      'string.js',
      'CKHelper.js',
      '../../jasmine/spec/HelperSpec.js',
      '../../jasmine/spec/UnitSpec.js',
      '../../jasmine/spec/AttributesSpec.js',
      '../../jasmine/spec/LinkAttributesSpec.js',
      '../../jasmine/spec/StyleSpec.js',
      '../../jasmine/spec/PropertySpec.js',
      '../../jasmine/spec/TagSpec.js',
      '../../jasmine/spec/TableSpec.js',
      '../../jasmine/spec/RowSpec.js',
      '../../jasmine/spec/CellSpec.js',
      '../../jasmine/spec/ListItemSpec.js',
      '../../jasmine/spec/ListSpec.js',
      '../../jasmine/spec/LinkSpec.js',
      '../../jasmine/spec/ContentSpec.js',
      '../../jasmine/spec/StringSpec.js'
    ].map(function(str){return str.replace('/', path.sep);}),
    browsers: isWin ? ['Firefox', 'Chrome', 'IE'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    reporters: ['progress', 'coverage'],
    preprocessors: { '*.js': ['coverage'] },
    coverageReporter: {
      type : 'html',
      dir : '../../test/coverage'.replace('/', path.sep),
    },
    singleRun: true
  });
};
