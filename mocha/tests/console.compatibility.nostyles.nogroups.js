var _consleApply = Console.support.consoleApply,
	F = Console.styles.format;

if (Console.support.console && !Console.support.consoleStyles && !Console.support.consoleGroups) {
	describe('Console (Compatibility Mode, No Styles, No Groups)', function(){
		describe('initialize', function(){
			it('should attach prepare Console', function() {
				Console.support.consoleApply = false;

				// make the console test friendly
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

				Console.styles.register({
					compatibilityRed: 'color:#de4f2a',
					compatibilityBlue: 'color:#1795de',
					compatibilityUnderline: 'text-decoration:underline'
				});
			});

			it('should throw an Error if trying to define ' + Console.styles.jsonGetter + ' style', function() {
				var styles = {};
				styles[Console.styles.jsonGetter] = { a: 'something' };

				expect(Console.styles.register.bind(Console.styles, styles)).to.throwError();
			});
		});

		describe('#log()', function(){
			it('should work with a normal string', function() {
				expect(Console.log('foobar')).to.eql(['foobar']);
			});

			it('should work with a styled string', function() {
				expect(Console.log(F('foobar', 'red'))).to.eql(['foobar']);
			});

			it('should work with multiple styled strings', function() {
				expect(Console.log(F('foo', 'red') + F('bar', 'blue'))).to.eql(['foobar']);
			});

			it('should work with JSON', function() {
				expect(Console.log(F(JSON.stringify(Mocks.obj), 'json'))).to.eql(Stubs.objNoStyle);
			});
		});

		describe('#group()', function(){
			it('should work with a normal string', function() {
				expect(Console.group('foobar')).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with a styled string', function() {
				expect(Console.group(F('foobar', 'red'))).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with multiple styled strings', function() {
				expect(Console.group(F('foo', 'red') + F('bar', 'blue'))).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with JSON', function() {
				expect(Console.group(F(JSON.stringify(Mocks.obj), 'json'))).to.eql(Stubs.objNoStyleNoGroup);
				Console.groupEnd();
			});
		});

		describe('#groupCollapsed()', function(){
			it('should work with a normal string', function() {
				expect(Console.groupCollapsed('foobar')).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with a styled string', function() {
				expect(Console.groupCollapsed(F('foobar', 'red'))).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with multiple styled strings', function() {
				expect(Console.groupCollapsed(F('foo', 'red,underline') + F('bar', 'blue'))).to.eql(['- foobar']);
				Console.groupEnd();
			});

			it('should work with JSON', function() {
				expect(Console.groupCollapsed(F(JSON.stringify(Mocks.obj), 'json'))).to.eql(Stubs.objNoStyleNoGroup);
				Console.groupEnd();
			});
		});

		describe('#warn()', function(){
			it('should work with a normal string', function() {
				expect(Console.warn('foobar')).to.eql(['foobar']);
			});

			it('should work with a styled string', function() {
				expect(Console.warn(F('foobar', 'red'))).to.eql(['foobar']);
			});

			it('should work with multiple styled strings', function() {
				expect(Console.warn(F('foo', 'red,underline') + F('bar', 'blue'))).to.eql(['foobar']);
			});

			it('should work with JSON', function() {
				expect(Console.warn(F(JSON.stringify(Mocks.obj), 'json'))).to.eql(Stubs.objNoStyle);
			});
		});

		describe('#info()', function(){
			it('should work with a normal string', function() {
				expect(Console.info('foobar')).to.eql(['foobar']);
			});

			it('should work with a styled string', function() {
				expect(Console.info(F('foobar', 'red'))).to.eql(['foobar']);
			});

			it('should work with multiple styled strings', function() {
				expect(Console.info(F('foo', 'red,underline') + F('bar', 'blue'))).to.eql(['foobar']);
			});

			it('should work with JSON', function() {
				expect(Console.info(F(JSON.stringify(Mocks.obj), 'json'))).to.eql(Stubs.objNoStyle);
			});
		});

		describe('uninitialize', function(){
			it('should detatch console', function() {
				Console.support.consoleApply = _consleApply;

				// restore the Console references
				Console.consoleMethodReferences.log = _console.log;
				Console.consoleMethodReferences.group = _console.group;
				Console.consoleMethodReferences.groupCollapsed = _console.groupCollapsed;
				Console.consoleMethodReferences.groupEnd = _console.groupEnd;
				Console.consoleMethodReferences.warn = _console.warn;
				Console.consoleMethodReferences.info = _console.info;
			});
		});
	});
}