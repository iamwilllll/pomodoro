// eslint gulp gulp-postcss  gulp-replace gulp-sass postcss prettier sass cssnano merge-stream
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import terser from 'gulp-terser';
import { exec } from 'child_process';

import { src, dest, watch, series } from 'gulp';

import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import replace from 'gulp-replace';
import merge from 'merge-stream';

const sass = gulpSass(dartSass); // Initialize gulp-sass with Dart Sass

// Task to compile and minify JavaScript files
export function compileJS() {
    return src('src/scripts/**/*.js')
        .pipe(terser()) // Minify the combined file
        .pipe(dest('build/scripts'));
} // Task to compile and minify JavaScript files

export function compileDB() {
    return src('./src/db/**/*.js')
        .pipe(terser()) // Minify the combined file
        .pipe(dest('build/db'));
}

// Task to compile SCSS, minify it, and generate sourcemaps
export function css() {
    return src('src/styles/index.scss', { sourcemaps: true })
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([cssnano()]))
        .pipe(dest('build/css', { sourcemaps: '.' }));
}

// Run Prettier using project settings
export function format(cb) {
    exec('prettier --write .', (err, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
}

// Copy HTML files from /public to /build
export function html() {
    return src('public/**/*.html').pipe(dest('build/public'));
}

// Remove `/build` from paths inside HTML files
export function fixPaths() {
    const html = src('build/**/*.html')
        .pipe(replace(/href="\/build([^"]*)"/g, 'href="..$1"'))
        .pipe(replace(/src="\/build([^"]*)"/g, 'src="..$1"'))
        .pipe(replace(/srcset="\/build([^"]*)"/g, 'srcset="..$1"'))
        .pipe(dest('build'));

    const js = src('build/**/*.js')
        .pipe(replace(/href="\/build([^"]*)"/g, 'href=".$1"'))
        .pipe(replace(/src="\/build([^"]*)"/g, 'src=".$1"'))
        .pipe(replace(/srcset="\/build([^"]*)"/g, 'srcset=".$1"'))
        .pipe(dest('build'));

    return merge(html, js); // We unite the two processes
}

// Watch source files for changes during development
export function dev() {
    watch('src/styles/**/*.scss', css);
    watch('src/scripts/**/*.js', compileJS);
    watch('src/db/**/*.js', compileDB);
    watch('public/**/*.html', html);
}

// Main tasks
export const deploy = series(format, compileJS, compileDB, css, html, fixPaths); // For production

export const build = series(format, compileJS, compileDB, css, html, fixPaths, dev); // For development

// Default task
export default build;
