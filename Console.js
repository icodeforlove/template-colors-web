var Console = (function () {
	var Console = {};

	var Colors = (function () {
		var existingStyleSpanRegExp = /^<span style="([^"]+)">.+<\/span>$/,
			styleSpanOpenRegExp = /^<span style="([^"]+)">/,
			styleSpanOpenOrCloseRegExp = /<span style="[^"]+">|<\/span>/g,
			colorSupport = true;

		function registerStyle (name, style) {
			String.prototype.__defineGetter__(name, function () {
				var string = this.toString();

				if (!colorSupport) {
					return string;
				}

				if (existingStyleSpanRegExp.test(string)) {
					string = string.replace(existingStyleSpanRegExp, function (match, styles) {
						if (!styles.match(style)) {
							return match.replace(styleSpanOpenRegExp, '<span style="' + styles + style + ';">');
						} else {
							return match;
						}
					});
				} else {
					string = '<span style="' + style + ';">' + this + '</span>';
				}

				return string;
			});
		}

		function registerStyles (styles) {
			for (var name in styles) {
				registerStyle(name, styles[name]);
			}
		}

		function stringToFormatArray (string) {
			var colors = [];

			string = string.replace(styleSpanOpenOrCloseRegExp, function (tag) {
				var styleMatch = tag.match(styleSpanOpenRegExp);

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

			Array.prototype.slice.call(args).forEach(function (arg) {
				if (typeof arg === 'string') {
					params = params.concat(stringToFormatArray(arg));
				} else {
					params.push(arg);
				}
			});

			return params;
		}


		return {
			registerStyle: registerStyle,
			registerStyles: registerStyles,
			argumentsToConsoleArguments: argumentsToConsoleArguments
		};
	})();

	var Logging = (function () {
		var methodNames = ['log', 'group', 'groupEnd', 'groupCollapsed', 'warn', 'info'];

		// browser compatibility
		if (!window.console) {
			window.console = {log: function () {}};
		}

		methodNames.forEach(function (name) {
			var method = console['_' + name] = console[name] || console.log;

			console[name] = Console[name] = function () {
				method.apply(console, Colors.argumentsToConsoleArguments(arguments));
			};
		});
	})();

	Console.registerStyle = Colors.registerStyle;
	Console.registerStyles = Colors.registerStyles;

	return Console;
})();