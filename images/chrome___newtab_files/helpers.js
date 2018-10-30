// дополнительные хелперы

/**
 * Образование множественного числа
 * @param array
 * @param boolean
 */
String.prototype.pluralize = function(aEndings, prepend) {
	if (prepend == null) {
		prepend = true;
	}
	var result, i = n = parseInt(this, 10);
	if (n < 0) {n = -1 * n}

	n = n % 100;
	if (n >= 11 && n <= 19) {
		result = aEndings[2];
	} else {
		n = n % 10;
		if (n == 1) {
			result = aEndings[0];
		} else if (n > 1 && n < 5) {
			result = aEndings[1];
		} else {
			result = aEndings[2];
		}
	}
	if (prepend && result.indexOf('%d') == -1) {
		result = '%d '+ result;
	}
	return result.replace('%d', i);
}
Number.prototype.pluralize = String.prototype.pluralize;

/**
 * From: http://phpjs.org/functions
 * example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
 * returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
 * example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
 * returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
 * 
 * @param {String} values
 * @param {String} numeric_prefix
 * @param {String} arg_separator
 * @return {String}
 */
function http_build_query(values, numeric_prefix, arg_separator) {
	var value, key, tmp = [],
			that = this;

	var _http_build_query_helper = function(key, val, arg_separator) {
		var k, tmp = [];
		if (val === true) {
			val = "1";
		} else if (val === false) {
			val = "0";
		}
		if (val != null) {
			if (typeof val === "object") {
				for (k in val) {
					if (val[k] != null) {
						tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
					}
				}
				return tmp.join(arg_separator);
			} else if (typeof val !== "function") {
				return that.encodeURI(key) + "=" + that.encodeURI(val);
			} else {
				throw new Error('There was an error processing for http_build_query().');
			}
		} else {
			return '';
		}
	};

	if (!arg_separator) {
		arg_separator = "&";
	}
	for (key in values) {
		value = values[key];
		if (numeric_prefix && !isNaN(key)) {
			key = String(numeric_prefix) + key;
		}
		var query = _http_build_query_helper(key, value, arg_separator);
		if (query !== '') {
			tmp.push(query);
		}
	}

	return tmp.join(arg_separator);
};

/**
 * From: http://phpjs.org/functions
 * 
 * @param {String} str
 * @param {Array} array
 * @returns {Void}
 */
function parse_str(str, array) {
	
	var strArr = String(str).replace(/^&/, '').replace(/&$/, '').split('&'),
			sal = strArr.length,
			i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
			postLeftBracketPos, keys, keysLen,
			fixStr = function(str) {
				return decodeURIComponent(str.replace(/\+/g, '%20'));
			};

	if (!array) {
		array = this.window;
	}

	for (i = 0; i < sal; i++) {
		tmp = strArr[i].split('=');
		key = fixStr(tmp[0]);
		value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

		while (key.charAt(0) === ' ') {
			key = key.slice(1);
		}
		if (key.indexOf('\x00') > -1) {
			key = key.slice(0, key.indexOf('\x00'));
		}
		if (key && key.charAt(0) !== '[') {
			keys = [];
			postLeftBracketPos = 0;
			for (j = 0; j < key.length; j++) {
				if (key.charAt(j) === '[' && !postLeftBracketPos) {
					postLeftBracketPos = j + 1;
				}
				else if (key.charAt(j) === ']') {
					if (postLeftBracketPos) {
						if (!keys.length) {
							keys.push(key.slice(0, postLeftBracketPos - 1));
						}
						keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
						postLeftBracketPos = 0;
						if (key.charAt(j + 1) !== '[') {
							break;
						}
					}
				}
			}
			if (!keys.length) {
				keys = [key];
			}
			for (j = 0; j < keys[0].length; j++) {
				chr = keys[0].charAt(j);
				if (chr === ' ' || chr === '.' || chr === '[') {
					keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
				}
				if (chr === '[') {
					break;
				}
			}

			obj = array;
			for (j = 0, keysLen = keys.length; j < keysLen; j++) {
				key = keys[j].replace(/^['"]/, '').replace(/['"]$/, '');
				lastIter = j !== keys.length - 1;
				lastObj = obj;
				if ((key !== '' && key !== ' ') || j === 0) {
					if (obj[key] === undef) {
						obj[key] = {};
					}
					obj = obj[key];
				}
				else { // To insert new dimension
					ct = -1;
					for (p in obj) {
						if (obj.hasOwnProperty(p)) {
							if (+p > ct && p.match(/^\d+$/g)) {
								ct = +p;
							}
						}
					}
					key = ct + 1;
				}
			}
			lastObj[key] = value;
		}
	}
};