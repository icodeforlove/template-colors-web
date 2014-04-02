var Console = (function () {
	var consoleMethodNames = ['log', 'group', 'groupCollapsed', 'groupEnd', 'warn', 'info'],
		groupDepth = 0;

	// preserve original console
	var consoleReference = console;
		consoleMethodReferences = {};

	consoleMethodNames.forEach(function (name) {
		consoleMethodReferences[name] = consoleReference[name];
	});

	// general way to calling console methods
	function applyConsoleMethod (method, args) {
		args = Array.prototype.slice.call(args);

		args = Console.styles.argumentsToConsoleArguments(args);

		// groupEnd should only be proxied if its actually supported
		if (!consoleMethodReferences[method] && method === 'groupEnd') {
			return;
		}

		// if a method is not supported it falls back to a standard log
		if (!consoleMethodReferences[method]) {
			method = 'log';
		}

		consoleMethodReferences[method].apply(consoleReference, args);
	}

	function prependGroupPaddingToArguments (args) {
		var args = Array.prototype.slice.call(args),
			string = '';

		for (var i = 0; i < groupDepth; i++) {
			string += '-';
		}

		if (string) {
			args.splice(0, 0, string);
		}

		return args;
	}

	// public interface
	return {
		log: function () {
			applyConsoleMethod('log', arguments);
		},

		group: function () {
			var args = arguments;

			groupDepth++;
			alert(groupDepth)
//consoleMethodReferences.log('test')
			//if (!consoleMethodReferences.group) {
				prependGroupPaddingToArguments(args);
			//}

			applyConsoleMethod('groupCollapsed', args);
		},

		groupCollapsed: function () {
			var args = arguments;

			groupDepth++;

			if (!consoleMethodReferences.group) {
				prependGroupPaddingToArguments(args);
			}

			applyConsoleMethod('groupCollapsed', args);
		},

		groupEnd: function () {
			groupDepth--;

			applyConsoleMethod('group', arguments);
		},

		warn: function () {
			applyConsoleMethod('warn', arguments);
		},

		info: function () {
			applyConsoleMethod('info', arguments);
		},

		unknown: function () {
			applyConsoleMethod('unknown', arguments);
		},

		attach: function () {
			consoleMethodNames.forEach(function (method) {
				window.console['_' + method] = consoleMethodReferences[method];
				window.console[method] = this[method];
			}, this);
		},

		detach: function () {
			consoleMethodNames.forEach(function (method) {
				delete window.console['_' + method];
				window.console[method] = consoleMethodReferences[method];
			}, this);
		}
	};
})();


//'log', 'group', 'groupCollapsed', 'warn', 'info'


// var Console = (function () {
// 	var Console = {};

// 	var browser = {};
// 	browser.isFirefox = /firefox/i.test(navigator.userAgent);
// 	browser.isIE = document.documentMode;

// 	var support = {};

// 	function detectSupport () {
// 		support.consoleApply = !browser.isIE || document.documentMode && document.documentMode > 9;
// 		support.functionGetters = support.consoleApply;
// 		support.console = !!window.console;
// 		support.modifiedConsole = !browser.isIE && support.console && console.log.toString().indexOf('apply') !== -1;
// 		support.consoleColors = !!window.chrome || !!(browser.isFirefox && support.modifiedConsole);
// 		support.consoleGroups = !!(window.console && console.group);

// 		if (browser.isFirefox && !support.modifiedConsole) {
// 			support.consoleGroups = false;
// 			support.consoleApply = false;
// 		}
// 	}

// 	function Stack (stack) {
// 		this._stackString = stack || new Error().stack || '';

// 	}
// 	Stack.prototype = {
// 		_geckoStackWithMethodNameRegExp: /\b([a-z0-9_-]+)@.*\/([^\/]+)\:(\d*)$/i,
// 		_geckoStackWithoutMethodName: /@.*\/([^\/]+)\:(\d*)$/i,

// 		_webkitStackWithMethodNameRegExp: /.+\b([a-z0-9_-]+) \(.*\/([^\/]+)\:(\d*)\:(\d+)\)$/i,
// 		_webkitStackWithoutMethodName: /at .*\/([^\/]+)\:(\d*)\:(\d+)/i,

// 		parse: function () {
// 			var stack = this._stackString;

// 			// convert stack into an array
// 			stack = stack.split('\n');

// 			// pop off first item
// 			stack = stack.slice(1);

// 			// parse stack
// 			stack = stack.map(function (line) {
// 				return this._parseStackLine(line);
// 			}, this);

// 			return stack || null;
// 		},

// 		_parseStackLine: function (line) {
// 			var parsedLine,
// 				userAgent = navigator.userAgent;

// 			if (userAgent.match(/Webkit/i)) {
// 			 	parsedLine = this._webkitParseStackLine(line);
// 			} else if (userAgent.match(/Gecko/i)) {
// 				parsedLine = this._geckoParseStackLine(line);
// 			}
// 			return parsedLine || {string: line};
// 		},

// 		_geckoParseStackLine: function (line) {
// 			var match;

// 			if (this._geckoStackWithMethodNameRegExp.test(line)) {
// 				match = line.match(this._geckoStackWithMethodNameRegExp);

// 				return {
// 					methodName: match[1],
// 					fileName: match[2],
// 					lineNumber: match[3]
// 				};
// 			} else if (this._geckoStackWithoutMethodName.test(line)) {
// 				match = line.match(this._geckoStackWithoutMethodName);

// 				return {
// 					fileName: match[1],
// 					lineNumber: match[2]
// 				};
// 			}
// 		},

// 		_webkitParseStackLine: function (line) {
// 			var match;

// 			if (this._webkitStackWithMethodNameRegExp.test(line)) {
// 				match = line.match(this._webkitStackWithMethodNameRegExp);

// 				return {
// 					methodName: match[1],
// 					fileName: match[2],
// 					lineNumber: match[3],
// 					columnNumber: match[4]
// 				};
// 			} else if (this._webkitStackWithoutMethodName.test(line)) {
// 				match = line.match(this._webkitStackWithoutMethodName);

// 				return {
// 					fileName: match[1],
// 					lineNumber: match[2],
// 					columnNumber: match[3]
// 				};
// 			}
// 		},

// 		getLineByCaller: function (caller, offset) {
// 			offset = offset || 0;

// 			var stack = this.parse();

// 			if (!stack) {
// 				return '';
// 			}

// 			for (var i = 0; i < stack.length; i++) {
// 				if (stack[i] && caller === stack[i].methodName) {
// 					return stack[i+offset];
// 				}
// 			}

// 			return null;
// 		}
// 	};



// 	function attach () {
// 		var methodNames = ['log', 'group', 'groupCollapsed', 'warn', 'info'],
// 			groupLevel = 0;

// 		// browser compatibility
// 		if (!support.console) {
// 			window.console = {log: function () {}};
// 		}

// 		// groupEnd not supported
// 		if (!support.consoleGroups) {
// 			if (console.group) {
// 				delete console.group;
// 				delete console.groupCollapsed;
// 				delete console.groupEnd;
// 			}

// 			var groupEnd = console.groupEnd ? console.groupEnd.bind(console) : null;
// 			console.groupEnd = function () {
// 				groupLevel--;
// 				if (groupEnd) {
// 					groupEnd();
// 				}
// 			};
// 		}

// 		methodNames.forEach(function (name) {
// 			var method = console['_' + name] = console[name] || console.log;

// 			console[name] = Console[name] = function () {
// 				if (!Console.logging) {
// 					return;
// 				}

// 				var args = Array.prototype.slice.call(arguments);

// 				if (!support.consoleGroups) {
// 					if (name === 'group' || name === 'groupCollapsed') {
// 						groupLevel++;
// 					} else if (name === 'log') {
// 						if (groupLevel) {
// 							var groupPadding = '';
// 							for (var i = 0; i < groupLevel; i++) {
// 								groupPadding += '-';
// 							}
// 							//groupPadding += ' ';
// 							args.splice(0, 0, groupPadding);
// 						}
// 					}
// 				}

// 				if (support.consoleApply) {
// 					return method.apply(console, Console.styles.argumentsToConsoleArguments(args));
// 				} else {
// 					var message = Console.styles.argumentsToConsoleArguments(args).join(' ');

// 					if (message.match('<Console.js:INVALID_GETTER_ATTEMPT>')) {
// 						if (!Console.legacySupport) {
// 							return;
// 						}

// 						message = 'Error Console.js: you need to call your style() methods';
// 					}

// 					return method(message);
// 				}
// 			};
// 		});
// 	};

// 	function detatch () {
// 		for (var methodName in console) {
// 			if (methodName.substr(0, 1) === '_' && console[methodName.substr(1)]) {
// 				if (console.__proto__ && console.__proto__.log) {
// 					delete console[methodName.substr(1)];
// 				} else {
// 					console[methodName.substr(1)] = console[methodName];
// 				}

// 				delete console[methodName];
// 			}
// 		}
// 	}

// 	detectSupport();

// 	Console.detectSupport = detectSupport;
// 	Console.attach = attach;
// 	Console.detatch = detatch;
// 	Console.support = support;
// 	Console.logging = true;
// 	Console.legacySupport = false;
// 	// Console.registerStyle = Colors.registerStyle;
// 	// Console.registerStyles = Colors.registerStyles;
// 	Console.getFileAndLineNumber = function (caller, offset) {
// 		var stack = new Stack(),
// 			line = stack.getLineByCaller(caller, offset);

// 		if (line) {
// 			return line.fileName + ':' + line.lineNumber + ' '
// 		} else {
// 			return '';
// 		}
// 	};

// 	return Console;
// })();
