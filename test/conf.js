var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1;
// require('../ckeditor/ckeditor.js'.replace(/\//g, path.sep));
module.exports = function (config) {
  config.set({
    basePath: '../js/classes'.replace(/\//g, path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: [
    'Helper.js',
    'Helper/unit.js',
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
    'HtmlElements/Tag/Row.js',
    'HtmlElements/Tag/List.js',
    'HtmlElements/Tag/ListItem.js',
    'HtmlElements/Tag/OList.js',
    'HtmlElements/Tag/UList.js',
    'HtmlElements/Tag/Link.js',

    'HtmlElements/Registry.js',
    'HtmlElements/Factory.js',

    'HtmlElements/PlainText.js',

    'CKHelper.js',
    'CKHelper/Selection.js',
    'Helper/String.js',
      '../../jasmine/spec/HelperSpec.js',
      '../../jasmine/spec/UnitSpec.js',
      '../../jasmine/spec/PropertiesSpec.js',
      '../../jasmine/spec/AttributesSpec.js',
      '../../jasmine/spec/LinkAttributesSpec.js',
      '../../jasmine/spec/TableAttributesSpec.js',
      '../../jasmine/spec/StyleSpec.js',
      '../../jasmine/spec/TagSpec.js',
      '../../jasmine/spec/PlainTextSpec.js',
      '../../jasmine/spec/TableSpec.js',
      '../../jasmine/spec/RowSpec.js',
      '../../jasmine/spec/CellSpec.js',
      '../../jasmine/spec/ListItemSpec.js',
      '../../jasmine/spec/ListSpec.js',
      '../../jasmine/spec/OListSpec.js',
      '../../jasmine/spec/UListSpec.js',
      '../../jasmine/spec/LinkSpec.js',
      '../../jasmine/spec/CKHelperSpec.js',
      '../../jasmine/spec/SelectionSpec.js',
      '../../jasmine/spec/ContentSpec.js',
      '../../jasmine/spec/StringSpec.js',
      '../../jasmine/spec/FactorySpec.js',
      '../../jasmine/spec/RegistrySpec.js',
      '../../ckeditor/ckeditor.js'
    ].map(function(str){return str.replace(/\//g, path.sep);}),
    browsers: isWin ? ['Firefox', 'Chrome', 'IE'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    reporters: ['progress', 'coverage'],
    preprocessors: { '*.js': ['coverage'] },
    coverageReporter: {
      type : 'html',
      dir : '../../test/coverage'.replace(/\//g, path.sep),
    },
    singleRun: true
  });
};
