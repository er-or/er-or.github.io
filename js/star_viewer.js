
// Apply a rotation to the galactic coordinates first.
// This is for use with the repeating CSS background,
// So that the CSS background can be rotated, too.
const GALACTIC_COORDINATE_ROTATION = 45;


// Background image to use, or not
const STAR_MAP_BACKGROUND_IMAGE_URL = 'img/galaxy_background.webp';

//
// Simple class, placeholder for other possible calculations such as RA and DEC from 
// Earth latitude, longitude, azimuth and date.  Or possibly from Mars!
// But, for now, primarily used for shared variables for rendering to current viewport.
//
class StarViewer {

	static ORTHOGRAPHIC_PROJECTION = 1; // Not currently used
	static EQUIRECTANGULAR_PROJECTION = 2;  // Galactic coordinates displayed horizontally
	static EQUIRECTANGULAR_PROJECTION_VERTICLE = 3;  // Galactic coordinates displayed vertically

	constructor() {
		this.longitude = 0; // Observer's galactic direction
		this.latitude = 0; // Observer's galactic direction
		this.rotation = 0; // Observer's tilt of FOV relative to galactic coordinates
		this.horizontalFov = 120;
		this.verticalFov = 90;
		this.projection = StarViewer.EQUIRECTANGULAR_PROJECTION;
	}

	getHorizontalFov() {
		return this.horizontalFov;
	}

	getVerticalFov() {
		return this.verticalFov;
	}

	// Get the observer's galactic direction Right Ascension
	getGalacticDirectionLatitude() {
		return this.longitude;
	}

	// Get the observer's galactic direction Declination
	getGalacticDirectionLongitude() {
		return this.latitude;
	}

	// Get the observer's rotation angle relative to galactic coordinates
	getGalacticDirectionRotationAngle() {
		return this.galacticRotationAngle;
	}




	panUp(degrees) {
		if (!degrees || degrees < 0) {
		//	degrees = 1;
		}
		const r = (this.rotation - GALACTIC_COORDINATE_ROTATION) * Math.PI / 180;
		this.latitude -= degrees * Math.cos(r);
		this.longitude -= degrees * Math.sin(r);
	}

	panDown(degrees) {
		if (!degrees || degrees < 0) {
		//	degrees = 1;
		}
		const r = (this.rotation - GALACTIC_COORDINATE_ROTATION) * Math.PI / 180;
		this.latitude += degrees * Math.cos(r);
		this.longitude += degrees * Math.sin(r);
	}

	panLeft(degrees) {
		if (!degrees || degrees < 0) {
			degrees = 1;
		}
		const r = (this.rotation - GALACTIC_COORDINATE_ROTATION) * Math.PI / 180;
		this.longitude -= degrees * Math.cos(r);
		this.latitude += degrees * Math.sin(r);
	}

	panRight(degrees) {
		if (!degrees || degrees < 0) {
			degrees = 1;
		}
		const r = (this.rotation - GALACTIC_COORDINATE_ROTATION) * Math.PI / 180;
		this.longitude += degrees * Math.cos(r);
		this.latitude -= degrees * Math.sin(r);
	}

}






//
//
// Class Star
//
//
class Star {

	constructor(id, galacticeLongitude, galacticLatitutde, magnitude, bvIndex) {
		this.id = id;
		this.galacticeLongitude = galacticeLongitude;
		this.galacticLatitutde = galacticLatitutde;
		this.magnitude = magnitude;
		this.bvIndex = bvIndex;
	}

	// Returns the galactic longitude in radians
	getGalacticLongitude() {
		return this.galacticeLongitude;
	}

	// Returns the galactic latitude in radians
	getGalacticLatitude() {
		return this.galacticLatitutde;
	}

	getMagnitude() {
		return this.magnitude;
	}

	getBvIndex() {
		return this.bvIndex;
	}





	//
	// Converts the equatorial (earth) coordinates to galactic (center of galaxy) coordinates.
	//
	// Source:
	//	https://www.atnf.csiro.au/people/Tobias.Westmeier/tools_coords.php
	//
	static equatorialToGalacticDeg(raDeg, decDeg) {

		// Convert degrees to radians
		const alphaRad = raDeg * Math.PI / 180;
		const deltaRad = decDeg * Math.PI / 180;

		// Offset to galactic center in epoch J2000.0 (these have probably been updated since)
		const alphaRad0 = 3.3660332687500040504071453976533;	//Math.PI * 192.8595 / 180;
		const deltaRad0 = 0.47347990079802970494616652643866;	//Math.PI * 27.1284 / 180;
		const lonRad0 = 2.1455681560616692355038315355184;		//Math.PI * 122.9320 / 180;

		// Calculate the numerator and denominator separately for atan2
		// tan(l0−l) = ( cos(δ) * sin(α−α0) ) / ( sin(δ) * cos(δ0) − cos(δ) * sin(δ0) * cos(α−α0) )
		let lonDiffNumerator = Math.cos(deltaRad) * Math.sin(alphaRad - alphaRad0);
		let lonDiffDenominator = Math.sin(deltaRad) * Math.cos(deltaRad0) - Math.cos(deltaRad) * Math.sin(deltaRad0) * Math.cos(alphaRad - alphaRad0);

		// sin(b) = sin(δ) * sin(δ0) + cos(δ) * cos(δ0) * cos(α−α0)
		let sinLat = Math.sin(deltaRad) * Math.sin(deltaRad0) + Math.cos(deltaRad) * Math.cos(deltaRad0) * Math.cos(alphaRad - alphaRad0);

		// Calculate the difference in longitude in radians
		const lonRad = lonRad0 - Math.atan2(lonDiffNumerator, lonDiffDenominator);

		// Grab the latitude
		let latRad = Math.asin(sinLat);

		// Convert to degrees
		let lonDeg = lonRad * 180 / Math.PI;
		let latDeg = latRad * 180 / Math.PI;
		lonDeg = (lonDeg < 0) ? (360 + lonDeg) : lonDeg;

		// Return the galactic coordinates
		return { galacticRA: lonDeg, galacticDEC: latDeg };

	}

	static equatorialToGalacticRad(alphaRad, deltaRad) {

		// Offset to galactic center in epoch J2000.0
		const alphaRad0 = 3.3660332687500040504071453976533;	//Math.PI * 192.8595 / 180;
		const deltaRad0 = 0.47347990079802970494616652643866;	//Math.PI * 27.1284 / 180;
		const lonRad0 = 2.1455681560616692355038315355184;		//Math.PI * 122.9320 / 180;

		// Calculate the numerator and denominator separately for atan2
		// tan(l0−l) = ( cos(δ) * sin(α−α0) ) / ( sin(δ) * cos(δ0) − cos(δ) * sin(δ0) * cos(α−α0) )
		let lonDiffNumerator = Math.cos(deltaRad) * Math.sin(alphaRad - alphaRad0);
		let lonDiffDenominator = Math.sin(deltaRad) * Math.cos(deltaRad0) - Math.cos(deltaRad) * Math.sin(deltaRad0) * Math.cos(alphaRad - alphaRad0);

		// sin(b) = sin(δ) * sin(δ0) + cos(δ) * cos(δ0) * cos(α−α0)
		let sinLat = Math.sin(deltaRad) * Math.sin(deltaRad0) + Math.cos(deltaRad) * Math.cos(deltaRad0) * Math.cos(alphaRad - alphaRad0);

		// Calculate the difference in longitude in radians
		const lonRad = lonRad0 - Math.atan2(lonDiffNumerator, lonDiffDenominator);

		// Grab the latitude
		let latRad = Math.asin(sinLat);

		// Return the galactic coordinates
		return { lon: lonRad, lat: latRad };
	}

	// Define color ranges and corresponding magnitudes and RGBA values
	static colorRanges = {
		//blue: { minBV: -0.5, maxBV: 0.5, minMv: 0, maxMv: 5, rgba: [0, 0, 255, 1] },
		//white: { minBV: 0.5, maxBV: 1.0, minMv: 5, maxMv: 10, rgba: [255, 255, 255, 1] },
		//yellow: { minBV: 1.0, maxBV: 1.5, minMv: 10, maxMv: 15, rgba: [255, 255, 0, 1] },
		//orange: { minBV: 1.5, maxBV: 2.0, minMv: 15, maxMv: 20, rgba: [255, 165, 0, 1] },
		//red: { minBV: 2.0, maxBV: 3.0, minMv: 20, maxMv: 25, rgba: [255, 0, 0, 1] }
		blue: { minBV: -0.5, maxBV: 0.5, minMv: 0, maxMv: 5, rgba: [128, 128, 255, 1] },
		white: { minBV: 0.5, maxBV: 1.0, minMv: 5, maxMv: 10, rgba: [255, 255, 255, 1] },
		yellow: { minBV: 1.0, maxBV: 1.5, minMv: 10, maxMv: 15, rgba: [255, 255, 128, 1] },
		orange: { minBV: 1.5, maxBV: 2.0, minMv: 15, maxMv: 20, rgba: [255, 188, 128, 1] },
		red: { minBV: 2.0, maxBV: 3.0, minMv: 20, maxMv: 25, rgba: [255, 128, 128, 1] }
	};


	// Function to interpolate RGBA color based on B-V value
	static interpolateColor(BV) {
		for (let color in Star.colorRanges) {
			const range = Star.colorRanges[color];
			if (BV >= range.minBV && BV < range.maxBV) {
				const proportion = (BV - range.minBV) / (range.maxBV - range.minBV);
				const rgba = range.rgba.map((channel, index) => {
					// Interpolate each channel
					const minChannel = range.rgba[index];
					const maxChannel = Star.colorRanges[Star.getNextColor(color)].rgba[index];
					return Math.round(minChannel + proportion * (maxChannel - minChannel));
				});
				return `rgba(${rgba.join(',')})`;
			}
		}
		// Return a default value if B-V is out of range
		return 'rgba(255, 255, 255, 1)';
	}

	// Helper function to get the next color in the sequence
	static getNextColor(color) {
		const colors = ['blue', 'white', 'yellow', 'orange', 'red'];
		const index = colors.indexOf(color);
		return colors[(index + 1) % colors.length];
	}



}




//
// Make a list of bright stars to twinkle
//
class BrightStar extends Star {

	//
	// Bright Star Data from https://astrosci.scimuze.com/stellar_data.htm
	//
	// name is the name of the star
	//
	// bayer_star
	//	A greek letter abbreviation or a latin letter, which sometimes will need to be escaped because they may contain '^'
	//
	// bayer_constel 
	//	The three-letter Bayer constellation abbrivation, like 'Ori', 'Leo' or 'Peg'
	//
	// multi_star_designation 
	//	refers to the designation of multiple stars within a single system or multiple components of a binary or multiple star system. 
	//	These designations are commonly used in astronomy to denote different components or characteristics of stars within a system.
	//	Here is what these designations typically mean:
	//		A: This designation usually refers to the primary or main star in a multiple star system. It could be the brightest or most massive component.
	//		B: This designation is commonly used for the secondary star in a binary star system, orbiting around the primary star (designated as 'A').
	//		C: If 'C' is present, it generally indicates the third star in a trinary star system. It orbits around the primary ('A') and secondary ('B') stars.
	//		AB: This designation signifies that the stars 'A' and 'B' are physically associated as a binary system. They may be gravitationally bound to 
	//			each other and orbit around a common center of mass.
	//		ABC: Similarly, 'ABC' indicates a trinary star system where all three stars are physically associated and interact gravitationally.
	//
	// RA (-90 to 90 degrees)
	//	Right Ascension: It is akin to longitude on the celestial sphere. It measures the eastward angular distance of a celestial object 
	//	from the vernal equinox along the celestial equator. RA is usually expressed in hours, minutes, and seconds.  But here it is a floating point value.
	//
	// DEC (0 to 360 degrees)
	//	Declination: It is akin to latitude on the celestial sphere. It measures the north or south angular distance of a celestial object 
	//	from the celestial equator. DEC is usually expressed in degrees, minutes, and seconds.  But here it is a floating point value.
	//
	// glon (radians)
	//	Galactic Longitude (l): The angular distance of celestial objects east or west of the galactic center, measured along the plane of 
	//	the Milky Way galaxy.
	//
	// glat (radians)
	//	Galactic Latitude (b): The angular distance of celestial objects above or below the plane of the Milky Way galaxy.
	//
	// V
	//	Magnitude (Apparent Visual Magnitude): It is a measure of the brightness of a celestial object as seen from Earth, 
	//	without accounting for any filtering or extinction effects. Lower values indicate brighter objects
	//
	// B-V
	//	Color Index: It is a measure of the color of a star in the UBV system, specifically the difference in brightness
	//	between a star's visual (V) magnitude (i.e., its brightness as seen by the human eye) and its blue (B) magnitude. 
	//	It helps astronomers determine the temperature of a star; bluer stars have negative B-V values, while redder stars 
	//	have positive B-V values.  The B-V color index typically ranges from around -0.5 to +2.0 for main sequence stars.
	//
	// spectral_type
	//	In the spectral classification system, stars are categorized into different types based on the characteristics of 
	//	their spectra.
	//
	// PI (arcseconds)
	//	(Parallax Angle): Parallax angle is a measure of the apparent shift in the position of a star when viewed from
	//	different vantage points on Earth's orbit around the Sun. 
	//
	// Mv
	//	(Absolute Visual Magnitude): Absolute visual magnitude is a measure of the intrinsic brightness of a star as it 
	//	would appear if it were located at a standard distance of 10 parsecs (about 32.6 light-years) from Earth.
	//
	// D (LY)
	//	(Distance in Light-Years): This represents the distance to the star measured in light-years.
	//
	// Mu ('/yr)
	//	(Proper Motion): The apparent motion of a star across the sky due to its actual motion through space relative to the Sun. 
	//
	// PA_deg (degrees)
	//	(Position Angle): Position angle refers to the angle between the north direction and the direction to another object in the sky, 
	//	measured eastward from north through east. 
	//	It is often used to describe the direction of motion, orientation, or alignment of celestial objects relative to a reference point.
	//
	// RV_km_s
	//	RV (km/s) (Radial Velocity): Radial velocity is the component of a star's velocity along the line of sight from Earth. 
	//	It indicates whether the star is moving toward or away from Earth and is measured in units of kilometers per second.
	//
	constructor(name, bayer_star, bayer_constel, multi_star_designation, RA, DEC, glon, glat, V, BV, spectral_type, PI, Mv, D_ly, Mu_arcsec_yr, PA_deg, RV_km_s, remarks) {
		super(
			'star_bayer_' + bayer_star.replace('_', '_sub_').replace('^', '_sup_') + '_' + bayer_constel,
			glon, glat, V, BV
		);
		this.name = name;						// Star's name (not always given)
		this.bayer_star = bayer_star;			// Star's latin or abbreviation of greek letter in Bayer system
		this.bayer_constel = bayer_constel;		// Constellation 3-letter abbreviation of Bayer system
		this.multi_star_designation = multi_star_designation;	
		this.RA = RA;							// RA (Right Ascension)
		this.DEC = DEC;							// DEC (Declination)
		this.glon = glon;						// Galactic coordinates longitude
		this.glat = glat;						// Galactic coordinates latitude
		this.V = V;								// V (Magnitude)
		this.BV = BV;							// B-V (Color Index)
		this.spectral_type = spectral_type;		// Spectral type
		this.PI = PI;
		this.Mv = Mv;
		this.D_ly = D_ly;
		this.Mu_arcsec_yr = Mu_arcsec_yr;
		this.PA_deg = PA_deg;
		this.RV_km_s = RV_km_s;
		this.remarks = remarks;	// Remarks


		this.domId = 'star_bayer_' + this.bayer_star.replace('_', '_sub_').replace('^', '_sup_') + '_' + this.bayer_constel;
	}






}












const STAR_VIEWER = new StarViewer();

const STAR_DIV_SIZE = 50; // The maximum size of div containing each star which needs to contain blurs
const STAR_MAX_RADIUS = 4; // The maximum radius of a star

function getStarSizeFromMagnitude(maxMagSize, mag) {
	return maxMagSize - Math.log10(mag + 2) * 5;
}

function getStarSvg(starX, starY, starR, starColor, star) {
	// Might want to give the star.name as the title
	return '<svg width="' + STAR_DIV_SIZE + '" height="' + STAR_DIV_SIZE + '" viewBox="0 0 ' + STAR_DIV_SIZE + ' ' + STAR_DIV_SIZE + '" xmlns="http://www.w3.org/2000/svg">'
		+ '<defs>'
			+ '<filter id="bigBackgroundBlur" x="-' + STAR_DIV_SIZE/2 + '" y="-' + STAR_DIV_SIZE/2 + '" width="' + STAR_DIV_SIZE + '" height="' + STAR_DIV_SIZE + '">'
			+ '	<feGaussianBlur in="SourceGraphic" stdDeviation="' + starR*4 + '" />'
			+ '</filter>'
			+ '<filter id="littleRotatingBlur" x="-50%" y="-50%" width="200%" height="200%">'
			+ '	<feGaussianBlur in="SourceGraphic" stdDeviation="0 0.5" />'
			+ '</filter>'
		+ '</defs>'
		+ '<circle cx="' + starX + '" cy="' + starY + '" r="' + starR + '" fill="' + starColor + '" filter="url(#bigBackgroundBlur)" />'
		+ '<circle cx="' + starX + '" cy="' + starY + '" r="' + starR + '" fill="' + starColor + '" filter="url(#littleRotatingBlur)">'
			+ '<animateTransform '
			+ '	attributeName="transform" attributeType="XML" '
			+ '	type="rotate" from="0 ' + starX + ' ' + starY + '" to="360 ' + starX + ' ' + starY + '" '
			+ '	begin="0s" dur="' + Math.floor(1 + Math.random() * 5) +'s" repeatCount="indefinite" '
			+ '/>'
		+ '</circle>'
		+ '<circle cx="' + starX + '" cy="' + starY + '" r="' + starR + '" fill="' + starColor + '" />'
		+ '</svg>'
	;
}



function placeStarInDocument(star, starX, starY, viewportW, viewportH) {

	const maxMagnitudeSize = STAR_MAX_RADIUS * 2;
	const brightStarContainer = document.getElementById('star_map_bright_star_container');


	// Try to get the star by it's DOM ID, create if does not exist
	let starElement = document.getElementById('bs_' + star.id);
	if (!starElement) {
		starElement = document.createElement('div');
		starElement.setAttribute('id', 'bs_' + star.id);
		starElement.classList.add('star');

		starElement.style.width = STAR_DIV_SIZE + 'px';
		starElement.style.height = STAR_DIV_SIZE + 'px';


		const starColor = Star.interpolateColor(star.getBvIndex());
		//starElement.style.border = 'solid ' + starColor + ' 1px';

		let starSize = getStarSizeFromMagnitude(maxMagnitudeSize, star.getMagnitude());

		if (starSize < 1) {
			starSize = 1;
		}
		if (starSize > maxMagnitudeSize) {
			starSize = maxMagnitudeSize;
		}

		// Put title on the div, but the div is too large
// NOTE: need to make hand-made javascript callback for on hover over SVG element
		//if (star.name && star.name.length > 0) {
		//	starElement.title = star.name;
		//}


		starElement.innerHTML = getStarSvg(Math.floor(STAR_DIV_SIZE / 2), Math.floor(STAR_DIV_SIZE / 2), (starSize/2), starColor, star);

		// Append the star element to the body
		brightStarContainer.appendChild(starElement);

	}
	if (starX + STAR_DIV_SIZE > 0 && starX < viewportW && starY + STAR_DIV_SIZE > 0 && starY < viewportH) {
		starElement.style.left = (starX - STAR_DIV_SIZE / 2) + 'px';
		starElement.style.top = (starY - STAR_DIV_SIZE / 2) + 'px';
		starElement.style.visibility = 'visible';
	} else {
		starElement.style.visibility = 'hidden';
	}

}

//
// Displays the stars in a equirectangular projection.
// This can use a repeating background image of the galaxy, but the corners
// are highly skewed
//
function updateStarmapOrientationEquirectangular() {

	let starMapContainer = document.getElementById('star_map_bg_container');

	let observer = STAR_VIEWER;

	// Define field of view variables
	let observerFovW = observer.getHorizontalFov();	// This is the FOV width in degrees
	let observerFovH = observer.getVerticalFov();	// This is the FOV height in degrees

	// Which direction is the observer looking straight up from on the celestial plain?
	let observerLon = observer.getGalacticDirectionLatitude();		// (-180 to 180)
	let observerLat = observer.getGalacticDirectionLongitude();	// (-90 S to 90 N)
	let observerRot = observer.getGalacticDirectionRotationAngle() * Math.PI / 180;

	if (observerLat > 360) observerLat = observerLat % 360;
	if (observerLat < 360) observerLat = -((-observerLat) % 360);
	if (observerLon > 360) observerLon = observerLon % 360;
	if (observerLon < -360) observerLon = -((-observerLon) % 360);
	//while (observerLon > 180) observerLon -= 360; // Spin around
	//while (observerLon < -180) observerLon += 360; // Spin around


	// Get viewport dimensions
	let viewportW = Math.max(window.innerWidth, document.body.scrollWidth);
	let viewportH = window.innerHeight;

	// How much to scale the background by, calculated from FOV but also needs to scale correctly
	let scaleW = viewportW;
	let scaleH = viewportH;
	if (viewportW / observerFovW > viewportH / observerFovH) {
		// Too wide, make the overflow height taller
		scaleH = viewportH * (viewportW / observerFovW) / (viewportH / observerFovH);
	} else {
		// Too tall, make the overflow width wider
		scaleW = viewportW * (viewportH / observerFovH) / (viewportW / observerFovW);
	}


	// Calculate background size in pixels from FOVs

	let backgroundW = scaleW * 360 / observerFovW;
	let backgroundH = scaleH * 180 / observerFovH;


	// GALACTIC_COORDINATE_ROTATION
	switch (GALACTIC_COORDINATE_ROTATION) {
		case 90:
		case -90:
			backgroundW = (scaleW * 180) / observerFovW;
			backgroundH = (scaleH * 360) / observerFovH;
			break;
		case 0:
		case 180:
		case -180:
			backgroundW = (scaleW * 360) / observerFovW;
			backgroundH = (scaleH * 180) / observerFovH;
			break;
		default:
			break;
	}

	let starContainerImage = null;
	let backgroundX = (viewportW - backgroundW) / 2 - (backgroundW * observerLon / 360);
	let backgroundY = (viewportH - backgroundH) / 2 - (backgroundH * observerLat / 360);
	if (GALACTIC_COORDINATE_ROTATION == 90) {
		backgroundX = (viewportW - backgroundW) / 2 + (backgroundW * observerLat / 360);
		backgroundY = (viewportH - backgroundH) / 2 - (backgroundH * observerLon / 360);
	} else if (GALACTIC_COORDINATE_ROTATION == -90) {
		backgroundX = (viewportW - backgroundW) / 2 - (backgroundW * observerLat / 360);
		backgroundY = (viewportH - backgroundH) / 2 + (backgroundH * observerLon / 360);
	} else if (GALACTIC_COORDINATE_ROTATION == 180 || GALACTIC_COORDINATE_ROTATION == -180) {
		backgroundX = (viewportW - backgroundW) / 2 + (backgroundW * observerLon / 360);
		backgroundY = (viewportH - backgroundH) / 2 + (backgroundH * observerLat / 360);
	} else {
		if (GALACTIC_COORDINATE_ROTATION && STAR_MAP_BACKGROUND_IMAGE_URL) {
			starContainerImage = document.getElementById("star_map_rotating_bg_image");
			if (!starContainerImage) {
				starContainerImage = document.createElement('img');
				starContainerImage.id = 'background_star_container_image';
				starContainerImage.style.position = 'absolute';
				starContainerImage.style.backgroundColor = 'black';
				starContainerImage.src = STAR_MAP_BACKGROUND_IMAGE_URL;
				starMapContainer.appendChild(starContainerImage);
			} else {
				starContainerImage.style.opacity = 1;
			}
		}
	}


	// Set background positioning

	if (starContainerImage) {
		starContainerImage.style.left = backgroundX + 'px';
		starContainerImage.style.top = backgroundY + 'px';
		starContainerImage.style.width = backgroundW + 'px';
		starContainerImage.style.height = backgroundH + 'px';
		starContainerImage.style.transform = 'rotate(' + GALACTIC_COORDINATE_ROTATION + 'deg)';
	} else {
		starMapContainer.style.backgroundSize = backgroundW + 'px ' + backgroundH + 'px';
		starMapContainer.style.backgroundPositionX = backgroundX + 'px';
		starMapContainer.style.backgroundPositionY = backgroundY + 'px';
	}




	const centerX = backgroundX + backgroundW/2;
	const centerY = backgroundY + backgroundH/2;


	//
	// Render bright stars
	//
	const galacticCoordinateRotationRad = GALACTIC_COORDINATE_ROTATION*Math.PI/180;
	BRIGHT_STARS.forEach(star => {

		let starRelLon = star.getGalacticLongitude();
		let starRelLat = star.getGalacticLatitude();


		let starX = centerX - backgroundW * starRelLon / (2*Math.PI);
		let starY = centerY - backgroundH * starRelLat / (Math.PI);

		if (GALACTIC_COORDINATE_ROTATION == 0) {
			starX = centerX - backgroundW * starRelLon / (2*Math.PI);
			starY = centerY - backgroundH * starRelLat / (Math.PI);
		} else if (GALACTIC_COORDINATE_ROTATION == -90) {
			starX = centerX - backgroundW * starRelLat / (Math.PI);
			starY = centerY + backgroundH * starRelLon / (2*Math.PI);
		} else if (GALACTIC_COORDINATE_ROTATION == 90) {
			starX = centerX + backgroundW * starRelLat / (Math.PI);
			starY = centerY - backgroundH * starRelLon / (2*Math.PI);
		} else if (GALACTIC_COORDINATE_ROTATION == 180) {
			starX = centerX + backgroundW * starRelLon / (2*Math.PI);
			starY = centerY + backgroundH * starRelLat / (Math.PI);
		} else {
			// rotate
			starX = centerX - backgroundW * starRelLon / (2*Math.PI);
			starY = centerY - backgroundH * starRelLat / (Math.PI);

			const xDiff = starX - centerX;
			const yDiff = starY - centerY;
			const r = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
			const a = Math.atan2(yDiff, xDiff);

			starX = centerX + r * Math.cos(a + galacticCoordinateRotationRad);
			starY = centerY + r * Math.sin(a + galacticCoordinateRotationRad);
		}


		while (starX < 0) {
			starX += backgroundW;
		}
		while (starX > viewportW) {
			starX -= backgroundW;
		}
		while (starY < 0) {
			starY += backgroundH;
		}
		while (starY > viewportH) {
			starY -= backgroundH;
		}

		placeStarInDocument(star, starX, starY, viewportW, viewportH);
	});

	if (typeof BACKGROUND_STARS !== 'undefined') {

		const canvasWidth = document.documentElement.clientWidth;
		const canvasHeight = document.documentElement.clientHeight;

		const backgroundCanvasContainer = document.getElementById('star_map_background_canvas_container');
		let backgroundCanvas = document.getElementById('background_canvas');

		// Dynamically create a background canvas element as background stars are loaded
		if (!backgroundCanvas) {
			backgroundCanvas = document.createElement('canvas');
			backgroundCanvas.id = 'background_canvas';
			backgroundCanvas.width = canvasWidth;
			backgroundCanvas.height = canvasHeight;
			backgroundCanvas.style.background = 'transparent';

			// Fade in slowly
			backgroundCanvas.style.opacity = '0'; // Set initial opacity to 0
			backgroundCanvas.style.transition = 'opacity 2s ease';

			// Callback to make it fade in
			setTimeout(() => {backgroundCanvas.style.opacity = '1';}, 500);

			// Attach to canvas container div
			backgroundCanvasContainer.appendChild(backgroundCanvas);

		} else if (backgroundCanvas.width != canvasWidth || backgroundCanvas.height != canvasHeight) {
			// Might need to adjust the size
			backgroundCanvas.width = canvasWidth;
			backgroundCanvas.height = canvasHeight;
		}


		// Clear the background
		const ctx = backgroundCanvas.getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.fillStyle = 'white';

		const maxMagnitudeSize = STAR_MAX_RADIUS * 2;

		// Draw the stars
		BACKGROUND_STARS.forEach(star => {
			// Calculate the screen position of the star

			let starRelLon = star.getGalacticLongitude();
			let starRelLat = star.getGalacticLatitude();

			while (starRelLon > Math.PI) starRelLon -= 2 * Math.PI;
			while (starRelLon <= -Math.PI) starRelLon += 2 * Math.PI;
			while (starRelLat > Math.PI / 2) starRelLat -= 2 * Math.PI;
			while (starRelLat <= -Math.PI / 2) starRelLat += 2 * Math.PI;

	// ROTATE

			let starX = centerX - backgroundW * starRelLon / (2*Math.PI);
			let starY = centerY - backgroundH * starRelLat / Math.PI;


			if (GALACTIC_COORDINATE_ROTATION == 0) {
				starX = centerX - backgroundW * starRelLon / (2*Math.PI);
				starY = centerY - backgroundH * starRelLat / (Math.PI);
			} else if (GALACTIC_COORDINATE_ROTATION == -90) {
				starX = centerX - backgroundW * starRelLat / (Math.PI);
				starY = centerY - backgroundH * starRelLon / (2*Math.PI);
			} else if (GALACTIC_COORDINATE_ROTATION == 90) {
				starX = centerX + backgroundW * starRelLat / (Math.PI);
				starY = centerY - backgroundH * starRelLon / (2*Math.PI);
			} else if (GALACTIC_COORDINATE_ROTATION == 180) {
				starX = centerX + backgroundW * starRelLon / (2*Math.PI);
				starY = centerY + backgroundH * starRelLat / (Math.PI);
			} else {

				starX = centerX - backgroundW * starRelLon / (2*Math.PI);
				starY = centerY - backgroundH * starRelLat / (Math.PI);

				const xDiff = starX - centerX;
				const yDiff = starY - centerY;
				const r = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
				const a = Math.atan2(yDiff, xDiff);

				starX = centerX + r * Math.cos(a + galacticCoordinateRotationRad);
				starY = centerY + r * Math.sin(a + galacticCoordinateRotationRad);
			}


			while (starX < 0) {
				starX += backgroundW;
			}
			while (starX > viewportW) {
				starX -= backgroundW;
			}
			while (starY < 0) {
				starY += backgroundH;
			}
			while (starY > viewportH) {
				starY -= backgroundH;
			}

			if (starX >= 0 && starY >= 0 && starX <= canvasWidth && starY <= canvasHeight) {
				let starR = Math.ceil(getStarSizeFromMagnitude(maxMagnitudeSize, star.getMagnitude()) / 4);
				ctx.beginPath();
				//ctx.fillStyle = Star.interpolateColor(star.getBvIndex());
				ctx.arc(starX, starY, starR, 0, Math.PI * 2);
				ctx.fill();
			}

		});

	}
}


function updateStarmapOrientation() {

	// We might want to use equarectangular, if low performance, with a background image
	// Or we might want to render the stars dynamically, if high performance
	// There isn't an easy way to test this without buying lots of computers.
	switch (STAR_VIEWER.projection) {
		case StarViewer.ORTHOGRAPHIC_PROJECTION:
			updateStarmapOrientationOrthographic();
			break;
		case StarViewer.EQUIRECTANGULAR_PROJECTION:
		default:
			updateStarmapOrientationEquirectangular();
	}
	//console.log('updating star view');
}







//
// Loads the Yale bright star catalogue from javascript file in dynamically in background
//
async function loadBackgroundStars() {
	const script = document.createElement('script');
	script.src = 'js/background_stars_4000.js';
	script.onload = function() {
		updateStarmapOrientation();
	};
	document.body.appendChild(script);
}

