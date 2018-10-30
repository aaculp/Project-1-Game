/**
 * Atavi javascript selector
 */

/**
 * @param {Object} window
 * @param {Object} $
 * @return {Void}
 */
(function(window, $) {
	'use strict';
	
	toppage.selector = function() {};
	
	/**
	 * @param {String} selector
	 * @param {String} url
	 * @returns {Void}
	 */
	toppage.selector.show = function(sender, params, callbackApply, callbackError, callbackInit) {
		
		var $sender = $(sender);
		var $popup = $('#selector-' + $sender.attr('id')).addClass('load');
		
		$('#js-selector-list .js-folderbox-item, #js-selector-list .bookmark-item').remove();
		$('#js-folder-list .js-folder-item').remove();
		$('#js-selector-bookmark-count').html(0);
		
		$popup.dialog({
			modal: true,
			width: '80%',
			maxWidth: 1024,
			title: $sender.data('title')
		});
		
		$('.selector-submit input').off('click').on('click', function() {
			$popup.addClass('load');
			callbackApply($('.bookmark-item input:checked'), function(){
				$popup.dialog('close');
			}, function() {
				$popup.removeClass('load');
			});
		});
		
		$('#js-selector-checkbox-all').off('change').on('change', function() {
			var $items = $('#js-selector-list input[type=checkbox]:visible');
			if ($(this).is(':checked')) {
				$items.prop('checked', true);
			} else {
				$items.removeAttr('checked');
			}
			toppage.selector.updateCountBookmark();
		});
				
		params.id = $sender.attr('id');
		$.get('/bookmark/selector', params, function(data) {
			if (data.success && data.success === true) {
				if (data.groups) {
					var groups = data.groups.sort(function(obj1, obj2) {
						if (obj1.order < obj2.order) return -1;
						if (obj1.order > obj2.order) return 1;
						return 0;
					});
					for (var k in groups) {
						toppage.selector.createFolder(groups[k]);
					}
					$('.folder-list').nanoScroller();
					$('#js-folder-list .folder-item').off('click').on('click', toppage.selector.onClickFolder);
				}
				if (data.items) {
					var items = data.items.sort(function(obj1, obj2) {
						if (obj1.order < obj2.order) return -1;
						if (obj1.order > obj2.order) return 1;
						return 0;
					});
					for (var k in items) {
						toppage.selector.createBookmark(items[k]);
					}
					$('.bookmark-item input').on('change', function() {
						toppage.selector.updateCountBookmark();
					});
				}
				$popup.removeClass('load');
				toppage.selector.switchFolder($('#js-folder-1'));
				
			} else {
				if (typeof callbackError === 'function') {
					callbackError();
				}
				$popup.dialog('close');
			}
		}, 'json');
		
		if (typeof callbackInit === 'function') {
			callbackInit();
		}
		
	};
	
	toppage.selector.updateCountBookmark = function() {
		var count = $('.bookmark-item input:checked').length;
		$('#js-selector-bookmark-count').html(count);
	}

	toppage.selector.createBookmark = function(node) {
		
		if (node.group_id) {
			var $folderBox = $('#js-folderbox-'+node.group_id);
			if ($folderBox.length === 0) {
				return;
			}
		} else {
			var $folderBox = $('#js-folderbox');
		}
		
		var $check = $('<input type="checkbox">').attr('id', 'js-selector-bookmark-' + node.id).data('id', node.id).val(node.url).
				attr('title', node.caption);
		var $link = $('<a>').attr('href', node.url).attr('target', '_blank').html(node.url);
		
		var caption = node.caption.substr(0,70);
		var $label = $('<label>').attr('for', 'js-selector-bookmark-' + node.id).append($check);
		if (node.favicon) {
			$label.append($('<img class="favicon">').attr('src', node.favicon));
		}
		$label.append(caption + (node.caption === caption ? '':'... ')).append($link);
	   
		var $item = $('<div class="bookmark-item">').append($label);
		$folderBox.append($item);
	};
	
	toppage.selector.createFolder = function(folder) {
		var $folderBox = $('<div>').attr('id', 'js-folderbox-'+folder.id).addClass('folderbox js-folderbox-item');
		$('#js-selector-list').append($folderBox);
		
		var $folderItem = $('<div>').attr('id', 'js-folder-'+folder.id)
			.addClass('folder-item js-folder-item')
			.attr('data-id', folder.id)
			.html(folder.title.substr(0,30))
			.on('click', function() { });
	
		if (folder.protected == 1) {
			var $protected = $('<i>').addClass('protected');
			if (folder.protectedActive == 0) {
				$protected.addClass('unprotected');
			}
			$folderItem.prepend($protected);
		}
	
	
		$('#js-folder-list').append($folderItem);
		return $folderBox;
	};
	
	toppage.selector.onClickFolder = function() {
		toppage.selector.switchFolder($(this));
	};
	
	toppage.selector.switchFolder = function($item) {
		var $folderBox = $('#js-folderbox-' + $item.attr('data-id'));
		if ($folderBox.length > 0) {
			$('#js-selector-list .folderbox').hide();
			$folderBox.show();
		} else {
			$('#js-selector-list .folderbox').show();
		}
		$('.selector-box .folder-list .folder-item').removeClass('active');
		$item.addClass('active');
		
		var $checked = $('#js-selector-list input[type=checkbox]:visible');
		var ischeck = true;
		$.each($checked, function(c, el) {
			if (!$(el).is(':checked')) {
				ischeck = false;
			}
		});
		if (ischeck) {
			$('#js-selector-checkbox-all').prop('checked', true);
		} else {
			$('#js-selector-checkbox-all').removeAttr('checked');
		}
	};
	
})(window, jQuery);