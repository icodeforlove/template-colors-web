const c = require('../dist-npm');

c.define('error', 'rgb(255,0,0)');
c.define('log', ['rgb(0,0,0)', 'rgbBG(255,255,255)', 'bold', 'underline', 'italic']);

describe('General', () => {
	it('can use inline styles', () => {
		expect(c`${'foobar'}.red`.toString()).toBe('<span style="color: rgb(237,  80,  65)">foobar</span>');
		expect(c`foo${'bar'}.red`.toString()).toBe('foo<span style="color: rgb(237,  80,  65)">bar</span>');
		expect(c`${'foo'.blue}${'bar'}.red`.toString()).toBe('<span style="color: rgb(73,  148,  201)">foo</span><span style="color: rgb(237,  80,  65)">bar</span>');
		expect(c`${'foo'}.blue${'bar'}.red`.toString()).toBe('<span style="color: rgb(73,  148,  201)">foo</span><span style="color: rgb(237,  80,  65)">bar</span>');
		expect(c`foobar ${1}.red foobar`.toString()).toBe('foobar <span style="color: rgb(237,  80,  65)">1</span> foobar');
	});

	it('can use default styles', () => {
	  	expect(c`foobar ${'foobar'}.red foobar`.blue.underline.toString()).toBe('<span style="text-decoration: underline"><span style="color: rgb(73,  148,  201)">foobar </span></span><span style="text-decoration: underline"><span style="color: rgb(73,  148,  201)"><span style="color: rgb(237,  80,  65)">foobar</span></span></span><span style="text-decoration: underline"><span style="color: rgb(73,  148,  201)"> foobar</span></span>');
	  	expect(c`foobar`.red.toString()).toBe('<span style="color: rgb(237,  80,  65)">foobar</span>');
	  	expect(c`foobar ${'foobar'}.blue ${'foobar'.cyan}`.red.bold.underline.toString()).toBe('<span style="text-decoration: underline"><span style="font-weight: bold"><span style="color: rgb(237,  80,  65)">foobar </span></span></span><span style="text-decoration: underline"><span style="font-weight: bold"><span style="color: rgb(237,  80,  65)"><span style="color: rgb(73,  148,  201)">foobar</span></span></span></span><span style="text-decoration: underline"><span style="font-weight: bold"><span style="color: rgb(237,  80,  65)"> </span></span></span><span style="text-decoration: underline"><span style="font-weight: bold"><span style="color: rgb(237,  80,  65)"><span style="color: rgb(78,  181,  230)">foobar</span></span></span></span><span style="text-decoration: underline"><span style="font-weight: bold"><span style="color: rgb(237,  80,  65)"></span></span></span>');
		expect(c`foobar ${123}.bold foobar`.red.toString()).toBe('<span style="color: rgb(237,  80,  65)">foobar </span><span style="color: rgb(237,  80,  65)"><span style="font-weight: bold">123</span></span><span style="color: rgb(237,  80,  65)"> foobar</span>');
	});

	it('can use .rgb and .rgbBG', () => {
		expect(c`${'one'.rgb(77,77,77)} ${'two'}.rgb(144,144,144).bold.rgbBG(44,44,44) three`.rgb(0,0,0).rgbBG(255,255,255).underline.bold.toString()).toBe('<span style="font-weight: bold"><span style="text-decoration: underline"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"></span></span></span></span><span style="font-weight: bold"><span style="text-decoration: underline"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"><span style="color: rgb(77, 77, 77)">one</span></span></span></span></span><span style="font-weight: bold"><span style="text-decoration: underline"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"> </span></span></span></span><span style="font-weight: bold"><span style="text-decoration: underline"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"><span style="background-color: rgb(44, 44, 44)"><span style="font-weight: bold"><span style="color: rgb(144, 144, 144)">two</span></span></span></span></span></span></span><span style="font-weight: bold"><span style="text-decoration: underline"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"> three</span></span></span></span>');
	});

	it('can use custom defined styles', () => {
		expect(c`foo bar ${'hello'}.error`.log.toString()).toBe('<span style="font-style: italic"><span style="text-decoration: underline"><span style="font-weight: bold"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)">foo bar </span></span></span></span></span><span style="font-style: italic"><span style="text-decoration: underline"><span style="font-weight: bold"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"><span style="color: rgb(255, 0, 0)">hello</span></span></span></span></span></span><span style="font-style: italic"><span style="text-decoration: underline"><span style="font-weight: bold"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)"></span></span></span></span></span>');
		expect(c`${'hello'.error}.bold ${'test'}.log ${'test'.log} hello`.error.toString()).toBe('<span style="color: rgb(255, 0, 0)"></span><span style="color: rgb(255, 0, 0)"><span style="font-weight: bold"><span style="color: rgb(255, 0, 0)">hello</span></span></span><span style="color: rgb(255, 0, 0)"> </span><span style="color: rgb(255, 0, 0)"><span style="font-style: italic"><span style="text-decoration: underline"><span style="font-weight: bold"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)">test</span></span></span></span></span></span><span style="color: rgb(255, 0, 0)"> </span><span style="color: rgb(255, 0, 0)"><span style="font-style: italic"><span style="text-decoration: underline"><span style="font-weight: bold"><span style="background-color: rgb(255, 255, 255)"><span style="color: rgb(0, 0, 0)">test</span></span></span></span></span></span><span style="color: rgb(255, 0, 0)"> hello</span>');
	});
});