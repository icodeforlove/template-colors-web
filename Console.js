if (!Array.prototype.forEach)
{
	Array.prototype.forEach = function(fun /*, thisArg */)
	{
		'use strict';

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function") {
			throw new TypeError();
		}

		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				fun.call(thisArg, t[i], i, t);
			}
		}
	};
}

var Console = (function () {
	var applySupport = !document.documentMode || document.documentMode && document.documentMode >= 9,
		getterSupport = applySupport,
		colorSupport = window.chrome;

	var Console = {};

	var Colors = (function () {
		var existingStyleSpanRegExp = /^<span style="([^"]+)">.+<\/span>$/,
			styleSpanOpenRegExp = /^<span style="([^"]+)">/,
			styleSpanOpenOrCloseRegExp = /<span style="[^"]+">|<\/span>/g;

		function registerStyle (name, style) {
			function getter () {
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
			}

			if (!getterSupport && !Console.legacySupport) {
				String.prototype[name] = '<Console.js:INVALID_GETTER_ATTEMPT>';
			} else if (Console.legacySupport) {
				getter.toString = function () {
					return '<Console.js:INVALID_GETTER_ATTEMPT>';
				};

				String.prototype[name] = getter
			} else if (Object.defineProperty) {
				Object.defineProperty(String.prototype, name, {get: getter});
			} else if (String.prototype.__defineGetter__) {
				String.prototype.__defineGetter__(name, getter);
			}
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
				if (!Console.logging) {
					return;
				}

				// groups are not suppored
				if (name === 'groupEnd' && console.log === method) {
					return;
				}

				if (applySupport) {
					method.apply(console, Colors.argumentsToConsoleArguments(arguments));
				} else {
					var message = Colors.argumentsToConsoleArguments(arguments).join(' ');

					if (message.match('<Console.js:INVALID_GETTER_ATTEMPT>')) {
						if (!Console.legacySupport) {
							return;
						}

						message = 'Error Console.js: you need to call your style() methods';
					}

					method(message);
				}
			};
		});
	})();

	Console.logging = true;
	Console.legacySupport = false;
	Console.registerStyle = Colors.registerStyle;
	Console.registerStyles = Colors.registerStyles;

	return Console;
})();