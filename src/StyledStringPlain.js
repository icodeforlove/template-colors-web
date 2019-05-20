function span (string, style) {
	return `<span style="${style}">${string}</span>`;
}

class StyledStringPlain {
	constructor(string) {
		this.string = string;
	}

	toString() {
		return this.string;
	}

	rgb (r, g, b) {
		return new StyledStringPlain(span(this, `color: rgb(${r}, ${g}, ${b})`));
	}

	rgbBG (r, g, b) {
		return new StyledStringPlain(span(this, `background-color: rgb(${r}, ${g}, ${b})`));
	}

	style (style) {
		return new StyledStringPlain(span(this, style));
	}
}

try {
	String.prototype.rgb = StyledStringPlain.prototype.rgb;
	String.prototype.rgbBG = StyledStringPlain.prototype.rgbBG;
	String.prototype.style = StyledStringPlain.prototype.style;
} catch (error) {
	console.log(error);
}

module.exports = StyledStringPlain;