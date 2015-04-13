/*jslint plusplus: true, white: true */
/*global gulp */

var gulp   = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// define project files in the order as they must be included
// each of these files is to be first compressed and then
// all of these files are concatenated in a single file.
var sourceFiles = [
	'js/classes/Helper.js',
	'js/classes/Helper/Unit.js',
	'js/classes/Properties.js',
	'js/classes/Properties/ImageProperties.js',
	'js/classes/Properties/LinkProperties.js',
	'js/classes/Properties/CellProperties.js',
	'js/classes/Properties/ListProperties.js',
	'js/classes/Properties/ListItemProperties.js',
	'js/classes/Properties/RowProperties.js',
	'js/classes/Properties/TableProperties.js',
	// models
	'js/classes/HtmlElements/Content.js',
	'js/classes/HtmlElements/Tag.js',
	'js/classes/HtmlElements/Tag/Table.js',
	'js/classes/HtmlElements/Tag/Cell.js',
	'js/classes/HtmlElements/Tag/ImageTag.js',
	'js/classes/HtmlElements/Tag/Row.js',
	'js/classes/HtmlElements/Tag/List.js',
	'js/classes/HtmlElements/Tag/ListItem.js',
	'js/classes/HtmlElements/Tag/OList.js',
	'js/classes/HtmlElements/Tag/UList.js',
	'js/classes/HtmlElements/Tag/Link.js',
	'js/classes/HtmlElements/PlainText.js',
	 // document-related models
	'js/classes/HtmlElements/Document.js',
	// converters
	'js/converters/Converter.js',
	'js/converters/ConverterGeneral.js',
	'js/converters/ConverterFixed.js',
	'js/converters/ConverterElastic.js',
	 // helpers
	'js/classes/CKHelper.js',
	'js/classes/HtmlElements/Mapper.js',
	'js/classes/HtmlElements/Factory.js',
	// Controllers
	'js/controllers/Controller.js',
	'js/controllers/CTable.js',
	'js/controllers/CRow.js',
	'js/controllers/CCell.js',
	'js/controllers/CLink.js',
	'js/controllers/CList.js',
	'js/controllers/CDownload.js',
	'js/controllers/CImage.js',
	'js/controllers/CTextDecoration.js',
	 // Adapters
	'js/adapters/EditorAdapter.js',
	'js/adapters/CKEditor/CKEditorAdapter.js',

	 // event handlers
	'js/eventHandlers/EHToolbar.js',

	// configuration file
	'settings/general_config.js',
	// entry file
	'js/start.js'
];
gulp.task('concat', function() {
  return gulp.src(['./gulp/compressed/*.js'])
    .pipe(concat('editor.min.js'))
    .pipe(gulp.dest('./js_prod/'));
});

gulp.task('compress', function() {
  return gulp.src(sourceFiles)
    .pipe(uglify())
    .pipe(gulp.dest('./gulp/compressed/'));
});

gulp.task('default', ['compress', 'concat']);
