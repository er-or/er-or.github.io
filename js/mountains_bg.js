// Adapted from https://thebookofshaders.com/13/
class FBM {

	constructor(amplitude, randomize = false, octaves = 1, lacunarity = 2.0, gain = 0.5) {
		this.octaves = octaves;
		this.amplitude = amplitude;
		this.lacunarity = lacunarity;
		this.gain = gain;
		this.randomize = randomize;
	}

	static noise(st, randomize) {
		let i = Math.floor(st);
		let f = st - i;

		// Four corners in 2D of a tile
		let a = FBM.random([i, i], randomize);
		let b = FBM.random([i + 1, i], randomize);
		let c = FBM.random([i, i + 1], randomize);
		let d = FBM.random([i + 1, i + 1], randomize);

		let u = f * f * (3.0 - 2.0 * f);

		return FBM.mix(a, b, u)
		  + (c - a) * u * (1.0 - f)
		  + (d - b) * f * u
		;
	}

	static mix(x, y, a) {
		return x * (1.0 - a) + y * a;
	}

	static random(st, randomize) {
		if (randomize) {
			return Math.random() * FBM.fract(Math.sin(FBM.dot([st[0], st[1]], [12.9898, 78.233])) * 43758.5453123);
		}
		return FBM.fract(Math.sin(FBM.dot([st[0], st[1]], [12.9898, 78.233])) * 43758.5453123);
	}

	static fract(x) {
		return x - Math.floor(x);
	}

	static dot(vec1, vec2) {
		if (vec1.length !== vec2.length) {
			return null;
		}
		let result = 0;
		const length = vec1.length;
		for (let i = 0; i < length; i++) {
			result += vec1[i] * vec2[i];
		}
		return result;
	}

	fbm(x, amplitude) {
		if (!amplitude) {
			amplitude = this.amplitude;
		}
		let frequency = 1.504;
		let y = 0;
		for (let i = 0; i < this.octaves; i++) {
			y += amplitude * FBM.noise(frequency * x, this.randomize);
			frequency *= this.lacunarity;
			amplitude *= this.gain;
		}
		return y;
	}
}


function getHorizonMountainsSvg(svgWidth) {

	const randomize = false;
	const svgHeight = 100;

	const stepSize = 20;
	const topCenterY = 40;
	const midCenterY = 50;

	const fbm = new FBM(stepSize, randomize, 2);
	const fbmUpperOffset = 333;
	const fbmLowerOffset = 555;


	let foothillBottomY = svgHeight;

	const numSteps = Math.floor(svgWidth / stepSize) + 2;

	let mountainPaths = '';
	let foothillPath = "M 0," + topCenterY + " ";

	let lastPx = 0;
	let lastPy = 60;
	let lastLoPy = midCenterY;
	let lastHiPy = 60;

	let clipBlurTopXs = [];
	let clipBlurTopYs = [];
	let clipBlurLowYs = [];

	for (let x = 0; x < numSteps; x++) {
		let px = x * stepSize;
		let py = fbm.fbm(x + fbmUpperOffset, stepSize*(randomize ? 1.5 : 1));

		let loPy = Math.round(midCenterY - 0.25 * fbm.fbm(x + fbmLowerOffset), 2);
		let hiPy = Math.round(topCenterY - py, 2);

		clipBlurTopXs.push(px);
		clipBlurTopYs.push(hiPy);
		clipBlurLowYs.push(loPy);

		let midPx = lastPx + 10;

		foothillPath += ' C' + Math.round(midPx, 2) + ',' + (lastLoPy - 2) + ' ' +
			Math.round(midPx, 2) + ',' + (loPy - 2) + ' ' +
			Math.round(px, 2) + ',' + (loPy - 2);

		if (x > 0) {
			if (py > lastPy) {
				mountainPaths += '<path fill="rgb(84,19,15)" stroke="rgb(84,19,15)" d="' +
					'M' + lastPx + ',' + lastHiPy +
					' C' + midPx + ',' + lastHiPy + ' ' + midPx + ',' + hiPy + ' ' + px + ',' + hiPy +
					' C' + midPx + ',' + lastHiPy + ' ' + midPx + ',' + lastLoPy + ' ' + lastPx + ',' + lastLoPy +
					'Z" />' + "\r\n";
				mountainPaths += '<path fill="rgb(107,23,13)" stroke="rgb(107,23,13)" d="' +
					'M' + px + ',' + hiPy +
					' C' + midPx + ',' + hiPy + ' ' + midPx + ',' + lastLoPy + ' ' + lastPx + ',' + lastLoPy +
					' C' + midPx + ',' + lastLoPy + ' ' + midPx + ',' + loPy + ' ' + px + ',' + loPy +
					'Z" />' + "\r\n";
			} else {
				mountainPaths += '<path fill="rgb(131,32,27)" stroke="rgb(131,32,27)" d="' +
					'M' + lastPx + ',' + lastHiPy +
					' C' + midPx + ',' + lastHiPy + ' ' + midPx + ',' + loPy + ' ' + px + ',' + loPy +
					' C' + midPx + ',' + loPy + ' ' + midPx + ',' + lastLoPy + ' ' + lastPx + ',' + lastLoPy +
					'Z" />' + "\r\n";
				mountainPaths += '<path fill="rgb(152,41,34)" stroke="rgb(152,41,34)" d="' +
					'M' + px + ',' + hiPy +
					' C' + midPx + ',' + hiPy + ' ' + midPx + ',' + lastHiPy + ' ' + lastPx + ',' + lastHiPy +
					' C' + midPx + ',' + lastHiPy + ' ' + midPx + ',' + loPy + ' ' + px + ',' + loPy +
					'Z" />' + "\r\n";
			}
		}

		lastPy = py;
		lastPx = px;
		lastHiPy = hiPy;
		lastLoPy = loPy;
	}

	foothillPath += ' L' + lastPx + ',' + foothillBottomY + ' 0,' + foothillBottomY + 'Z';

	let clipBlurPath = '';
	for (var i = 0; i < clipBlurTopXs.length; i++) {
		let px = clipBlurTopXs[i];
		let py = clipBlurTopYs[i];
		if (i == 0) {
			clipBlurPath = 'M' + px + ',' + py + ' C';
		} else {
			var midPx = Math.round((clipBlurTopXs[i - 1] + px) / 2, 2);
			clipBlurPath += ' ' +
				midPx + ',' + lastPy + ' ' +
				midPx + ',' + py + ' ' +
				px + ',' + py;
		}
		lastPx = px;
		lastPy = py;
	}

	clipBlurLowYs.reverse();

	let clipBlurLowXs = clipBlurTopXs.slice().reverse();
	clipBlurPath += ' L' + lastPx + ',' + clipBlurLowYs[0] + ' C';
	lastPy = clipBlurLowYs[0];
	for (var i = 1; i < clipBlurLowXs.length; i++) {
		let px = clipBlurLowXs[i];
		let py = clipBlurLowYs[i];
		let midPx = Math.round((clipBlurLowXs[i - 1] + px) / 2, 2);
		clipBlurPath += ' ' +
			midPx + ',' + lastPy + ' ' +
			midPx + ',' + py + ' ' +
			px + ',' + py;
		lastPx = px;
		lastPy = py;
	}
	clipBlurPath += ' Z';

	let svg = '';
	svg += '<svg x="0" y="0" width="' + svgWidth + '" height="' + svgHeight + '" viewBox="0 0 ' + svgWidth + ' ' + svgHeight + '" xmlns="http://www.w3.org/2000/svg">\r\n';
	svg += "<defs>\r\n";
	svg += '	<linearGradient id="foothills" x1="0%" y1="0%" x2="0%" y2="100%">\r\n';
	svg += '		<stop offset="0%" stop-color="rgb(211,104,88)" />\r\n';
	svg += '		<stop offset="50%" stop-color="rgb(167, 60, 51)" />\r\n';
	svg += '		<stop offset="100%" stop-color="rgba(223,184,104,0)" />\r\n';
	svg += '	</linearGradient>\r\n';

	svg += '	<filter id="blurFilter" x="0" y="-50%" width="100%" height="200%">\r\n';
	svg += '		<feGaussianBlur in="SourceGraphic" stdDeviation="2" />\r\n';
	svg += '	</filter>\r\n';

	svg += '	<clipPath id="clipMountainBlurPath">\r\n';
	svg += '		<path d="' + clipBlurPath + '" />\r\n';
	svg += '	</clipPath>\r\n';

	svg += '</defs>\r\n';
	svg += '<g style="stroke-linejoin:round">\r\n';



	svg += '<g clip-path="url(#clipMountainBlurPath)" filter="url(#blurFilter)">\r\n';
	svg += mountainPaths;
	svg += '</g>\r\n';

	svg += '<path fill="url(#foothills)" d="\r\n' + foothillPath + '" />\r\n';

	svg += "</g>\r\n";
	svg += "</svg>\r\n";

	return svg;
}
