var Console = (function () {
	// compatibility
	var browser = {};
	browser.isFirefox = /firefox/i.test(navigator.userAgent);
	browser.isIE = document.documentMode;

	var support = support = {};
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
				return line.fileName + ':' + line.lineNumber + ' '
			} else {
				return '';
			}
		}
	};
})();