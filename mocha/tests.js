Console.registerStyles({
	bold: 'font-weight:bold',
	underline: 'text-decoration:underline',
	red: 'color:#de4f2a',
	blue: 'color:#1795de',
	green: 'color:green',
	grey: 'color:grey',
	orange: 'color:#ffa500'
});

var _console = console;

var console = {
	log: function () {
		return Array.prototype.slice.call(arguments);
	},
	groupEnd: function () {}
};

var assert = chai.assert;

describe('Modern Console', function(){
	describe('#attach()', function () {
		it('should attatch the console', function () {
			Console.support.consoleApply = true;
			Console.support.functionGetters = true;
			Console.support.consoleColors = true;
			Console.support.console = true;
			Console.support.modifiedConsole = false;
			Console.support.consoleGroups = true;

			Console.attach();
		});
	});

	describe('#log("message")', function(){
		it('should return "message"', function () {
			assert.equal(console.log('message'), 'message');
		});
	});

	describe('#log() // with colors', function(){
		it('should return colored message', function(){
			assert.deepEqual(console.log('message'.red), ["%cmessage%c", "color:#de4f2a;", ""]);
		})

		it('should return colored message', function(){
			assert.deepEqual(console.log('message'.red + 'something'.blue), ["%cmessage%c%csomething%c", "color:#de4f2a;", "", "color:#1795de;", ""]);
		})
	});

	describe('#group()', function(){
		it('should nest properly', function(){
			assert.equal(console.group('message'), 'message');
			console.groupEnd();
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.group('message'.red), [ '%cmessage%c', 'color:#de4f2a;', '' ]);
			console.groupEnd();
		});
	});

	describe('#groupCollapsed()', function(){
		it('should nest properly', function(){
			assert.equal(console.groupCollapsed('message'), 'message');
			console.groupEnd();
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.groupCollapsed('message'.red), [ '%cmessage%c', 'color:#de4f2a;', '' ]);
			console.groupEnd();
		});
	});

	describe('#detatch', function () {
		it('should detatch itself', function () {
			Console.detatch();
			assert.equal(console._log, undefined);
		});
	});
});

describe('Degraded Console Without Colors', function(){
	describe('#attach()', function () {
		it('should attatch the console', function () {
			Console.support.consoleApply = true;
			Console.support.functionGetters = true;
			Console.support.consoleColors = false;
			Console.support.console = true;
			Console.support.modifiedConsole = false;
			Console.support.consoleGroups = true;
			Console.attach();
		});
	});

	describe('#log("message")', function(){
		it('should return "message"', function () {
			assert.equal(console.log('message'), 'message');
		});
	});

	describe('#log() // with colors', function(){
		it('should return colored message', function(){
			assert.equal(console.log('message'.red), 'message');
		})

		it('should return colored message', function(){
			assert.equal(console.log('message'.red + 'something'.blue), 'messagesomething');
		})
	});

	describe('#group()', function(){
		it('should nest properly', function(){
			assert.equal(console.group('message'), 'message');
			console.groupEnd();
		});

		it('should nest with colors', function(){
			assert.equal(console.group('message'.red), 'message');
			console.groupEnd();
		});
	});

	describe('#groupCollapsed()', function(){
		it('should nest properly', function(){
			assert.equal(console.groupCollapsed('message'), 'message');
			console.groupEnd();
		});

		it('should nest with colors', function(){
			assert.equal(console.groupCollapsed('message'.red), 'message');
			console.groupEnd();
		});
	});

	describe('#detatch', function () {
		it('should detatch itself', function () {
			Console.detatch();
			assert.equal(console._log, undefined);
		});
	});
});

describe('Degraded Console Without Colors or Groups', function(){
	describe('#attach()', function () {
		it('should attatch the console', function () {
			Console.support.consoleApply = true;
			Console.support.functionGetters = true;
			Console.support.consoleColors = false;
			Console.support.console = true;
			Console.support.modifiedConsole = false;
			Console.support.consoleGroups = false;
			Console.attach();
		});
	});

	describe('#log("message")', function(){
		it('should return "message"', function () {
			assert.equal(console.log('message'), 'message');
		});
	});

	describe('#log() // with colors', function(){
		it('should return colored message', function(){
			assert.equal(console.log('message'.red), 'message');
		})

		it('should return colored message with multiple args', function(){
			assert.equal(console.log('message'.red + 'something'.blue), 'messagesomething');
		})
	});

	describe('#group()', function(){
		it('should nest properly', function(){
			assert.deepEqual(console.group('message'), ['- ', 'message']);
			assert.deepEqual(console.group('message'), ['-- ', 'message']);
			assert.deepEqual(console.group('message'), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['message']);
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.group('message'.red), ['- ', 'message']);
			assert.deepEqual(console.group('message'.red), ['-- ', 'message']);
			assert.deepEqual(console.group('message'.red), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['message']);
		});
	});

	describe('#groupCollapsed()', function(){
		it('should nest properly', function(){
			assert.deepEqual(console.groupCollapsed('message'), ['- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'), ['-- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['message']);
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.groupCollapsed('message'.red), ['- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'.red), ['-- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'.red), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.red), ['message']);
		});
	});

	describe('#detatch', function () {
		it('should detatch itself', function () {
			Console.detatch();
			assert.equal(console._log, undefined);
		});
	});
});

describe('Degraded Console Without Colors or Groups and In Legacy Mode', function(){
	describe('#attach()', function () {
		it('should attatch the console', function () {
			Console.legacySupport = true;
			Console.registerStyles({
				legacyBold: 'font-weight:bold',
				legacyUnderline: 'text-decoration:underline',
				legacyRed: 'color:#de4f2a',
				legacyBlue: 'color:#1795de',
				legacyGreen: 'color:green',
				legacyGrey: 'color:grey',
				legacyOrange: 'color:#ffa500'
			});

			Console.support.consoleApply = true;
			Console.support.functionGetters = true;
			Console.support.consoleColors = false;
			Console.support.console = true;
			Console.support.modifiedConsole = false;
			Console.support.consoleGroups = false;
			Console.attach();
		});
	});

	describe('#log("message")', function(){
		it('should return "message"', function () {
			assert.equal(console.log('message'), 'message');
		});
	});

	describe('#log() // with colors', function(){
		it('should return colored message', function(){
			assert.equal(console.log('message'.legacyRed()), 'message');
		})

		it('should return colored message with multiple args', function(){
			assert.equal(console.log('message'.legacyRed() + 'something'.legacyBlue()), 'messagesomething');
		})
	});

	describe('#group()', function(){
		it('should nest properly', function(){
			assert.deepEqual(console.group('message'), ['- ', 'message']);
			assert.deepEqual(console.group('message'), ['-- ', 'message']);
			assert.deepEqual(console.group('message'), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['message']);
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.group('message'.legacyRed()), ['- ', 'message']);
			assert.deepEqual(console.group('message'.legacyRed()), ['-- ', 'message']);
			assert.deepEqual(console.group('message'.legacyRed()), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['message']);
		});
	});

	describe('#groupCollapsed()', function(){
		it('should nest properly', function(){
			assert.deepEqual(console.groupCollapsed('message'), ['- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'), ['-- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'), ['message']);
		});

		it('should nest with colors', function(){
			assert.deepEqual(console.groupCollapsed('message'.legacyRed()), ['- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'.legacyRed()), ['-- ', 'message']);
			assert.deepEqual(console.groupCollapsed('message'.legacyRed()), ['--- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['-- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['- ', 'message']);
			console.groupEnd();
			assert.deepEqual(console.log('message'.legacyRed()), ['message']);
		});
	});

	describe('#detatch', function () {
		it('should detatch itself', function () {
			Console.detatch();
			Console.legacySupport = false;
			assert.equal(console._log, undefined);
		});
	});
});


describe('Success', function() {
	describe('#destroy', function () {
		it('should restore a clean Console', function () {
			console = _console;
			Console.detectSupport();
			Console.attach();
		});
	});
});