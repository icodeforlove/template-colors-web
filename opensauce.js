var MochaSauce = require('mocha-sauce'),
	express = require('express'),
	app = express(),
	sauceConnectLauncher = require('sauce-connect-launcher'),
	colors = require('colors');

app.use(express.static(__dirname), {maxAge: 0});

sauceConnectLauncher(
	{
		username: process.env.SAUCE_USERNAME,
		accessKey: process.env.SAUCE_ACCESS_KEY,
		verbose: false
	},
	function (err, sauceConnectProcess) {
		var failed = false;

		app.listen(8081, '0.0.0.0');

		// configure cloud
		var sauce = new MochaSauce({
			name: 'Chad Scira',
			username: process.env.SAUCE_USERNAME,
			accessKey: process.env.SAUCE_ACCESS_KEY,
			build: process.env.TRAVIS_BUILD_NUMBER,
			url: 'http://0.0.0.0:8081/mocha'
		});

		sauce.record(true);

		// chrome
		sauce.browser({ browserName: 'chrome', platform: 'Windows 8.1', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 8.1', version: '32' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 8.1', version: '31' });

		sauce.browser({ browserName: 'chrome', platform: 'Windows 8', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 8', version: '32' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 8', version: '31' });

		sauce.browser({ browserName: 'chrome', platform: 'Windows 7', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 7', version: '32' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows 7', version: '31' });

		sauce.browser({ browserName: 'chrome', platform: 'Windows XP', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows XP', version: '32' });
		sauce.browser({ browserName: 'chrome', platform: 'Windows XP', version: '31' });

		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.9', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.9', version: '32' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.9', version: '31' });

		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8', version: '32' });
		// ERORR // sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8', version: '31' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8', version: '28' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.8', version: '27' });

		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.6', version: '33' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.6', version: '32' });
		// ERORR // sauce.browser({ browserName: 'chrome', platform: 'OS X 10.6', version: '31' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.6', version: '28' });
		sauce.browser({ browserName: 'chrome', platform: 'OS X 10.6', version: '27' });

		// safari
		sauce.browser({ browserName: 'safari', platform: 'OS X 10.9', version: '7' });
		sauce.browser({ browserName: 'safari', platform: 'OS X 10.8', version: '6' });
		sauce.browser({ browserName: 'safari', platform: 'OS X 10.6', version: '5' });

		// internet explorer
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 8.1', version: '11' });

		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 8', version: '10' });

		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 7', version: '11' });
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 7', version: '10' });
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 7', version: '9' });
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows 7', version: '8' });

		sauce.browser({ browserName: 'internet explorer', platform: 'Windows XP', version: '8' });
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows XP', version: '7' });
		sauce.browser({ browserName: 'internet explorer', platform: 'Windows XP', version: '6' });

		// iphone
		sauce.browser({ browserName: 'iphone', platform: 'OS X 10.9', version: '7.1' });
		sauce.browser({ browserName: 'iphone', platform: 'OS X 10.9', version: '7.0' });
		sauce.browser({ browserName: 'iphone', platform: 'OS X 10.8', version: '6.1' });
		sauce.browser({ browserName: 'iphone', platform: 'OS X 10.8', version: '6.0' });
		sauce.browser({ browserName: 'iphone', platform: 'OS X 10.8', version: '5.1' });

		// ipad
		sauce.browser({ browserName: 'ipad', platform: 'OS X 10.9', version: '7.1' });
		sauce.browser({ browserName: 'ipad', platform: 'OS X 10.9', version: '7.0' });
		sauce.browser({ browserName: 'ipad', platform: 'OS X 10.8', version: '6.1' });
		sauce.browser({ browserName: 'ipad', platform: 'OS X 10.8', version: '6.0' });
		sauce.browser({ browserName: 'ipad', platform: 'OS X 10.8', version: '5.1' });

		// android phone
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.3' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.2' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.1' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.0' });

		// android tablet
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.3', 'device-type': 'tablet' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.2', 'device-type': 'tablet' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.1', 'device-type': 'tablet' });
		// ERORR // sauce.browser({ browserName: 'android', platform: 'Linux', version: '4.0', 'device-type': 'tablet' });

		// firefox
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8.1', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8.1', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8.1', version: '26' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8.1', version: '3.6' });

		sauce.browser({ browserName: 'firefox', platform: 'Windows 8', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8', version: '26' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 8', version: '3.6' });

		sauce.browser({ browserName: 'firefox', platform: 'Windows 7', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 7', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 7', version: '26' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows 7', version: '3.6' });

		sauce.browser({ browserName: 'firefox', platform: 'Windows XP', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows XP', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows XP', version: '26' });
		sauce.browser({ browserName: 'firefox', platform: 'Windows XP', version: '3.6' });

		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.9', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.9', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.9', version: '26' });

		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.6', version: '28' });
		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.6', version: '27' });
		sauce.browser({ browserName: 'firefox', platform: 'OS X 10.6', version: '26' });

		sauce.on('end', function(browser, response) {
			if (response.failures) {
				failed = true;
			}

			console.log(('(' + browser.platform + ') ' + browser.browserName + ' ' + browser.version + ' Tests: ' + response.tests + ' Passes: ' + response.passes + ' Failures: ' + response.failures)[response.failures ? 'red' : 'green']);
		});

		sauce.start(function(err, response) {
			if(err) {
				console.log(err);
			}

			sauceConnectProcess.close(function () {
				console.log('');
				console.log('Closed Sauce Connect process');

				process.exit(failed ? 1 : 0);
			});
		});
	}
);
