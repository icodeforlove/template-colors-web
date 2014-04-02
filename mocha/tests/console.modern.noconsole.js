var _console = {};

if (Console.support.console && !Console.support.consoleStyles && Console.support.consoleGroups) {
	describe('Console (Modern Mode, No Console)', function(){
		describe('initialize', function(){
			it('should attach the console', function() {
				// make the console test friendly
				_console.log = Console.consoleMethodReferences.log;
				_console.group = Console.consoleMethodReferences.log;
				_console.groupCollapsed = Console.consoleMethodReferences.log;
				_console.groupEnd = Console.consoleMethodReferences.log;
				_console.warn = Console.consoleMethodReferences.log;
				_console.info = Console.consoleMethodReferences.log;

				Console.consoleMethodReferences.log = function () {
					return Array.prototype.slice.call(arguments);
				};
				Console.consoleMethodReferences.group = function () {
					return Array.prototype.slice.call(arguments);
				};
				Console.consoleMethodReferences.groupCollapsed = function () {
					return Array.prototype.slice.call(arguments);
				};
				Console.consoleMethodReferences.groupEnd = function () {
					return Array.prototype.slice.call(arguments);
				};
				Console.consoleMethodReferences.warn = function () {
					return Array.prototype.slice.call(arguments);
				};
				Console.consoleMethodReferences.info = function () {
					return Array.prototype.slice.call(arguments);
				};

				Console.attach();

				expect(!!console._log).to.eql(true);
			});
		});

		describe('basic test', function(){
			it('should not error', function() {
				console.log('');
				console.group('');
				console.groupEnd();
				console.groupCollapsed('');
				console.groupEnd();
				console.warn('');
				console.info('');
			});
		});

		describe('uninitialize', function(){
			it('should detatch console', function() {
				// restore the Console references
				Console.consoleMethodReferences.log = _console.log;
				Console.consoleMethodReferences.group = _console.group;
				Console.consoleMethodReferences.groupCollapsed = _console.groupCollapsed;
				Console.consoleMethodReferences.groupEnd = _console.groupEnd;
				Console.consoleMethodReferences.warn = _console.warn;
				Console.consoleMethodReferences.info = _console.info;

				// restore the console references
				Console.detach();

				expect(!!console.log.toString().match('[native code]')).to.eql(true);
			});
		});
	});
}