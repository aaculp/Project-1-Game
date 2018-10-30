/**
 * Atavi javascript
 */

/**
 * @param {Object} window
 * @param {Object} $
 * @return {Void}
 */
(function(window, $) {
	'use strict';

	var toppage = function() {};
	window.toppage = toppage;

	/**
	 * Конфигурация по умолчанию
	 */
	toppage.config = {
		userid: 0,
		groupid: 0,
		groupidbyurl: 0,
		popupid: 0,
		lang: '',
		popup: {
			modal: true,
			width: 450,
			maxWidth: 800,
			maxHeight: 600
		},
		popuponload: function(target) {
			$(target).dialog("option", "position", {my: "center", at: "center", of: window});
			$(target).find('[placeholder]').placeholder();

			var close = function(e) {
				$(target).dialog("close");
				e.preventDefault();
			};
			$(target).find('.js-popup-close').click(close);
			if ($(target).dialog("option", "closeOnOverlayClick"))
				$('.ui-widget-overlay').click(close);

			$(target).removeClass('process');
		},
		popuponclose: function(target) {
			$(target).remove();
		},
		ajax: {
			url: '',
			data: {},
			dataType: 'json',
			type: 'get'
		},
		menu: {
			selector: '.js-link-menu',
			sliderselector: '#collsCount-slider',
			closeall: false
		},
		columns: {
			min: null,
			max: null,
			start: null
		},
		bookmark: {
			count: 0,
			view: null
		},
		queue: {
			callback: {},
			process: {},
			timeout: 15000,
			timeoutprocess: null
		},
		bodyEvent: {
			events: {}
		},
		dict: {
			startpopuptitle: null,
			ajaxerrortitle: null,
			ajaxerrortext: null
		},
		webstorelink: {}
	};

	
	toppage.preinit = function(config) {
        $.extend(toppage.config, config || {});
        document.domain = toppage.config.hostname;
	};
	
	/**
	 * Инициализация объекта
	 * @param {Object} name description
	 * @return {Void} description
	 */
	toppage.init = function(config) {
		$.extend(toppage.config, config);

		document.domain = toppage.config.hostname;
		
		if (toppage.init.events) {
			$.each(toppage.init.events, function(i, event) {
				if (typeof event === 'function') {
					event(toppage);
				}
			});
		}
		
		if (window.name === 'ext-newtab-iframe' && toppage.config.userid === 0 && toppage.browser.chrome) {
			window.top.location = window.location;
		}

	};

	/**
	 * Динамические события, которые обрабатываются
	 * после инициализации объекта
	 * @var {Object}
	 */
	toppage.init.events = [];

	/**
	 * 
	 * @returns {n.nextSibling.value|n.value}
	 */
	toppage.converForm2Json = function($form) {
        var json = {};
        jQuery.map($form.serializeArray(), function(n, i) {
            json[n['name']] = n['value'];
        });
        return json;
    };

	/**
	 * @param {String} url
	 * @param {Object} data
	 * @param {Function} success
	 * @param {Funvtion} error
	 * @param {String} dataType
	 * @return {Void}
	 */
	toppage.ajax = function(url, data, success, error, dataType, type) {

		url = url || document.location;
		dataType = dataType || toppage.config.ajax.dataType;
		type = type || toppage.config.ajax.type;

		$.ajax(url, {
				type: type,
				data: $.extend({}, toppage.config.ajax.data, data),
				success: function (data, textStatus, jqXHR) {
					if (dataType !== 'json' || data.success) {
						if (typeof success === 'function') {
							success(data, textStatus, jqXHR);
						}
					} else {
						if (data.message) {
							$.pnotify({
								title: toppage.config.dict.ajaxerrortitle,
								text: data.message,
								type: 'error',
								animate_speed: 1
							});
						}
						if (dataType === 'json') {
							success(false);
						}
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {

					// перезагрузка страницы
					if (!jqXHR.status) {
						return;
					}

					var errorCallback = function() {
						$.pnotify({
							title: toppage.config.dict.ajaxerrortitle,
							text: toppage.config.dict.ajaxerrortext,
							type: 'error',
							animate_speed: 1
						});
					};

					if (typeof error === 'function') {
						error(errorCallback, jqXHR, textStatus, errorThrown);
					} else {
						errorCallback();
					}
				},
				dataType: dataType
			}
		);
	};

	toppage.returnCall = function(funcname) {
		if (typeof window[funcname] === 'function') {
			var func = window[funcname];
			func();
		}
	};
	
	toppage.togglePopup = function(target, popup) {
		var $target = $(target);
		var $popup = $(popup);
		$target.off('click').on('click', function(e) {
			e.preventDefault();
			$popup.toggle();
		});
		
		// закрыть по клику мимо
		toppage.bodyEvent.on('togglepopup'+popup, function($t) {
			if ($t.closest($popup).length === 0 && $t.closest($target).length === 0) {
				$popup.hide();
			}
		});
	};

	toppage.popup = function() {};

	/**
	 * @param {String} params
	 * @param {Object} params
	 * @return {Void}
	 */
	toppage.popup.init = function(el, context, params) {
		if (typeof el === 'string') {
			el = $(el, context);
		}

		el.off('click').on('click', function(e) {
			var $self = $(this);

			var config = $.extend({}, params, $self.data());
			config.url = $self.attr('href') || $(this).attr('action');

			toppage.popup.create(config);
			e.preventDefault();
		});
	};

	/**
	 * @param {Object} params
	 * @return {Void}
	 */
	toppage.popup.create = function(params, closeOther) {

		closeOther && $('.ui-dialog-content').dialog('close');

		var config = $.extend({}, toppage.config.popup, params);

		var type = 'html';
		var content = '';

		if (config.content) {
			content = config.content;
			delete config.content;
		} else if(config.url) {
			type = 'url';
			var url = config.url;
			delete config.url;
		}

		// create item for popup
		var $item = toppage.popup.createItem(config);

		if (type === 'html') {
			$item.prepend(content);
			config.load($item);
		} else {
			var params = {};
			if (typeof url === 'object') {
				params = url.params;
				url = url.path;
			}
			toppage.ajax(url, params, function(data) {
				$item.prepend(data);
				config.load($item);
			}, function(errorCallback) {
				errorCallback();
				$('#'+$item.attr('id')).dialog("close");
			}, 'html');
		}

		// close menu if opened
		if ($('body').hasClass('openmenu')) {
			toppage.menu.off();
		}

	};
	/**
	 * @param {String} params
	 * @return {Object}
	 */
	toppage.popup.createItem = function(params) {

		// create box for popup
		var id = 'popup-' + (++toppage.config.popupid);
		var $item = $('<div>').attr('id', id).addClass('process');
		$item.append($('<div>').attr('class','load'));
		$('body').append($item);

		// overload close
		var close = params.close ? params.close : function() {};
		params.close = function(event, ui) {
			close(event.target);
			toppage.config.popuponclose(event.target);
		};

		// overload load
		var load = params.load ? params.load : function() {};
		params.load = function(target) {
			load(target);
			toppage.config.popuponload(target);
		};

		// create popup
		$('#'+id).dialog(params);
		
		// add custom class
		if (params.customclass) {
			$('#'+id).parents('.ui-dialog').addClass(params.customclass);
		}

		return $item;
	};


	toppage.user = function() {};
	toppage.user.loginform = function() {};
	toppage.user.loginform.init = function() {
		$('.js-link-loginform').off('click.loginform').on('click.loginform', function(e) {
			$('#popup-login').toggle();
			e.preventDefault();
		});
		// закрыть по клику мимо
		toppage.bodyEvent.on('loginform', function($target){
			if ($target.closest(".js-link-loginform").length === 0 && $target.closest("#popup-login").length === 0) {
				toppage.user.loginform.off();
			}
		});
	};
	toppage.user.loginform.on = function() {
		$('#popup-login').show();
	};
	toppage.user.loginform.off = function() {
		$('#popup-login').hide();
	};
	toppage.init.events.push(function() {
		toppage.user.loginform.init();
	});

	toppage.user.onClickLogin = function(e) {
		var $sender = $(e.target);

		var template = $('#user-login-form-tpl').html();
		var content = tmpl(template, {marker: $sender.data('marker')});
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				toppage.user.loginform.initPopup();
				$sender.parents('.ui-dialog, .ui-dialog-content').remove();
			}
		});
		e.preventDefault();
	};
	toppage.user.loginform.initPopup = function() {
		jQuery('#user-form-login').yiiactiveform({'validateOnChange':false,'validateOnSubmit':true,'afterValidate':toppage.user.loginCallback,'attributes':[{'id':'LoginForm_username','inputID':'LoginForm_username','errorID':'LoginForm_username_em_','model':'LoginForm','name':'username','enableAjaxValidation':true},{'id':'LoginForm_password','inputID':'LoginForm_password','errorID':'LoginForm_password_em_','model':'LoginForm','name':'password','enableAjaxValidation':true}]});
		toppage.user.socialLoginInit('.js-social-login');
		$('.js-link-popup-remind').on('click', toppage.user.onClickRemind);
		$('.js-link-popup-loginpin').on('click', toppage.user.onClickLoginPin);
	};
	toppage.user.socialLoginInit = function(selector) {
		var $el = $(selector);
		if (!$.isFunction($el.eauth)) {
			return;
		}
		$el.find(".auth-service.facebook a").eauth({"popup":{"width":585,"height":290},"id":"facebook"});
		$el.find(".auth-service.twitter a").eauth({"popup":{"width":900,"height":550},"id":"twitter"});
		$el.find(".auth-service.google a").eauth({"popup":{"width":500,"height":450},"id":"google"});
		$el.find(".auth-service.vkontakte a").eauth({"popup":{"width":585,"height":350},"id":"vkontakte"});
		$el.find(".auth-service.odnoklassniki a").eauth({"popup":{"width":680,"height":500},"id":"odnoklassniki"});
		$el.find(".auth-service.mailru a").eauth({"popup":{"width":580,"height":400},"id":"mailru"});
	};
	toppage.user.onClickLoginPin = function(e) {
		e.preventDefault();
		var $sender = $(this);
		var content = $('#user-loginpin-form-tpl').html();
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				$('#js-pin-code').on('input', function(e) {
					var target = $(e.currentTarget);
					var val = target.val();
					var char = val.charCodeAt(val.length-1);
					if (char < 48 || char > 57) {
						target.val(val.substr(0, (val.length-1)));
					}
					if (val.length >= 5) {
						$('#js-login-pin-form').submit();
					}
				});
				$('#js-login-pin-form').on('submit', function(e) {
					e.preventDefault();
                    $('#js-login-pin-message .message').hide();
					$('#js-login-pin-message .loading').show();
					$('#js-pin-code').attr('readonly', 'readonly');
					toppage.ajax('/user/loginPin', {value:$('#js-pin-code').val()}, function(data) {
						if (data.message) {
                            $('#js-login-pin-message .loading').hide();
							$('#js-login-pin-message .message').text(data.message).show();
							$('#js-pin-code').val('');
							$('#js-pin-code').removeAttr('readonly');
						} else {
							document.location.reload();
						}
					}, function(errorCallback) {
						$('#js-pin-code').removeAttr('readonly');
						errorCallback();
					});
				});
				$('#js-pin-code').focus();
			},
			'customclass': 'popup-otherlogin',
			'width': 500
		}, true);
	};
	toppage.init.events.push(function() {
		$('.js-link-popup-loginform').on('click', toppage.user.onClickLogin);
	});

	toppage.user.register = function($sender) {
		var template = $('#user-register-form-tpl').html();
		var content = tmpl(template, {marker: $sender.data('marker')});
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				toppage.user.registerFormInit();
			}
		});
	};
	toppage.user.onClickRegister = function(e) {
		e.preventDefault();
		var $sender = $(this);
		toppage.user.register($sender);
	};
	toppage.user.registerFormInit = function() {
		$('.js-link-popup-loginform').on('click', toppage.user.onClickLogin);
		toppage.user.extractLoginEmail('#User_email');
		jQuery('#user-form-register').yiiactiveform({'validationDelay':10,'validateOnSubmit':true,'afterValidate':toppage.user.registerCallback,'attributes':[{'id':'User_email','inputID':'User_email','errorID':'User_email_em_','model':'User','name':'email','enableAjaxValidation':true},{'id':'User_password','inputID':'User_password','errorID':'User_password_em_','model':'User','name':'password','enableAjaxValidation':true},{'id':'User_password_again','inputID':'User_password_again','errorID':'User_password_again_em_','model':'User','name':'password_again','enableAjaxValidation':true}]});
		toppage.user.socialLoginInit('.js-social-login');
	};
	toppage.init.events.push(function() {
		$('.js-link-register').on('click', toppage.user.onClickRegister);
	});
	/**
	 * Обратный вызов регистрации
	 * @return {Boolean}
	 */
	toppage.user.registerCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		$('.ui-form-preloader', $form).addClass('process');

		$form.ajaxSubmit({
			success: function(response) {
				$form.parents('.ui-dialog-content').dialog('close');
				var marker = $('#marker', $form).val();
				if (typeof yaCounter25117439 === "object" && marker) {
					yaCounter25117439.reachGoal(marker);
				}
				if (response && response.success && response.redirect) {
					window.location = response.redirect;
				} else {
					window.location.reload();
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
				$('.ui-form-preloader', $form).removeClass('process');
			}
		});
	};

	/**
	 * Обратный вызов авторизации
	 * @return {Boolean}
	 */
	toppage.user.loginCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');

		$form.ajaxSubmit({
			success: function(response) {
				if (response.message) {
					$.pnotify({
						text: response.message,
						type: 'error',
						animate_speed: 1
					});
					$form.parents('.ui-dialog-content').removeClass('process');
				}
				if (response && response.success && response.redirect) {
					//$form.parents('.ui-dialog-content').dialog('close');
					window.location = response.redirect;
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
			}
		});
	};

	/**
	 * Обратный вызов сохранение нового пароля
	 * @return {Boolean}
	 */
	toppage.user.savePasswordCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		$form.ajaxSubmit({
			success: function(response) {
				$form.parents('.ui-dialog-content').dialog('close');
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
			}
		});
	};

	/**
	 * Обратный вызов сохранение нового адреса почты
	 * @return {Boolean}
	 */
	toppage.user.saveEmailCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		$form.ajaxSubmit({
			success: function(response) {
				document.location.reload();
				$form.parents('.ui-dialog-content').dialog('close');
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
			}
		});
	};

	/**
	 * Обратный вызов сохранение номера телефона
	 * @return {Boolean}
	 */
	toppage.user.savePhoneCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		
		if ($('#js-settings-phone .phonesendcode').val() === '') {
			$form.ajaxSubmit({
				success: function(response) {
					$form.parents('.ui-dialog-content').removeClass('process');
					if (response.success) {
						toppage.user.smscode.switchCode('#js-settings-phone');
						window.setTimeout(function() {toppage.user.smscode.processWait('#js-settings-phone')}, 1000);
						$('#User_phoneSMS').focus();
					}
					
					if (response.message) {
						$.pnotify({
							text: response.message,
							type: 'error',
							animate_speed: 1
						});
					}
				},
				error: function() {
					$form.parents('.ui-dialog-content').removeClass('process');
				}
			});
			
		} else {
			$form.ajaxSubmit({
				success: function(response) {
					if (response.success) {
						document.location.reload();
						$form.parents('.ui-dialog-content').dialog('close');
					} else {
						$form.parents('.ui-dialog-content').removeClass('process');
					}
				},
				error: function() {
					$form.parents('.ui-dialog-content').removeClass('process');
				}
			});
		}
	};
	toppage.user.phoneDeleteCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		
		$form.ajaxSubmit({
			success: function(response) {
				if (response.success) {
					$form.parents('.ui-dialog-content').dialog('close');
				} else {
					$form.parents('.ui-dialog-content').removeClass('process');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
			}
		});
	};
	
	toppage.user.onClickSendSMS = function(e) {
		e.preventDefault();
		toppage.user.smscode.repeatSendSms('#js-settings-phone');
	};
	
	toppage.user.smscode = {};
	toppage.user.smscode.switchCode = function(context) {
		$(context).addClass('sendcode');
		$('.phonesendcode', context).val($('.phone input', context).val());
		$('.phone input', context).attr('disabled', 'disabled');
		$('.phonecode input', context).removeAttr('disabled');
		$('.repeat-send-code', context).addClass('wait').data('time', 60);
		$('.repeat-send-code span', context).html($('.repeat-send-code', context).data('time'));
		$('.repeat-send-code a', context).on('click', toppage.user.onClickSendSMS);
	};
	toppage.user.smscode.switchPhone = function(context) {
		$(context).removeClass('sendcode');
		$('.phonesendcode', context).val('');
		$('.phone input', context).removeAttr('disabled');
		$('.phonecode input', context).attr('disabled', 'disabled');
		$('.repeat-send-code a', context).off('click', toppage.user.onClickSendSMS);
	};
	toppage.user.smscode.processWait = function(context) {
		var $el = $('.repeat-send-code', context);
		var t = $el.data('time');
		if (t > 0) {
			t = t-1; 
			$el.data('time', t);
			$('span', $el).html(t);
			window.setTimeout(function() { toppage.user.smscode.processWait(context) }, 1000);
		} else {
			//$('span', $el).html('');
			$el.removeClass('wait');
		}
	};
	toppage.user.smscode.repeatSendSms = function(context) {
		if ($('.repeat-send-code', context).data('time') === 0) {
			toppage.user.smscode.switchPhone(context);
			$('form',context).submit();
		}
	};
	
	toppage.user.onClickRemind = function(e) {
		var $sender = $(this);
		if ($('#user-remind-form-tpl').length) {
			var template = $('#user-remind-form-tpl').html();
			var content = tmpl(template);
			toppage.popup.create({
				title: $sender.data('title'),
				content: content,
				load: function(target) {
					toppage.user.remindFormInit();
					$sender.parents('.ui-dialog, .ui-dialog-content').remove();
				}
			});
		} else {
			toppage.popup.create({
				title: $sender.data('title'),
				url: '/user/remind',
				load: function(target) {
					$sender.parents('.ui-dialog, .ui-dialog-content').remove();
				}
			});
		}
		e.preventDefault();
	};
	toppage.user.remindFormInit = function() {
		toppage.user.extractLoginEmail('#RemindPasswordForm_login');
		jQuery('#user-form-remind').yiiactiveform({'validationDelay':10,'validateOnSubmit':true,'afterValidate':toppage.user.remindCallback,'attributes':[{'id':'RemindPasswordForm_login','inputID':'RemindPasswordForm_login','errorID':'RemindPasswordForm_login_em_','model':'RemindPasswordForm','name':'login','enableAjaxValidation':true}]});
	};
	toppage.init.events.push(function() {
		$('.js-link-remind').on('click', toppage.user.onClickRemind);
	});

	/**
	 * Обратный вызов восстановления пароля
	 * @return {Boolean}
	 */
	toppage.user.remindCallback = function($form, data, hasError) {
		if (hasError) {
			return;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		$form.ajaxSubmit({
			success: function(response) {
				if (response.success) {
					$form.parents('.ui-dialog-content').html(response.content);
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').removeClass('process');
			}
		});
	};

	toppage.user.extractLoginEmail = function(input) {
		var email = $('#LoginForm_username').val();
		$(input).val(email);
	};

	toppage.browser = function() {};

	toppage.browser.msie = false;
	toppage.browser.safari = false;
	toppage.browser.chrome = false;
	toppage.browser.opera = false;
	toppage.browser.firefox = false;
	toppage.browser.yandex = false;

	toppage.browser.type = '';
	toppage.browser.version = '0';
	/**
	 * deprecated
	 * use isExtension()
	 */
	toppage.browser.extension = false;
	/**
	 * @param {String} ua
	 * @returns {Void}
	 */
	toppage.browser.init = function(ua) {
		
		setTimeout(function() {
			var iframe = window.name === 'ext-newtab-iframe' || window.name === 'ext-newtab-theme-iframe';
			toppage.browser.extension = ($('#js-atavi-extension-install').length || iframe) ? true : false;
		}, 1500);
		
		ua = ua.toLowerCase();
		var match = /(opera|opr)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
				/(yabrowser)[ \/]([\w.]+)?/.exec(ua) ||
				/(chrome)[ \/]([\w.]+)?/.exec(ua) ||
				/(safari)[ \/]([\w.]+)?/.exec(ua) ||
				/(msie) ([\w.]+)/.exec(ua) ||
				/(trident)(?:.*rv:)([\w.]+)/.exec(ua) ||
				/(firefox)[ \/]([\w.]+)?/.exec(ua) || [];

		toppage.browser.type = match[1] || '';
		toppage.browser.version = match[2] || '0';

		switch (toppage.browser.type) {
			case 'yabrowser':
				toppage.browser.yandex = true;
				break;
			case 'chrome':
				toppage.browser.chrome = true;
				break;
			case 'safari':
				toppage.browser.safari = true;
				var vmatch = /(?:version)[ \/]([\w.]+)/.exec(ua) || [];
				if (vmatch[1]) {
					toppage.browser.version = vmatch[1];
				}
				break;
			case 'opera':
			case 'opr':
				toppage.browser.opera = true;
				toppage.browser.type = 'opera';
				break;
			case 'msie':
				toppage.browser.msie = true;
				break;
			case 'trident':
				toppage.browser.msie = true;
				toppage.browser.type = 'msie';
				break;
			case 'firefox':
				toppage.browser.firefox = true;
				break;
		}
	};
	toppage.browser.isExtension = function() {
		return ($('#js-atavi-extension-install').length
			|| window.name === 'ext-newtab-iframe'
			|| window.name === 'ext-newtab-theme-iframe'
		) ? true : false;
	};
	toppage.init.events.push(function() {
		if (window.navigator && window.navigator.userAgent) {
			toppage.browser.init(window.navigator.userAgent)}
		}
	);

	/**
	 * Вывод рекламы
	 * @returns {Void}
	 */
	toppage.advert = function() {};
	toppage.advert.config = {
		urigetunit: '/advert/unit',
		selectorclose: '#advert-close a'
	};
	/**
	 * @param {String} place
	 * @param {Integer} delay in ms
	 * @param {Function} callbackSuccess
	 * @param {Function} callbackClose
	 * @param {Function} callbackError
	 * @returns {Void}
	 */
	toppage.advert.place = function(place, delay, callbackSuccess, callbackClose, callbackError) {
		setTimeout(function() {
			var query = {place: place};
			query.user = window.toppage.config.userid ? (window.toppage.config.hasemail ? 1 : 2 ) : 0;
			query.browser = window.toppage.browser.type;
			query.extension = toppage.browser.isExtension() ? 1 : 0;
			query._t = Math.random();
			if (window.toppage.config.lp) {
				query.lp = window.toppage.config.lp;
			}
			$.get(toppage.advert.config.urigetunit, query, function(data) {
				if (data.success && data.success === true) {
					if (data.content) {
						$('.' + place).html(data.content);
					}
					if (typeof callbackSuccess === 'function') {
						callbackSuccess();
					}
					$(toppage.advert.config.selectorclose).on('click', function(e) {
						if (typeof callbackClose === 'function') {
							callbackClose();
						}
						if (data.period && data.period > 0) {
							toppage.advert.close(data.group, data.period);
						}
						e.preventDefault();
					});
				} else {
					if (typeof callbackError === 'function') {
						callbackError();
					}
				}
			}, 'json');
		}, delay);
	};

	/**
	 * @param {String} group
	 * @param {Integer} period
	 * @returns {Void}
	 */
	toppage.advert.close = function(group, period) {
		var s = $.cookie('atavi-advert-closed');
		var cookie = {};

		if (typeof s === 'string' && s) {
			parse_str(s, cookie);
		}

		var date = new Date().getTime();
		cookie[group] = Math.ceil(date/1000) + (period * 3600);

		$.cookie('atavi-advert-closed', http_build_query(cookie), {domain: toppage.config.hostname, expires: 5000});
	};

	/**
	 * @returns {Void}
	 */
	toppage.newtabToParent = function() {
		if (window.name === 'ext-newtab-iframe' || window.name === 'ext-newtab-theme-iframe') {
			$('a:not(.js-current-frame), form:not(.js-current-frame)').attr('target', '_parent');
		}
	};
	toppage.init.events.push(function() {
		toppage.newtabToParent();
	});

	toppage.invite = function() {};
	toppage.invite.onClick = function(e) {
		var $sender = $(this);
		toppage.popup.create({
			url: $sender.attr('href'),
			title: $sender.data('title'),
			width: 600,
			height: 640
		});
		e.preventDefault();
	};
	toppage.invite.sendCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}
		$form.parents('.ui-dialog-content').addClass('process');
		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					toppage.popup.create({
						content: '<div class="tp-form"><p>' + response.message + '</p><br><center><a class="tp-button js-popup-close ok" href="#">OK</a></center></div>',
						title: response.title
					});
					$form.parents('.ui-dialog-content').dialog('close');
				} else {
					$form.parents('.ui-dialog-content').removeClass('process');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});
	};
	toppage.init.events.push(function() {
		$('.js-menu-invite-link').on('click', toppage.invite.onClick);
	});

	toppage.menu = function() {};
	toppage.menu.notautooff = 0;
	toppage.menu.opened = {};
	toppage.menu.init = function() {
		$('#menu').hide();
		toppage.menu.sliderColumnInit();
		$(toppage.config.menu.selector).off('click.menu').on('click.menu', function(e) {
			if (typeof yaCounter25117439 === 'object') {
				yaCounter25117439.reachGoal('click_main_menu');
			}
			if ($('body').hasClass('openmenu')) {
				toppage.menu.off();
			} else {
				toppage.menu.on();
			}
			e.preventDefault();
		});

		// закрыть по клику мимо
		toppage.bodyEvent.on('menu', function($target) {
			if (toppage.menu.notautooff) {
				return;
			}
			if ($('body').hasClass('openmenu')) {
				if ($target.closest(".js-link-menu").length === 0 && $target.closest("#menu").length === 0) {
					toppage.menu.off();
				}
			}
		});

		// accordeon
		toppage.menu.loadState();
		$("#menu").on('click', 'dt', toppage.menu.onClickTitle);

		// views
		$('#js-view-list a').on('click', toppage.menu.onClickViews);
		$('#js-view-list a.view-'+toppage.config.bookmark.view).addClass('active');
	};
	toppage.menu.onClickTitle = function() {
		var parentId = $(this).parent().attr('id');
		
		if (toppage.config.menu.closeall) {
			toppage.menu.loadState();
			toppage.menu.opened[parentId] = 1;
		} else {
			toppage.menu.opened[parentId] ^= 1;
		}
		
		var current = $(this).parent().children('dd');
		if(toppage.menu.opened[parentId]){
			current.slideDown(300);
		} else {
			current.slideUp(300);
		}
		toppage.menu.saveState();
		toppage.theme.moreOff();
	};
	toppage.menu.saveState = function() {
		$.cookie('menu-state', JSON.stringify(toppage.menu.opened), {domain: toppage.config.hostname, expires: 3650});
	};
	toppage.menu.loadState = function() {
		var menuState = $.cookie('menu-state');
		if (menuState !== null) {
			toppage.menu.opened = JSON.parse(menuState);
		}
		
		$("#menu dl").each(function() {
			var id = $(this).attr('id');
			if (menuState === null) {
				toppage.menu.opened[id] = 1;
			}
			if (toppage.menu.opened[id] == 0) {
				$("#menu #"+id+' > dd').slideUp(200);
			} else {
				$("#menu #"+id+' > dd').slideDown(200);
			}
		});
		
		toppage.config.menu.closeall = false;
	};
	toppage.menu.closeAll = function() {
		$("#menu dd").not('#menu #me2 dd').slideUp(200);
		toppage.config.menu.closeall = true;
	};
	toppage.menu.on = function(withoutAnimate) 
	{
		typeof Event === 'function' && $('#menu')[0].dispatchEvent(new Event('open'));
		$('body').addClass('openmenu');
		$("#menu").css('right','-235px').show();
		$(".ym-wrapper").css('margin-left','-15px');
		
		if (withoutAnimate) {
			$("#menu").css('right','0px');
			$("#header .menu").css('margin-right', '-200px').css('opacity', 0);
			$(".ym-wrapper").css('margin-left', '-250px');
			$(".menu-content").nanoScroller();
			$("#background.js-menu-move").css('left', '-250px');
			$(".inner-have-an-account").css('margin-right', '250px');
		} else {
			$("#menu").animate({
				'right': '0px'
			}, 200, function() {
				$(".menu-content").nanoScroller();
			});
			$("#header .menu").animate({
				'margin-right': '-200px',
				'opacity': 0
			}, 200);
			$(".ym-wrapper").animate({
				'margin-left': '-250px'
			}, 200);
			$("#background.js-menu-move").animate({
				'left': '-250px'
			}, 200);
		}
	};
	toppage.menu.off = function(withoutAnimate) {
        typeof Event === 'function' && $('#menu')[0].dispatchEvent(new Event('close'));
		if (withoutAnimate) {
			$("#menu").css('right','-220px');
			$("#header .menu").css('margin-right', '5px').css('opacity', 1);
			$(".ym-wrapper").css('margin-left','0px');
			$('body').removeClass('openmenu');
			$("#background.js-menu-move").css('left', '-0px');
			$("#menu").hide();
			$(".inner-have-an-account").css('margin-right', '300px');
			
		} else {
			$("#menu").animate({
				'right': '-220px'
			}, 200, function() {
				$('body').removeClass('openmenu');
				$("#menu").hide();
			});
			$("#header .menu").animate({
				'margin-right': '5px',
				'opacity': 1
			}, 200);
			$(".ym-wrapper").animate({
				'margin-left': '-15px'
			}, 200, function() {
				$(".ym-wrapper").css('margin-left','0px');
			});
			$("#background.js-menu-move").animate({
				'left': '0px'
			}, 200);
		}
	};

	toppage.menu.changeView = function(type) {
		var $view = $('.view-'+type, '#js-view-list');

		$('#js-view-list a').removeClass('active');
		$view.addClass('active');

		toppage.config.bookmark.view = $view.data('type');

		$.cookie('view', toppage.config.bookmark.view, {expires: 5000, path: '/', 'domain' : toppage.config.domain});
		var slider = (toppage.config.bookmark.view === 'sketch') ? 'enable' : 'disable';
		$(toppage.config.menu.sliderselector).slider(slider);

		toppage.ajax('/bookmark/changeView', {view: toppage.config.bookmark.view}, function() {});
		toppage.bookmark.reloadPage();
	};
	toppage.menu.onClickViews = function() {
		toppage.menu.changeView($(this).data('type'));
	};

	toppage.menu.sliderColumnInit = function() {
		var min = toppage.config.columns.min;
		var max = toppage.config.columns.max;
		var start = toppage.config.columns.start;

		if (start > max) {
			start = max;
		}
		
		var disabled = $(toppage.config.menu.sliderselector).data('disabled');
		$(toppage.config.menu.sliderselector).slider({
			min: min,
			max: max,
			value: start,
			disabled: disabled
		})
		.on("slide", function(event, ui) {
			$(ui.handle).html(ui.value);
		})
		.on("slidechange", function(event, ui) {
			toppage.columns.change(ui.value, true);
		});

		if (toppage.config.bookmark.view !== 'sketch') {
			$(toppage.config.menu.sliderselector).slider('disable');
		}

		$('a', toppage.config.menu.sliderselector).html(start);
	};
	/**
	 * Показать лоадер для меню
	 * @return {Void}
	 */
	toppage.menu.loaderOn = function() {
		var $sender = $('#menu');
		$sender.addClass('process');
	};
	/**
	 * Показать лоадер для меню
	 * @return {Void}
	 */
	toppage.menu.loaderOff = function() {
		var $sender = $('#menu');
		$sender.removeClass('process');
	};
	/**
	 * @return {Void}
	 */
	toppage.menu.extensionInit = function() {
		var br = toppage.browser;
		if (br.msie || br.opera || br.firefox || br.chrome || br.safari || br.yandex) {
			if (br.isExtension() === false) {
				$('#menu .extension-block-installed').hide();
				$('#menu .extension-block').addClass(br.type).show();
				
				var link = $('#menu .extension-block a');
				
				if (br.msie) {
					link.attr('href', 'http://atavi.com/start/');
					var func = function(e) {
						e.preventDefault();
						window.external.AddService('http://atavi.com/extension/WidgetForIE?lang=ru');
					};
				}
				if (br.opera || br.yandex) {
					link.attr('href', 'https://addons.opera.com/extensions/details/atavi-bookmarks/');
					if (br.yandex) return;
					var func = function(e) {
						e.preventDefault();
						opr.addons.installExtension("bihjdnaakmmjplhilkgboobdhpihklib");
					};
				}
				if (br.firefox) {
					link.attr('href', 'https://addons.mozilla.org/firefox/addon/atavi-bookmarks/');
					var func = function(e) {};
				}
				if (br.chrome) {
					link.attr('href', 'https://chrome.google.com/webstore/detail/jpchabeoojaflbaajmjhfcfiknckabpo');
					if ((typeof chrome === "object") && (typeof chrome.webstore === "object") && (typeof chrome.webstore.install === "function")) {
						var func = function(e) {
							e.preventDefault();
							chrome.webstore.install('https://chrome.google.com/webstore/detail/jpchabeoojaflbaajmjhfcfiknckabpo');
						};
					}
				}
				if (br.safari) {
					link.attr('href', 'http://atavi.com/files/safari/atavi-bookmarks.safariextz');
					var func = function(e) {};
				}
				
				link.on('click', func);
			} else {
				if (br.chrome)
					$('#menu .extension-block-installed').show();
			}
		}
	};

	/**
	 *
	 */
	toppage.init.events.push(function() {
		toppage.menu.init();
	});


	toppage.columns = function() {};
	toppage.columns.init = function() {};
	toppage.columns.change = function(val) {
		toppage.config.columns.start = val;
		$('#bookmarks').attr('class', 'column'+val);
		$.cookie('columns', val, {expires: -1, path: '/'});
		$.cookie('columns', val, {expires: 5000, path: '/', 'domain' : toppage.config.domain});
		
		toppage.ajax('/bookmark/changeColumns', {columns: val}, function() {});
	};


	toppage.theme = function() {};
	toppage.theme.init = function() {};
	toppage.theme.change = function(name, callback) {
		toppage.ajax('/theme/change', {name: name}, function(data) {
			$('#theme-style').remove();
			$('#theme-style-static').remove();
			if (data.styleStaticPath) {
				$('head').append($('<link id="theme-style-static" rel="stylesheet" type="text/css" href="'+data.styleStaticPath+'" />'));
			}
			if (data.style) {
				$('head').append($('<style id="theme-style">'+data.style+'</style>'));
			}
			if (data.names && $('#menu .themes.expanded').length) {
				$('#menu .themes a').removeClass('show');
				$.each(data.names, function(i, name) {
					$('#menu .themes a#theme-'+name).addClass('show');
				});
			}

			if (typeof yaCounter25117439 === 'object') {
				yaCounter25117439.reachGoal('theme_change');
			}
			
			if (data && typeof callback === 'function') {
				callback(data);
			}
		});
	};
	toppage.theme.moreOn = function() {
		$('#menu .themes').addClass('expanded');
	};
	toppage.theme.moreOff = function() {
		$('#menu .themes').removeClass('expanded');
	};
	
	toppage.init.events.push(function() {
		$('#menu .themes a').click(function(e) {
			toppage.menu.loaderOn();
			var $self = $(this);
			var name = $self.data('name');
			toppage.theme.change(name, function() {
				$('#menu .themes-my .image .theme-custom-change').removeClass('active');
				$('#menu .themes a').removeClass('active');
				$self.addClass('active');
				toppage.menu.loaderOff();
			});
			e.preventDefault();
		});
		
		$('#menu #js-themes-expand').on('click', function() {
			if ($('#menu .themes').hasClass('expanded')) {
				toppage.theme.moreOff();
				toppage.menu.loadState();
			} else {
				toppage.theme.moreOn();
				toppage.menu.closeAll();
			}
		});
	});


	toppage.group = function() {};
	toppage.group.notautooff = 0;
	toppage.group.on = function() {
		toppage.menu.loaderOn();

		$('body').addClass('group-on');
		toppage.ajax('/group/on', {checked: 1, gid: toppage.config.groupidbyurl}, function(data) {
			if (data) {
				toppage.group.setId(data.id);
				toppage.bookmark.reloadPage(function() {
					toppage.menu.loaderOff();
					toppage.group.triggerChange();
				});
			} else {
				toppage.menu.loaderOff();
			}

		}, function(errorCallback) {
			toppage.menu.loaderOff();
			errorCallback();
		});
	};
	toppage.group.off = function() {
		toppage.menu.loaderOn();

		$('body').removeClass('group-on');
		toppage.ajax('/group/on', {checked: 0}, function(data) {
			if (data) {
				toppage.group.setId(0);
				toppage.bookmark.reloadPage(function() {
					toppage.menu.loaderOff();
					toppage.group.triggerChange();
				});
			} else {
				toppage.menu.loaderOff();
				$('#user-menu-ongroup').iCheck('check');
			}
		}, function(errorCallback) {
			toppage.menu.loaderOff();
			errorCallback();
		});
	};
	toppage.group.getIsOn = function() {
		if ($('body').hasClass('group-on')) {
			return true;
		}
		return false;
	};
	toppage.group.getId = function() {
		if (toppage.config.groupid) {
			return toppage.config.groupid;
		}
		return false;
	};
	toppage.group.setId = function(id) {
		toppage.config.groupid = id;
		if (!id)
			return;
		var items = $('#group .items, #group .items-virtual');
		$('> .active', items).removeClass('active');
		$('[data-id=' + id + ']').addClass('active');
		toppage.widget[id > 1 ? 'hide' : 'show']();
	};
	toppage.group.onCreate = function(e) {
		var $sender = $(this);

		var template = $('#group-create-form-tpl').html();
		var content = tmpl(template);

		toppage.group.settingsOff();

		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				toppage.group.createFormInit();
			}
		});

		e.preventDefault();
	};

	toppage.group.createFormInit = function() {
		$('#js-group-change-protected').on('click', toppage.group.onChangeProtected);
		jQuery('#group-form').yiiactiveform({'validationDelay':10,'validateOnSubmit':true,'afterValidate':toppage.group.createCallback,'attributes':[{'id':'Group_title','inputID':'Group_title','errorID':'Group_title_em_','model':'Group','name':'title','enableAjaxValidation':true},{'id':'Group_password_atavi','inputID':'Group_password_atavi','errorID':'Group_password_atavi_em_','model':'Group','name':'password_atavi','enableAjaxValidation':true}],'focus':'#Group_title'});
	};

	toppage.group.createCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}

		$form.parents('.ui-dialog-content').addClass('process');

		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					$form.parents('.ui-dialog-content').dialog('close');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});

	};

	toppage.group.editCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}

		$form.parents('.ui-dialog-content').addClass('process');

		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					$form.parents('.ui-dialog-content').dialog('close');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});
	};

	toppage.group.settingsOn = function() {
		$('#group .settings-menu').show();
	};
	toppage.group.settingsOff = function() {
		$('#group .settings-menu').hide();
	};
	toppage.group.settingsToggle = function() {
		$('#group .settings-menu').toggle();
	};

	toppage.group.onManage = function(e) {
		toppage.group.settingsOff();
		toppage.group.manageOn();
		e.preventDefault();
	};
	toppage.group.onManageComplete = function(e) {
		toppage.group.settingsOff();
		toppage.group.manageOff();
		e.preventDefault();
	};
	toppage.group.manageOn = function() {
		$('#group').addClass('manage');
		toppage.group.sortableEnable('#group');
		toppage.group.triggerChange();
	};
	toppage.group.manageOff = function() {
		$('#group').removeClass('manage');
		toppage.group.sortableDisable('#group');
		toppage.group.triggerChange();
	};
	toppage.group.isManageOn = function() {
		return ($('#group.manage').length > 0) ? true : false;
	};
	

	toppage.group.onDelete = function(e) {
		var $sender = $(this);

		var template = $('#group-delete-message-tpl').html();
		var $item = $sender.parents('.item');

		var content = tmpl(template, {group: {
			id: $item.data('id'),
			title: $item.find('.title').html()
		}});

		toppage.popup.create({
			title: $sender.attr('title'),
			content: content,
			load: function(target) {
				var $target = $(target);
				$target.find('input[type=submit]').focus().on('click', function(e) {

					$target.addClass('process');
					toppage.ajax(
						$sender.attr('href'), {},
						function (data) {
							if (data) {
								$target.dialog('close');
								$item.remove();
								if ($sender.parent('.item').data('id') === toppage.group.getId()) {
									document.location = $('#js-group-home a').attr('href');
								}
								toppage.group.triggerChange();
							}
						},
						function (errorCallback) {
							errorCallback();
							$target.removeClass('process');
						},
						'json',
						'post'
					);
					e.preventDefault();
				});
			}
		});

		// клик не должен уходить на редактирование группы
		return false;
	};

	toppage.group.onClick = function(e) {
		var $sender = $(this);

		if ($('#group').hasClass('manage') && !$sender.is('#js-group-home')) {
			//Редактирование группы
			toppage.group.settingsOff();

			var $edit = $sender.find('.edit');
			toppage.popup.create({
				title: $edit.attr('title'),
				url: $edit.attr('href')
			});

			e.preventDefault();
		} else {
			if (!$(e.target).is('.title'))
				return false;
			//Переход в группу
			if (!window.history || !history.pushState)
				return;
			var groupId = $sender.data('id');
			var oldGid = toppage.group.getId();

			if ($sender.is('.protected:not(.unprotected)')) {
				toppage.group.unprotect(groupId, function() {
					toppage.group.writeHistory(oldGid, groupId, $sender.find('.title').attr('href'));
					$sender.addClass('unprotected');
					toppage.group.change(groupId);
				});
				return false;
			}
			toppage.group.change(groupId);
			toppage.group.writeHistory(oldGid, groupId, $sender.find('.title').attr('href'));
			return false;
		}
	};

	toppage.group.unprotect = function(groupId, callback) {
		toppage.protected.openRequest('group:'+groupId, {
			title: toppage.config.dict.unprotecttitle
		}, callback);
	};

	toppage.group.writeHistory = function(oldGroup, newGroup, url) {
		if (newGroup == oldGroup)
			return false;

		//Запись начального состояния нужна для перехода "назад"
		if (!history.state || !history.state.gid) {
			history.replaceState({gid: oldGroup}, '');
		}

		history.pushState({gid: newGroup}, '', url);
	};

	toppage.group.change = function(gid, callback) {
		window.NProgress && NProgress.start();
		toppage.bookmark.reloadPage(function(result) {
			window.NProgress && NProgress.done();
			$(toppage.searchEngine.input).focus();
			if (result.title) {
				document.title = result.title;
			}
			if (!result.access) {
				var $element = $('#group .item[data-id='+gid+']');
				$element.addClass('protected').removeClass('unprotected');
				toppage.group.unprotect(gid, function() {
					$element.addClass('unprotected');
					toppage.group.change(gid);
				});
			}
			if (gid == toppage.group.getId())
				return;
			toppage.group.setId(gid);
			toppage.group.checkPageHeight();
			callback && callback();
		}, null, gid);
	};

	toppage.init.events.push(function() {
		if (!window.history || !history.pushState)
			return;
		window.onpopstate = function(event) {
			if (!event.state || !event.state.gid)
				return;
			toppage.group.change(event.state.gid);
		};
	});

	/**
	 * Инициализация событий Drag&Drop
	 * @return {Void}
	 */
	toppage.group.dragDropInit = function (items) {
		var $items = (typeof items === 'string') ? $(items) : items;
		$items.droppable({
			accept: function (bm) {
				if ($(this).parents('#group')) {
					// в текущую группу перемещать нельзя
					if (toppage.group.getId() === $(this).data('id') && !$('.search-result').length) {
						return false;
					}
					if ($(this).data('id') == bm.data('group-id')) {
						return false;
					}
				}
				return true;
			},
			hoverClass: 'drop-hover',
			tolerance: 'pointer',
			scope: 'bookmark',
			drop: function(event, ui) {
				toppage.bookmark.groupUpdate(ui.draggable, $(this).data('id'));
				setTimeout(function(){delete(toppage.config.bookmark.moveoff);}, 500);
			},
			over: function(event, ui) {
				toppage.config.bookmark.moveoff = true;
			},
			out: function(event, ui) {
				delete(toppage.config.bookmark.moveoff);
			}
		});
	};

	/**
	 * Инициализация событий сортировки
	 * @param {String} container
	 * @return {Void}
	 */
	toppage.group.sortableInit = function (container) {
		var $sort = (typeof container === 'string') ? $(container) : container;

		$sort.sortable({
			items: '> .item',
			containment: 'parent',
			scroll: false,
			update: function() {
				var $items = $('#js-group-items.ui-sortable > .item');
				var list = [];
				$items.each(function(i, item) {
					list.push($(item).data('id'));
				});
				toppage.ajax('/group/sort', {ids: list.join(',')}, function() {
					toppage.group.triggerChange();
				});
			}
		});
	};

	/**
	 * Включение событий сортировки
	 * @param {String} container
	 * @return {Void}
	 */
	toppage.group.sortableEnable = function (container) {
		var $sort = (typeof container === 'string') ? $(container).find('.ui-sortable') : container.find('.ui-sortable');
		$sort.sortable('enable');
	};

	/**
	 * Включение событий сортировки
	 * @param {String} container
	 * @return {Void}
	 */
	toppage.group.sortableDisable = function (container) {
		var $sort = (typeof container === 'string') ? $(container).find('.ui-sortable') : container.find('.ui-sortable');
		$sort.sortable('disable');
	};

	/**
	 * Инициализация сворачивания групп
	 * @return {Void}
	 */
	toppage.group.initExpand = function () {
		var h = $('#js-group-items').height();
		if (h > 36) {
			if (!$('#group').hasClass('expand')) {
				$('#group').addClass('expand');
			}
		} else {
			if ($('#group').hasClass('expand')) {
				$('#group').removeClass('expand');
			}
		}

		if ($.cookie && $.cookie('group-collapse') === '1') {
			toppage.group.expandDown(true);
		}
	};

	/**
	 * Свернуть лишние группы
	 * @return {Void}
	 */
	toppage.group.onExpand = function (e) {
		if ($('#group').hasClass('expand-collapse')) {
			toppage.group.expandUp();
		} else {
			toppage.group.expandDown();
		}
		e.preventDefault();
	};

	/**
	 * Свернуть лишние группы
	 * @return {Void}
	 */
	toppage.group.expandDown = function (withoutCookie) {
		$('#group').addClass('expand-collapse');
		if (!withoutCookie) {
			$.cookie('group-collapse', 1, {domain: toppage.config.hostname, expires: -1});
			$.cookie('group-collapse', 1, {domain: toppage.config.domain, expires: 1000});
		}
		toppage.group.checkPageHeight();
	};

	/**
	 * @return {Void}
	 */
	toppage.group.fieldCreateInit = function ($context) {
		$('#new-group-link', $context).on('click', function(e) {
			$('#new-group-link', $context).hide();
			$('#new-group-field', $context).show();
			$('select.js-select-group, #new-group-field select', $context).attr('disabled', 'disabled');
			e.preventDefault();
		});
		$('#new-group-field .cancel', $context).on('click', function(e) {
			$('#new-group-field', $context).hide();
			$('#new-group-link', $context).show();
			$('select.js-select-group, #new-group-field select', $context).removeAttr('disabled');
			e.preventDefault();
		});
	};
	
	/**
	 * @return {Void}
	 */
	toppage.group.initItems = function ($panel) {
		$('.items > .item, .items-virtual > .item', $panel).off('click').on('click', toppage.group.onClick);
		$('.items > .item .delete', $panel).off('click').on('click', toppage.group.onDelete);
	};
	
	/**
	 * @return {Void}
	 */
	toppage.group.reloadItems = function ($panel) {
		var url = '/group/loadItems';
		var params = {gid: toppage.group.getId()};
		
		toppage.ajax(url, params, function(data) {
			if (data) {
				$('.item', $panel).remove();
				$('.expand-button', $panel).after(data.items);

				toppage.group.initItems($('#group'));
				toppage.group.dragDropInit($('#group .items > .item'));

				if (toppage.group.isManageOn()) {
					toppage.group.sortableDisable('#group');
					toppage.group.sortableEnable('#group');
				}
				toppage.group.triggerChange();
			}
			
		}, function(errorCallback) {
			errorCallback();
		});
	};
	
	/**
	 * Развернуть лишние группы
	 * @return {Void}
	 */
	toppage.group.expandUp = function (withoutCookie) {
		$('#group').removeClass('expand-collapse');
		if (!withoutCookie) {
			$.cookie('group-collapse', 0, {domain: toppage.config.hostname, expires: -1});
			$.cookie('group-collapse', 0, {domain: toppage.config.domain, expires: 1000});
		}
		toppage.group.checkPageHeight();
	};

	/**
	 * Триггер на изменение группы
	 * @return {Void}
	 */
	toppage.group.triggerChange = function () {
		toppage.group.checkPageHeight();
		toppage.group.initExpand();
	};
	/**
	 * @return {Void}
	 */
	toppage.group.checkPageHeight = function () {
		var $addNano = $("#group .js-add-nano"),
			$addNanoContent = $("#group .js-add-nano-content");

		var isOverflow = $('#js-group-items').height() > 108;
		var isCollapsed = $('#group').hasClass('expand-collapse');
		var isManage = $('#group').hasClass('manage');

		if (isOverflow && (!isCollapsed || isManage)) {
			$addNano.addClass("nano");
			$addNanoContent.addClass("nano-content");
			$(".group-content").nanoScroller({
				iOSNativeScrolling: true,
				sliderMaxHeight: 70
			});
		} else {
			if ($addNano.hasClass("nano")) {
				$addNano.removeClass("nano");
				$addNanoContent.removeClass("nano-content");
				$(".group-content").nanoScroller({stop:true});
			}
		}

		$('#bookmarks .page').css('margin-bottom', $('#group .ym-wrapper').height());
	};
	
	toppage.group.onChangeProtected = function(e) {
		e.preventDefault();
		var $sender = $(this);
		
		$sender.parents('.group-protected').hide();
		$('.group-password-input', $sender.parents('.tp-form')).show();
		$('.group-password-input input', $sender.parents('.tp-form')).removeAttr('disabled');
	};
	
	toppage.group.onLoadBookmarkGroup = function(e) {
		e.preventDefault();
		var $sender = $(this);
		
		$('#group .items-popup .item a').removeClass('active');
		$sender.addClass('active');
		
		var name = $sender.data('name');
		if (typeof yaCounter25117439 === 'object') {
			yaCounter25117439.reachGoal('click_group_' + name);
		}
		
		$('#group .group-item-popup').hide();
		var $popup = $('#group .group-item-popup-' + name);
		if ($popup.length === 0) {
			toppage.ajax(
				$sender.attr('href'), {},
				function(response) {
					if (response) {
						$('#group .items-popup-content').append(response.content);
					}
				},
				function(errorCallback) {
					errorCallback();
				},
				'json'
			);
		} else {
			$popup.show();
		}
	};
	toppage.group.closeBookmarkGroup = function() {
		$('#group .items-popup .item a').removeClass('active');
		$('#group .group-item-popup').hide();
	};
	toppage.group.onHideBookmarkGroup = function(e) {
		e.preventDefault();
		var $sender = $(this);
		
		toppage.ajax(
			$sender.attr('href'), {},
			function(response) {
				if (response) {
					$sender.parents('#group .group-item-popup li').addClass('hidden');
				}
			},
			function(errorCallback) {
				errorCallback();
			},
			'json'
		);
	};
	toppage.group.onShowBookmarkGroup = function(e) {
		e.preventDefault();
		var $sender = $(this);
		
		toppage.ajax(
			$sender.attr('href'), {},
			function(response) {
				if (response) {
					$sender.parents('#group .group-item-popup li').removeClass('hidden');
				}
			},
			function(errorCallback) {
				errorCallback();
			},
			'json'
		);
	};

	/**
	 * Очереди запросов
	 * @returns {Void}
	 */
	toppage.queue = function() {};
	toppage.queue.next = function(name) {
		if (toppage.config.queue.timeoutprocess) {
			window.clearTimeout(toppage.config.queue.timeoutprocess);
		}

		if (toppage.config.queue.callback[name].length > 0) {
			var callback = toppage.config.queue.callback[name].shift();
			try {
				callback();
				toppage.config.queue.timeoutprocess = window.setTimeout(function() {
					toppage.queue.next(name);
				}, toppage.config.queue.timeout);
			} catch (e) {
				toppage.queue.next(name);
			}
		} else {
			delete(toppage.config.queue.process[name]);
		}
	};
	toppage.queue.push = function(name, func) {
		if (typeof toppage.config.queue.callback[name] !== 'object') {
			toppage.config.queue.callback[name] = [];
		}
		toppage.config.queue.callback[name].push(func);

		if (!toppage.config.queue.process[name]) {
			toppage.config.queue.process[name] = 1;
			toppage.queue.next(name);
		}
	};

	toppage.bodyEvent = function(){};
	toppage.bodyEvent.init = function() {
		$('body').on('click.event', function(e) {
			var id;
			for (id in toppage.config.bodyEvent.events) {
				if (typeof toppage.config.bodyEvent.events[id] === 'function') {
					var func = toppage.config.bodyEvent.events[id];
					func($(e.target));
				}
			}
		});
	};
	toppage.bodyEvent.on = function(id, func) {
		toppage.config.bodyEvent.events[id] = func;
	};
	toppage.bodyEvent.off = function(id) {
		delete(toppage.config.bodyEvent.events[id]);
	};
	toppage.init.events.push(function() {
		toppage.bodyEvent.init();
	});

	/**
	 * @returns {Void}
	 */
	toppage.start = function() {};
	toppage.start.init = function() {
		toppage.start.change(toppage.browser.type);
	};
	toppage.start.onClick = function(e) {
		var id = $(this).data('id');
		toppage.start.change(id);
		e.preventDefault();
	};
	toppage.start.change = function(type) {
		var b = 'chrome';
		switch (type) {
			case 'chrome':
				b = 'chrome';
				break;
			case 'safari':
				b = 'safari';
				break;
			case 'yabrowser':
			case 'opera':
			case 'opr':
				b = 'opera';
				break;
			case 'msie':
				b = 'msie';
				break;
			case 'firefox':
				b = 'firefox';
				break;
		}
		var $content = $('.content-start');
		$('.menu a', $content).removeClass('active');
		$('#js-menu-'+b, $content).addClass('active');
		$('.section', $content).removeClass('active');
		$('#js-section-'+b, $content).addClass('active');

		// extension
		$('.section', '#js-extensions').removeClass('active');
		var $ext = $('#js-ext-'+b, '#js-extensions').addClass('active');
		if ($ext.length > 0) {
			$('body').addClass('extension-on');
		} else {
			$('body').removeClass('extension-on');
		}
	};

	toppage.start.setUrl = function(target, url) {
		if (toppage.browser.msie) {
            target.style.behavior = 'url(#default#homepage)';
            target.setHomePage(url);
        } else {
			toppage.start.change(toppage.browser.type);
		}
	};

	/**
	 * @returns {Void}
	 */
	toppage.search = function() {};
	toppage.search.queryTimeout = null;
	toppage.search.init = function() {
		$('#js-search-bookmark-open').on('click', toppage.search.on);
		$('#js-search-bookmark-field').on('blur', toppage.search.off).on('keyup', toppage.search.change);
		$('#js-search-bookmark-field-clean').on('click', toppage.search.clean);
		if ($('#js-search-bookmark-field').val() !== '') {
			toppage.search.on();
		}
	};
	toppage.search.on = function() {
		if (!$('.search-bookmark').hasClass('active')) {
			$('.search-bookmark').addClass('active');
			$('#js-search-bookmark-field').animate({width: '150px'}, 200, function() {
				$(this).focus();
			});
			if (!$('#background-gray').length) {
				$('body').append('<div id="background-gray"></div>');
			}
		}
	};
	toppage.search.off = function() {
		if ($('.search-bookmark').hasClass('active') && $('#js-search-bookmark-field').val() === '') {
			$('#js-search-bookmark-field').animate({width: '0px'}, 200, function() {
				$('.search-bookmark').removeClass('active');
			});
		}
	};
	toppage.search.clean = function() {
		$('#js-search-bookmark-field').val('').focus();
		$('#js-search-bookmark-field-clean').removeClass('active');
		toppage.search.reset();
	};
	toppage.search.change = function(event) {
		var query = $(this).val();
		if (query !== '') {
			$('#js-search-bookmark-field-clean').addClass('active');
		} else {
			$('#js-search-bookmark-field-clean').removeClass('active');
		}

		if (event.keyCode === 13) {
			// enter
			if ($('#bookmarks .page').length === 0) {
				window.location = '/search?q=' + encodeURIComponent(query);
			} else {
				$(this).blur();
			}
		} else if (event.keyCode === 27) {
			// escape
			$(this).blur();
		} else {
			// other
			if ($(this).val().length > 0) {
				toppage.search.addQuery(query);
			} else {
				toppage.search.reset();
			}
		}
	};
	toppage.search.addQuery = function(query, callback) {
		toppage.search.clearQuery();
		toppage.search.queryTimeout = setTimeout(function(){
			if ($('#bookmarks .page').length === 0) {
				return;
			}
			toppage.search.request(query);
			toppage.search.queryTimeout = null;
		}, 300);
	};
	toppage.search.request = function(query, callback) {
		toppage.ajax('/search', {q: query}, function(data) {
			if (data) {
				if (toppage.search.lock)
					return;
				toppage.search.lock = true;
				
				if (typeof yaCounter25117439 === 'object') {
					yaCounter25117439.reachGoal('bookmark_search_request');
				}

				$('#bookmarks .page').replaceWith(data.content);
				$('#background-gray').addClass('showed');
				$('body').addClass('searching');
				toppage.group.checkPageHeight();
				toppage.search.lock = false;
				callback && callback();
			}
		});
	};
	toppage.search.reset = function(callback) {
		toppage.search.clearQuery();
		toppage.bookmark.reloadPage(function(){
			$('#background-gray').removeClass('showed');
			$('body').removeClass('searching');
			toppage.search.lock = false;
			callback && callback();
		}, function checkLock() {
			if (toppage.search.lock) {
				return false;
			} else {
				toppage.search.lock = true;
				return true;
			}
		});
	};
	toppage.search.clearQuery = function() {
		if (toppage.search.queryTimeout) {
			clearTimeout(toppage.search.queryTimeout);
			toppage.search.queryTimeout = null;
		}
	};
	toppage.search.reload = function() {
		var query = $('#js-search-bookmark-field').val();
		if (!query) {
            var finded = location.search.match(new RegExp("[\?\&]" + "q" + "=([^\&]*)(\&?)","i"));
            query = finded ? finded[1] : "";
		}
		toppage.search.request(query);
	};
	toppage.init.events.push(function() {
		toppage.search.init();
	});

	/**
	 * Обработка сообщений от comet-сервера
	 * @returns {Void}
	 */
	toppage.comet = function() {};
	toppage.comet.init = function() {
		var rp = new Dklab_Realplexor(
			toppage.config.comet.protocol + '://comet5.' + toppage.config.hostname + '/'
		);

		var id;
		var channel;
		if (toppage.config.comet.channels) {
			for (id in toppage.config.comet.channels) {
				channel = toppage.config.comet.channels[id];
				rp.setCursor(channel, toppage.config.comet.initialId);
				rp.subscribe(channel, toppage.comet.callback);
			}
		}

		rp.execute();
	};

	toppage.comet.callback = function(data, id) {
		if (data && data.c && data.p) {
			var command = data.c;
			var params = data.p;
			var delay = data.d || 0;
			switch (command) {
				case 'bm.update':
					setTimeout(function() {
						toppage.comet.bookmarkUpdate(params);
					}, delay);
					break;
				case 'bm.reload':
					setTimeout(function() {
						toppage.comet.bookmarkReload(params);
					}, delay);
					break;
				case 'gr.reload':
					setTimeout(function() {
						toppage.comet.groupReload();
					}, delay);
					break;
				case 'w.reload':
					setTimeout(function() {
						toppage.comet.reload();
					}, delay);
					break;
				case 'exp.dropboxUp':
					setTimeout(function() {
						toppage.exportBookmark.dropboxUp(params);
					}, delay);
					break;
			}
		}
	};

	toppage.comet.bookmarkUpdate = function(params) {
		var index = false;
		var currentGroupId = toppage.group.getId();
		if (params.group_id) {
			if (currentGroupId === false || currentGroupId == params.group_id) {
				index = (currentGroupId) ? params.group_index : params.index;
			}
		}
		if (params.old && params.old.group_id && params.group_id !== params.old.group_id) {
			if (currentGroupId === false || currentGroupId == params.old.group_id) {
				index = (currentGroupId) ? params.old.group_index : params.old.index;
			}
		}
		if (index) {
			if (!params.pageid || params.pageid !== toppage.config.pageid) {
				toppage.bookmark.reloadPage();
			}
		}
	};
	toppage.comet.reload = function() {
		document.location.reload();
	};

	toppage.comet.bookmarkReload = function(params) {
		var index = false;
		var currentGroupId = toppage.group.getId();
		if (!currentGroupId || (params.group_id && currentGroupId == params.group_id)) {
			index = (currentGroupId) ? params.group_index : params.index;
		}
		if (index) {
			if (!params.pageid || params.pageid !== toppage.config.pageid) {
				toppage.bookmark.reload(index);
			}
		}
	};
	toppage.comet.groupReload = function(params) {
		toppage.group.reloadItems($('#js-group-items'));
	};
	toppage.comet.reload = function() {
		document.location.reload();
	};

	/**
	 * Обработка сообщений
	 * @returns {Void}
	 */
	toppage.feedback = function() {};
	toppage.feedback.createCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}

		$form.parents('.ui-dialog-content').addClass('process');

		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					toppage.popup.create({
						content: '<div class="tp-form"><p>' + response.message + '</p><br><center><a class="tp-button js-popup-close ok" href="#">OK</a></center></div>',
						title: response.title
					});
					$form.parents('.ui-dialog-content').dialog('close');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});
	};

	/**
	 * Стартовый попап
	 * @returns {Void}
	 */
	toppage.info = function() {};
	toppage.info.show = function(marker) {
		var url = '/index/start';
		if (marker) {
			url += '?marker=' + marker;
		}
		toppage.popup.create({
			url: url,
			title: toppage.config.dict.startpopuptitle,
			width: 640,
			height: 460
		});
	};

	/**
	 * Обработка коллекций
	 * @returns {Void}
	 */
	toppage.collection = function() {};
	toppage.collection.onSaveForm = function(e) {
		e.preventDefault();
		var $el = $(this);
		toppage.collection.saveForm($el);
	};
	toppage.collection.saveForm = function($el) {
		toppage.popup.create({
			type: 'html',
			content: $('#js-collection-save-popup').html(),
			title: $el.data('title'),
			load: function($item) {
				toppage.group.fieldCreateInit($item);
				$('#collection-form input[type=submit]', $item).on('click', toppage.collection.onSave);
				if (!toppage.config.groupid) {
					setTimeout(function() {
						toppage.collection.save($('#collection-form', $item));
					},200);
				}
			}
		});
	};

	toppage.collection.onSave = function(e) {
		e.preventDefault();
		toppage.collection.save($(this));
	};

	toppage.collection.save = function($item) {

		var $form = $item.closest('form');
		$form.parents('.ui-dialog-content').addClass('process');

		var params = {};
		$form.serializeArray().map(function(x){params[x.name] = x.value;});

		var bm = [];
		$.each($('#bookmarks .item'), function(i, el) {
			bm.push($(el).data('id'));
		});

		params.bm = bm;
		toppage.ajax(
			$form.attr('action'),
			params,
			function(response) {
				if (response) {
					$form.parents('.ui-dialog-content').dialog('close');
					toppage.popup.create({
						content: '<div class="tp-form"><p>' + response.message + '</p><br><center><a class="tp-button js-popup-close ok" href="#">OK</a></center></div>',
						title: response.title
					});
				}
			},
			function(errorCallback) {
				$form.parents('.ui-dialog-content').removeClass('process');
				errorCallback();
			},
			'json',
			'post'
		);

	};

	toppage.collection.callCollectionSave = function() {
		if ($('#bookmarks .item').length > 0 && toppage.config.userid) {
			toppage.collection.saveForm($('#collection-save'));
		}
	};
	toppage.collection.onComplain = function(e) {
		e.preventDefault();
		var $el = $(this), params = {},
		url = $el.attr("action");
		params.reason = $el.find("input:checked").val();
		toppage.ajax(
			url,
			params,
			function(response) {
				if (response) {
					$el.parents('.ui-dialog-content').dialog('close');
					toppage.popup.create({
						content: '<center style="padding: 0px 40px 40px;">' + response.message + '</center>',
						dialogClass: 'noTitlePopup'
					});
				}
			},
			function(errorCallback) {
				$el.parents('.ui-dialog-content').removeClass('process');
				errorCallback();
			},
			'json',
			'post'
		);
	};
	toppage.collection.editFormInit = function() {
		jQuery('#collection-edit-form').yiiactiveform({'validationDelay':10,'validateOnSubmit':true,'afterValidate':toppage.collection.editCallback,'attributes':[
			{'id':'Collection_uri','inputID':'Collection_uri','errorID':'Collection_uri_em_','model':'Collection','name':'uri','enableAjaxValidation':true},
			{'id':'Collection_title','inputID':'Collection_title','errorID':'Collection_title_em_','model':'Collection','name':'title','enableAjaxValidation':true},
			{'id':'Collection_content','inputID':'Collection_content','errorID':'Collection_content_em_','model':'Collection','name':'content','enableAjaxValidation':true}
		],'focus':'#Collection_title'});
	};

	toppage.collection.editCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}

		$form.parents('.ui-dialog-content').addClass('process');

		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					$form.parents('.ui-dialog-content').dialog('close');
					if (response.newUrl && $form.data('to-col')) {
						document.location = response.newUrl;
					} else {
						document.location.reload();
					}
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});

	};

	/**
	 * Удаление коллекции
	 * @return {Boolean}
	 */
	toppage.collection.onDelete = function(e) {
		var $sender = $(this);

		var template = $('#collection-delete-message-tpl').html();
		var collectionTitle = $sender.closest('[data-col-title]').data('col-title');
		var content = tmpl(template, {collection: {
			title: collectionTitle
		}});

		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				var $target = $(target);
				$target.find('input[type=submit]').focus().on('click', function(e) {
					$target.addClass('process');
					toppage.ajax(
						$sender.attr('href'), {},
						function (response) {
							if (response) {
								$target.dialog('close');
								document.location.reload();
							}
						},
						function (errorCallback) {
							errorCallback();
							$target.removeClass('process');
						}
					);
					e.preventDefault();
				});
			}
		});

		e.preventDefault();
	};



	/**
	 * Обработка экспорта закладок
	 * @returns {Void}
	 */
	toppage.exportBookmark = function() {};
	toppage.exportBookmark.dropboxChangeUp = function() {
		toppage.ajax('/exportBookmark/dropboxUp', {},
			function(response) {
				if (response.link) {
					var win = window.open(response.link, 'dropbox.oauth', 'width=600,height=450,left=center');
					win.focus();
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	toppage.exportBookmark.dropboxChangeDown = function() {
		toppage.ajax('/exportBookmark/dropboxDown', {},
			function(response) {
				if (response) {
					$('#js-export-dropbox-change').html(response.title);
					$('#js-export-dropbox-change').closest('.export-dropbox').removeClass('active');
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	toppage.exportBookmark.onDropboxChange = function(e) {
		e.preventDefault();
		
		var $link = $(e.target);
		var state = $link.closest('.export-dropbox').hasClass('active');
		
		if (state) {
			toppage.exportBookmark.dropboxChangeDown();
		} else {
			toppage.exportBookmark.dropboxChangeUp();
		}
	};
	toppage.exportBookmark.dropboxUp = function(params) {
		var $dropbox = $('#js-export-dropbox-change').closest('.export-dropbox');
		
		if (params.title) {
			$('#js-export-dropbox-change').html(params.title);
		}
		if (params.infoTag) {
			$('.info', $dropbox).replaceWith(params.infoTag);
		}
		
		$dropbox.addClass('active');
	};
	
	
	/**
	 * @returns {Void}
	 */
	toppage.protected = function() {};
	toppage.protected.openRequest = function(key, popup, callback) {
		popup = popup||{};
		popup.url = {path: '/protected/request', params:{key: key}};
		toppage.protected.customCallback = callback;

		toppage.popup.create(popup);
	};
	toppage.protected.requestCallback = function($form, data, hasError) {
		if (hasError) {
			return false;
		}
		
		$form.parents('.ui-dialog-content').addClass('process');
		
		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if (response.success) {
					if (toppage.protected.customCallback) {
						toppage.protected.customCallback();
						$form.parents('.ui-dialog-content').dialog('close');
					} else {
						document.location.reload();
					}
				} else {
					if (response.message) {
						$.pnotify({title: 'Error',text: response.message,type: 'error',animate_speed: 1});
					}
					$form.parents('.ui-dialog-content').removeClass('process');
				}
			},
			error: function() {
				$form.parents('.ui-dialog-content').dialog('close');
			}
		});	
	};
	
	/**
	 * @returns {Void}
	 */
	toppage.social = function() {};
	toppage.social.join = function(data) {
		if (data.success) {
			$('.social-list-item').append(data.item);
			toppage.social.checkListShow();
		} else {
			$.pnotify({
				title: toppage.config.dict.ajaxerrortitle,
				text: data.message,
				type: 'error',
				animate_speed: 1
			});
		}
	};
	toppage.social.remove = function(id) {
		toppage.ajax('/user/socialRemove', {id: id},
			function(response) {
				if (response) {
					$('#social-item-'+id).remove();
					toppage.social.checkListShow();
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	toppage.social.checkListShow = function() {
		if ($('.social-list-item .social-item').length === 0) {
			$('.social-list-item').hide();
		} else {
			$('.social-list-item').show();
		}
	};

	toppage.mytheme = function() {};
	toppage.mytheme.onChangeSubmenu = function(e) {
		e.preventDefault();
		toppage.mytheme.changeSubmenu($(this).data('type'));
	};
	toppage.mytheme.changeSubmenu = function(type) {
		$('#menu .themes-submenu a').removeClass('active');
		$('#menu #submenu-' + type).addClass('active');
		$('#menu .item-themes-submenu').hide();
		$('#menu .item-themes-submenu.' + type).show();
	};
	toppage.mytheme.load = function (e, response) {
		if (response && response.success == true) {
			var $thememy = $('#menu .themes-my');
			if (!$thememy.hasClass('created')) {
				$thememy.addClass('created');
			}
			if (response.preview) {
				$('#menu .themes-my .image').css('background-image','url(\''+response.preview+'\')');
			}
			toppage.mytheme.change(response.style);
			
			if (typeof yaCounter25117439 === 'object') {
				yaCounter25117439.reachGoal('mytheme_load');
			}
			
		} else if (response && response.message) {
			alert(response.message);
		}
		toppage.menu.loaderOff();
	};
	toppage.mytheme.onUpdate = function(e) {
		e.preventDefault();
		$('#menu .themes-my .theme-image-upload').click();
	};
	toppage.mytheme.onDelete = function(e) {
		e.preventDefault();
		toppage.ajax('/theme/deleteCustom', {},
			function(response) {
				if (response) {
					$('#menu .themes-my').removeClass('created');
					if (response.style && response.style !== '') {
						$('#theme-style').remove();
						$('head').append($('<style id="theme-style">'+response.style+'</style>'));
						
						$('#menu .themes-my .image .theme-custom-change').removeClass('active');
						$('#menu .themes a').removeClass('active');
						$('#menu .themes a#theme-default').addClass('active');
					}
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	toppage.mytheme.onChange = function(e) {
		e.preventDefault();
		toppage.menu.loaderOn();
		
		toppage.mytheme.changeCustom(function() {
			toppage.menu.loaderOff();
		});
	};
	toppage.mytheme.changeCustom = function(callback) {
		toppage.ajax('/theme/changeCustom', {},
			function(response) {
				if (response) {
					toppage.mytheme.change(response.style);
				}
				callback();
			},
			function(errorCallback) {
				errorCallback();
				callback();
			}, 'json'
		);
	};
	toppage.mytheme.change = function(style) {
		$('#theme-style-static').remove();
		$('#theme-style').remove();
		
		$('#menu .themes a').removeClass('active');
		$('#menu .themes-my .image .theme-custom-change').addClass('active');

		if (style && style !== '') {
			$('head').append($('<style id="theme-style">'+style+'</style>'));
		}
	};
	toppage.mytheme.updateStyle = function(params) {
		var styles = {};
		$.each(params, function(k, v) {
			styles['ThemeCustom['+k+']'] = v;
		});
		
		toppage.ajax('/theme/saveCustom', styles,
			function(response) {
				if (response && response.style) {
					toppage.mytheme.change(response.style);
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	
	/** Widgets **/
	toppage.widget = function() {};
	toppage.widget.events = [];
	toppage.widget.startColumn = null;
	
	toppage.widget.weather = null;
	toppage.widget.exchangeRates = null;
	toppage.widget.group = null;
	
	toppage.widget.panelInit = function()
	{
		var $panel = $($('#widget-panel-tpl').html());
		$panel.hide();
		$('body').append($panel);
		$('#widget-panel .panel-close').on('click', toppage.widget.onClosePanel);
	};
	toppage.widget.onClosePanel = function(e)
	{
		e.preventDefault();
		var $item = $('#widget-panel');
		$item.fadeOut(200, function() { 
			$('#widget-panel-inner', $item).html('');
			$('body').css('overflow', '');
		});
	};
	
	toppage.widget.init = function() 
	{
		if (toppage.widget.events) {
			$.each(toppage.widget.events, function(i, event) {
				if (typeof event === 'function') {
					event();
				}
			});
		}
		toppage.widget.checkButtonCreate('#widgets');
		toppage.widget.panelInit();
	};
	
	toppage.widget.on = function() 
	{
		toppage.menu.loaderOn();

		$('body').addClass('widget-on');
		toppage.ajax('/widget/on', {checked: 1}, function(data) {
			if (data && data.reload) {
				document.location.reload();
			}
			toppage.menu.loaderOff();

		}, function(errorCallback) {
			toppage.menu.loaderOff();
			errorCallback();
		});
	};
	toppage.widget.off = function() 
	{
		toppage.menu.loaderOn();
		
		$('body').removeClass('widget-on');
		toppage.ajax('/widget/on', {checked: 0}, function(data) {
			toppage.menu.loaderOff();

		}, function(errorCallback) {
			toppage.menu.loaderOff();
			errorCallback();
		});
	};
	toppage.widget.hide = function()
	{
		$('body.widget-on').addClass('widget-hide');
	};
	toppage.widget.show = function()
	{
		$('body.widget-on').removeClass('widget-hide');
	};

	toppage.widget.onSettingOn = function(e) 
	{
		e.preventDefault();
		$('body #widgets').addClass('edit');
		$('#widgets .ui-sortable').sortable({disabled: false});
	};
	toppage.widget.onSettingOff = function(e) 
	{
		e.preventDefault();
		$('body #widgets').removeClass('edit');
		$('#widgets .ui-sortable').sortable({disabled: true});
		$('.WeatherWidget .ya-weather').addClass('show').not(':first').removeClass('show');
	};
	
	toppage.widget.sortableInit = function(boxes)
	{
		var $boxes = (typeof boxes === 'string') ? $(boxes) : boxes;
		
		$boxes.sortable({
			connectWith: $boxes,
			revert: 100,
			cancel: ".no-sortable",
			disabled: true,
			start: function(event, ui) {
				var $column = $(ui.item).parents('.wcolumn, .mini-wcolumn');
				toppage.widget.startColumn = $column;
				$('#widgets .wcolumn .widget.CreateWidget').remove();
			},
			stop: function(event, ui) {
				var $startColumn = toppage.widget.startColumn;
				var $stopColumn = $(ui.item).parents('.wcolumn, .mini-wcolumn');
				
				toppage.widget.startColumn = null;
				
				var data = {};
				
				var listStart = [];
				$('.widget, .widget-mini', $startColumn).each(function(i, item) {
					if ($(item).data('id')) {
						listStart.push($(item).data('id'));
					}
				});
				data[$startColumn.data('id')] = listStart.join(',');

				var listStop = [];
				$('.widget, .widget-mini', $stopColumn).each(function(i, item) {
					if ($(item).data('id')) {
						listStop.push($(item).data('id'));
					}
				});
				data[$stopColumn.data('id')] = listStop.join(',');
				
				toppage.ajax('/widget/sort', {ids: data}, function() {});
				toppage.widget.checkButtonCreate('#widgets');
			}
		});
	};
	
	toppage.widget.checkButtonCreate = function(el)
	{
		$('#widgets .wcolumn .widget.CreateWidget').remove();
		
		var $el = $(el);
		
		var max = 0;
		var columns = {};
		
		$('.wcolumn', $el).each(function(k, column) {
			var i = $(column).data('id');
			columns[i] = 0;
			
			$('.widget', column).each(function(n, w) {
				columns[i] += $(w).data('size');
			});
			
			if (columns[i] > max) {
				max = columns[i];
			}
		});
		
		for (var id in columns) {
			var cur = columns[id];
			var delta = max - cur;
			if (delta) {
				toppage.widget.buttonCreate(el, id, delta);
			}
		}
	};
	toppage.widget.buttonCreate = function(el, column, amount)
	{
		var $column = $('.wcolumn.col'+column+'>.wrapper', el);
		do {
			var template = $('#widget-create-new-tpl').html();
			var $template = $(template).on('click', toppage.widget.onCreatePanel);
			$column.append($template);
			amount--;
		} while(amount);
	};
	
	toppage.widget.onDelete = function(e)
	{
		e.preventDefault();
		var $widget = $(this).closest('#widgets .widget, #widgets .widget-mini'); 
		toppage.ajax('/widget/delete', {id: $widget.data('id')},
			function(response) {
				$widget.fadeOut(200, function() {
					$widget.remove();
					toppage.widget.checkButtonCreate('#widgets');
				});
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	
	toppage.widget.onCreatePanel = function(e)
	{
		e.preventDefault();
		
		var data = {};
		var $this = $(this);
		
		if ($this.hasClass('widget')) {
			data['column'] = $this.parents('#widgets .wcolumn').data('id');
		}
		
		$('#widget-panel-inner').html('');
		$('#widget-panel').fadeIn(200, function() {
			$('body').css('overflow', 'hidden');
		});
		toppage.ajax('/widget/createPanel', data,
			function(response) {
				$('#widget-panel-inner').html($(response.html));
				
				$('#widget-panel a.button-create').on('click', toppage.widget.onCreateWidget);
				$('#widget-panel .form-section input').on('keypress', toppage.widget.onEnterCreateWidget);
				$('#widget-panel .done').on('click', toppage.widget.onClosePanel);
			},
			function(errorCallback) {
				$('#widget-panel').fadeOut(200, function() {
					$('body').css('overflow', 'auto');
				});
				errorCallback();
			}, 'json'
		);
	};

	toppage.widget.onEnterCreateWidget = function(e)
	{
		if (e.which === 13) {
			e.preventDefault(); toppage.widget.onCreateWidget(e) 
		}
	};
	
	toppage.widget.onCreateWidget = function(e)
	{
		e.preventDefault();
		var $this = $(e.target);
		var $newwidget = $this.closest('.widget');
		
		var form = toppage.converForm2Json($('form', $newwidget));
		form.type = $newwidget.data('type');
		form.column = toppage.widget.findMinColumn($newwidget.data('column'));
		
		var $button = $('a.button-create', $newwidget);
		
		$button.fadeOut(200);
		
		toppage.ajax('/widget/create', form,
			function(response) {
				
				if (response) {
					var $widget = $(response.widget);
					var $column = $('#widgets .col' + response.column + ' > div');

					$('#widgets .wcolumn .widget.no-sortable').remove();

					$column.append($widget);
					$('a.delete', $widget).on('click', toppage.widget.onDelete);
					$('a.edit', $widget).on('click', toppage.widget.onEdit);

					toppage.widget.checkButtonCreate('#widgets');

					$button.next().fadeIn(200, function() {
						if (!$newwidget.hasClass('onlyone')) {
							setTimeout(function() {
								$button.next().fadeOut('200', function() {$button.fadeIn(200)})
							}, 1000);
						}
					});
				} else {
					$button.fadeIn(200);
				}
			},
			function(errorCallback) {
				$button.fadeIn(200);
				errorCallback();
			}, 'json'
		);
	};
	toppage.widget.findMinColumn = function(def)
	{
		if (def) return def;
		
		var $el = $('#widgets');
		
		var min = null;
		var col = null;
		
		$('.wcolumn', $el).each(function(k, column) {
			var i = $(column).data('id');
			var size = 0;
			
			$('.widget', column).each(function(n, w) {
				var s = $(w).data('size');
				if (!isNaN(s)) size += s; 
			});
			
			if (min === null || min > size) {
				min = size;
				col = i;
			}
		});
		
		return col;
	};

	toppage.widget.onEdit = function(e)
	{
		e.preventDefault();
		
		var $this = $(e.target);
		var $widget = $this.closest('.widget, .widget-mini');
		
		$('#widget-panel-inner').html('');
		$('#widget-panel').fadeIn(200, function() {
			$('body').css('overflow', 'hidden');
		});
		
		toppage.ajax('/widget/edit', {id: $widget.data('id')},
			function(response) {
				if (response) {
					var $options = $(response.options);
					$('#widget-panel-inner').html($options);
					$('.button-create', $options).on('click', toppage.widget.onEditSave);
					$('.form-section input', $options).on('keypress', toppage.widget.onEnterSaveWidget);
				} else {
					$('#widget-panel').fadeOut(200, function() {
						$('body').css('overflow', 'auto');
					});
				}
			},
			function(errorCallback) {
				$('#widget-panel').fadeOut(200, function() {
					$('body').css('overflow', 'auto');
				});
				errorCallback();
			}, 'json'
		);
	};
	toppage.widget.onEnterSaveWidget = function(e)
	{
		if (e.which === 13) {
			e.preventDefault(); toppage.widget.onEditSave(e) 
		}
	};
	
	toppage.widget.onEditSave = function(e)
	{
		e.preventDefault();
		
		var $this = $(e.target);
		var $widgetOptions = $this.closest('.widget, .widget-mini');
		
		var form = toppage.converForm2Json($('form', $widgetOptions));
		form.id = $widgetOptions.data('id');
		
		var $this = $(this);
		$this.fadeOut(200);
		
		toppage.ajax('/widget/edit', form,
			function(response) {
				if (response.success) {
					var $widgetNew = $(response.widget);
					
					var $widget = $('#widget-'+form.id);
					$widget.after($widgetNew);
					$('a.delete', $widgetNew).on('click', toppage.widget.onDelete);
					$('a.edit', $widgetNew).on('click', toppage.widget.onEdit);
					$widget.remove();
					
					toppage.widget.checkButtonCreate('#widgets');
					
					$widgetOptions.closest('.inner').remove();
					$('#widget-panel').fadeOut(200, function() {
						$('body').css('overflow', 'auto');
					});
				} else {
					$this.fadeIn(200);
				}
			},
			function(errorCallback) {
				$widgetOptions.closest('.inner').remove();
				$this.fadeIn(200);
				$('#widget-panel').fadeOut(200, function() {
					$('body').css('overflow', 'auto');
				});
				errorCallback();
			}, 'json'
		);
	};
	
	toppage.widget.updateCache = function(id)
	{
		var $widget = $('#widgets #widget-'+id);
		
		toppage.ajax('/widget/updateCache', {id: id},
			function(response) {
				if (response.success) {
					var $widgetNew = $(response.widget);
					$widget.before($widgetNew);
					$widget.remove();

					$('a.delete', $widgetNew).on('click', toppage.widget.onDelete);
					$('a.edit', $widgetNew).on('click', toppage.widget.onEdit);

					toppage.widget.checkButtonCreate('#widgets');
				} else {
					$('.title', $widget).html('Ошибка при обновлении').css('color', '#cf0000');
				}
			},
			function(errorCallback) {
				errorCallback();
			}, 'json'
		);
	};
	
	toppage.widget.weatherCitiesCache = {};
	toppage.widget.lastCities = {};
	
	toppage.widget.initAutocompleteWeather = function(el)
	{
		var $t = $(el);
				
		$t.autocomplete({
			minLength: 2,
  			delay: 200,
  			source: function(request, response) {
				if (request.term in toppage.widget.weatherCitiesCache) {
					response(toppage.widget.weatherCitiesCache[request.term]);
					return;
				}
				toppage.ajax('/widget/getWeatherCities', {s: request.term}, function(r) {
					toppage.widget.lastCities = r.items;
					response(r.list);
				}, 'json');
  			},
			open: function() {
				var width = $t.width()+12;
				$(this).autocomplete('widget').css({
					left: '0px',
					top: '0px',
					position: 'relative'
				}).css({width: width, top: 0, left: -16}).appendTo($t.parent());
			},
			select: function(event, ui) {
				var sender = this;
				if (ui.item) {
					$(sender).next().val(toppage.widget.lastCities[ui.item.value]);
				}
				return;
			}
		});
	};
	
	toppage.widget.initSmartMoney = function(maxIterations)
	{
		maxIterations = maxIterations || 4;
		var statecookiename = 'sm-state';
		var state = $.cookie(statecookiename);
		if (state !== null && (state === 'closed' || state >= maxIterations)) {
			return;
		}
            
		setTimeout(function() {
			toppage.ajax('/widget/smartMoney', {},
				function(response) {
					if (response.success && response.content) {
						
						var $w = $(response.content);
						$('#content .search-engine .ym-wbox').append($w.hide());

						$w.find('.js-close-smartmoney').click(function() {
                            $.cookie(statecookiename, 'closed', {domain: toppage.config.hostname, expires: 14});
                            $w.fadeOut(500);
						});

						$w.fadeIn(500);
						
						if (typeof yaCounter25117439 === 'object') {
							yaCounter25117439.reachGoal('lunch-widget-index-show');
							$('.lunch-widget-index a').on('click', function(e) {
								yaCounter25117439.reachGoal('lunch-widget-index-click');
							});
						}
						
						state++;
						$.cookie(statecookiename, state, {domain: toppage.config.hostname, expires: 0.25});
					}
				},
				function() {}, 'json'
			);
		}, 500);
	};
	
	toppage.browsertheme = {};
	toppage.browsertheme.showItem = function(target) {
		//retina display optimization
		if (window.devicePixelRatio > 1) {
			var $bg = target.find('.js-retina-optimize');
			$bg.css('background-image', 'url('+$bg.data('retina')+')');
		}
		
		var $front = $('<div class="js-popup-browser-theme ui-widget-overlay ui-front"></div>');
		var $popup = $(target.parent('.item').find('.js-popup-content').html());
		$popup.find('.js-close-popup').on('click', function(e) {
			toppage.browsertheme.closeItems();
		});
		$popup.find('.js-install-nt-ext').on('click', function(e) {
			e.preventDefault();
			toppage.browsertheme.jsinstallext($popup);
		});
		$front.append($popup);
		$('body').append($front).css('overflow','hidden');
		
		toppage.browsertheme.loadSimilar($popup.data('id'), '.js-popup-browser-theme .similar > .cl');
		
		toppage.browsertheme.viewCountOnServer($popup.data('id'));
		
	};
	toppage.browsertheme.loadSimilar = function (id, before) {
		toppage.ajax('/browser-themes/similar', {id: id},
			function(response) {
				if (response.success && response.content) {
					var $content = $(response.content);
					$content.find('.js-install-nt-ext').on('click', function(e) {
						e.preventDefault();
						toppage.browsertheme.jsinstallext($(this).closest('.item'));
					});
					$content.find('.js-open-theme-popup').on('click', function(e) {
						e.preventDefault();
						toppage.browsertheme.closeItems();
						toppage.browsertheme.showItem($(this));
					});
					$(before).before($content);
				}
			},
			function() {}, 'json'
		);
	};
	toppage.browsertheme.viewCountOnServer = function (id) {
		toppage.ajax('/browser-themes/onView', {id: id},
			function() {},
			function() {}, 'json'
		);
	};
	toppage.browsertheme.closeItems = function () {
		$('.js-popup-browser-theme.ui-widget-overlay').remove();
		$('body').css('overflow','auto');
	};
	toppage.browsertheme.jsinstallext = function(target, theme) {
		theme = theme || target.data('name');
		target.addClass('process');

		if (typeof chrome === 'undefined' || !chrome.webstore || !(typeof chrome.webstore.install == 'function')) {
			document.location = '/user/start/?tour=0&theme=' + theme;
			return;
		}
		if (toppage.browser.isExtension()) {
            toppage.browsertheme.setTheme(theme);
			return;
		}
		chrome.webstore.install(
			//toppage.config.webstorelink.atavibookmarkmanager,
			toppage.config.webstorelink.themeofnewtab,
			function success() {
                toppage.browsertheme.setInstalledCookie();
                toppage.browsertheme.loadStartData(function(data) {
                    toppage.browsertheme.setTheme(theme, data);
				});
                //toppage.browsertheme.setTheme(target.data('name'), {}, '/?new=1');
			},
			function failure() {
				target.removeClass('process');
                $.cookie('theme', 'catalog:'+theme, {
                    expires: new Date().getTime() / 1000 + 60 * 60 * 24 * 30,
                    path: '/',
                    'domain' : toppage.config.domain
                });
                $.cookie('catalog-theme', theme, {
                    expires: new Date().getTime() / 1000 + 60 * 60 * 24 * 30,
                    path: '/',
                    'domain' : toppage.config.domain
                });
			}
		);
	};
	toppage.browsertheme.setInstalledCookie = function(value) {
        $.cookie('a-ext-installed', value || 2, {
            expires: new Date().getTime() / 1000 + 60 * 60 * 24 * 30,
            path: '/',
            'domain' : toppage.config.domain
        });
	};
	toppage.browsertheme.setTheme = function(name, data, redirect) {
		toppage.ajax('/user/start/?tour=0&groups=0&widgets=0&columns=4&theme=' + name, data || {}, function() {
        //toppage.ajax('/user/start/?tour=0&groups=0&widgets=0&columns=4&startgroups=0&theme=' + name, data || {}, function() {
            setTimeout(function() {
            	toppage.browsertheme.openNewTab(function(response) {
                    if (response && response.success) {
                        window.location.reload();
                    } else {
                        window.location = redirect || '/';
                    }
                });
            }, 500);
		}, undefined, undefined, 'post');
	};
	toppage.browsertheme.openNewTab = function(callback) {
        chrome.runtime.sendMessage(toppage.browsertheme.getExtId(), {type: 'openNewTab'}, function(response) {
			callback && callback(response);
        });
	};
	toppage.browsertheme.loadStartData = function(callback, tries, pause) {
		tries = tries || 5;
		pause = pause || 500;
        var data = {},
			repeat,
			count = 0;
        var loader = function() {
        	if (++count > tries) {
                clearInterval(repeat);
                repeat = null;
                callback && callback(data);
                return;
			}
            chrome.runtime.sendMessage(toppage.browsertheme.getExtId(), {type: 'get-top-sites'}, function(response) {
				if (repeat && response && response.success) {
					data.topSites = response.result;
                    clearInterval(repeat);
                    repeat = null;
                    callback && callback(data);
				}
            });
		};
		repeat = setInterval(loader, pause);
		loader();
	};
	toppage.browsertheme.getExtId = function() {
        var parts = toppage.config.webstorelink.themeofnewtab.split('/');
        return parts[parts.length - 1];
	};
})(window, jQuery);

var window_toppage_social_join = function(data) {
	return window.toppage.social.join(data);
};