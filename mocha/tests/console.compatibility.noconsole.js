var _console = {};

if (!Console.support.console) {
	describe('Console (Compatibility Mode, No Console)', function(){
		describe('basic test', function(){
			it('should not error', function() {
				Console.log('');
				Console.group('');
				Console.groupEnd();
				Console.groupCollapsed('');
				Console.groupEnd();
				Console.warn('');
				Console.info('');
			});
		});
	});
}