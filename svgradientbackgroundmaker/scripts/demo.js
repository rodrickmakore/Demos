var SVGBGMAKER = SVGBGMAKER || {};

(function () {
	'use strict';

	var allLinearPos = [
		'top left',
		'top',
		'top right',
		'left',
		'right',
		'bottom left',
		'bottom',
		'bottom right',
		'custom'
	];
	var allRadialPos = [
		'top left',
		'top center',
		'top right',
		'middle left',
		'middle center',
		'middle right',
		'bottom left',
		'bottom center',
		'bottom right',
		'custom position'
	];
	var allRadialSizes = [
		'sub-petite',
		'petite',
		'extra small',
		'small',
		'medium',
		'large',
		'extra large',
		'jumbo',
		'colossal',
		'custom size'
	];

	SVGBGMAKER.clearImportGradMarkup = function () {
		if (document.getElementById('markup-type').innerHTML === 'Cannot parse input.') {
			document.getElementById('markup-type').innerHTML = '';
		}
	};

	SVGBGMAKER.findLinearPosition = function (x1, y1, x2, y2) {
		if ((x1 === '0') && (y1 === '0') && (x2 === '0') && (y2 === '100')) {
			SVGBGMAKER.selectedPos = 'top';
		} //T
		else if ((x1 === '0') && (y1 === '0') && (x2 === '100') && (y2 === '0')) {
			SVGBGMAKER.selectedPos = 'left';
		} //L
		else if ((x1 === '0') && (y1 === '100') && (x2 === '100') && (y2 === '0')) {
			SVGBGMAKER.selectedPos = 'bottom left';
		} //BL
		else if ((x1 === '100') && (y1 === '100') && (x2 === '100') && (y2 === '0')) {
			SVGBGMAKER.selectedPos = 'bottom';
		} //B
		else if ((x1 === '100') && (y1 === '100') && (x2 === '0') && (y2 === '0')) {
			SVGBGMAKER.selectedPos = 'bottom right';
		} //BR
		else if ((x1 === '100') && (y1 === '100') && (x2 === '0') && (y2 === '100')) {
			SVGBGMAKER.selectedPos = 'right';
		} //R
		else if ((x1 === '100') && (y1 === '0') && (x2 === '0') && (y2 === '100')) {
			SVGBGMAKER.selectedPos = 'top right';
		} //TR
		else if ((x1 === '0') && (y1 === '0') && (x2 === '100') && (y2 === '100')) {
			SVGBGMAKER.selectedPos = 'top left';
		} //TL
		else {
			SVGBGMAKER.selectedPos = 'custom';
			SVGBGMAKER.cusX1 = x1 + '%';
			SVGBGMAKER.cusY1 = y1 + '%';
			SVGBGMAKER.cusX2 = x2 + '%';
			SVGBGMAKER.cusY2 = y2 + '%';
		}
	};

	SVGBGMAKER.loadBase64URL = function () {
		// Strip url of prefix, etc
		SVGBGMAKER.markup = SVGBGMAKER.markup.replace('background-image:url', '');
		SVGBGMAKER.markup = SVGBGMAKER.markup.replace('(data:image/svg+xml;base64,', '');
		SVGBGMAKER.markup = SVGBGMAKER.markup.replace(');', '');
		SVGBGMAKER.markup = SVGBGMAKER.trimString(SVGBGMAKER.markup);

		var svg = SVGBGMAKER.Base64.decode(SVGBGMAKER.markup);

		// Parsing svg string into svg contents via array
		var svgContentArray = [];
		var currsvg = svg;

		while (currsvg.indexOf('<') !== -1) {
			var a = currsvg.substring(currsvg.indexOf('<'), currsvg.indexOf('>') + 1);
			if (a.indexOf('</') === -1) {
				svgContentArray.push(a);
			}
			currsvg = currsvg.replace(a, '');
		}

		SVGBGMAKER.stops = [];
		for (var i = 0; i < svgContentArray.length; i++) {

			var attribute = svgContentArray[i];

			if (attribute.indexOf('preserveAspectRatio') !== -1) {
				var position = attribute.substring(attribute.indexOf('preserveAspectRatio'));
				SVGBGMAKER.pAspectRatio = position.substring(position.indexOf('preserveAspectRatio'));
				SVGBGMAKER.pAspectRatio = SVGBGMAKER.pAspectRatio.replace('preserveAspectRatio=', '');
				SVGBGMAKER.pAspectRatio = SVGBGMAKER.pAspectRatio.replace('>', '');
				SVGBGMAKER.pAspectRatio = SVGBGMAKER.stripQuotes(SVGBGMAKER.pAspectRatio);
			}

			// 1. Check the type of gradient
			if (attribute.indexOf('linearGradient') !== -1) {
				SVGBGMAKER.gradientType = 'linear';

				position = attribute.substring(attribute.indexOf('x1'));
				var x1 = position.substring(position.indexOf('x1'), position.indexOf(' '));
				x1 = x1.replace('x1=', '');
				x1 = x1.replace('\%', '');
				x1 = SVGBGMAKER.stripQuotes(x1);

				position = attribute.substring(attribute.indexOf('y1'));
				var y1 = position.substring(position.indexOf('y1'), position.indexOf(' '));
				y1 = y1.replace('y1=', '');
				y1 = y1.replace('\%', '');
				y1 = SVGBGMAKER.stripQuotes(y1);

				position = attribute.substring(attribute.indexOf('x2'));
				var x2 = position.substring(position.indexOf('x2'), position.indexOf(' '));
				x2 = x2.replace('x2=', '');
				x2 = x2.replace('\%', '');
				x2 = SVGBGMAKER.stripQuotes(x2);

				var y2 = position.substring(position.indexOf('y2'));
				y2 = y2.replace('y2=', '');
				y2 = y2.replace('\%', '');
				y2 = y2.replace('>', '');
				y2 = SVGBGMAKER.stripQuotes(y2);

				SVGBGMAKER.findLinearPosition(x1, y1, x2, y2);

			} else if (attribute.indexOf('radial-gradient') !== -1) {
				SVGBGMAKER.gradientType = 'radial';

				position = attribute.substring(attribute.indexOf('gradientUnits'));
				var gradientUnits = position.substring(position.indexOf('gradientUnits'), position.indexOf(' '));
				gradientUnits = gradientUnits.replace('gradientUnits=', '');
				gradientUnits = SVGBGMAKER.stripQuotes(gradientUnits);

				position = attribute.substring(attribute.indexOf('cx'));
				var cx = position.substring(position.indexOf('cx'), position.indexOf(' '));
				cx = cx.replace('cx=', '');
				cx = SVGBGMAKER.stripQuotes(cx);

				position = attribute.substring(attribute.indexOf('cy'));
				var cy = position.substring(position.indexOf('cy'), position.indexOf(' '));
				cy = cy.replace('cy=', '');
				cy = SVGBGMAKER.stripQuotes(cy);

				position = attribute.substring(attribute.indexOf('r='));
				var r = position.substring(position.indexOf('r'), position.indexOf(' '));
				if (SVGBGMAKER.trimString(r) === '') {
					r = position.substring(position.indexOf('r'));
				}
				r = r.replace('r=', '');
				r = r.replace('>', '');
				r = SVGBGMAKER.stripQuotes(r);

				SVGBGMAKER.findRadialPosition(gradientUnits, cx, cy, r);
			}

			// 2. Detect the stops
			if (attribute.indexOf('stop') !== -1) {

				attribute = attribute.replace('stop ', '');
				attribute = attribute.replace('<', '');
				attribute = attribute.replace('/>', '');
				attribute = attribute.replace('>', '');

				var stopcolor = attribute.substring(attribute.indexOf('stop-color'), attribute.indexOf(' '));
				stopcolor = stopcolor.replace('stop-color=', '');
				stopcolor = stopcolor.replace('\#', '');
				stopcolor = SVGBGMAKER.stripQuotes(stopcolor);

				var offset = attribute.substring(attribute.indexOf('offset'));
				offset = offset.replace('offset=', '');
				offset = SVGBGMAKER.stripQuotes(offset);
				var currStop = [stopcolor, offset];
				SVGBGMAKER.stops.push(currStop);
			}
		}
		//alert(printData());
		SVGBGMAKER.updateGradControl();
	};

	SVGBGMAKER.findRadialPosition = function (gradientUnits, cx, cy, r) {
		var posx, posy;

		if (r.toString().indexOf('\%') !== -1) {
			r = parseFloat(r) / 100;
		}

		SVGBGMAKER.shape = 'ellipse';

		posx = parseFloat(cx) / 100;
		posy = parseFloat(cy) / 100;

		if ((posx === 0) && (posy === 0)) {
			SVGBGMAKER.selectedPos = 'top left';
		} // TL
		else if ((posx === 0.5) && (posy === 0)) {
			SVGBGMAKER.selectedPos = 'top center';
		} // TC
		else if ((posx === 1) && (posy === 0)) {
			SVGBGMAKER.selectedPos = 'top right';
		} // TR
		else if ((posx === 0) && (posy === 0.5)) {
			SVGBGMAKER.selectedPos = 'middle left';
		} // ML
		else if ((posx === 0.5) && (posy === 0.5)) {
			SVGBGMAKER.selectedPos = 'middle center';
		} // MC
		else if ((posx === 1) && (posy === 0.5)) {
			SVGBGMAKER.selectedPos = 'middle right';
		} // MR
		else if ((posx === 0) && (posy === 1)) {
			SVGBGMAKER.selectedPos = 'bottom left';
		} // BL
		else if ((posx === 0.5) && (posy === 1)) {
			SVGBGMAKER.selectedPos = 'bottom center';
		} // BC
		else if ((posx === 1) && (posy === 1)) {
			SVGBGMAKER.selectedPos = 'bottom right';
		} // BR
		else {
			SVGBGMAKER.selectedPos = 'custom position';
			SVGBGMAKER.cusCX = cx;
			SVGBGMAKER.cusCY = cy;
		}

		if (r === 0.01) {
			SVGBGMAKER.selectedSize = 'sub-petite';
		} else if (r === 0.05) {
			SVGBGMAKER.selectedSize = 'petite';
		} else if (r === 0.1) {
			SVGBGMAKER.selectedSize = 'extra small';
		} else if (r === 0.25) {
			SVGBGMAKER.selectedSize = 'small';
		} else if (r === 0.5) {
			SVGBGMAKER.selectedSize = 'medium';
		} else if (r === 0.75) {
			SVGBGMAKER.selectedSize = 'large';
		} else if (r === 1) {
			SVGBGMAKER.selectedSize = 'extra large';
		} else if (r === 2) {
			SVGBGMAKER.selectedSize = 'jumbo';
		} else if (r === 4) {
			SVGBGMAKER.selectedSize = 'colossal';
		} else {
			SVGBGMAKER.selectedSize = 'custom size';
			SVGBGMAKER.cusR = r * 100 + '%';
		}
	};

	SVGBGMAKER.updateGradControl = function () {

		// Setting type
		if (SVGBGMAKER.gradientType === 'linear') {
			document.getElementById('g-type').gradtype[0].checked = true;
		} else if (SVGBGMAKER.gradientType === 'radial') {
			document.getElementById('g-type').gradtype[1].checked = true;
		}
		if (SVGBGMAKER.stops === null) {
			// No stops detected
			return;
		}
		// Setting the color-stops and offsets for first and last stops
		document.getElementById('color0').value = SVGBGMAKER.stops[0][0];
		document.getElementById('offset0').value = SVGBGMAKER.stops[0][1];
		SVGBGMAKER.repaint(document.getElementById('color0'));

		document.getElementById('colorN').value = SVGBGMAKER.stops[SVGBGMAKER.stops.length - 1][0];
		document.getElementById('offsetN').value = SVGBGMAKER.stops[SVGBGMAKER.stops.length - 1][1];
		SVGBGMAKER.repaint(document.getElementById('colorN'));

		SVGBGMAKER.clearStops();

		for (var i = 1; i < SVGBGMAKER.stops.length - 1; i++) {
			SVGBGMAKER.insertAllStops(SVGBGMAKER.stops[i][0], SVGBGMAKER.stops[i][1]);
		}

		//alert(printData());
		SVGBGMAKER.updateAllPanelsFromImport();
	};

	var nextStopCount = 2;
	var StopValue0 = 0;

	SVGBGMAKER.insertAllStops = function (color, offset) {
		var nNewStop = nextStopCount - 1;

		var thLabel = document.createElement('td');
		document.getElementById('stops-label').insertBefore(thLabel, document.getElementById('last-label'));
		thLabel.id = 'stopRow' + nNewStop.toString() + 'label';
		thLabel.appendChild(document.createTextNode('Stop'));
		thLabel.style.fontWeight = 'normal';

		var thOffset = document.createElement('td');
		document.getElementById('stops-offset').insertBefore(thOffset, document.getElementById('last-offset'));
		thOffset.id = 'stopRow' + nNewStop.toString() + 'offset';
		var input = document.createElement('input');
		input.type = 'text';
		input.id = 'offset' + nNewStop.toString();
		input.value = offset;
		input.size = '6';
		input.onchange = function () {
			SVGBGMAKER.updateAllPanels();
		};
		thOffset.appendChild(input);

		var thColor = document.createElement('td');
		document.getElementById('stops-color').insertBefore(thColor, document.getElementById('last-color'));
		thColor.id = 'stopRow' + nNewStop.toString() + 'color';
		input = document.createElement('input');
		input.id = 'color' + nNewStop.toString();
		input.size = '6';
		input.value = color;
		thColor.appendChild(input);
		SVGBGMAKER.repaint(input);

		var thButton = document.createElement('td');
		thButton.className = 'deletebutton';
		document.getElementById('stops-button').insertBefore(thButton, document.getElementById('last-button'));
		thButton.id = 'stopRow' + nNewStop.toString() + 'button';
		var button = document.createElement('button');
		button.type = 'button';
		button.id = nNewStop.toString();
		button.innerHTML = 'Delete';
		button.onclick = function () {
			SVGBGMAKER.removeStop(this);
		};
		thButton.appendChild(button);

		nextStopCount++;
	};

	SVGBGMAKER.clearStops = function () {
		var ct = nextStopCount;
		for (var i = 1; i < ct; i++) {
			var stopLabel = document.getElementById('stopRow' + i + 'label');
			if (stopLabel !== null) {
				stopLabel.parentNode.removeChild(stopLabel);
			}
			var stopOffset = document.getElementById('stopRow' + i + 'offset');
			if (stopOffset !== null) {
				stopOffset.parentNode.removeChild(stopOffset);
			}
			var stopColor = document.getElementById('stopRow' + i + 'color');
			if (stopColor !== null) {
				stopColor.parentNode.removeChild(stopColor);
			}
			var stopButton = document.getElementById('stopRow' + i + 'button');
			if (stopButton !== null) {
				stopButton.parentNode.removeChild(stopButton);
			}
		}
	};

	SVGBGMAKER.clearTable = function () {
		var cell = document.getElementById('gradAttributes');
		if (cell.hasChildNodes()) {
			while (cell.childNodes.length >= 1) {
				cell.removeChild(cell.firstChild);
			}
		}
	};

	SVGBGMAKER.loadLinearTable = function () {
		SVGBGMAKER.gradientType = 'linear';
		SVGBGMAKER.shape = 'none';
		SVGBGMAKER.customAngleVal = null;
		document.getElementById('sizes').style.display = 'none';
		document.getElementById('custom-radial-svg').style.display = 'none';
		SVGBGMAKER.createPositionPanel();
	};

	SVGBGMAKER.loadRadialTable = function (s) {
		SVGBGMAKER.gradientType = 'radial';
		SVGBGMAKER.shape = s;
		document.getElementById('custom-linear-svg').style.display = 'none';
		SVGBGMAKER.createPositionPanel();
	};

	SVGBGMAKER.createPositionPanel = function () {
		SVGBGMAKER.clearPosPanel();
		SVGBGMAKER.clearSizePanel();

		var thumbnailPosPanel = document.createElement('table');
		thumbnailPosPanel.id = 'thumbnailPosPanel';
		var tr = document.createElement('tr');
		thumbnailPosPanel.appendChild(tr);

		var posPerRow = 10;

		var defaultpos;
		if (SVGBGMAKER.gradientType === 'linear') {
			if ((SVGBGMAKER.selectedPos === null) || !(SVGBGMAKER.contains(allLinearPos, SVGBGMAKER.selectedPos))) {
				defaultpos = allLinearPos[0];
			} else {
				defaultpos = SVGBGMAKER.selectedPos;
			}
			for (var i = 0; i < allLinearPos.length; i++) {
				var th = document.createElement('td');
				if (posPerRow === 0) {
					tr = document.createElement('tr');
					thumbnailPosPanel.appendChild(tr);
					posPerRow = 5;
				} else {
					posPerRow--;
				}
				tr.appendChild(th);
				var thumbnail = document.createElement('div');
				th.appendChild(thumbnail);
				thumbnail.className = 'positionThumbnail';
				thumbnail.id = 'pos' + i;
				thumbnail.name = allLinearPos[i];
				thumbnail.appendChild(document.createTextNode(allLinearPos[i]));

				var markups = SVGBGMAKER.getMarkup(allLinearPos[i], null);
				thumbnail.setAttribute('style', markups);
				thumbnail.addEventListener('click', SVGBGMAKER.selectPos, true);

			}
		} else if (SVGBGMAKER.gradientType === 'radial') {
			var defaultsize;
			if ((SVGBGMAKER.selectedSize === null) || !(SVGBGMAKER.contains(allRadialPos, SVGBGMAKER.selectedPos))) {
				defaultpos = allRadialPos[4];
				defaultsize = allRadialSizes[4];
			} else {
				defaultpos = SVGBGMAKER.selectedPos;
				defaultsize = SVGBGMAKER.selectedSize;
			}
			for (i = 0; i < allRadialPos.length; i++) {
				th = document.createElement('td');
				if (posPerRow === 0) {
					tr = document.createElement('tr');
					thumbnailPosPanel.appendChild(tr);
					posPerRow = 5;
				} else {
					posPerRow--;
				}
				tr.appendChild(th);
				thumbnail = document.createElement('div');
				th.appendChild(thumbnail);
				thumbnail.className = 'positionThumbnail';
				thumbnail.id = 'pos' + i;
				thumbnail.name = allRadialPos[i];
				thumbnail.appendChild(document.createTextNode(allRadialPos[i]));

				markups = SVGBGMAKER.getMarkup(allRadialPos[i], defaultsize);
				thumbnail.setAttribute('style', markups);
				thumbnail.addEventListener('click', SVGBGMAKER.selectPos, true);
			}
		} else {
			return;
		}

		document.getElementById('pos-panel').appendChild(thumbnailPosPanel);
		SVGBGMAKER.pickPos(defaultpos);
		SVGBGMAKER.updateSample();
	};

	SVGBGMAKER.updateAllPanelsFromImport = function () {
		var newPos = SVGBGMAKER.selectedPos;
		var newSize = SVGBGMAKER.selectedSize;
		SVGBGMAKER.createPositionPanel();
		SVGBGMAKER.selectedPos = newPos;
		SVGBGMAKER.selectedSize = newSize;
		SVGBGMAKER.updateCustomPanels();
		SVGBGMAKER.updateAllPanels();
	};

	SVGBGMAKER.updateCustomPanels = function () {

		if (SVGBGMAKER.gradientType === 'linear') {
			if (SVGBGMAKER.selectedPos === 'custom') {
				document.getElementById('custom-linear-svg').style.display = '';
				document.getElementById('linear-start').setAttribute('x', SVGBGMAKER.cusX1);
				document.getElementById('linear-start').setAttribute('y', SVGBGMAKER.cusY1);
				document.getElementById('linear-end').setAttribute('x', SVGBGMAKER.cusX2);
				document.getElementById('linear-end').setAttribute('y', SVGBGMAKER.cusY2);
				var linex1 = parseFloat(SVGBGMAKER.cusX1) / 100 * SVGBGMAKER.sampleWidth;
				var liney1 = parseFloat(SVGBGMAKER.cusY1) / 100 * SVGBGMAKER.sampleHeight;
				var linex2 = parseFloat(SVGBGMAKER.cusX2) / 100 * SVGBGMAKER.sampleWidth;
				var liney2 = parseFloat(SVGBGMAKER.cusY2) / 100 * SVGBGMAKER.sampleHeight;
				SVGBGMAKER.setStartTo(linex1, liney1);
				SVGBGMAKER.setEndTo(linex2, liney2);
			}
		} else if (SVGBGMAKER.gradientType === 'radial') {
			var pointcx, pointcy;
			if (SVGBGMAKER.selectedPos === 'custom position') {
				document.getElementById('custom-radial-svg').style.display = '';
				document.getElementById('radial-center').style.display = '';

				pointcx = parseFloat(SVGBGMAKER.cusCX) / 100 * SVGBGMAKER.sampleWidth;
				pointcy = parseFloat(SVGBGMAKER.cusCY) / 100 * SVGBGMAKER.sampleHeight;
				SVGBGMAKER.setCenterTo(pointcx, pointcy, true);
			}

			if (SVGBGMAKER.selectedSize === 'custom size') {
				document.getElementById('custom-radial-svg').style.display = '';
				document.getElementById('radial-radius').style.display = '';

				var pos;
				if (SVGBGMAKER.selectedPos === 'custom position') {
					pos = SVGBGMAKER.getRadiusPoints(true);
				} else {
					pos = SVGBGMAKER.getRadiusPoints(false);
				}
				SVGBGMAKER.setRadiusTo(pos[0], pos[1]);
			}
		}
	};

	SVGBGMAKER.selectPos = function (e) {
		if (SVGBGMAKER.gradientType === 'linear') {
			var allpos = allLinearPos;
		} else if (SVGBGMAKER.gradientType === 'radial') {
			allpos = allRadialPos;
		}
		for (var i = 0; i < allpos.length; i++) {
			document.getElementById('pos' + i).style.border = '2px solid white';
		}

		document.getElementById(e.target.id).style.border = '2px solid red';
		SVGBGMAKER.selectedPos = e.target.name;

		if (SVGBGMAKER.gradientType === 'radial') {
			SVGBGMAKER.createSizePanel(SVGBGMAKER.selectedPos);

			//Show custom radial tool
			if ((SVGBGMAKER.selectedPos === 'custom position') || (SVGBGMAKER.selectedSize === 'custom size')) {
				document.getElementById('custom-radial-svg').style.display = '';

				if (SVGBGMAKER.selectedPos === 'custom position') {
					document.getElementById('radial-center').style.display = '';
				} else {
					document.getElementById('radial-center').style.display = 'none';
				}

				if (SVGBGMAKER.selectedSize === 'custom size') {
					document.getElementById('radial-radius').style.display = '';
				} else {
					document.getElementById('radial-radius').style.display = 'none';
				}

			} else {
				document.getElementById('custom-radial-svg').style.display = 'none';
				document.getElementById('radial-radius').style.display = 'none';
				document.getElementById('radial-center').style.display = 'none';
			}
		}

		//Show custom
		if (SVGBGMAKER.selectedPos === 'custom') {
			document.getElementById('custom-linear-svg').style.display = '';

			document.getElementById('custom-radial-svg').style.display = 'none';
			document.getElementById('radial-radius').style.display = 'none';
			document.getElementById('radial-center').style.display = 'none';
		} else {
			document.getElementById('custom-linear-svg').style.display = 'none';
		}

		SVGBGMAKER.updateAllPanels();
	};

	SVGBGMAKER.pickPos = function (position) {
		if (SVGBGMAKER.gradientType === 'linear') {
			var allpos = allLinearPos;
		} else if (SVGBGMAKER.gradientType === 'radial') {
			allpos = allRadialPos;
		}

		for (var i = 0; i < allpos.length; i++) {
			var currPos = document.getElementById('pos' + i);
			if (currPos.name === position) {
				currPos.style.border = '2px solid red';
				SVGBGMAKER.selectedPos = currPos.name;
			} else {
				currPos.style.border = '2px solid white';
			}
		}
		if (SVGBGMAKER.gradientType === 'radial') {
			SVGBGMAKER.createSizePanel(SVGBGMAKER.selectedPos);

			//Show custom radial tool
			if ((SVGBGMAKER.selectedPos === 'custom position') || (SVGBGMAKER.selectedSize === 'custom size')) {
				document.getElementById('custom-radial-svg').style.display = '';

				if (SVGBGMAKER.selectedPos === 'custom position') {
					document.getElementById('radial-center').style.display = '';
				} else {
					document.getElementById('radial-center').style.display = 'none';
				}

				if (SVGBGMAKER.selectedSize === 'custom size') {
					document.getElementById('radial-radius').style.display = '';
				} else {
					document.getElementById('radial-radius').style.display = 'none';
				}

			} else {
				document.getElementById('custom-radial-svg').style.display = 'none';
				document.getElementById('radial-radius').style.display = 'none';
				document.getElementById('radial-center').style.display = 'none';
			}
		}
		//Show custom
		if (SVGBGMAKER.selectedPos === 'custom') {
			document.getElementById('custom-linear-svg').style.display = '';

			document.getElementById('custom-radial-svg').style.display = 'none';
			document.getElementById('radial-radius').style.display = 'none';
			document.getElementById('radial-center').style.display = 'none';
		} else {
			document.getElementById('custom-linear-svg').style.display = 'none';
		}
	};

	SVGBGMAKER.clearPosPanel = function () {
		var thumbnailPosPanel = document.getElementById('thumbnailPosPanel');
		if (thumbnailPosPanel !== null) {
			thumbnailPosPanel.parentNode.removeChild(thumbnailPosPanel);
		}
	};

	SVGBGMAKER.clearSizePanel = function () {
		var thumbnailSizePanel = document.getElementById('thumbnailSizePanel');
		if (thumbnailSizePanel !== null) {
			thumbnailSizePanel.parentNode.removeChild(thumbnailSizePanel);
		}
	};

	SVGBGMAKER.createSizePanel = function (position) {
		var thumbnailSizePanel = document.getElementById('thumbnailSizePanel');
		if (thumbnailSizePanel !== null) {
			thumbnailSizePanel.parentNode.removeChild(thumbnailSizePanel);
		}
		thumbnailSizePanel = document.createElement('table');
		thumbnailSizePanel.id = 'thumbnailSizePanel';
		var tr = document.createElement('tr');
		thumbnailSizePanel.appendChild(tr);

		for (var i = 0; i < allRadialSizes.length; i++) {
			var th = document.createElement('td');
			tr.appendChild(th);
			var thumbnail = document.createElement('div');
			th.appendChild(thumbnail);
			thumbnail.className = 'sizeThumbnail';
			thumbnail.id = 'size' + i;
			thumbnail.name = allRadialSizes[i];
			thumbnail.appendChild(document.createTextNode(allRadialSizes[i]));
			thumbnail.addEventListener('click', SVGBGMAKER.selectSize, true);

			var markups = SVGBGMAKER.getMarkup(position, allRadialSizes[i]);
			thumbnail.setAttribute('style', markups);
		}
		document.getElementById('size-panel').appendChild(thumbnailSizePanel);
		document.getElementById('sizes').style.display = '';
		if (SVGBGMAKER.selectedSize === null) {
			SVGBGMAKER.pickSize(allRadialSizes[4]); //select default size
		} else {
			SVGBGMAKER.pickSize(SVGBGMAKER.selectedSize);
		}
	};

	SVGBGMAKER.selectSize = function (e) {
		for (var i = 0; i < allRadialSizes.length; i++) {
			document.getElementById('size' + i).style.border = '2px solid white';
		}
		document.getElementById(e.target.id).style.border = '2px solid red';
		SVGBGMAKER.selectedSize = e.target.name;

		if (SVGBGMAKER.selectedSize === 'custom size') {
			document.getElementById('radial-radius').style.display = '';
		} else {
			document.getElementById('radial-radius').style.display = 'none';
		}
		SVGBGMAKER.updateAllPanels();
	};

	SVGBGMAKER.pickSize = function (size) {
		for (var i = 0; i < allRadialSizes.length; i++) {
			var currSize = document.getElementById('size' + i);
			if (currSize.name.toLowerCase() === size.toLowerCase()) {
				currSize.style.border = '2px solid red';
				SVGBGMAKER.selectedSize = currSize.name;
			} else {
				currSize.style.border = '2px solid white';
			}
		}
		if (SVGBGMAKER.selectedSize === 'custom size') {
			document.getElementById('radial-radius').style.display = '';
		} else {
			document.getElementById('radial-radius').style.display = 'none';
		}
		SVGBGMAKER.updateSample();
	};

	SVGBGMAKER.insertStop = function () {
		var nNewStop = nextStopCount - 1;

		var thLabel = document.createElement('td');
		document.getElementById('stops-label').insertBefore(thLabel, document.getElementById('last-label'));
		thLabel.id = 'stopRow' + nNewStop.toString() + 'label';
		thLabel.appendChild(document.createTextNode('Stop'));
		thLabel.style.fontWeight = 'normal';

		var prevStop = nextStopCount;
		while ((document.getElementById('offset' + prevStop.toString()) === null) && (prevStop > 0)) {
			prevStop--;
		}
		StopValue0 = parseFloat(document.getElementById('offset' + prevStop.toString()).value);
		var StopValue2 = 1;
		var StopValue1 = (StopValue0 + StopValue2) / 2;

		var thOffset = document.createElement('td');
		document.getElementById('stops-offset').insertBefore(thOffset, document.getElementById('last-offset'));
		thOffset.id = 'stopRow' + nNewStop.toString() + 'offset';
		var input = document.createElement('input');
		input.type = 'text';
		input.id = 'offset' + nNewStop.toString();
		input.value = StopValue1;
		input.size = '6';
		input.onchange = function () {
			SVGBGMAKER.updateAllPanels();
		};
		thOffset.appendChild(input);

		var thColor = document.createElement('td');
		document.getElementById('stops-color').insertBefore(thColor, document.getElementById('last-color'));
		thColor.id = 'stopRow' + nNewStop.toString() + 'color';
		input = document.createElement('input');
		input.id = 'color' + nNewStop.toString();
		input.size = '6';
		input.type = 'text';
		input.value = SVGBGMAKER.randomColor();
		thColor.appendChild(input);
		SVGBGMAKER.repaint(input);

		var thButton = document.createElement('td');
		thButton.className = 'deletebutton';
		document.getElementById('stops-button').insertBefore(thButton, document.getElementById('last-button'));
		thButton.id = 'stopRow' + nNewStop.toString() + 'button';
		var button = document.createElement('button');
		button.type = 'button';
		button.id = nNewStop.toString();
		button.innerHTML = 'Delete';
		button.onclick = function () {
			SVGBGMAKER.removeStop(this);
		};
		thButton.appendChild(button);

		nextStopCount++;

		SVGBGMAKER.updateAllPanels();
	};

	SVGBGMAKER.removeStop = function (obj) {
		var num = obj.id;
		var currLabel = document.getElementById('stopRow' + num + 'label');
		var currOffset = document.getElementById('stopRow' + num + 'offset');
		var currColor = document.getElementById('stopRow' + num + 'color');
		var currButton = document.getElementById('stopRow' + num + 'button');

		currLabel.parentNode.removeChild(currLabel);
		currOffset.parentNode.removeChild(currOffset);
		currColor.parentNode.removeChild(currColor);
		currButton.parentNode.removeChild(currButton);

		SVGBGMAKER.updateAllPanels();
	};

	SVGBGMAKER.getMarkup = function (inputPos, inputSize) {
		if (SVGBGMAKER.gradientType === 'linear') {
			var svg = SVGBGMAKER.linearGradientSVG(inputPos);
			SVGBGMAKER.base64url = 'url(data:image/svg+xml;base64,' + SVGBGMAKER.Base64.encode(svg) + ')';
		} else if (SVGBGMAKER.gradientType === 'radial') {
			svg = SVGBGMAKER.radialGradientSVG(inputPos, inputSize);
			SVGBGMAKER.base64url = 'url(data:image/svg+xml;base64,' + SVGBGMAKER.Base64.encode(svg) + ')';
		} else {
			return '';
		}
		var markup = '/* SVG as background image (IE9/Chrome/Safari/Opera) */ \nbackground-image:' + SVGBGMAKER.base64url + ';';
		return markup;
	};

	SVGBGMAKER.getRawMarkup = function (inputPos, inputSize) {
		var base64url;
		if (SVGBGMAKER.gradientType === 'linear') {
			var svg = SVGBGMAKER.linearGradientSVG(inputPos);
			base64url = 'url(data:image/svg+xml;base64,' + SVGBGMAKER.Base64.encode(svg) + ')';
		} else if (SVGBGMAKER.gradientType === 'radial') {
			svg = SVGBGMAKER.radialGradientSVG(inputPos, inputSize);
			base64url = 'url(data:image/svg+xml;base64,' + SVGBGMAKER.Base64.encode(svg) + ')';
		} else {
			return '';
		}
		return base64url;
	};

	SVGBGMAKER.updateSample = function () {
		if (SVGBGMAKER.gradientType === 'linear') {
			var svg = SVGBGMAKER.linearGradientSVG(SVGBGMAKER.selectedPos);
		} else if (SVGBGMAKER.gradientType === 'radial') {
			svg = SVGBGMAKER.radialGradientSVG(SVGBGMAKER.selectedPos, SVGBGMAKER.selectedSize);
		} else {
			return;
		}
		var markup = SVGBGMAKER.getMarkup(SVGBGMAKER.selectedPos, SVGBGMAKER.selectedSize);

		if (document.getElementById('other-source') !== null) {
			document.getElementById('other-source').value = markup;
		}
		if (document.getElementById('svg-source') !== null) {
			document.getElementById('svg-source').value = '<!-- SVG syntax --> \n' + svg;
		}
		//document.getElementById("other-sample").setAttribute("style", markup);
		document.getElementById('other-sample').style.backgroundImage = SVGBGMAKER.getRawMarkup(SVGBGMAKER.selectedPos, SVGBGMAKER.selectedSize);
		document.getElementById('other-sample').style.backgroundRepeat = 'no-repeat';
	};

	SVGBGMAKER.linearGradientSVG = function (inputPos) {
		var x1, y1, x2, y2;

		if (inputPos === 'top left') {
			x1 = '0%';
			y1 = '0%';
			x2 = '100%';
			y2 = '100%';
		}
		if (inputPos === 'top') {
			x1 = '0%';
			y1 = '0%';
			x2 = '0%';
			y2 = '100%';
		}
		if (inputPos === 'top right') {
			x1 = '100%';
			y1 = '0%';
			x2 = '0%';
			y2 = '100%';
		}
		if (inputPos === 'left') {
			x1 = '0%';
			y1 = '0%';
			x2 = '100%';
			y2 = '0%';
		}
		if (inputPos === 'right') {
			x1 = '100%';
			y1 = '100%';
			x2 = '0%';
			y2 = '100%';
		}
		if (inputPos === 'bottom left') {
			x1 = '0%';
			y1 = '100%';
			x2 = '100%';
			y2 = '0%';
		}
		if (inputPos === 'bottom') {
			x1 = '100%';
			y1 = '100%';
			x2 = '100%';
			y2 = '0%';
		}
		if (inputPos === 'bottom right') {
			x1 = '100%';
			y1 = '100%';
			x2 = '0%';
			y2 = '0%';
		}
		if (inputPos === 'custom') {
			x1 = SVGBGMAKER.cusX1;
			y1 = SVGBGMAKER.cusY1;
			x2 = SVGBGMAKER.cusX2;
			y2 = SVGBGMAKER.cusY2;
		}

		var id = 'g' + new Date().getMilliseconds();
		var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">\n<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '">\n{stops}\n</linearGradient>\n<rect x="0" y="0" width="1" height="1" fill="url(#' + id + ')" />\n</svg>';

		var nStops = nextStopCount;
		var svgStops = '';
		for (var n = 0; n < nStops; ++n) {
			var stopNum = (n < nStops - 1) ? n.toString() : 'N';
			if (document.getElementById('offset' + stopNum) !== null) {
				svgStops += '<stop stop-color="{color}" offset="{offset}"/>'
					.replace(/{color}/, '#' + document.getElementById('color' + stopNum).value)
					.replace(/{offset}/, document.getElementById('offset' + stopNum).value);
			}
		}

		svg = svg.replace(/{stops}/, svgStops);
		return svg;
	};

	SVGBGMAKER.radialGradientSVG = function (inputPos, inputSize) {
		var posx, posy, dist;

		if (inputPos === 'top left') {
			posx = 0;
			posy = 0;
		} else if (inputPos === 'top center') {
			posx = 0.5;
			posy = 0;
		} else if (inputPos === 'top right') {
			posx = 1;
			posy = 0;
		} else if (inputPos === 'middle left') {
			posx = 0;
			posy = 0.5;
		} else if (inputPos === 'middle center') {
			posx = 0.5;
			posy = 0.5;
		} else if (inputPos === 'middle right') {
			posx = 1;
			posy = 0.5;
		} else if (inputPos === 'bottom left') {
			posx = 0;
			posy = 1;
		} else if (inputPos === 'bottom center') {
			posx = 0.5;
			posy = 1;
		} else if (inputPos === 'bottom right') {
			posx = 1;
			posy = 1;
		} else if (inputPos === 'custom position') {
			posx = 0.5;
			posy = 0.5;
		}

		if (inputSize === 'sub-petite') {
			dist = 0.01;
		} else if (inputSize === 'petite') {
			dist = 0.05;
		} else if (inputSize === 'extra small') {
			dist = 0.1;
		} else if (inputSize === 'small') {
			dist = 0.25;
		} else if (inputSize === 'medium') {
			dist = 0.5;
		} else if (inputSize === 'large') {
			dist = 0.75;
		} else if (inputSize === 'extra large') {
			dist = 1;
		} else if (inputSize === 'jumbo') {
			dist = 2;
		} else if (inputSize === 'colossal') {
			dist = 4;
		} else if (inputSize === 'custom size') {
			dist = 0.5;
		}

		var rectX = -50;
		var rectY = -50;
		var rectWidth = 101;
		var rectHeight = 101;

		var nStops = nextStopCount;
		var svgStops = '';
		for (var n = 0; n < nStops; ++n) {
			var stopNum = (n < nStops - 1) ? n.toString() : 'N';
			if (document.getElementById('offset' + stopNum) !== null) {
				svgStops += '<stop stop-color="{color}" offset="{offset}"/>'
					.replace(/{color}/, '#' + document.getElementById('color' + stopNum).value)
					.replace(/{offset}/, document.getElementById('offset' + stopNum).value);
			}
		}

		var gradUnit, pAspectRatio, circleRect;
		circleRect = '';
		pAspectRatio = ' preserveAspectRatio="none"';
		gradUnit = 'userSpaceOnUse';

		dist = dist * 100 + '%';
		posx = (posx * 100) + '%';
		posy = (posy * 100) + '%';

		if (inputPos === 'custom position') {
			if (SVGBGMAKER.cusCX === null) {
				posx = '50%';
				SVGBGMAKER.cusCX = posx;
			} else {
				posx = SVGBGMAKER.cusCX;
			}
			if (SVGBGMAKER.cusCY === null) {
				posy = '50%';
				SVGBGMAKER.cusCY = posy;
			} else {
				posy = SVGBGMAKER.cusCY;
			}
		}
		if (inputSize === 'custom size') {
			dist = SVGBGMAKER.cusR;
		}

		SVGBGMAKER.radcx = posx;
		SVGBGMAKER.radcy = posy;

		var id = 'g' + new Date().getMilliseconds();
		var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1 1"' + pAspectRatio + '>\n' + circleRect + '<radialGradient id="' + id + '" gradientUnits="' + gradUnit + '" cx="' + posx + '" cy="' + posy + '" r="' + dist + '">\n{stops}\n</radialGradient>\n<rect x="' + rectX + '" y="' + rectY + '" width="' + rectWidth + '" height="' + rectHeight + '" fill="url(#' + id + ')" />\n</svg>';
		svg = svg.replace(/{stops}/, svgStops);
		return svg;
	};

	// Helpful functions for Test Drive Demo
	SVGBGMAKER.trimString = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	SVGBGMAKER.stripQuotes = function (string) {
		return string.replace(/"*"/g, '');
	};

	SVGBGMAKER.contains = function (string, obj) {
		var i = string.length;
		while (i--) {
			if (string[i] === obj) {
				return true;
			}
		}
		return false;
	};

	SVGBGMAKER.repaint = function (input) {
		input.style.backgroundColor = '#' + input.value;
	};

	SVGBGMAKER.random = function (min, max) {
		return min + Math.floor(Math.random() * max);
	};

	SVGBGMAKER.randomColor = function () {
		var s = '000000' + SVGBGMAKER.random(0, 256 * 256 * 256).toString(16);
		s = s.substr(s.length - 6, 6);
		return s;
	};

	SVGBGMAKER.printData = function () {
		var msg = '';
		if (SVGBGMAKER.gradientType !== null) {
			msg += 'TYPE: ' + SVGBGMAKER.gradientType + '\n';
		}
		if (SVGBGMAKER.posvalue !== null) {
			msg += 'POSVALUE: ' + SVGBGMAKER.posvalue + '\n';
		}
		if (SVGBGMAKER.pAspectRatio !== null) {
			msg += 'PRESERVEASPECTRATIO: ' + SVGBGMAKER.pAspectRatio + '\n';
		}
		if (SVGBGMAKER.selectedPos !== null) {
			msg += 'SELECTED POS: ' + SVGBGMAKER.selectedPos + '\n';
		}
		if (SVGBGMAKER.selectedSize !== null) {
			msg += 'SELECTED SIZE: ' + SVGBGMAKER.selectedSize + '\n';
		}
		if (SVGBGMAKER.stops !== null) {
			for (var i = 0; i < SVGBGMAKER.stops.length; i++) {
				msg += 'STOPS: color: <' + SVGBGMAKER.stops[i][0] + '>; offset: <' + SVGBGMAKER.stops[i][1] + '>\n';
			}
		}
		return msg;
	};

	SVGBGMAKER.initCustomTools = function () {
		document.getElementById('linear-start').onmousedown = SVGBGMAKER.linearStartMouseDown;
		document.getElementById('linear-end').onmousedown = SVGBGMAKER.linearEndMouseDown;
		document.getElementById('radial-center').onmousedown = SVGBGMAKER.radialCenterMouseDown;
		document.getElementById('radial-radius').onmousedown = SVGBGMAKER.radialRadiusMouseDown;
		SVGBGMAKER.sampleWidth = document.getElementById('other-sample').offsetWidth - 2;
		SVGBGMAKER.sampleHeight = document.getElementById('other-sample').offsetHeight - 2;
		SVGBGMAKER.setStartTo(0, 0);
		SVGBGMAKER.setEndTo(SVGBGMAKER.sampleWidth, SVGBGMAKER.sampleHeight);
		SVGBGMAKER.setCenterTo(SVGBGMAKER.sampleWidth / 2, SVGBGMAKER.sampleHeight / 2, false);
		SVGBGMAKER.setRadiusTo(SVGBGMAKER.sampleWidth * 0.75, SVGBGMAKER.sampleHeight * 0.75);
	};

	SVGBGMAKER.updateAllPanels = function () {
		var newPos = SVGBGMAKER.selectedPos;
		var newSize = SVGBGMAKER.selectedSize;

		//Updating the thumbnails
		var thumbnail;
		if (SVGBGMAKER.gradientType === 'linear') {
			for (var i = 0; i < allLinearPos.length; i++) {
				thumbnail = document.getElementById('pos' + i);
				var markups = SVGBGMAKER.getMarkup(allLinearPos[i]);
				thumbnail.setAttribute('style', markups);
			}
		} else if (SVGBGMAKER.gradientType === 'radial') {
			for (i = 0; i < allRadialPos.length; i++) {
				thumbnail = document.getElementById('pos' + i);
				if (SVGBGMAKER.selectedSize === null) {
					newSize = allRadialSizes[4];
				}
				markups = SVGBGMAKER.getMarkup(allRadialPos[i], newSize);
				thumbnail.setAttribute('style', markups);
			}
		}
		SVGBGMAKER.pickPos(newPos);
		if ((SVGBGMAKER.gradientType === 'radial') && (newSize !== null)) {
			SVGBGMAKER.createSizePanel(newPos);
			SVGBGMAKER.pickSize(newSize);
		}
		SVGBGMAKER.updateSample();
	};

	SVGBGMAKER.showImportGradMarkup = function () {
		document.getElementById('htxtlink').style.display = 'none';
		document.getElementById('parse-link').style.display = '';
		document.getElementById('hide-link').style.display = '';
		document.getElementById('markup-source').style.display = '';
	};

	SVGBGMAKER.hideImportGradMarkup = function () {
		document.getElementById('htxtlink').style.display = '';
		document.getElementById('parse-link').style.display = 'none';
		document.getElementById('hide-link').style.display = 'none';
		document.getElementById('markup-source').style.display = 'none';
		document.getElementById('markup-type').innerHTML = '';
	};

	// Detect what type of markup it is
	SVGBGMAKER.loadMarkup = function () {
		SVGBGMAKER.markup = SVGBGMAKER.trimString(document.getElementById('markup-source').value);
		if (SVGBGMAKER.markup.indexOf('base64') !== -1) {
			document.getElementById('markup-type').innerHTML = 'Successfully parsed from base-64 URL.';
			SVGBGMAKER.loadBase64URL();
		} else if (SVGBGMAKER.markup.length === 0) {
			// Empty textarea; do nothing
			document.getElementById('markup-type').innerHTML = '';
		} else {
			document.getElementById('markup-type').innerHTML = 'Cannot parse input.';
			document.getElementById('markup-type').style.color = 'red';
			return;
		}
		document.getElementById('markup-type').style.color = '#424242';
	};

	SVGBGMAKER.initCustomTools();
	document.getElementById('g-type').gradtype[0].checked = true;
	document.getElementById('markup-source').onfocus = SVGBGMAKER.clearImportGradMarkup;
	document.getElementById('pos-panel').onchange = SVGBGMAKER.updateAllPanels;
	document.getElementById('size-panel').onchange = SVGBGMAKER.updateAllPanels;
	document.getElementById('add-stop').onclick = SVGBGMAKER.insertStop;
	document.getElementById('control-wrapper').onchange = SVGBGMAKER.updateSample;
	document.getElementById('htxtlink').onclick = SVGBGMAKER.showImportGradMarkup;
	document.getElementById('parse-link').onclick = SVGBGMAKER.loadMarkup;
	document.getElementById('hide-link').onclick = SVGBGMAKER.hideImportGradMarkup;
	document.getElementById('l-grad').onclick = SVGBGMAKER.loadLinearTable;
	document.getElementById('e-grad').onclick = function () {
		SVGBGMAKER.loadRadialTable('ellipse');
	};

	SVGBGMAKER.loadLinearTable();
}());