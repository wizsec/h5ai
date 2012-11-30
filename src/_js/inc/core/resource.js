
modulejs.define('core/resource', ['core/settings'], function (settings) {

	var image = function (id, noPngExt) {

			return settings.h5aiAbsHref + '_img/' + id + (noPngExt ? '' : '.png');
		},

		icon = function (id, big) {

			return settings.h5aiAbsHref + '_img/icons/' + (big ? '48x48' : '16x16') + '/' + id + '.png';
		};

	return {
		image: image,
		icon: icon
	};
});
