module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: grunt.file.readJSON('src/.jshintrc'),
			src: ['src/*.js']
		},

		concat: {
			options: {
				separator: ';',
			},
			dist: {
				src: ['src/ecma5.js', 'src/Console.js', 'src/Styles.js', 'src/Stack.js'],
				dest: 'console.js',
			}
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> */\n'
			},
			build: {
				src: 'console.js',
				dest: 'console.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
};