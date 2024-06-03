/*
 * Gruntfile.js
 *
 * This file is part of OscProfessionals CPW.
 *
 * OscProfessionals CPW is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License as published by the Open Source
 * Initiative.
 *
 * OscProfessionals CPW is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * MIT License for more details.
 *
 * You should have received a copy of the MIT License along with OscProfessionals CPW.
 * If not, see <https://opensource.org/licenses/MIT>.
 * 
*/


/*
* ----------------- Node package.json files ----------------- 
*
* Step 1: If pagcjkage.json is not updated with bellow code 
*
* "devDependencies": {
*    "grunt": "^1.6.1",
*    "grunt-contrib-cssmin": "^5.0.0",
*    "grunt-contrib-uglify": "^5.2.2",
*    "gulp": "^4.0.2",
*    "gulp-uglify": "^3.0.2"
*  }: 
*  
* Run command: npm install grunt grunt-contrib-cssmin grunt-contrib-uglify --save-dev
* 
* Step 2: For Run npm install --force
* Step 3: Global install-  npm install -g grunt-cli --force
*
*
* Run Bellow command for Generate CSS or JS minify files with Grunt:
* Command 1: grunt cssmin --verbose  // Css minify
* Command 2: grunt uglify --verbose  // Javascript minify
*
*/

// Exporting a function that takes in the Grunt object as a parameter
module.exports = function(grunt) {
  // Initializing Grunt configuration
  grunt.initConfig({
    // Configuration for cssmin task
    cssmin: {
      target: {
        // Defining files to be processed by cssmin
        files: [{
          expand: true,
          cwd: 'web/frontend/assets/extenssions/', // Source directory for CSS
          src: ['*.css'],
          dest: 'extensions/theme-app-extension/assets/', // Destination directory for minified CSS
          ext: '.css'
        }]
      }
    },
    // Configuration for uglify task
    uglify: {
      options: {
        mangle: {
          toplevel: true,
          /*properties: {
            builtins : false
          }*/
        }
      },
      target: {
        // Defining files to be processed by uglify
        files: [{
          expand: true,
          cwd: 'web/frontend/assets/extenssions/', // Source directory for JS
          src: ['*.js'],
          dest: 'extensions/theme-app-extension/assets/', // Destination directory for minified JS
          ext: '.js'
        }]
      }
    }
    
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register default task
  grunt.registerTask('default', ['cssmin', 'uglify']);
};