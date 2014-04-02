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

if (!Array.prototype.map)
{
  Array.prototype.map = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null)
      throw new TypeError();

    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();

    var res = new Array(len);
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      // NOTE: Absolute correctness would demand Object.defineProperty
      //       be used.  But this method is fairly new, and failure is
      //       possible only if Object.prototype or Array.prototype
      //       has a property |i| (very unlikely), so use a less-correct
      //       but more portable alternative.
      if (i in t)
        res[i] = fun.call(thisArg, t[i], i, t);
    }

    return res;
  };
};var Console = (function () {
	// compatibility
	var browser = {};
	browser.isFirefox = /firefox/i.test(navigator.userAgent);
	browser.isIE = document.documentMode;

	var support = {};
	support.consoleApply = !browser.isIE || document.documentMode && document.documentMode > 9;
	support.functionGetters = support.consoleApply;
	support.console = !!window.console;
	support.modifiedConsole = !browser.isIE && support.console && console.log.toString().indexOf('apply') !== -1;
	support.consoleStyles = !!window.chrome || !!(browser.isFirefox && support.modifiedConsole);
	support.consoleGroups = !!(window.console && console.group);

	var consoleMethodNames = ['log', 'group', 'groupCollapsed', 'groupEnd', 'warn', 'info'],
		groupDepth = 0;

	// preserve original console
	if (!support.console) {
		window.console = {};
	}

	var consoleReference = window.console;
		consoleMethodReferences = {};

	consoleMethodNames.forEach(function (name) {
		if (consoleReference[name]) {
			consoleMethodReferences[name] = consoleReference[name];
		}
	});

	if (browser.isFirefox && !support.modifiedConsole) {
		support.consoleGroups = false;
		support.consoleApply = true;
	}

	// general way to calling console methods
	function applyConsoleMethod (method, args) {
		if (!support.console) {
			return;
		}

		args = Array.prototype.slice.call(args);

		args = Console.styles.argumentsToConsoleArguments(args);

		// groupEnd should only be proxied if its actually supported
		if (!support.consoleGroups && method === 'groupEnd') {
			return;
		}

		// if a method is not supported it falls back to a standard log
		if (!consoleMethodReferences[method]) {
			method = 'log';
		}

		if (support.consoleApply) {
			return consoleMethodReferences[method].apply(consoleReference, args);
		} else {
			var message = args.join(' ');

			if (!message.match('<STYLES:UNSUPPORTED>')) {
				return consoleMethodReferences[method](args.join(' '));
			} else {
				return '<STYLES:UNSUPPORTED>';
			}
		}
	}

	function prependGroupPaddingToArguments (args) {
		var string = '';

		for (var i = 0; i < groupDepth; i++) {
			string += '-';
		}

		if (string) {
			args = args.splice(0, 0, string);
		}
	}

	// public interface
	return {
		log: function () {
			return applyConsoleMethod('log', arguments);
		},

		group: function () {
			var args = Array.prototype.slice.call(arguments);

			groupDepth++;

			if (!support.consoleGroups) {
				prependGroupPaddingToArguments(args);
			}

			return applyConsoleMethod('group', args);
		},

		groupCollapsed: function () {
			var args = Array.prototype.slice.call(arguments);

			groupDepth++;

			if (!support.consoleGroups) {
				prependGroupPaddingToArguments(args);
			}

			return applyConsoleMethod('groupCollapsed', args);
		},

		groupEnd: function () {
			groupDepth--;

			return applyConsoleMethod('groupEnd', arguments);
		},

		warn: function () {
			return applyConsoleMethod('warn', arguments);
		},

		info: function () {
			return applyConsoleMethod('info', arguments);
		},

		attach: function () {
			consoleMethodNames.forEach(function (method) {
				if (support.console) {
					window.console['_' + method] = consoleMethodReferences[method];
					window.console[method] = this[method];
				} else {
					window.console[method] = function () {};
				}
			}, this);
		},

		detach: function () {
			if (support.console) {
				consoleMethodNames.forEach(function (method) {
					delete window.console['_' + method];
					window.console[method] = consoleMethodReferences[method];
				}, this);
			} else {
				delete window.console;
			}
		},

		support: support,

		consoleMethodReferences: consoleMethodReferences,

		getFileAndLineNumber: function (caller, offset) {
			var stack = new Console.Stack(),
				line = stack.getLineByCaller(caller, offset);

			if (line) {
				return line.fileName + ':' + line.lineNumber + ' ';
			} else {
				return '';
			}
		}
	};
})();;Console.styles = (function () {
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

		function getter () {
			return format(this.toString(), name);
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
})();;Console.Stack = function (stack) {
	this._stackString = stack || new Error().stack || '';
};
Console.Stack.prototype = {
	_geckoStackWithMethodNameRegExp: /\b([a-z0-9_-]+)@.*\/([^\/]*)\:(\d*)$/i,
	_geckoStackWithoutMethodName: /@.*\/([^\/]+)\:(\d*)$/i,

	_webkitStackWithMethodNameRegExp: /.+\b([a-z0-9_-]+) \(.*\/([^\/]*)\:(\d*)\:(\d+)\)$/i,
	_webkitStackWithoutMethodName: /at .*\/([^\/]*)\:(\d*)\:(\d+)/i,

	parse: function () {
		var stack = this._stackString;

		// convert stack into an array
		stack = stack.split('\n');

		// pop off first item
		stack = stack.slice(1);

		// parse stack
		stack = stack.map(function (line) {
			return this._parseStackLine(line);
		}, this);

		return stack || null;
	},

	_parseStackLine: function (line) {
		var parsedLine,
			userAgent = navigator.userAgent;

		if (userAgent.match(/Webkit/i)) {
		 	parsedLine = this._webkitParseStackLine(line);
		} else if (userAgent.match(/Gecko/i)) {
			parsedLine = this._geckoParseStackLine(line);
		}
		return parsedLine || {string: line};
	},

	_geckoParseStackLine: function (line) {
		var match;

		if (this._geckoStackWithMethodNameRegExp.test(line)) {
			match = line.match(this._geckoStackWithMethodNameRegExp);

			return {
				methodName: match[1],
				fileName: match[2],
				lineNumber: match[3]
			};
		} else if (this._geckoStackWithoutMethodName.test(line)) {
			match = line.match(this._geckoStackWithoutMethodName);

			return {
				fileName: match[1],
				lineNumber: match[2]
			};
		}
	},

	_webkitParseStackLine: function (line) {
		var match;

		if (this._webkitStackWithMethodNameRegExp.test(line)) {
			match = line.match(this._webkitStackWithMethodNameRegExp);

			return {
				methodName: match[1],
				fileName: match[2],
				lineNumber: match[3],
				columnNumber: match[4]
			};
		} else if (this._webkitStackWithoutMethodName.test(line)) {
			match = line.match(this._webkitStackWithoutMethodName);

			return {
				fileName: match[1],
				lineNumber: match[2],
				columnNumber: match[3]
			};
		}
	},

	getLineByCaller: function (caller, offset) {
		offset = offset || 0;

		var stack = this.parse();

		if (!stack) {
			return '';
		}

		for (var i = 0; i < stack.length; i++) {
			if (stack[i] && caller === stack[i].methodName) {
				return stack[i+offset];
			}
		}

		return null;
	}
};