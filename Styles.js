Console.styles = (function () {
	var existingSpanRegExp = /^<span style="([^"]+)">.+<\/span>$/,
		spanOpenRegExp = /^<span style="([^"]+)">/,
		spanOpenOrCloseRegExp = /<span style="[^"]+">|<\/span>/g,
		styles = {},
		attached = false;

	function attach () {
		attached = true;
	}

	function register () {
		if (typeof arguments[0] === 'object') {
			var styles = arguments[0];

			for (var name in styles) {
				if (!styles.hasOwnProperty(name)) return;
				registerStyle(name, styles[name]);
			}
		} else {
			registerStyle(arguments[0], arguments[1]);
		}
	}

	function registerStyle (name, style) {
		styles[name] = style;

		if (attached) {
			function getter () {
				return format(this.toString(), name);
			}

			if (Object.defineProperty && Console.support.functionGetters) {
				Object.defineProperty(String.prototype, name, {get: getter});
			} else if (String.prototype.__defineGetter__) {
				String.prototype.__defineGetter__(name, getter);
			} else {
				String.prototype[name] = '<STYLES:UNSUPPORTED>';
			}
		}
	}

	function format (string, names) {
		if (Console.support.consoleStyles) {
			names.split(',').forEach(function (name) {
				var style = styles[name];

				if (existingSpanRegExp.test(string)) {
					string = string.replace(existingSpanRegExp, function (match, styles) {
						if (!styles.match(style)) {
							return match.replace(spanOpenRegExp, '<span style="' + styles + style + ';">');
						} else {
							return match;
						}
					});
				} else {
					string = '<span style="' + style + ';">' + string + '</span>';
				}
			});
		}

		return string;
	}

	function stringToFormatArray (string) {
		var colors = [];

		string = string.replace(spanOpenOrCloseRegExp, function (tag) {
			var styleMatch = tag.match(spanOpenRegExp);

			if (styleMatch) {
				colors.push(styleMatch[1]);
			} else {
				colors.push('');
			}

			return '%c';
		});

		return [string].concat(colors);
	}

	function argumentsToConsoleArguments (args) {
		var params = [];

		args.forEach(function (arg) {
			if (typeof arg === 'string') {
				params = params.concat(stringToFormatArray(arg));
			} else {
				params.push(arg);
			}
		});

		return params;
	}

	return {
		attach: attach,
		format: format,
		register: register,
		argumentsToConsoleArguments: argumentsToConsoleArguments
	};
})();