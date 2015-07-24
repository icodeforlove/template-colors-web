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
			var styles = defaultStyles,
				userStyles = arguments[0];

			// check if `prettyJsonKey` is present and if
			// that's the case, init the right style
			if (Object.keys(userStyles).indexOf(prettyJsonKey) != -1) {
				var verified = true,
					userJsonStyles = userStyles[prettyJsonKey],
					stylesKeys = Object.keys(styles),
					userStylesKeys = Object.keys(userStyles);

				// verify that the user defined style for `prettyJsonKey` has
				// a key for each JSON components (bool, number, string, etc.)
				// and that the associated color / style is defined
				for (var jsonKey in jsonStyle) {
					var dependantStyle = userJsonStyles[jsonKey],
						isStyleDefined = stylesKeys.indexOf(dependantStyle) != -1 || userStylesKeys.indexOf(dependantStyle) != -1;
					verified = userJsonStyles.hasOwnProperty(jsonKey) && isStyleDefined && verified;
				}

				if (verified) {
					jsonStyle = userJsonStyles;
				} else {
					throw new Error('Invalid "' + prettyJsonKey + '" style.');
				}
				delete userStyles[prettyJsonKey];
			}

			// merge remaining user defined styles
			for (var userStyle in userStyles) {
				if (!userStyles.hasOwnProperty(userStyle)) return;
				styles[userStyle] = userStyles[userStyle];
			}

			// register `prettyJsonKey`
			registerStyle(prettyJsonKey);

			// register all the other styles
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
			var _string = jsonStyle.string,
				_number = jsonStyle.number,
				_boolean = jsonStyle.boolean,
				_null = jsonStyle.null,
				_key = jsonStyle.key;

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
				return format(match, style);
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
				if (name === prettyJsonKey) {
					string = string[prettyJsonKey];
					return;
				}

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
		argumentsToConsoleArguments: argumentsToConsoleArguments,
		jsonGetter: prettyJsonKey
	};
})();