/*jslint white: false */
/*jslint plusplus: true, white: true */

var path = require('path'),
  os = require('os'),
  // if the operation system is Windows
  isWin = os.platform().toLowerCase().indexOf('win') !== -1,
  allFiles = [
    "../ckeditor/ckeditor.js",
    "classes/Helper.js",
    "classes/Helper/Unit.js",
    "classes/Properties.js",
    "classes/Properties/ImageProperties.js",
    "classes/Properties/LinkProperties.js",
    "classes/Properties/CellProperties.js",
    "classes/Properties/ListProperties.js",
    "classes/Properties/ListItemProperties.js",
    "classes/Properties/RowProperties.js",
    "classes/Properties/TableProperties.js",
    "classes/HtmlElements/Content.js",
    "classes/HtmlElements/Tag.js",
    "classes/HtmlElements/Tag/Table.js",
    "classes/HtmlElements/Tag/Cell.js",
    "classes/HtmlElements/Tag/Image.js",
    "classes/HtmlElements/Tag/Row.js",
    "classes/HtmlElements/Tag/List.js",
    "classes/HtmlElements/Tag/ListItem.js",
    "classes/HtmlElements/Tag/OList.js",
    "classes/HtmlElements/Tag/UList.js",
    "classes/HtmlElements/Tag/Link.js",
    "controllers/Controller.js",
    "controllers/CDownload.js",
    "converters/Worker.js",
    "converters/Converter.js",
    "converters/ConverterGeneral.js",
    "converters/ConverterFixed.js",
    "converters/ConverterElastic.js",
    "converters/ConverterSimpleText.js",
    "classes/HtmlElements/Dom.js",
    "classes/HtmlElements/Document.js",
    "classes/HtmlElements/Mapper.js",
    "classes/HtmlElements/Factory.js",
    "classes/HtmlElements/PlainText.js",
    "classes/CKHelper.js",
    "classes/CKHelper/Selection.js",
    "../settings/general_config.js",
    "../jasmine/spec/classes/HelperSpec.js",
    "../jasmine/spec/classes/Helper/UnitSpec.js",
    "../jasmine/spec/classes/PropertiesSpec.js",
    "../jasmine/spec/classes/Properties/ImagePropertiesSpec.js",
    "../jasmine/spec/classes/Properties/LinkPropertiesSpec.js",
    "../jasmine/spec/classes/Properties/CellPropertiesSpec.js",
    "../jasmine/spec/classes/Properties/ListPropertiesSpec.js",
    "../jasmine/spec/classes/Properties/ListItemPropertiesSpec.js",
    "../jasmine/spec/classes/Properties/RowPropertiesSpec.js",
    "../jasmine/spec/classes/Properties/TablePropertiesSpec.js",
    "../jasmine/spec/classes/HtmlElements/ContentSpec.js",
    "../jasmine/spec/classes/HtmlElements/TagSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/TableSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/CellSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/ImageSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/RowSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/ListSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/ListItemSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/OListSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/UListSpec.js",
    "../jasmine/spec/classes/HtmlElements/Tag/LinkSpec.js",
    "../jasmine/spec/classes/HtmlElements/DomSpec.js",
    "../jasmine/spec/classes/HtmlElements/DocumentSpec.js",
    "../jasmine/spec/classes/HtmlElements/MapperSpec.js",
    "../jasmine/spec/classes/HtmlElements/FactorySpec.js",
    "../jasmine/spec/classes/HtmlElements/PlainTextSpec.js",
    "../jasmine/spec/classes/CKHelperSpec.js",
    "../jasmine/spec/classes/CKHelper/SelectionSpec.js",
    "../jasmine/spec/controllers/ControllerSpec.js",
    "../jasmine/spec/controllers/CDownloadSpec.js",
    "../jasmine/spec/converters/WorkerSpec.js",
    "../jasmine/spec/converters/ConverterFixedSpec.js",
    "../jasmine/spec/converters/ConverterElasticSpec.js",
    "../jasmine/spec/converters/ConverterSimpleTextSpec.js"
  ],
  statisticsDir = '../statistics/jsCoverage/'.replace(/\//g, path.sep);


allFiles = allFiles.map(function(fn){ return fn.replace(/\//g, path.sep);});

module.exports = function (config) {
  config.set({
    basePath: '../js/'.replace(/\//g, path.sep),
    autoWatch: true,
    frameworks: ['jasmine'],
    files: allFiles,
    browsers: isWin ? ['Chrome', 'IE', 'Firefox'] : ['/usr/lib/chromium-browser/chromium-browser', 'Firefox'],
    // browsers: ['Firefox'],
    reporters: ['progress', 'coverage', 'spec'],
    browserDisconnectTimeout: 1000,
    browserNoActivityTimeout: 1000,
    preprocessors: {'**/*.js': 'coverage'},
    colors: true,
    coverageReporter: {
      reporters: [
          {type: 'lcov', dir: statisticsDir}
        ],
    },
    singleRun: false
  });
};