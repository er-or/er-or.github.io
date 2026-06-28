/*
 * index.js - Main page script for Joshua Shuller's portfolio site
 *
 * Sections:
 *   1. Star viewer configuration
 *   2. Tooltip - generic floating tooltip component
 *   3. Tooltip offscreen sizing clone
 *   4. Mountains - javascript-generated SVG horizon mountains
 *   5. Waves - multi-layer SVG waves at content boundaries
 *   6. Rocks - procedural rock placement using FBM noise
 *   7. Callout boxes - floating info panels
 *   8. Toolbelt - interactive language/technology experience display
 *   9. Contact info - Vigenere-encoded contact details
 *  10. Signature animation - SVG path draw-on animation
 *  11. Page lifecycle - load, resize, and scroll handlers
 */


// =============================================================================
// 1. STAR VIEWER CONFIGURATION
// Sets the observer's latitude and longitude for the star map projection.
// See js/star_viewer.js for the canvas-based star rendering engine.
// =============================================================================

STAR_VIEWER.latitude = 0;
STAR_VIEWER.longitude = 0;


// =============================================================================
// 2. TOOLTIP
// A generic animated tooltip that floats above any element.
// Used throughout the page for star names, copy buttons, etc.
// =============================================================================

// Returns element dimensions,
// normally in a wrapper in a separate javascript file, but don't expect to use it here much
function getBoundingRect(element) {
	let elementX = 0;
	let elementY = 0;
	let elementW = 0;
	let elementH = 0;
	let ep = element;
	if (ep && ep.offsetParent) {
		while (ep.offsetParent) {
			elementX += ep.offsetLeft;
			elementY += ep.offsetTop
			ep = ep.offsetParent;
		}
	} else if (ep && (ep.x || ep.y)) {
		elementX = ep.x;
		elementY = ep.y;
	} else {
		// This is the only one we need, works in modern browsers...
		const rect = element.getBoundingClientRect();
		const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		elementX = rect.left + scrollLeft;
		elementY = rect.top + scrollTop;
		elementW = rect.width;
		elementH = rect.height;
	}
	if (element.clip && (element.clip.width || element.clip.height)) {
		elementW = element.clip.width;
		elementH = element.clip.height;
	} else if (element.offsetWidth || element.offsetHeight) {
		elementW = element.offsetWidth;
		elementH = element.offsetHeight;
	} else if (element.width || element.height) {
		elementW = element.width;
		elementH = element.height;
	} else if (element.w || element.h) {
		elementW = element.w;
		elementH = element.h;
	} else if (element.style && (element.style.width || element.style.height)) {
		elementW = element.style.width;
		elementH = element.style.height;
	} else if (element.style && (element.style.pixelWidth || element.style.pixelHeight)) {
		elementW = element.style.pixelWidth;
	}
	return {x: elementX, y: elementY, w: elementW, h: elementH};
}

// Shows a tooltip box over the specified element with the specified message.
// If the message is null, the tooltip box is hidden
let tooltipLastElement = null;
let tooltipTimeoutId = null;
function tip(element, message, bgcolor, adjustX, adjustY, timeout) {
	if (!element) element = null;
	if (!message) message = null;
	if (!bgcolor) bgcolor = null;
	if (!adjustX) adjustX = 0;
	if (!adjustY) adjustY = 0;
	if (!timeout) timeout = 0;
	const tip = document.getElementById('tooltip_box');
	if (message) {

		// Put it in the offscreen tooltip box for sizing
		offscreenTooltipBox.innerHTML = message;

		// Put it in the actual tooltip box for display, but the transition animation will take hundreds of milliseconds
		tip.innerHTML = message;

		// Place above the element
		const elementRect = getBoundingRect(element);
		const elementX = elementRect.x;
		const elementY = elementRect.y;
		const elementW = elementRect.w;
		const elementH = elementRect.h;

		// Get tooltip size
		const tooltipRect = getBoundingRect(offscreenTooltipBox);
		const tooltipW = tooltipRect.w;
		const tooltipH = tooltipRect.h;

		// Adjust for shadow?
		const tooltipShadowWidth = getComputedStyle(offscreenTooltipBox).getPropertyValue('--tooltip-shadow-width');

		// Put at center of element
		const tooltipX = Math.round(Math.max(0, Math.min(window.innerWidth - tooltipW, elementX + (elementW - tooltipW) / 2 + adjustX ))); // Ensure tip is within viewport
		const tooltipY = Math.max(0, elementY - tooltipH - 20 + adjustY); // Down arrow causes flicker in animation if too low


		// Set visible
		tip.style.visibility = 'visible';
		tip.style.opacity = '1';
		tip.style.height = 'auto';
		tip.style.left = tooltipX + 'px';
		tip.style.top = tooltipY + 'px';
		tip.style.width = tooltipW + 'px';

		// Show full size and at zero Y
		tip.style.webkitTransform = 'translateY(0px) scaleX(1)';
		tip.style.khtmlTransform = 'translateY(0px) scaleX(1)';
		tip.style.msTransform = 'translateY(0px) scaleX(1)';
		tip.style.transform = 'translateY(0px) scaleX(1)';

		// Set background color if specified
		if (bgcolor) {
			tip.style.setProperty('--tooltip-background-color', bgcolor);
		}

		// A timeout can be given to indicate that the tooltip should disappear afterwards
		if (timeout > 0) {
			// Clear the previous timeout if it exists
			if (tooltipTimeoutId) {
				clearTimeout(tooltipTimeoutId);
			}

			// Set a new timeout
			tooltipTimeoutId = setTimeout(function() {
				// Check if the last element hasn't changed
				if (element === tooltipLastElement) {
					tip.innerHTML = '';
					tip.style.height = '1px'
					tip.style.opacity = '0';
					tip.style.webkitTransform = 'translateY(-25px) scaleX(0)';
					tip.style.khtmlTransform = 'translateY(-25px) scaleX(0)';
					tip.style.msTransform = 'translateY(-25px) scaleX(0)';
					tip.style.transform = 'translateY(-25px) scaleX(0)';
				}
			}, timeout);
		}
		// Keep a reference to the previous element for the display timeout, a different tooltip might be shown
		tooltipLastElement = element;

	} else {
		// Hide the tooltip and set height to 1, hopefully the size will be animated when it's displayed again
		tip.innerHTML = '';
		tip.style.height = '1px'
		tip.style.opacity = '0';

		// Move the tooltip up 25 pixels so that when it's shown again it might look like it's dropping down
		tip.style.webkitTransform = 'translateY(-25px) scaleX(0)';
		tip.style.khtmlTransform = 'translateY(-25px) scaleX(0)';
		tip.style.msTransform = 'translateY(-25px) scaleX(0)';
		tip.style.transform = 'translateY(-25px) scaleX(0)';
	}
}


// =============================================================================
// 3. TOOLTIP OFFSCREEN SIZING CLONE
// Clones the tooltip box off-screen so we can measure its natural size before
// animating it into position - avoids layout thrash during the transition.
// =============================================================================

// Make an offscreen tooltip box to get the size of the animated tooltip box
const offscreenTooltipBox = document.getElementById('tooltip_box').cloneNode(true);
offscreenTooltipBox.id = 'offscreen_tooltip_box';
offscreenTooltipBox.style.height = 'auto';
offscreenTooltipBox.style.webkitTransform = 'translateY(0px) scaleX(1)';
offscreenTooltipBox.style.khtmlTransform = 'translateY(0px) scaleX(1)';
offscreenTooltipBox.style.msTransform = 'translateY(0px) scaleX(1)';
offscreenTooltipBox.style.transform = 'translateY(0px) scaleX(1)';
offscreenTooltipBox.style.transition = 'none';
offscreenTooltipBox.style.left = '-9999px';
offscreenTooltipBox.style.top = '-9999px';
document.body.appendChild(offscreenTooltipBox);


// =============================================================================
// 4. MOUNTAINS
// Delegates to mountains_bg.js (getHorizonMountainsSvg) to fill the
// background_mountain_container div with a procedurally generated SVG.
// =============================================================================

function redrawBackgroundMountains() {
	let box = document.getElementById('background_mountain_container');
	if (box) {
		box.innerHTML = getHorizonMountainsSvg(Math.max(window.innerWidth, document.body.scrollWidth) + 50);
	}
}


// =============================================================================
// 5. WAVES
// Multi-layer SVG waves at the top and bottom of the content area.
// Each layer uses randomized cubic bezier curves for an organic look.
// The drop shadow filter gives depth between layers.
// =============================================================================

//
// Waves right below 100vh
//
function getSvgWave(cls, y1, y2, h = 200, z = 1002, is_footer = false) {
	//const fbm = new FBM(3231, false);

	if (!is_footer) is_footer = false;

	let dropshadow =
		'<filter id="sha' + z + '" height="130%">'
			+ '<feGaussianBlur in="SourceAlpha" stdDeviation="2" />'
				+ '<feOffset dx="0" dy="' + (is_footer ? '-2' : '2') + '" result="offsetblur"/>'
				+ '<feComponentTransfer>'
				+ '<feFuncA type="linear" slope="0.5"/>'
			+ '</feComponentTransfer>'
			+ '<feMerge>'
				+ '<feMergeNode in="SourceGraphic"/>'
			+ '</feMerge>'
		+ '</filter>'
	;

	let wave_path = '';
	let num_points = Math.round(Math.max(window.innerWidth, document.body.scrollWidth) / 100);

	let last_y = Math.ceil(y2 * h / 100);
	for (let i = -1; i < num_points; i++) {
		let x1 = Math.round((i) * 1000 / (num_points - 1));
		let x2 = Math.round((i + 1) * 1000 / (num_points - 1));
		let x3 = Math.round((i + 2) * 1000 / (num_points - 1));
		x2 = Math.floor(x1 + 3 * (x2 - x1) / 4 + Math.random() * ((x2 - x1) / 4));
		let y = (i % 2 !== 0) ? Math.floor(Math.random() * 41) : Math.floor(Math.random() * 41) + 60;
		y = (y1 + (y2 - y1) * y / 100);
		y = Math.round(y * h / 100);
		if (!wave_path) {
			wave_path = 'L' + x1 + ',' + y2 + ' ';
		} else {
			// wave_path += ' ';
		}
		wave_path += 'C' + Math.round((x1 + x2) / 2) + ',' + last_y +
			' ' + Math.round((x1 + x2) / 2) + ',' + y +
			' ' + Math.round(x2) + ',' + y + ''
		;
		last_y = y;
	}
	let topY = -10;
	if (is_footer) {
		topY = h + 10;
	}
	return '<div class="page_' + (is_footer ? 'footer' : 'header') + '_wave" style="height:' + Math.round(h) + 'px;' + (z > 1 ? 'z-index:' + z + ';' : '') + '">' +
		'<svg width="100vw" height="' + h + '" viewBox="' + (is_footer ? '0 -10 1000 ' + h : '0 0 1000 ' + (Math.round(h + 10))) + '" preserveAspectRatio="none" draggable="false" ondragstart="return false">' +
		dropshadow + ' ' +
		'<path class="' + cls + '" d="M-10,' + topY + '' + wave_path + '' + 'L1010,' + topY + ' Z" style="filter:url(#sha' + z + ')" />' +
		'</svg>' +
		'</div>'
	;
}

//
// Draws the header waves, transition from ground to "underground" content.
// Box is at 100vh
//
function redrawSvgHeaderWaves() {
	let waves = ''
		+ getSvgWave('page_header_lvl_4', 77, 100, 100, 13)
		+ getSvgWave('page_header_lvl_3', 57, 73, 100, 14)
		+ getSvgWave('page_header_lvl_2', 27, 53, 100, 15)
		+ getSvgWave('page_header_lvl_1', 10, 23, 100, 16)
	;
	let box = document.getElementById('header_wave_container');
	if (box) box.innerHTML = waves;
}

// Draws the footer waves - underground water table!
function redrawSvgFooterWaves() {
	let waves = ''
		+ getSvgWave('page_footer_lvl_1', 0, 25, 100, 13, true)
		+ getSvgWave('page_footer_lvl_2', 25, 50, 100, 14, true)
		+ getSvgWave('page_footer_lvl_3', 50, 70, 100, 15, true)
		+ getSvgWave('page_footer_lvl_4', 70, 90, 100, 20, true)
	;
	let box = document.getElementById('footer_wave_container');
	if (box) box.innerHTML = waves;
}


// =============================================================================
// 6. ROCKS
// Procedural rock placement using Fractal Brownian Motion (FBM) noise from
// FBM.js. Rocks are SVG paths placed into the rock_svg element. Only redraws
// rocks when the container height changes (e.g. on mobile rotation), not on
// horizontal resize, to avoid unnecessary reflow.
// =============================================================================

// Need to check if resize is width-only, in which case we do not really need to replace the rocks.
// But if the resize is also in height, we need to clear the rocks and replace them.
let last_rock_container_height = -1;
function placeRocks() {

	const container = document.getElementById('rock_container');
	if (!container) {
		return;
	}
	const containerR = container.getBoundingClientRect();
	const containerY = containerR.top;
	const containerW = containerR.width;
	const containerH = containerR.height;

	const rockSize = 30;
	const spacing = 150;
	const fbm = new FBM(1234, false);

	const rockSvg = document.getElementById('rock_svg');
	const rockG = rockSvg.getElementById('rock_g');

	if (containerH != last_rock_container_height) {
		// Clear rockG
		while (rockG.firstChild) {
			rockG.removeChild(rockG.firstChild);
		}
		last_rock_container_height = containerH;
	}

	rockSvg.width = containerW;
	rockSvg.height = containerH;

	const ySpacing = Math.ceil(spacing / containerH) * 8;
	for (let y = 0; y <= containerH; y += ySpacing) {

		// Skip over a part of the gradient that is just a little too dark.
		let downPercent = y / containerH;
		if (downPercent > .60 && downPercent < .90) {
			continue;
		}



		const xSpacing = Math.ceil((y + 1) * spacing / containerH) * 8;
		for (let x = 0; x <= containerW; x += xSpacing) {

			const rockId = 'rock_' + Math.floor(x % spacing) + '_' + Math.floor(y % spacing);

			if (rockSvg.getElementById(rockId)) {
				//console.log('already have: ' + rockId);
				continue;
			}

			const rockX = x + Math.round(fbm.fbm(x + y, xSpacing)*2 - xSpacing / 2);
			const rockY = y + Math.round(fbm.fbm(x + y + 1, ySpacing) - ySpacing / 2);
			if (rockY < 0) {
				continue;
			}

			const scale = Math.max(2 * rockY / containerH, 0.01);

			// Create rock path
			let rock = document.createElementNS("http://www.w3.org/2000/svg", 'path');
			rock.id = rockId;
			rock.setAttribute('d', getRockPath(rockX, rockY, scale, fbm));
			rock.setAttribute('fill', "url(#rockGrad)");
			rock.setAttribute('stroke', "none");
			rockG.appendChild(rock);
		}
	}
}


// =============================================================================
// 7. CALLOUT BOXES
// Floating semi-transparent panels for displaying contextual content.
// Used by the toolbelt experience display.
// =============================================================================

// This constant is also used in CSS, to make the callout 100% of view width
const CALLOUT_MIN_WIDTH_TO_FLUSH_LEFT = 400;

// Shows the callout box at the specified coordinates with the specified HTML contents
function showCalloutBox(x, y, html, callout_id) {
	if (window.innerWidth <= CALLOUT_MIN_WIDTH_TO_FLUSH_LEFT) {
		x = 0;
	}
	if (!callout_id) {
		callout_id = 'callout_box';
	}
	const callout = document.getElementById(callout_id);
	callout.innerHTML = html;
	callout.style.visibility = "visible";
	callout.style.opacity = 1;
	callout.style.height = 'auto';
	callout.style.left = x + 'px';
	callout.style.top = y + 'px';
	callout.style.pointerEvents = 'auto';
}

// Hides the callout box
function hideCalloutBox(callout_id) {
	if (!callout_id) {
		callout_id = 'callout_box';
	}
	const callout = document.getElementById(callout_id);
	callout.style.opacity = 0;
	callout.style.height = '1px';
	callout.style.pointerEvents = 'none';
}


// =============================================================================
// 8. TOOLBELT
// Interactive list of languages/technologies. Hovering shows a callout with
// experience details. Clicking pins the callout open. Uses a pin icon SVG
// that rotates to indicate pinned state.
// =============================================================================

// Place toolbelt callout right if the view width is at least this much
const TOOLBELT_MIN_WIDTH_FOR_DISPLAY_TO_RIGHT = 500;

// Variable used to keep track of if and which experience item is pinned.
let pinned_toolbelt_experience_item = null;
let hovered_toolbelt_experience_item = null;

// Function to display experience for a 'toolbelt' item into the callout and position the callout to the right of the list
function displayExperience(id, listItem) {
	if (pinned_toolbelt_experience_item) {
		return;
	}
	const experienceText = document.getElementById(id).innerHTML;
	const toolbeltRect = getBoundingRect(document.getElementById('toolbelt'));
	const listItemRect = getBoundingRect(listItem);
	if (window.innerWidth >= TOOLBELT_MIN_WIDTH_FOR_DISPLAY_TO_RIGHT) {
		showCalloutBox(listItemRect.x + listItemRect.w + 30, toolbeltRect.y - 10, experienceText, 'experience_callout_box');
	} else {
		showCalloutBox(listItemRect.x - 10, listItemRect.y + 30, experienceText, 'experience_callout_box');
	}
	let pin = document.getElementById(id + '_pin');
	if (pin) {
		pin.style.opacity = 1;
		pin.style.transformOrigin = "center";
		pin.style.transform = "rotate(0deg)";
	}
	if (hovered_toolbelt_experience_item && hovered_toolbelt_experience_item != id) {
		// Hide it just to be safe
		pin = document.getElementById(hovered_toolbelt_experience_item + '_pin');
		if (pin) {
			pin.style.transformOrigin = "center";
			pin.style.transform = "rotate(0deg)";
			pinned_toolbelt_experience_item = null;
		}
	}
	hovered_toolbelt_experience_item = id;
}

// Toggles and pins/unpins the callout box with the details of my experience.
// Should probably use a dedicated callout box but don't plan on using it elsewhere at current time.
function togglePinExperience(id, listItem) {
	const pin = document.getElementById(id + '_pin');
	if (pin) {
		pin.style.opacity=1;
		if (pinned_toolbelt_experience_item) {
			if (pinned_toolbelt_experience_item == id) {
				// Unpin it...
				pin.style.transformOrigin = "center";
				pin.style.transform = "rotate(0deg)";
				pinned_toolbelt_experience_item = null;
			} else {
				// A different one is being pinned...

				// Hide the old one
				const oldPin = document.getElementById(pinned_toolbelt_experience_item + '_pin');
				oldPin.style.transformOrigin = "center";
				oldPin.style.transform = "rotate(0deg)";
				oldPin.style.opacity = 0;

				// Set to null so that displayExperience doesn't quit
				pinned_toolbelt_experience_item = null;

				// Show the experience of this one
				displayExperience(id, listItem);

				// Show the current one first...
				pin.style.opacity = 1;
				pin.style.transformOrigin = "center";
				pin.style.transform = "rotate(-90deg)";
				pinned_toolbelt_experience_item = id;

				// Keep track of the new one
				pinned_toolbelt_experience_item = id;
			}
		} else {
			pin.style.opacity = 1;
			pin.style.transformOrigin = "center";
			pin.style.transform = "rotate(-90deg)";
			pinned_toolbelt_experience_item = id;
		}
	}
}

// Hides the experience callout box
function hideExperience(id, listItem) {
	if (pinned_toolbelt_experience_item) {
		return;
	}
	hideCalloutBox('experience_callout_box');

	// Hide the toggle pin
	if (hovered_toolbelt_experience_item) {
		const pin = document.getElementById(hovered_toolbelt_experience_item + '_pin');
		if (pin) {
			pin.style.opacity = 0;
			pin.style.transformOrigin = "center";
			pin.style.transform = "rotate(0deg)";
		}
	}
}


// =============================================================================
// 9. CONTACT INFO
// Contact details are obfuscated with a Vigenere cipher to deter spam crawlers.
// The writeInDivs() trick splits text into individual letter divs to further
// confuse naive scrapers. Info is only decoded and written when the element
// scrolls into view (IntersectionObserver in pageLoaded).
// =============================================================================

// Writes contact info in divs, just trying to confuse spam crawlers
function writeInDivs(container, text) {
	let divs = '';
	for (let i = 0; i < text.length; i++) {
		divs += '<div class="letter_div" style="width:0;opacity:0">.</div>';
		divs += '<div class="letter_div">' + text[i] + '&#8203;</div>';
	}
	container.innerHTML = divs;
}

// Puts specified text into clipboard
function copyToClipboard(text) {
	if (window.clipboardData && window.clipboardData.setData) {
		// Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
		return clipboardData.setData("Text", text);

	} else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
		var textarea = document.createElement("textarea");
		textarea.textContent = text;
		textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
		document.body.appendChild(textarea);
		textarea.select();
		try {
			return document.execCommand("copy");  // Security exception may be thrown by some browsers.
		} catch (ex) {
			console.warn("copy to clipboard failed.", ex);
			return false;
		} finally {
			document.body.removeChild(textarea);
		}
	}
}

// Using a Vigenere cipher and basic measures to hide email from basic spam crawlers
const vigenereAlphabet = ' ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@.-_+';
const superSecretKey = 'QhYb9JXLFkWZuX4QjbdCos9arVtmnbhoBhEQUOyx';

// Encodes the text with keyword using the Vigenere cipher
function vigenereCipher(text, keyword) {
	let encodedText = '';
	for (let i = 0; i < text.length; i++) {
		const char = text[i];
		const charIndex = vigenereAlphabet.indexOf(char);
		if (charIndex < 0) {
			// Character not found in the vigenereAlphabet, leave it unchanged
			encodedText += char;
		} else {
			const keywordChar = keyword[i % keyword.length];
			const keywordIndexShift = vigenereAlphabet.indexOf(keywordChar);
			const newIndex = (charIndex + keywordIndexShift) % vigenereAlphabet.length;
			encodedText += vigenereAlphabet[newIndex];
		}
	}
	return encodedText;
}

// Decodes the text with keyword using the Vigenere cipher
function vigenereDecipher(text, keyword) {
	let decodedText = '';
	for (let i = 0; i < text.length; i++) {
		const keywordChar = keyword[i % keyword.length];
		const keywordIndexShift = vigenereAlphabet.indexOf(keywordChar);
		let decodedIndex = vigenereAlphabet.indexOf(text[i]) - keywordIndexShift;
		if (decodedIndex < 0) {
			decodedIndex += vigenereAlphabet.length;
		}
		decodedText += vigenereAlphabet[decodedIndex];
	}
	return decodedText;
}


// Returns my email address
function getContactInfoEmail() {
	return vigenereDecipher('9 D_fo GmHx8QTR5G', superSecretKey);
}

// Returns my phone number
function getContactInfoPhone() {
	return vigenereDecipher('PYPY3GL_@dTLfKs', superSecretKey);
}


// Returns my github url, marketing bots are welcome
function getContactInfoGithub() {
	return 'https://github.com/er-or';
}

// Returns my linkedin url, maybe I can get some more bots
function getContactInfoLinkedin() {
	return 'https://www.linkedin.com/in/joshua-shuller';
}

// Displays my email in the HTML page (as divs with single letters)
function writeContactInfoEmail() {
	const email_div = document.getElementById('contact_info_email');
	writeInDivs(email_div, getContactInfoEmail());
}

// Displays my phone in the HTML page
function writeContactInfoPhone() {
	const phone_div = document.getElementById('contact_info_phone');
	writeInDivs(phone_div, getContactInfoPhone());
}


// Checkmark is shown after 'copy' is clicked
const CHECKMARK_PATH = '<path fill="currentColor" d="M3.37 10.17a.5.5 0 0 0-.74.66l4 4.5c.19.22.52.23.72.02l10.5-10.5a.5.5 0 0 0-.7-.7L7.02 14.27l-3.65-4.1Z"></path>';

// The 'copy' icon is shown again 5 seconds after the checkmark is displayed
const COPY_TO_CLIPBOARD_PATH = '<path fill="currentColor" d="M8 2a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h6a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8ZM7 4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4ZM4 6a2 2 0 0 1 1-1.73V14.5A2.5 2.5 0 0 0 7.5 17h6.23A2 2 0 0 1 12 18H7.5A3.5 3.5 0 0 1 4 14.5V6Z"></path>';

// Copies my email to the clipboard, hopefully basic web crawlers won't click this
function copyContactInfoEmail(element) {
	copyToClipboard(getContactInfoEmail());
	const copy_icon = document.getElementById('copy_email_icon');
	copy_icon.innerHTML = CHECKMARK_PATH;
	tip(element, 'Copied', '#003300', 0, 0, 5000);
	setTimeout(() => {document.getElementById('copy_email_icon').innerHTML=COPY_TO_CLIPBOARD_PATH;},5000);
}

// Copies my phone to the clipboard, female robots feel free to call
function copyContactInfoPhone(element) {
	copyToClipboard(getContactInfoPhone());
	const copy_icon = document.getElementById('copy_phone_icon');
	copy_icon.innerHTML = CHECKMARK_PATH;
	tip(element, 'Copied', '#003300', 0, 0, 5000);
	setTimeout(() => {document.getElementById('copy_phone_icon').innerHTML=COPY_TO_CLIPBOARD_PATH;},5000);
}

// Copies my github URL to the clipboard
function copyContactInfoGithub(element) {
	copyToClipboard(getContactInfoGithub());
	const copy_icon = document.getElementById('copy_github_icon');
	copy_icon.innerHTML = CHECKMARK_PATH;
	tip(element, 'Copied', '#003300', 0, 0, 5000);
	setTimeout(() => {document.getElementById('copy_github_icon').innerHTML=COPY_TO_CLIPBOARD_PATH;},5000);
}

// Copies my linked URL to the clipboard
function copyContactInfoLinkedin(element) {
	copyToClipboard(getContactInfoLinkedin());
	const copy_icon = document.getElementById('copy_linkedin_icon');
	copy_icon.innerHTML = CHECKMARK_PATH;
	tip(element, 'Copied', '#003300', 0, 0, 5000);
	setTimeout(() => {document.getElementById('copy_linkedin_icon').innerHTML=COPY_TO_CLIPBOARD_PATH;},5000);
}


// Load contact info only when it comes into view
function contactInfoCallback() {
	setTimeout(() => {writeContactInfoEmail();},0);
	setTimeout(() => {writeContactInfoPhone();},0);
}


// =============================================================================
// 10. SIGNATURE ANIMATION
// The SVG signature uses stroke-dashoffset animation to simulate handwriting.
// IntersectionObserver triggers it when it scrolls into view. The get/put
// inner SVG trick forces a DOM re-insert so the CSS animation replays.
// =============================================================================

// Returns the SVG content using a timeout, because javascript
// won't update if the same content is simple replaced in one step
function getInnerSVG(element, timeout) {
	if (!timeout) timeout = 0;
	return new Promise((resolve, reject) => {
		// Get the inner SVG content of the element
		const innerSVG = element.innerHTML;
		// Simulate asynchronous operation (e.g., fetching SVG content from a server)
		setTimeout(() => {
			// Resolve the Promise with the inner SVG content
			resolve(innerSVG);
		}, timeout); // Adjust the delay as needed
	});
}

// Sets the SVG content using a timeout, because javascript
// won't update if the same content is simple replaced in one step
function putInnerSVG(element, svgContent, timeout) {
	if (!timeout) timeout = 0;
	return new Promise((resolve, reject) => {
		// Put the SVG content back into the element
		element.innerHTML = svgContent;
		// Simulate asynchronous operation (e.g., applying animations or transformations)
		setTimeout(() => {
			// Resolve the Promise after the operation is complete
			resolve();
		}, timeout); // Adjust the delay as needed
	});
}

// Callback function to start drawing signature when it scrolls into view
const signatureCallback = (entries, observer) => {
	entries.forEach(entry => {
		// If the target element is intersecting
		if (entry.isIntersecting) {
			// Stop observing once it's shown
			observer.unobserve(entry.target);

			// This is silly, but we got to get the animation to restart somehow
			getInnerSVG(entry.target).then(svgContent => {
				// Put the SVG content back into the element
				putInnerSVG(entry.target, svgContent);
			}).then(() => {
				// Callback function after putting the SVG content back into the element
			});

			// Show the SVG element by changing its opacity
			entry.target.style.opacity = 1;

			// We're going to draw the footer waves here, too
			redrawSvgFooterWaves();
		}
	});

};


// =============================================================================
// 11. PAGE LIFECYCLE
// pageLoaded: wires up all event listeners and kicks off initial renders.
// pageResized: redraws anything that depends on viewport dimensions.
// pageScrolled: pans the star map as the user scrolls, throttled via rAF
//   so we never queue more than one repaint per frame.
// =============================================================================

function pageLoaded() {
	loadBackgroundStars();
	updateStarmapOrientation();
	setTimeout(() => {placeRocks();}, 0);
	setTimeout(() => {redrawSvgHeaderWaves();}, 0);

	// Add callbacks to experience items
	document.getElementById('my_java_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_java_experience', event.target);
	});
	document.getElementById('my_php_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_php_experience', event.target);
	});
	document.getElementById('my_mysql_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_mysql_experience', event.target);
	});
	document.getElementById('my_html_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_html_experience', event.target);
	});
	document.getElementById('my_javascript_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_javascript_experience', event.target);
	});
	document.getElementById('my_c_sharp_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_c_sharp_experience', event.target);
	});
	document.getElementById('my_c_plus_plus_experience_title').addEventListener('mouseenter', function(event) {
		displayExperience('my_c_plus_plus_experience', event.target);
	});

	document.getElementById('my_java_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_java_experience', event.target) });
	document.getElementById('my_java_experience_title').addEventListener('click', function(event) { togglePinExperience('my_java_experience', event.target) });

	document.getElementById('my_php_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_php_experience', event.target) });
	document.getElementById('my_php_experience_title').addEventListener('click', function(event) { togglePinExperience('my_php_experience', event.target) });

	document.getElementById('my_mysql_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_mysql_experience', event.target) });
	document.getElementById('my_mysql_experience_title').addEventListener('click', function(event) { togglePinExperience('my_mysql_experience', event.target) });

	document.getElementById('my_html_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_html_experience', event.target) });
	document.getElementById('my_html_experience_title').addEventListener('click', function(event) { togglePinExperience('my_html_experience', event.target) });

	document.getElementById('my_javascript_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_javascript_experience', event.target) });
	document.getElementById('my_javascript_experience_title').addEventListener('click', function(event) { togglePinExperience('my_javascript_experience', event.target) });

	document.getElementById('my_c_sharp_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_c_sharp_experience', event.target) });
	document.getElementById('my_c_sharp_experience_title').addEventListener('click', function(event) { togglePinExperience('my_c_sharp_experience', event.target) });

	document.getElementById('my_c_plus_plus_experience_title').addEventListener('mouseleave', function(event) { hideExperience('my_c_plus_plus_experience', event.target) });
	document.getElementById('my_c_plus_plus_experience_title').addEventListener('click', function(event) { togglePinExperience('my_c_plus_plus_experience', event.target) });


	// Email and phone observer
	const contactObserver = new IntersectionObserver(contactInfoCallback, {root:null,rootMargin:'0px',threshold:0});
	contactObserver.observe(document.getElementById('contact_info_email'));
	contactObserver.observe(document.getElementById('contact_info_phone'));

	// Signature observer
	const signatureObserver = new IntersectionObserver(signatureCallback, {root: null, rootMargin: '0px', threshold: 0.5});
	const signatureSVG = document.getElementById('signature');
	signatureObserver.observe(signatureSVG);



}
window.addEventListener('load', pageLoaded);

function pageResized() {
	redrawBackgroundMountains();
	updateStarmapOrientation();
	redrawSvgHeaderWaves();
	setTimeout(() => {placeRocks();}, 0);
	setTimeout(() => {redrawSvgFooterWaves();}, 0);
}
window.addEventListener('resize', pageResized);


// Scroll the background stars, when they are in the background
let previousScrollPosition = window.scrollY;
let starmapRafId = null;
function pageScrolled() {

	let currentScrollPosition = window.scrollY;

	let sixtyVH = window.innerHeight * 0.6;

	if (currentScrollPosition < sixtyVH || previousScrollPosition < sixtyVH) {
		if (currentScrollPosition > previousScrollPosition) {
			STAR_VIEWER.panDown((currentScrollPosition - previousScrollPosition) / 55);
		} else if (currentScrollPosition < previousScrollPosition) {
			STAR_VIEWER.panUp((previousScrollPosition - currentScrollPosition) / 55);
		}
		if (starmapRafId === null) {
			starmapRafId = requestAnimationFrame(() => {
				starmapRafId = null;
				updateStarmapOrientation();
			});
		}
	}
	previousScrollPosition = currentScrollPosition;

}
window.addEventListener('scroll', pageScrolled);
