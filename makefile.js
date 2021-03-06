/*jshint node: true */
'use strict';


var path = require('path'),

	pkg = require('./package.json'),

	root = path.resolve(__dirname),
	src = path.join(root, 'src'),
	build = path.join(root, 'build'),

	jshint = {
		// Enforcing Options
		bitwise: true,
		curly: true,
		eqeqeq: true,
		forin: true,
		latedef: true,
		newcap: true,
		noempty: true,
		plusplus: true,
		trailing: true,
		undef: true,

		// Environments
		browser: true,

		// Globals
		predef: [
			'modulejs'
		]
	},

	handlebarsEnv = {
		pkg: pkg
	},

	mapSrc = function (blob) {

		return blob.source.replace(src, build).replace(/\.less$/, '.css');
	};


module.exports = function (make) {

	var Event = make.Event,
		$ = make.fQuery,
		moment = make.moment;


	make.version('>=0.8.1');
	make.defaults('build');


	make.before(function () {

		handlebarsEnv.stamp = moment().format('YYYY-MM-DD HH:mm:ss');
	});


	make.target('check-version', [], 'add git info to dev builds').async(function (done, fail) {

		if (!/-dev$/.test(pkg.version)) {
			done();
			return;
		}

		$.git(root, function (err, result) {

			pkg.version += '-' + result.revListOriginMasterHead.length + '-' + result.revParseHead.slice(0, 7);
			Event.info({
				method: 'check-version',
				message: 'version set to ' + pkg.version
			});
			done();
		});
	});


	make.target('clean', [], 'delete build folder').sync(function () {

		$.rmfr($.I_AM_SURE, build);
	});


	make.target('lint', [], 'lint all JavaScript files with JSHint').sync(function () {

		$(src + '/_js: **/*.js, ! lib/**')
			.jshint(jshint);
	});


	make.target('build', ['check-version'], 'build all updated files').sync(function () {

		$(src + ': _js/*.js')
			.modified(mapSrc, $(src + ': _js/**'))
			.includify()
			.uglifyjs()
			.write($.OVERWRITE, mapSrc);

		$(src + ': _css/*.less')
			.modified(mapSrc, $(src + ': _css/**'))
			.less()
			.cssmin()
			.write($.OVERWRITE, mapSrc);

		$(src + ': **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			//.jade()
			.write($.OVERWRITE, mapSrc);

		$(src + ': **, ! _js/**, ! _css/**, ! **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.write($.OVERWRITE, mapSrc);
	});


	make.target('build-uncompressed', ['check-version'], 'build all updated files without compression').sync(function () {

		$(src + ': _js/*.js')
			.modified(mapSrc, $(src + ': _js/**'))
			.includify()
			// .uglifyjs()
			.write($.OVERWRITE, mapSrc);

		$(src + ': _css/*.less')
			.modified(mapSrc, $(src + ': _css/**'))
			.less()
			// .cssmin()
			.write($.OVERWRITE, mapSrc);

		$(src + ': **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			//.jade()
			.write($.OVERWRITE, mapSrc);

		$(src + ': **, ! _js/**, ! _css/**, ! **/*.jade')
			.modified(mapSrc)
			.handlebars(handlebarsEnv)
			.write($.OVERWRITE, mapSrc);
	});


	make.target('release', ['clean', 'build'], 'create a zipball').async(function (done, fail) {

		$(build + ': **').shzip({
			target: path.join(build, pkg.name + '-' + pkg.version + '.zip'),
			dir: build,
			callback: done
		});
	});
};
