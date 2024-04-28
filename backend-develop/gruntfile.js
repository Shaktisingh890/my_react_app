module.exports = function(grunt) {

  /////////////////////////////////////////////

  // Add the grunt-mocha-test tasks. 
  grunt.loadNpmTasks('grunt-mocha-test');

  grunt.initConfig({
    // Configure a mochaTest task 
    mochaTest: {
      specs: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: './specs/helpers/chai'
        },
        src: ['specs/**/*.js']
      }
    },

  });

   // On watch events, if the changed file is a test file then configure mochaTest to only 
  // run the tests from that file. Otherwise run all the tests 
  var defaultTestSrc = grunt.config('mochaTest.specs.src');
  grunt.event.on('watch', function(action, filepath) {
    grunt.config('mochaTest.specs.src', defaultTestSrc);
    if (filepath.match('specs/')) {
      grunt.config('mochaTest.specs.src', filepath);
    }
  });


  grunt.registerTask('default', 'mochaTest');

};
