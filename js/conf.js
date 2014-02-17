module.exports = function(config) {
  config.set({
    basePath: 'classes',
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
      'string.js',
      '..\\..\\jasmine\\spec\\HelperSpec.js',
      '..\\..\\jasmine\\spec\\UnitSpec.js',
      '..\\..\\jasmine\\spec\\StyleSpec.js',
      '..\\..\\jasmine\\spec\\PropertySpec.js',
      '..\\..\\jasmine\\spec\\TagSpec.js',
      '..\\..\\jasmine\\spec\\TableSpec.js',
      '..\\..\\jasmine\\spec\\RowSpec.js',
      '..\\..\\jasmine\\spec\\CellSpec.js',
      '..\\..\\jasmine\\spec\\ListItemSpec.js',
      '..\\..\\jasmine\\spec\\ListSpec.js',
      '..\\..\\jasmine\\spec\\ContentSpec.js',
      '..\\..\\jasmine\\spec\\StringSpec.js'
    ],
    browsers: ['Firefox'],
    reporters: ['progress', 'coverage'],
    preprocessors: { '*.js': ['coverage'] },
    singleRun: true
  });
};