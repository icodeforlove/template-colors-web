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
	var Console = {};

	var browser = {};
	browser.isFirefox = /firefox/i.test(navigator.userAgent);
	browser.isIE = document.documentMode;

	var support = {};

	function detectSupport () {
		support.consoleApply = !browser.isIE || document.documentMode && document.documentMode > 9;
		support.functionGetters = support.consoleApply;
		support.console = !!window.console;
		support.modifiedConsole = !browser.isIE && support.console && console.log.toString().indexOf('apply') !== -1;
		support.consoleColors = !!window.chrome || !!(browser.isFirefox && support.modifiedConsole);
		support.consoleGroups = !!(window.console && console.group);

		if (browser.isFirefox && !support.modifiedConsole) {
			support.consoleGroups = false;
			support.consoleApply = false;
		}
	}

	var Colors = (function () {
		var existingStyleSpanRegExp = /^<span style="([^"]+)">.+<\/span>$/,
			styleSpanOpenRegExp = /^<span style="([^"]+)">/,
			styleSpanOpenOrCloseRegExp = /<span style="[^"]+">|<\/span>/g;

		function registerStyle (name, style) {
			function getter () {
				var string = this.toString();

				if (!support.consoleColors) {
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

			if (!support.functionGetters && !Console.legacySupport) {
				String.prototype[name] = '<Console.js:INVALID_GETTER_ATTEMPT>';
			} else if (Console.legacySupport) {
				getter.toString = function () {
					return '<Console.js:INVALID_GETTER_ATTEMPT>';
				};

				String.prototype[name] = getter;
			} else if (Object.defineProperty) {
				Object.defineProperty(String.prototype, name, {get: getter});
			} else if (String.prototype.__defineGetter__) {
				String.prototype.__defineGetter__(name, getter);
			} else {
				String.prototype[name] = '';
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
			registerStyle: registerStyle,
			registerStyles: registerStyles,
			argumentsToConsoleArguments: argumentsToConsoleArguments
		};
	})();

	function attach () {
		var methodNames = ['log', 'group', 'groupCollapsed', 'warn', 'info'],
			groupLevel = 0;

		// browser compatibility
		if (!support.console) {
			window.console = {log: function () {}};
		}

		// groupEnd not supported
		if (!support.consoleGroups) {
			if (console.group) {
				delete console.group;
				delete console.groupCollapsed;
				delete console.groupEnd;
			}

			var groupEnd = console.groupEnd ? console.groupEnd.bind(console) : null;
			console.groupEnd = function () {
				groupLevel--;
				if (groupEnd) {
					groupEnd();
				}
			};
		}

		methodNames.forEach(function (name) {
			var method = console['_' + name] = console[name] || console.log;

			console[name] = Console[name] = function () {
				if (!Console.logging) {
					return;
				}

				var args = Array.prototype.slice.call(arguments);

				if (!support.consoleGroups) {
					if (name === 'group' || name === 'groupCollapsed') {
						groupLevel++;
					} else if (name === 'log') {
						if (groupLevel) {
							var groupPadding = '';
							for (var i = 0; i < groupLevel; i++) {
								groupPadding += '-';
							}
							groupPadding += ' ';
							args.splice(0, 0, groupPadding);
						}
					}
				}

				if (support.consoleApply) {
					return method.apply(console, Colors.argumentsToConsoleArguments(args));
				} else {
					var message = Colors.argumentsToConsoleArguments(args).join(' ');

					if (message.match('<Console.js:INVALID_GETTER_ATTEMPT>')) {
						if (!Console.legacySupport) {
							return;
						}

						message = 'Error Console.js: you need to call your style() methods';
					}

					return method(message);
				}
			};
		});
	};

	function detatch () {
		for (var methodName in console) {
			if (methodName.substr(0, 1) === '_' && console[methodName.substr(1)]) {
				if (console.__proto__ && console.__proto__.log) {
					delete console[methodName.substr(1)];
				} else {
					console[methodName.substr(1)] = console[methodName];
				}

				delete console[methodName];
			}
		}
	}

	detectSupport();

	if (!window.DO_NOT_AUTO_ATTACH_CONSOLE) {
		attach();
	}

	Console.detectSupport = detectSupport;
	Console.attach = attach;
	Console.detatch = detatch;
	Console.support = support;
	Console.logging = true;
	Console.legacySupport = false;
	Console.registerStyle = Colors.registerStyle;
	Console.registerStyles = Colors.registerStyles;

	return Console;
})();