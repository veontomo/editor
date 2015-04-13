/*jslint plusplus: true, white: true */
/*global gulp */

var gulp   = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
  return gulp.src(["js/classes/HtmlElements/Content.js", "js/classes/HtmlElements/Tag.js", "js/classes/HtmlElements/Tag/Table.js", "js/classes/HtmlElements/Tag/Cell.js", "js/classes/HtmlElements/Tag/ImageTag.js", "js/classes/HtmlElements/Tag/Row.js", "js/classes/HtmlElements/Tag/List.js", "js/classes/HtmlElements/Tag/ListItem.js", "js/classes/HtmlElements/Tag/OList.js", "js/classes/HtmlElements/Tag/UList.js", "js/classes/HtmlElements/Tag/Link.js", "js/classes/HtmlElements/PlainText.js"])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./dist/'));
});

// gulp.task('watch', function(){
//     gulp.watch([tsPath], ['scripts']);
// });

gulp.task('default', ['scripts']);
