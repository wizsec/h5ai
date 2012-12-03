
modulejs.define('info', ['$'], function ($) {

	var setCheckResult = function (id, result) {

			var $result = $(id).find('.test-result');

			if (result) {
				$result.addClass('test-passed').text('yes');
			} else {
				$result.addClass('test-failed').text('no');
			}
		},

		init = function () {

			$.getJSON(wiz.getURL(), {action: 'get', checks: true}, function (json) {

				if (json) {
					$('.test').each(function () {

						setCheckResult(this, json.checks[$(this).data('id')]);
					});
				}
			});
		};

	init();
});
