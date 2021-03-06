
modulejs.define('core/settings', ['config', '_', '$'], function (config, _, $) {

	var filename = '_js/scripts.js',
		src = $('script[src$="' + filename + '"]').attr('src'),
		appHref = src.substr(0, src.length - filename.length),

		h5aiAbsHref = /^(\/[^\/]*\/).*$/.exec(wiz.getPath())[1],
		rootAbsHref = '/',

		settings = _.extend({}, config.options, {
			h5aiAbsHref: h5aiAbsHref,
			rootAbsHref: rootAbsHref
		});

	return settings;
});
