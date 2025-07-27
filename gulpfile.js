// cssnano eslint gulp gulp-postcss gulp-replace gulp-sass gulp-terser merge-stream prettier sass sharp

// 🟢
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

// 🟡
import sharp from 'sharp';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import replace from 'gulp-replace';
import merge from 'merge-stream';
import terser from 'gulp-terser';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';

// 🔵
import { src, dest, watch, series } from 'gulp';

// 🔧
const sass = gulpSass(dartSass);

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

export async function crop() {
    const folders = ['src/assets/images', 'build/images/webp', 'build/images/png', 'build/images/jpg', 'build/images/ico', 'build/images/svg', 'build/images/crop/webp', 'build/images/crop/png', 'build/images/crop/jpg'];

    const cropWidth = null; // Width for cropping, change if cropping needed
    const cropHeight = null; // Height for cropping, change if cropping needed

    // Create folders if they don't exist
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });

    // Read JPG and PNG images from source folder
    const images = fs.readdirSync('src/assets/images').filter(file => /\.(jpg|png)$/i.test(file));

    try {
        for (const file of images) {
            const inputFile = path.join('src/assets/images', file);
            const fileName = path.parse(file).name;

            // Convert and save in different formats without cropping
            await sharp(inputFile).toFormat('webp', { quality: 99 }).toFile(`build/images/webp/${fileName}.webp`);
            await sharp(inputFile).toFormat('png', { quality: 99 }).toFile(`build/images/png/${fileName}.png`);
            await sharp(inputFile).toFormat('jpeg', { quality: 99 }).toFile(`build/images/jpg/${fileName}.jpg`);

            // If crop dimensions defined, resize and crop images
            if (cropWidth && cropHeight) {
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('webp', { quality: 99 }).toFile(`build/images/crop/webp/${fileName}-crop.webp`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('png', { quality: 99 }).toFile(`build/images/crop/png/${fileName}-crop.png`);
                await sharp(inputFile).resize(cropWidth, cropHeight, { fit: 'cover' }).toFormat('jpeg', { quality: 99 }).toFile(`build/images/crop/jpg/${fileName}-crop.jpg`);
            }
        }

        // Copy icons and SVG images without modification
        src('src/assets/images/**/*.ico').pipe(dest('build/images/ico'));
        src('src/assets/images/**/*.svg').pipe(dest('build/images/svg'));
        src('src/assets/icons/**/*.svg').pipe(dest('build/images/svg'));

        // Copy WebP images directly without conversion
        src('src/assets/images/**/*.webp').pipe(dest('build/images/webp'));
    } catch (error) {
        console.error('Error processing images:', error);
    }
}

export function redirect() {
    return src('_redirects').pipe(dest('build')); // to /build
}

// Watch source files for changes during development
export function dev() {
    watch('src/styles/**/*.scss', css);
    watch('src/scripts/**/*.js', compileJS);
    watch('src/db/**/*.js', compileDB);
    watch('public/**/*.html', html);
    watch('src/assets/images/**', crop);
    watch('src/assets/icons/**', crop);
}

// Main tasks
export const deploy = series(format, crop, compileJS, compileDB, css, html, fixPaths, redirect); // For production

export const build = series(format, crop, compileJS, compileDB, css, html, fixPaths, redirect, dev); // For development

// Default task
export default build;
