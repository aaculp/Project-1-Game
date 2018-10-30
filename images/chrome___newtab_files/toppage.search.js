/**
 * TopPage javascript bookmark
 */

/**
 * @param {Object} window
 * @param {Object} $
 * @return {Void}
 */
(function(window, $) {
	'use strict';
	
	toppage.searchEngine = function() {};
	
	toppage.searchEngine.searchCache = {};
	toppage.searchEngine.currentResponse = null;
	
	toppage.searchEngine.input = null;
	
	/**
	 * @param {String} selector
	 * @param {String} url
	 * @returns {Void}
	 */
	toppage.searchEngine.initAutocomplite = function(selector, url, initStat) {
		initStat = typeof initStat === 'undefined' ? true : initStat;
		toppage.searchEngine.input = $(selector);
		var $block = toppage.searchEngine.input;
		
		$block.autocomplete({
			minLength: 1,
  			delay: 100,
  			source: function(request, response) {
				if (request.term in toppage.searchEngine.searchCache) {
					response(toppage.searchEngine.searchCache[request.term]);
					return;
				}
				
				toppage.searchEngine.currentResponse = response;
				setTimeout(function() {
					var script = document.createElement('script');
					script.src = url + encodeURIComponent(request.term);
					script.type = 'text/javascript';
					document.body.appendChild(script);
				}, 10);
  			},
			open: function() {
				var width = $block.width() + 30;
				$(this).autocomplete('widget').css({
					left: '0px',
					top: '0px',
					position: 'relative',
					'z-index': 5001
				}).css({width: width, top: 9, left: -10}).appendTo($block.parent());
			},
			select: function(event, ui) {
				var sender = this;
				if (ui.item.submit) {
					setTimeout(
						function() { $(sender).parents('form').trigger('submit'); },
						100
					);
				}
			}
		}).click(function(e) {
			$(this).autocomplete('search');
		});
		
		$block.data('ui-autocomplete')._renderItem = function(ul, item) {
			return $('<li>')
				.data('item.autocomplete', item)
				.append($('<a>').attr(item.linkAttr).html(item.label))
				.appendTo(ul);
		};
		
		initStat && toppage.searchEngine.input.parents('form').on('submit', toppage.searchEngine.initStat);

	};
	
	toppage.searchEngine.yandexBackend = {
		apply: function(res) {  
			var tok = res[0];
			var list = res[1];
			
			var values = $.map(list, function(item) {
				var val = item + '', value = '', submit = true, linkAttr = {};
				if (typeof val !== 'undefined') {
					if (val.indexOf('nav,') === 0) {
						val = '<span class="nav_link_domain">' + item[2] + '</span> &mdash; ' + item[1];
						value = tok;
						submit = false;
						linkAttr = {
							href: 'http://' + item[2],
							target: '_blank'
						};
					}
					else if (val.indexOf('fact') !== -1) {
						val = '<b>' + item[1].slice(0, tok.length) + '</b>' + item[1].slice(tok.length);
						if (item[2]) {
							val += ' &ndash; '+item[2];
						}
						value = item[1];
					}
					else {
						value = val;
						val = '<b>' + val.slice(0, tok.length) + '</b>' + val.slice(tok.length);
					}
				}
				return {
					id: item,
					label: val,
					value: value,
					submit: submit,
					linkAttr: linkAttr
				};
			});
			
			if (values.length) {
				toppage.searchEngine.searchCache[tok] = values;
			} else {
				toppage.searchEngine.input.autocomplete('close');
			}
			
			if (toppage.searchEngine.currentResponse !== null) {
				toppage.searchEngine.currentResponse(toppage.searchEngine.searchCache[tok]);
			}
		}
	};
	
	toppage.searchEngine.googleBackend = {
		apply: function(res) {
			var tok = res[0];
			var list = res[1].slice(0,10);
			var label = res[2].slice(0,10);
			var values = $.map(list, function(item, i) {
				var val = '', value = '', submit = true, linkAttr = {};
				if (label[i]) { 
					val = '<span class="nav_link_domain">' + label[i] + '</span>';
					value = tok;
					submit = false;
					linkAttr = {
						href: item,
						target: '_blank'
					};
				} else {
					value = item;
					val = '<b>' + item.slice(0, tok.length) + '</b>' + item.slice(tok.length);
				}
				
				return {
					id: item,
					label: val,
					value: value,
					submit: submit,
					linkAttr: linkAttr
				};
			});
			
			if (values.length) {
				toppage.searchEngine.searchCache[tok] = values;
			} else {
				toppage.searchEngine.input.autocomplete('close');
			}
			
			if (toppage.searchEngine.currentResponse !== null) {
				toppage.searchEngine.currentResponse(toppage.searchEngine.searchCache[tok]);
			}
		}
	};
	
	toppage.searchEngine.initStat = function (e) 
	{
		if (toppage.config.userid > 0) {
			e.preventDefault();
			toppage.searchEngine.sendStat(e, function() {
				e.target.submit();
			});
		}
	};
	toppage.searchEngine.sendStat = function(e, callback)
	{
        toppage.ajax('/search/stat', {userid: toppage.config.userid, type: $(e.target).data('type'), s: $(e.target).find('input[type=text]').val()},
            function(response) {
                callback();
            },
            function() {
                callback();
            }, 'json'
        );
	};

	toppage.searchEngine.getExtension = function(eid, callback) {
		if (window.chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage(eid, {
                type: 'info'
            }, function(result) {
            	if (result && result.success && result.info) {
            		return callback && callback(result.info);
				}
				callback && callback(null);
			});
		} else {
            callback && callback(null);
        }
	};

})(window, jQuery);

var google = {
	ac: {
		h: function(list) {
			var $ = jQuery;
			var googleAuc = $("#searchForm .searchKey:visible");
			var tok = googleAuc.val();
			var values = $.map( list[1], function(item) {
				var val = item[0] + '';
				if (val!='undefined') {
					val = '<b>'+val.slice(0, tok.length)+'</b>'+val.slice(tok.length);
				}
				return {
					id: item[0],
					label: val,
					value: item[0],
					submit: true,
					linkAttr: {}
				}
			});
			if (values.length) {
				googleCache[tok] = values;
			}
			else {
				googleAuc.autocomplete("close")
			}
			if (currentResponse !== null) {
				currentResponse(googleCache[tok]);
			}
		}
	}
};