# console.js

A sane way to interface with your console and use the latest features.

![console](https://cloud.githubusercontent.com/assets/139784/2598269/2cf8e294-bac3-11e3-8f5e-875cb251839d.gif)

## support

[![Selenium Test Status](https://saucelabs.com/browser-matrix/consolejs.svg)](https://saucelabs.com/u/consolejs)

## modern usage (Chrome / Firefox / IE >= 9)

modern mode is great if you're fine with overriding console methods, and don't mind additional methods on your String.prototype

```javascript
// Step 1: override console methods and enable String.prototype styles
Console.attach();
Console.styles.attach();

// Step 2: register your styles
Console.styles.register({
	bold: 'font-weight:bold',
	underline: 'text-decoration:underline',

	red: 'color:#de4f2a',
	blue: 'color:#1795de',
	green: 'color:green',
	grey: 'color:grey',

	code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
});

// Step 3: profit!
console.log('hello'.red.bold);
```

## compatibility usage

compatibility mode is useful if you want your logs to work in IE < 9, or you don't want be invasive on the console or String.prototype

```javascript
// Step 1: because we aren't using String.prototype, we make our lives a little easier by creating a shortcut
window.F = Console.styles.format;

// Step 2: register your styles
Console.styles.register({
	bold: 'font-weight:bold',
	underline: 'text-decoration:underline',

	red: 'color:#de4f2a',
	blue: 'color:#1795de',
	green: 'color:green',
	grey: 'color:grey',

	code: 'background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1); line-height: 18px; text-decoration:underline;'
});

// Step 3: profit!
Console.log(F('hello', 'red,bold'));
```