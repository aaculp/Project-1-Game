/**
 * Atavi javascript assistant
 */

/**
 * @param {Object} window
 * @param {Object} $
 * @return {Void}
 */
(function(window, $) {
	'use strict';
	
	toppage.assistant = function() {};
	
	/**
	 * @param {Object} params
	 * @returns {Void}
	 */

	toppage.assistant.popupVk = function(params) 
	{
		if (!toppage.assistant.cookie.check('assistant-popup-vk') || toppage.config.lang !== 'ru') {
			return;
		}
		
		var $message = $('<div>').addClass('popup-message')
				.append($('<p>').text('Присоединяйтесь'))
				.append($('<a>').addClass('button').attr('href','http://vk.com/atavi').attr('target','_blank'))
				.append($('<a>').addClass('close'));

		var $wrapper = $('<div>').addClass('assistant-popup-wrapper').append($message);
		var $item = $('<div>').addClass('assistant assistant-popup item-popup-vk').append($wrapper);

		$('#content').append($item);

		$('.item-popup-vk a.close').on('click', function(e) {
			e.preventDefault();
			$('.item-popup-vk').remove();
			toppage.assistant.cookie.remove('assistant-popup-vk', 1);
		});
	};
	
	/**
	 * @returns {Void}
	 */
	toppage.assistant.intro = {};
	toppage.assistant.currentStep = 1;

	toppage.assistant.intro._instance = null;

	toppage.assistant.intro.start = function(config, onbeforechanges) {
		var intro = introJs();
		this._instance = intro;

		intro.setOptions(config);
		intro.onbeforechange(onbeforechanges);
		intro.onexit(toppage.assistant.intro.exit);
		intro.oncomplete(toppage.assistant.intro.exit);

		toppage.menu.notautooff = 1;
		toppage.group.notautooff = 1;
		intro.start();
		return intro;
	};
	toppage.assistant.intro.exit = function() {
		toppage.menu.notautooff = 0;
		toppage.group.notautooff = 0;
		toppage.assistant.cookie.remove('assist-intro', 30);

		if (typeof yaCounter25117439 === "object") {
			yaCounter25117439.reachGoal('introstep' + toppage.assistant.currentStep);
		}
	};
    toppage.assistant.intro.setOption = function(key, value) {
        this._instance.setOption(key, value);
    };
	
	/**
	 * @param {Object} params
	 * @returns {Void}
	 */
	toppage.assistant.popupHelp = function() 
	{
		if ($.cookie("a-ext-installed")) {
			return false;
		}

		toppage.ajax('/assistant/getHelp', {},
			function(response) {
				if (response && response.html) {
					
					if (response.id) {
						$('.assistant-popup').attr('id', response.id);
					}
					
					$('.assistant-popup .inner').html(response.html);
					$('.assistant-popup').show();
					
					var $item = $('.assistant-popup .inner-assistant');
					$('.assistant-popup a.close').on('click', function(e) {
						e.preventDefault();
						
						var $this = $(this);
						$('.assistant-popup').removeAttr('id');
						$('.assistant-popup').hide();
						toppage.assistant.cookie.remove($item.data('cookie'), 5);
						if ($this.data('href')) {
							document.location = $this.data('href');
						}
					});
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	
	/**
	 * @param {Object} params
	 * @returns {Void}
	 */
	toppage.assistant.registerCallback = function($form, data, hasError) 
	{
		if (hasError) {
			return;
		}
		$form.parents('.tp-form').addClass('process');

		$form.ajaxSubmit({
			success: function(response) {
				if (typeof yaCounter25117439 === "object") {
					yaCounter25117439.reachGoal('register_help');
				}
				if (response && response.success && response.redirect) {
					window.location = response.redirect;
				} else {
					window.location.reload();
				}
			},
			error: function() {
				$form.parents('.tp-form').removeClass('process');
			}
		});
	};

	/**
	 * @param {Object} params
	 * @returns {Void}
	 */
	toppage.assistant.popupImport = function(params)
	{
		if (!params.selector) return;
		if ($.cookie('assistant-popup-browser-import-closed')) return;
		params.delay = params.delay || 1;

		setTimeout(function(){
			toppage.ajax('/assistant/getImport', {browser:toppage.browser.type},
				function(response) {
					if (response && response.html) {

						$(params.selector).html(response.html).append(
							$('<div>').addClass('nipple')
						).append(
							$('<a href="#">').addClass('close')
						);
						$(params.selector+' a.close').on('click', function(e) {
							e.preventDefault();
							$(params.selector).fadeOut(300);
							$.cookie('assistant-popup-browser-import-closed', 1, {expires: 30, path: '/', 'domain' : toppage.config.domain});//$.cookie('assistant-popup-vk', 1, {expires: -1, path: '/', 'domain' : toppage.config.domain});
						});
						if (typeof(params.callback=='function')) {
							params.callback();
						}
						$(params.selector).fadeIn(300);
					}
				},
				function(errorCallback) {
					errorCallback();
				}, 'json'
			);

		}, params.delay);
	};

	toppage.assistant.cookie = function() {};
	toppage.assistant.cookie.check = function(key) {
		var cookie = $.cookie(key);
		if (!cookie) return false;
		var data = jQuery.parseJSON(cookie);
		if (!$.isArray(data) || !data.length) {
			toppage.assistant.cookie.clear(key);
			return false;
		}
		return ($.inArray(toppage.config.userid, data)>=0);
	};
	toppage.assistant.cookie.remove = function(key, expires) {
		var cookie = $.cookie(key);
		if (!cookie) return;
		var data = jQuery.parseJSON(cookie);
		if (!$.isArray(data)) {
			toppage.assistant.cookie.clear(key); return;
		}
		var newData = $.grep(data, function(value) {
			return value != toppage.config.userid;
		});

		if (!newData.length) {
			toppage.assistant.cookie.clear(key);
		} else {
			$.cookie(key, JSON.stringify(newData), {expires: expires, path: '/', 'domain' : toppage.config.domain});
		}
	};
	toppage.assistant.cookie.clear = function(key) {
		$.cookie(key, 1, {expires: -1, path: '/', 'domain' : toppage.config.domain});
	};

	toppage.assistant.importSuggestion = function($sender) {
		var template = $('#assistant-import-suggestion-tpl').html();
		var content = tmpl(template, {});
		var chromeExts = [
			'cppkdfiehodeplgalcinpklndfdmccba',
			'pcacinjbimcceegjmilcmllbagjjelef',
			'kjpbnomffmmmdnedadahoflodnabckoi',
			'jpchabeoojaflbaajmjhfcfiknckabpo'
		];
		if (toppage.browser.chrome) {
			chromeExts.forEach(function(extId) {
				toppage.assistant.importSuggestion.checkExt(extId, function(result) {
					if (!result || toppage.assistant.importSuggestion.chromeImporter) return;
					toppage.assistant.importSuggestion.chromeImporter = extId;
				});
			});
		}
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				$(".js-import-bookmarks-button").on('click', toppage.assistant.importSuggestion.click);
			}
		});
	};

	toppage.assistant.importSuggestion.chromeImporter = null;

	toppage.assistant.importSuggestion.click = function(event) {
		if (toppage.browser.chrome || toppage.browser.yandex) {
			if (toppage.assistant.importSuggestion.failed) return true;
			var importer = toppage.assistant.importSuggestion.chromeImporter;
			if (!importer) {
				chrome.webstore.install('https://chrome.google.com/webstore/detail/kkfbdmieimnhmbinobdjhejdinamjalf');
				return false;
			}
			chrome.runtime.sendMessage(importer, {type: "run-import"});
			return false;
		}
		if (toppage.browser.opera) {
			opr.addons.installExtension("klclggecgkodipcdnjlmbakmmhnkokmn");
			return false;
		}
		if (toppage.browser.firefox) {
			var xpi={'Import':'https://addons.mozilla.org/firefox/downloads/latest/699205/addon-699205-latest.xpi'};
			if (InstallTrigger!==undefined && InstallTrigger.enabled()) {
				InstallTrigger.install(xpi);
				return false;
			}
		}
	};

	toppage.assistant.importSuggestion.checkExt = function(id, callback) {
		/*
		Код мешает корректной загрузке скрипта в IE8 (свойство import)
		В данный момент toppage.assistant.importSuggestion не используется

		chrome.runtime.sendMessage(id, {type: "get-extension-info"}, function (response) {
			if (response && response.success && response.import)
				return callback(true);
			callback(false);
		});
		*/
	};

})(window, jQuery);