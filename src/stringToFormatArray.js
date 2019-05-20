const DOMParser = (
	typeof window != 'undefined' ?
	window.DOMParser :
	require('xmldom').DOMParser
);

function processStyleArray (styleArray) {
	let styles = {};

	styleArray.forEach(style => {
		let [key, value] = style.split(':');
		styles[key] = value.trim();
	});

	return Object.keys(styles)
		.map(style => `${style}: ${styles[style]}`)
		.join('; ');
}

function stringToFormatArray (string) {
	let colors = [],
		stringDoc = new DOMParser().parseFromString(`<root>${string}</root>`, 'text/xml');

	string = '';

	function walk (node, styles) {
		styles = styles.slice(0);

		if (node.getAttribute && node.getAttribute('style')) {
			styles.push(node.getAttribute('style'));
		}

		if ((!node.childNodes || !node.childNodes.length) && node.textContent) {
			string += `%c${node.textContent}%c`;
			colors.push(processStyleArray(styles));
			colors.push('');
		}

		if (node.childNodes) {
			Array.from(node.childNodes).forEach(node => walk(node, styles));
		}
	}
	walk(stringDoc, []);

	return [string].concat(colors);
}

module.exports = stringToFormatArray;