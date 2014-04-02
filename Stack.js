Console.Stack = function (stack) {
	this._stackString = stack || new Error().stack || '';
};
Console.Stack.prototype = {
	_geckoStackWithMethodNameRegExp: /\b([a-z0-9_-]+)@.*\/([^\/]+)\:(\d*)$/i,
	_geckoStackWithoutMethodName: /@.*\/([^\/]+)\:(\d*)$/i,

	_webkitStackWithMethodNameRegExp: /.+\b([a-z0-9_-]+) \(.*\/([^\/]+)\:(\d*)\:(\d+)\)$/i,
	_webkitStackWithoutMethodName: /at .*\/([^\/]+)\:(\d*)\:(\d+)/i,

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