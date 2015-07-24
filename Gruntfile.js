module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			options: grunt.file.readJSON('src/.jshintrc'),
			src: ['src/*.js']
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/ecma5.js', 'src/Console.js', 'src/Styles.js', 'src/Stack.js'],
				dest: 'console.js'
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
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release v%VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: false,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: false,
				pushTo: 'upstream',
				gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
				globalReplace: false,
				prereleaseName: false,
				regExp: false
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-bump');

	grunt.registerTask('build', ['jshint', 'concat', 'uglify']);
};