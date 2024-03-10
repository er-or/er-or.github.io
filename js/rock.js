
function getRockPath(startX, startY, scale, fbm) {
	// Control the degree of randomness
	const xfuzz = 0.7; // Adjust this value to control the intensity of the fuzziness
	const yfuzz = 0.1; // Adjust this value to control the intensity of the fuzziness

	// Original path data
	const originalPaths = [
		"-2.28779,0.87186 -7.96324,0.75167 -11.01063,0.37325 -0.37097,-0.0461 -0.22442,-0.79873 0.12441,-0.93311 2.70811,-1.04324 6.14647,-0.64343 9.08222,-0.62209 0.71889,0.005 2.47578,0.92594 1.804,1.18195",
		"4.12697,0.52673 9.3719596,0.2637 13.4366996,-0.31101 2.08769,-0.29517 0.60487,-1.49929 -0.49766,-2.11504 -1.68849,-0.94299 -2.90858,-1.43101 -4.85214,-1.74179 -1.61873,-0.25884 -3.3524496,-0.31115 -4.9143496,0.18661 -1.22746,0.39118 -2.37931,1.32576 -3.23476,2.11505 -0.70431,0.64984 -1.58466,1.86618 0.0622,1.86618",
		"2.397366,-0.58701 5.117859,-0.73315 8.005627,-0.21995 3.218272,0.57194 2.995006,1.59582 0.08797,1.89145 -2.783873,0.28311 -5.889622,0.3136 -8.445496,0.17594 -3.046107,-0.16407 -2.515076,-1.14544 0.351899,-1.84744",
		"-4.145955,-0.21957 -4.025579,-1.59444 -0.307909,-2.3752998 4.558001,-0.95736 9.190206,-1.51477 13.372037,-0.61579 4.009764,0.8619898 4.059342,2.2684298 0.791765,2.5512198 -4.643381,0.40186 -7.848358,0.75802 -13.855893,0.43987",
		"4.329892,-0.18257 7.544385,0.31373 11.321666,0.21775 3.729199,-0.0948 7.442557,-0.24712 11.135048,-0.7776 7.182867,-1.03193 5.233448,-1.65701 -0.259122,-2.72515 -2.850731,-0.49865 -5.81637,-2.27569 -10.689304,-1.69154 -5.171228,0.6199 -8.277858,0.55361 -12.316979,1.43076 -1.320077,0.28667 -2.659536,0.61864 -3.856831,1.24415 -1.904601,0.99504 -1.29775,1.92458 0.995312,1.99062 1.880744,0.0542 2.443512,0.36273 3.67021,0.31101",
		"-1.312102,0.97964 -3.260255,2.5979 0.217724,2.61268 2.311641,0.01 4.493569,-0.57336 6.314008,-0.80867 2.434164,-0.31464 2.781438,-1.39447 -0.0311,-2.33278 -3.190196,-1.0643 -4.758582,-0.77188 -6.500632,0.52877",
		"-8.902168,0.59021 -1.590398,-2.83808 -0.351895,-3.03511 4.77273,-0.7593 8.871369,-1.67353 13.328051,-1.27561 2.082892,0.18597 6.422248,3.04424 1.319609,3.87084 -4.820788,0.78094 -9.422831,0.11681 -14.295765,0.43988",
	];
	let pathData = null;
	if (!fbm) {
		pathData = originalPaths[Math.floor(Math.random() * originalPaths.length)];
	} else {
		let semiRand = fbm.fbm(startX + startY, 1);
		if (semiRand >= 1) {
			semiRand = 0.9999;
		} else if (semiRand < 0) {
			semiRand = 0;
		}
		pathData = originalPaths[Math.floor(semiRand * originalPaths.length)];
	}

	// Split the path data into individual coordinates
	let coordinates = pathData.split(" ");
	coordinates = coordinates.map(coordinate => {
		// Apply random fuzz to each coordinate
		let xy = coordinate.split(',');
		let x = Math.round( (parseFloat(xy[0]) + (xfuzz * (Math.random() * 2 - 1))) * scale, 6);
		let y = Math.round( (parseFloat(xy[1]) + (yfuzz * (Math.random() * 2 - 1))) * scale, 6);
		return x + ',' + y;
	});

	// Reconstruct the path data with randomized coordinates
	return 'M' + Math.round(startX + 10 * scale, 6) + ',' + Math.round(startY - 6 * scale, 6) + ' c' + coordinates.join(" ") + ' Z';

}


function getRockSvg(scale) {
		let svg = '<svg x="0" y="0" viewBox="0 0 50 15" width="' + Math.round(50 * scale, 4) + '" height="' + Math.round(15 * scale, 4) + '" xmlns="http://www.w3.org/2000/svg">\r\n'
		+ '<defs>\r\n'
		+ '	<linearGradient id="rockGrad" x1="20%" x2="0" y1="0" y2="100%">\r\n'
		+ '		<stop style="stop-color:#8a1f12" offset="0" />\r\n'
		+ '		<stop style="stop-color:#5a0e0b" offset="1" />\r\n'
		+ '	</linearGradient>\r\n'
		+ '</defs>\r\n'
		+ '<path fill="url(#rockGrad)" stroke="none" d="' + getRockPath(0, 0, 1) + '" />\r\n';
		+ '</svg>\r\n'
	;
	return svg;
}

/*
function getGroundRocksSvg(container) {
	const containerR = container.getBoundingClientRect();
	const containerY = containerR.top;
	const containerW = containerR.width;
	const containerH = containerR.height;

	const rockSize = 30;
	const spacing = 120;
	const fbm = new FBM(spacing, false);

	rockSvg.width = containerW;
	rockSvg.height = containerH;

	let svg = '<svg x="0" y="0" width="' + containerW + '" height="' + containerH + '" xmlns="http://www.w3.org/2000/svg">\r\n'
		+ '<defs>\r\n'
		+ '	<linearGradient id="rockGrad" x1="20%" x2="0" y1="0" y2="100%">\r\n'
		+ '		<stop style="stop-color:#8a1f12" offset="0" />\r\n'
		+ '		<stop style="stop-color:#5a0e0b" offset="1" />\r\n'
		+ '	</linearGradient>\r\n'
		+ '</defs>\r\n'
		+ '<g>\r\n'
	;

//console.log(containerH);

	let xSpacing = 	Math.ceil(spacing / containerH) * 8;
	let ySpacing = Math.ceil(spacing / containerH) * 8;
	for (let y = 0; y <= containerH; y += ySpacing) {

		// Skip over a part of the gradient that is just a little too dark.
		let downPercent = y / containerH;
		if (downPercent > .60 && downPercent < .80) {
			continue;
		}

		xSpacing = Math.ceil((y + 1) * spacing / containerH) * 8;
		for (let x = 0; x <= containerW; x += xSpacing) {

			const rockId = 'rock_' + x + '_' + y;

			if (rockSvg.getElementById(rockId)) {
				continue;
			}

			const rockX = x + Math.round(fbm.fbm(x + y, xSpacing)*2 - xSpacing / 2);
			const rockY = y + Math.round(fbm.fbm(x + y + 1, ySpacing) - ySpacing / 2);
			if (rockY < 0) {
				continue;
			}

			let scale = 3 * rockY / containerH;
//console.log(rockX + ' x ' + rockY + ' [' + containerR.left + ' x ' + containerR.top + ', ' + containerR.width + ' x ' + containerR.height + ']');

			// Create rock path
			let rock = document.createElement('path');
			rock.id = rockId;
			rock.setAttribute('d', getRockPath(rockX, rockY, scale));
			rock.setAttribute('fill', "url(#rockGrad)");
			rock.setAttribute('stroke', "none");
			rockG.appendChild(rock);
		}
		xSpacing = Math.ceil((y + 1) * spacing / containerH) * 8;
	}
}
*/