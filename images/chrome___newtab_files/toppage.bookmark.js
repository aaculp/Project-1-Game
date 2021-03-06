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
	
	toppage.bookmark = function() {};
	
	/**
	 * Перезагрузка одной закладки по индексу
	 * @param {Integer} index
	 * @param {Function} callback
	 * @return {Void}
	 */
	toppage.bookmark.reload = function(index, callback, withLoader) {
		var $bookmark = $('#box-' + index);
		
		if (withLoader) {
			toppage.bookmark.loaderOn($bookmark);
		}
		
		var params = {index: index};
		if (toppage.group.getIsOn()) {
			params.gid = toppage.group.getId();
		}
		
		toppage.ajax('/bookmark/view/', params, function(response) {
			if (response.viewtype && toppage.config.bookmark.view !== response.viewtype) {
				toppage.bookmark.reloadPage(callback);
				return;
			}
			if (response) {
				$bookmark.replaceWith(response.content);
				toppage.bookmark.dragDropInit($('#box-' + index));
				if (typeof callback === 'function') {
					callback();
				}
			}
			
			toppage.bookmark.loaderOff($bookmark);
		}, function(callbackError) {
			if (withLoader) {
				callbackError();
			}
		});
	};
	
	/**
	 * Событие открытия формы создания новой закладки
	 * @return {Boolean}
	 */
	toppage.bookmark.onCreate = function(e) {
		var $sender = $(this);

		var template = $('#bookmark-create-form-tpl').html();
		var url = $sender.attr('href');

		var content = tmpl(template, {
			index: $sender.parents('.item-box').data('index'),
			url: url
		});
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				toppage.bookmark.createFormInit();
			}
		});
		
		if (typeof yaCounter25117439 === 'object') {
			yaCounter25117439.reachGoal('bookmark_create');
		}

		e.preventDefault();
	};

	/**
	 * Инициализации формы создания новой закладки
	 */
	toppage.bookmark.createFormInit = function() {
		var gid = toppage.group.getId();
		if (gid) {
			var $select = $(".js-select-group");
			$("#js-group-home").each(function(i) {
				var $el = $("<option></option>")
					.val($(this).data('id'))
					.html($(this).find(".title").html());
				if (gid==$(this).data('id')) $el.attr("selected", "selected");
				$el.appendTo($select);
			});
			$("#js-group-items .item").each(function(i) {
				var $el = $("<option></option>")
					.val($(this).data('id'))
					.html($(this).html());
				if (gid==$el.val()) $el.attr("selected", "selected");
				$el.appendTo($select);
			});
			$('.js-show-groups-enabled').show();
		}
		jQuery('#bookmark-form').yiiactiveform({'validationDelay':10,'validateOnSubmit':true,'afterValidate':toppage.bookmark.createCallback,'attributes':[{'id':'Bookmark_url','inputID':'Bookmark_url','errorID':'Bookmark_url_em_','model':'Bookmark','name':'url','enableAjaxValidation':true},{'id':'Bookmark_caption','inputID':'Bookmark_caption','errorID':'Bookmark_caption_em_','model':'Bookmark','name':'caption','enableAjaxValidation':true},{'id':'Bookmark_group_id','inputID':'Bookmark_group_id','errorID':'Bookmark_group_id_em_','model':'Bookmark','name':'group_id','enableAjaxValidation':true},{'id':'Bookmark_newgrouptitle','inputID':'Bookmark_newgrouptitle','errorID':'Bookmark_newgrouptitle_em_','model':'Bookmark','name':'newgrouptitle','enableAjaxValidation':true}],'focus':'#Bookmark_url'});
		toppage.group.fieldCreateInit($('#bookmark-form'));
	};

	/**
	 * Создание новой закладки без индекса
	 */
	toppage.bookmark.onAdd = function(e) {
		e.preventDefault();
		toppage.bookmark.findFirstEmpty().click();
	};
	toppage.init.events.push(function() {
		$('.js-bookmark-add').on('click', toppage.bookmark.onAdd);
	});

	/**
	 * Найти первое свободное место
	 * @return {Object}
	 */
	toppage.bookmark.findFirstEmpty = function () {
		var object = null;
		$('#bookmarks .page .item').each(function() {
			if ($(this).data('id') == '0') {
				object = $(this).find('a.js-bookmark-create');
				return false;
			}
		});
		return object; 
	};

	/**
	 * Обратный вызов при сохранении новой закладки
	 * @param {Object} $form
	 * @param {Object} data
	 * @param {boolean} hasError
	 * @return {Boolean}
	 */
	toppage.bookmark.createCallback = function ($form, data, hasError) {
		if (hasError) {
			return false;
		}
		
		$form.parents('.ui-dialog-content').dialog('close');
		var index = $form.data('index');
		
		toppage.bookmark.loaderOn(index);
		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				toppage.bookmark.loaderOff(index);
				if (response.success) {
					if (!toppage.config.userid) {
						location.reload(true);
					} else {
						toppage.bookmark.reload(index, function() {
							toppage.bookmark.checkLast();
						}, true);
					}
				}
			}
		});
	};
	
	/**
	 * Событие открытия формы копирования закладки в новую
	 * @return {Boolean}
	 */
	toppage.bookmark.onCopy = function(e) {
		var $sender = $(this);
		var params = {
			index: $sender.parents('.item-box').data('index'),
			indexreset: 1,
			pageid: toppage.config.pageid,
			callback: 'toppage.bookmark.copyCallback'
		};
		var url = $sender.data('path') ? $sender.data('path') : $sender.attr('href');
		toppage.popup.create({
			title: $sender.data('title'),
			url: {
				path: url, 
				params: params
			}
		});
		e.preventDefault();
	};
	/**
	 * Обратный вызов при копировании новой закладки
	 * @param {Object} $form
	 * @param {Object} data
	 * @param {boolean} hasError
	 * @return {Boolean}
	 */
	toppage.bookmark.copyCallback = function ($form, data, hasError) {
		if (hasError) {
			return false;
		}
		
		$form.parents('.ui-dialog-content').dialog('close');
		var index = $form.data('index');
		
		toppage.bookmark.loaderOn(index);
		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				toppage.bookmark.loaderOff(index);
				if (response.success) {
					if (!toppage.config.userid) {
						location.reload(true);
					}
				}
			}
		});
	};
	
	
	/**
	 * Событие открытия формы редактирования закладки
	 * @return {Boolean}
	 */
	toppage.bookmark.onEdit = function(e) {
		var $sender = $(this);
		
		var params = {pageid: toppage.config.pageid};
		var gid = $('.search-result').length ? $sender.closest('.item').data('group-id') : toppage.group.getId();
		if (gid) {
			params.gid = gid;
		}
		toppage.popup.create({
			title: $sender.data('title'),
			url: {
				path: $sender.attr('href'),
				params: params
			}
		});
		
		if (typeof yaCounter25117439 === 'object') {
			yaCounter25117439.reachGoal('bookmark_edit');
		}

		e.preventDefault();
	};
	
	/**
	 * Обратный вызов при сохранении закладки
	 * @param {Object} $form
	 * @param {Object} data
	 * @param {boolean} hasError
	 * @return {Boolean}
	 */
	toppage.bookmark.editCallback = function ($form, data, hasError) {
		if (hasError) {
			return false;
		}
		
		$form.parents('.ui-dialog-content').dialog('close');
		var index = $form.data('index');
		var id = $form.data('id');
		var element = $('#bookmarks .item[data-id='+id+']').closest('.item-box');
		
		toppage.bookmark.loaderOn($('.search-result').length ? element : index);

		$form.ajaxSubmit({
			url: $form.attr('action'),
			success: function(response) {
				if ($('.search-result').length) {
					toppage.search.reload();
					return;
				}

				toppage.bookmark.loaderOff(index);
				if (response.success) {
					toppage.bookmark.reload(index, function() {
						toppage.bookmark.checkLast();
					}, true);
				}
			}
		});
	};
	
	/**
	 * Инициализация событий Drag&Drop
	 * @return {Void}
	 */
	toppage.bookmark.dragDropInit = function (boxes, droppable) {
		var $boxes = (typeof boxes === 'string') ? $(boxes) : boxes;
		
		$boxes.find('.dd-source').draggable({
			/*containment: 'window',*/
			opacity: 0.5,
			helper: 'clone',
			cursor: 'move',
			zIndex: 9000,
			cancel: 'a.title, a.delete, a.edit',
			scope: 'bookmark',
			delay: 150
		});

		if (droppable === false)	
			return;

		var move = function() {
			var $target = $boxes.find('.drop-hover');
			var $targetBox = $target.closest('.item-box'),
                $targetItem = $targetBox.find('.item').first();

            $boxes.find('.move-left').removeClass('move-left');
            $boxes.find('.move-right').removeClass('move-right');
            if (!$target.length)
                return;
            if ($target.hasClass('dd-left')) {
                $targetItem.addClass('move-right');
                $targetBox.prev().find('.item').first().addClass('move-left');
            } else {
                $targetItem.addClass('move-left');
                $targetBox.next().find('.item').first().addClass('move-right');
            }
		};

        $boxes.find('.dd-left, .dd-right').droppable({
            accept: '#bookmarks .item',
            hoverClass: 'drop-hover',
            tolerance: 'pointer',
            scope: 'bookmark',
			drop: function(event, ui) {
				toppage.bookmark.moveAfter(ui.draggable, this);
                move();
            },
			over: function(event, ui) {
				move();
            },
			out: function(event, ui) {
				move();
			}
        });
        $boxes.find('.dd-target').droppable({
            accept: '#bookmarks .item',
            hoverClass: 'drop-hover',
            tolerance: 'pointer',
            scope: 'bookmark',
            drop: function(event, ui) {
                move();
                toppage.bookmark.move(ui.draggable, this);
            }
        });
	};
	
	/**
	 * Перемещение закладки
	 * @return {Boolean}
	 */
	toppage.bookmark.move = function(source, target) {
		
		if (toppage.config.bookmark.moveoff) {
			return;
		}

		var sourceBox = $(source).closest('.item-box');
		var targetBox = $(target).closest('.item-box');
		
		toppage.bookmark.loaderOn(sourceBox);
		toppage.bookmark.loaderOn(targetBox);
		
		// Отправляем данные на сервер, если произошло реальное изменение
		var params = {from: sourceBox.data('index'), to: targetBox.data('index'), pageid: toppage.config.pageid};
		if (toppage.group.getIsOn()) {
			params.gid = toppage.group.getId();
		}
		toppage.ajax('/bookmark/move/', params, function(response) {
			if (response) {
				toppage.bookmark.moveCallback(source, target, function() {
					toppage.bookmark.checkLast();
				});
			}
		}, function (errorCallback) {
			toppage.bookmark.loaderOff(sourceBox);
			toppage.bookmark.loaderOff(targetBox);
			errorCallback();
		});
	};

    toppage.bookmark.moveAfter = function(source, target) {

        if (toppage.config.bookmark.moveoff) {
            return;
        }

        var sourceBox = $(source).closest('.item-box');
        var targetBox = $(target).closest('.item-box');
        var targetIndex = targetBox.data('index');
        if ($(target).hasClass('dd-right')) {
			targetIndex++;
        }
        toppage.bookmark.dragDropOff();

		if (sourceBox.data('index') < targetIndex) {
			toppage.bookmark.loaderOn(targetIndex - 1);
		} else {
			toppage.bookmark.loaderOn(targetIndex);
		}

        // Отправляем данные на сервер, если произошло реальное изменение
        var params = {from: sourceBox.data('index'), to: targetIndex - 1, pageid: toppage.config.pageid};
        if (toppage.group.getIsOn()) {
            params.gid = toppage.group.getId();
        }
        toppage.ajax('/bookmark/moveAfter/', params, function(response) {
            if (response) {
                toppage.bookmark.reloadPage();
            }
        }, function (errorCallback) {
            toppage.bookmark.dragDropOn();
            errorCallback();
        });
    };
	
	toppage.bookmark.moveCallback = function(source, target, callback) {
        var sourceItem = $(source);
		var sourceBox = sourceItem.closest('.item-box');
		var sourceParent = sourceItem.parent();

        var targetItem = $(target);
		var targetBox = targetItem.closest('.item-box');
		var targetParent = targetItem.parent();
		
		// Меняем теперь их местами
        sourceParent.append(targetItem.detach());
        targetParent.append(sourceItem.detach());

		sourceBox.find("a.js-bookmark-create").each(function() {
			var params = { "index": sourceBox.data("index") };
			var gid = toppage.group.getId();
			if (gid) params.gid = gid;
			$(this).attr("href", $(this).data("path") + "?" + jQuery.param(params));
		});

		toppage.bookmark.loaderOff(sourceBox);
		toppage.bookmark.loaderOff(targetBox);
		
		if (typeof callback === 'function') {
			callback();
		}
	};
	
	/**
	 * Перемещение закладки
	 * @return {Boolean}
	 */
	toppage.bookmark.groupUpdate = function(source, groupId) {

		var $box = $(source).closest('.item-box');
		var $item = $(source);
		
		toppage.bookmark.loaderOn($box);
		
		// Отправляем данные на сервер, если произошло реальное изменение
		var params = {id: $item.data('id'), groupid: groupId, pageid: toppage.config.pageid};
		
		toppage.queue.push('bookmark', function() {
			toppage.ajax('/bookmark/group/', params, function(response) {
				if (response) {
					if ($('.search-result').length) {
						toppage.search.reload();
						toppage.queue.next('bookmark');
						return;
					}
					toppage.bookmark.reload($box.data('index'), function() {
						toppage.bookmark.loaderOff($box);
						toppage.bookmark.checkLast();
					});
					toppage.queue.next('bookmark');
				}
			});
		});
	};
	
	/**
	 * Удаление закладки
	 * @return {Boolean}
	 */
	toppage.bookmark.onDelete = function(e) {
		var $sender = $(this);
		
		var template = $('#bookmark-delete-message-tpl').html();
		var index = $sender.parents('.item-box').data('index');
		var content = tmpl(template, {bookmark: {
			title: $sender.parents('.item').find('.js-bookmark-link:last').attr('title')
		}});
		
		toppage.popup.create({
			title: $sender.data('title'),
			content: content,
			load: function(target) {
				var $target = $(target);
				$target.find('input[type=submit]').focus().on('click', function(e) {
					$target.addClass('process');
					toppage.ajax(
						$sender.attr('href'), {pageid: toppage.config.pageid}, 
						function (response) {
							if (response) {
								$target.dialog('close');
								if ($('.search-result').length) {
									toppage.search.reload();
									return;
								}
								toppage.bookmark.reload(index, function(){
									toppage.bookmark.checkLast();
								}, true);
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
		
		e.preventDefault();
	};

	/**
	 * Обновление скриншота по запросу
	 * @return {Boolean}
	 */
	toppage.bookmark.onScreenshotUpdate = function(e) {
		var $sender = $(this);
		if ($sender.attr("disabled") == undefined) {
			toppage.ajax(
				$sender.attr('href'), {pageid: toppage.config.pageid}, 
				function (response) {
				},
				function (errorCallback) {
					errorCallback();
				}
			);
			$sender.attr("disabled", "disabled");
		}
		e.preventDefault();
	};		

	/**
	 * Показать лоадер для закладки
	 * @return {Void}
	 */
	toppage.bookmark.loaderOn = function($sender) {
		if (!isNaN($sender)) {
			$sender = $('#box-' + $sender);
		}
		$sender.addClass('process');
		
		$sender.find('.ui-draggable').not('.ui-draggable-dragging').draggable('disable');
		$sender.find('.ui-droppable').not('.ui-draggable-dragging').droppable('disable');
	};
	
	/**
	 * Скрыть лоадер для закладки
	 * @return {Void}
	 */
	toppage.bookmark.loaderOff = function($sender) {
		if (!isNaN($sender)) {
			$sender = $('#box-' + $sender);
		}
		$sender.removeClass('process');
		
		$sender.find('.ui-draggable').draggable('enable');
		$sender.find('.ui-droppable').droppable('enable');
	};

	toppage.bookmark.dragDropOn = function() {
        $('#bookmarks .ui-draggable').draggable('enable');
        $('#bookmarks .ui-droppable').droppable('enable');
	};

    toppage.bookmark.dragDropOff = function() {
        $('#bookmarks .ui-draggable').not('.ui-draggable-dragging').draggable('disable');
        $('#bookmarks .ui-droppable').not('.ui-draggable-dragging').droppable('disable');
    };

	/**
	 * Обработка клика по закладке
	 * @return {Boolean}
	 */
	toppage.bookmark.onClick = function(e) {
		var $linkReferal = $(this).closest(".item").find("form.js-referal-link");
		if ($linkReferal.length) {
			e.preventDefault();
            $linkReferal.submit();
			if ($linkReferal.attr('target') !== '_blank') {
                $('body').css('background-color', '#fff').hide();
			}
		}
		return true;
	};

	/**
	 * Обработка клика по закладке из попапа
	 * @return {Boolean}
	 */
	toppage.bookmark.onPopupClick = function(e) {
		var $linkReferal = $(this).closest("li").find("form.js-referal-link");
		if ($linkReferal.length) {
			e.preventDefault();
			$linkReferal.submit();
		}
		return true;
	};

	toppage.bookmark.createNew = function(num, container) {
		var $c = $(container);
		var count = $c.children('.item-box').length;
		var template = $('#bookmark-new-tpl').html();
		
		for (var i = 1; i <= num; i++) {
			var html = tmpl(template, {bookmark: {index: count + i}});
			var $o = $(html);
			$c.children('.item-box').last().after($o);
			toppage.bookmark.dragDropInit($o);
		}
		
	};
	
	/**
	 * Проверить последнюю закладку, если не пустая, то создать пустую
	 * @returns {Void}
	 */
	toppage.bookmark.checkLast = function() {
		var $items = $('#bookmarks .item-box');
		var amount = $items.length;
		var $item = $($items.get(amount-1));		
		if ($item.find('.bookmark-new').length) {
			for (var i = amount; i > 1; i--) {
				if ($item.length) {
					var $previtem = $item.prev();
					if ($previtem.find('.bookmark-new').length) {
						$item.remove();
						$item = $previtem;
					} else {
						break;
					}
				}
			}
		} else {
			toppage.bookmark.createNew(1, '#bookmarks .page');
		}
		toppage.bookmark.reloadEmptyManager();
	};

	/**
	 * Скрыть кнопку оптимизации на последней пустой закладке,
	 * показать на остальных
	 * @returns {Void}
	 */
	toppage.bookmark.reloadEmptyManager = function() {
		$('#bookmarks .item-box:not(:last) .bookmark-new .manager .js-bookmark-optimize').show();
		$('#bookmarks .item-box:last .bookmark-new .manager .js-bookmark-optimize').hide();
	};
	toppage.init.events.push(function() {
		toppage.bookmark.reloadEmptyManager();
	});

	/**
	 * 
	 * @returns {Void}
	 */
	toppage.bookmark.reloadPage = function(callback, before, groupId) {
		if (before && !before())
			return;
		var $page = $('#bookmarks .page');
		
		var params = {};
		if (toppage.group.getIsOn()) {
			params.gid = groupId || toppage.group.getId();
		}
		
		toppage.ajax('/', params, function(response) {
			if (response) {
				$('#background-gray').removeClass('showed');
				$('body').removeClass('searching');
				$page.replaceWith(response.content);
				toppage.group.checkPageHeight();
				if (response.viewtype) {
					toppage.config.bookmark.view = response.viewtype;
				}

				if (typeof callback === 'function') {
					callback(response);
				}

				toppage.bookmark.reloadEmptyManager();
				toppage.newtabToParent();
			}
		}, function () {
			window.location.reload();
		});
	};
	
	toppage.bookmark.onOptimize = function(e) {
		var params = {};
		params.gid = toppage.group.getIsOn() ? toppage.group.getId() : 0;
		
		$('#bookmarks .page .item:not(:last)').each(function() {
			if ($(this).data('id') == '0') {
				toppage.bookmark.loaderOn($(this).closest('.item-box').data('index'));
			}
		});
		if (typeof yaCounter25117439 === "object") {
			yaCounter25117439.reachGoal('remove_empty_bookmarks');
		}
		toppage.ajax('/bookmark/optimize/', params, function(response) {
			if (response.reload) {
				toppage.bookmark.reloadPage();
			}
		});
		e.preventDefault();
	};
	
	toppage.bookmark.processClick = function(el, funcid) {
		$(el).on('click.request', function(e) {
			toppage.ajax('/click/request', {bid: funcid(this)}, function() {});
		});
	};

    toppage.bookmark.onHideBookmarks = function(e) {
        e.preventDefault();

        if ($('body').hasClass('bookmarks-off')) {
            $.cookie('bookmarks-off', '0', {domain: toppage.config.hostname, expires: -1});
        } else {
            $.cookie('bookmarks-off', '1', {domain: toppage.config.hostname, expires: 5000});
		}
        $('body').toggleClass('bookmarks-off');
    };
    toppage.init.events.push(function() {
        $('.js-hide-bookmarks').on('click', toppage.bookmark.onHideBookmarks);
    });


})(window, jQuery);