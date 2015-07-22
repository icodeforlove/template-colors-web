Console.styles = (function () {
	var existingSpanRegExp = /^<span style="([^"]+)">.+<\/span>$/,
		spanOpenRegExp = /^<span style="([^"]+)">/,
		spanOpenOrCloseRegExp = /<span style="[^"]+">|<\/span>/g,
		jsonPartsRegExp = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
		prettyJsonKey = 'json',
		styles = {},
		defaultStyles = {
			red: 'color: red',
			blue: 'color: blue',
			green: 'color: green',
			darkorange: 'color: darkorange',
			magenta: 'color: magenta'
		},
		jsonStyle = {
			'string': 'green',
			'number': 'darkorange',
			'boolean': 'blue',
			'null': 'magenta',
			'key': 'red'
		},
		attached = false;

	function attach () {
		attached = true;
	}

	function register () {
		if (typeof arguments[0] === 'object') {
			var styles = defaultStyles;

			for (var userStyle in arguments[0]) {
				if (!arguments[0].hasOwnProperty(userStyle)) return;
				styles[userStyle] = arguments[0][userStyle];
			}

			if (Object.keys(arguments[0]).indexOf(prettyJsonKey) != -1) {
				throw new Error('Style "' + prettyJsonKey + '" is not permitted.');
			} else {
				registerStyle(prettyJsonKey);
			}

			for (var name in styles) {
				if (!styles.hasOwnProperty(name)) return;
				registerStyle(name, styles[name]);
			}
		} else {
			registerStyle(arguments[0], arguments[1]);
		}
	}

	function registerStyle (name, style) {
		var getter;

		// avoid redefining getter
		if (styles.hasOwnProperty(name)) return;
		styles[name] = style;

		var defaultGetter = function () {
			return format(this.toString(), name);
		};

		var jsonGetter = function () {
			var _string = jsonStyle['string'],
				_number = jsonStyle['number'],
				_boolean = jsonStyle['boolean'],
				_null = jsonStyle['null'],
				_key = jsonStyle['key'];

			return this.toString().replace(jsonPartsRegExp, function (match) {
				var style = _number;
				if (/^"/.test(match)) {
					if (/:$/.test(match)) {
						style = _key;
					} else {
						style = _string;
					}
				} else if (/true|false/.test(match)) {
					style = _boolean;
				} else if (/null/.test(match)) {
					style = _null;
				}
				return match[style];
			});
		};

		if (name === prettyJsonKey) {
			getter = jsonGetter;
		} else {
			getter = defaultGetter;
		}

		if (attached) {
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