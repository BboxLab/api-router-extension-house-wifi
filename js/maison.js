var maison;
var deb, end;
var stroke = 4;
var widthHouse;
var cptBbox = -1;
var devices = {24: [], 5: []};
var boolInit = false;
function makeSVG(tag, attrs, style) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    for (var k in style) {
        el.style[k] = style[k];
    }
    return el;
};

var parseCoord = function(obj) {
	var val = 0.5 * widthHouse / 10;
	var x = Math.round((obj.x - 25) / val) * val + 25;
	var y = Math.round((obj.y - 25) / val) * val + 25;
	
	return {
		x: x,
		y: y
	}
};

$('.onglet-plus').on('click', function() {
	var list = $('[class*="onglet-"]');
	var l = $('[class*="onglet-"]').length - 1;
	$('[class*="onglet-"]').removeClass('active');
	$('[id*="maison-"]').hide();
	for(var i = 0; i < l; i++) {
		if(list.eq(i).css('display') === 'none') {
			var id = i;
			break;
		}
	}
	$('#' + id).show().addClass('active');
	$('#maison-' + id).show();
	maison = $('#maison-' + id).contents().find('svg');
	if(id >= 2) {
		$(this).hide();
	}
	initOnglet();
	initDraw();
	initPal();
});

var initOnglet = function() {
	$('[class*="onglet-"]:not([class*="onglet-plus"])').off('click');
	$('[class*="onglet-"]:not([class*="onglet-plus"])').on('click', function() {
		$('[class*="onglet-"]').removeClass('active');
		$(this).addClass('active');
		var id = $(this).attr('id');
		$('[id*="maison-"]').hide();
		$('#maison-' + id).show();
		if(parseInt(id) >= 2) {
			$('[class*="onglet-plus"]').hide();
		}
		maison = $('#maison-' + id).contents().find('svg');
		initDraw();
		initPal();
	});
};

var bool = false;
var touchInitMur = function(e) {
	e.preventDefault();
	bool = true;
	deb = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
	}
	deb = parseCoord(deb);
};

var touchMur = function(e) {
	e.preventDefault();
	maison.find('[id="tmp"]').remove();
	if(bool) {
		if(e.type==='touchmove') {
			end = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
			}
			end = parseCoord(end);
		}
		var line = makeSVG('line', {x1:deb.x, y1: deb.y, x2: end.x, y2: end.y, id:(e.type==='touchend'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: stroke + 'px', strokeDasharray: 1});
		maison.find('#main')[0].appendChild(line);
		if(e.type==='mouseup') {
			bool = false;
			end = null;
		}
	}
};

var initMur = function() {
	maison.on('mousedown', function(e) {
		bool = true;
	});

	maison[0].addEventListener('touchstart', touchInitMur);
	maison[0].addEventListener('touchmove', touchMur);
	maison[0].addEventListener('touchend', touchMur);

	maison.on('mousemove mouseup', function(e) {
		maison.find('[id="tmp"]').remove();
		if(bool) {
			if(!end) {
				end = deb;
			}
			var line = makeSVG('line', {x1:deb.x, y1: deb.y, x2: end.x, y2: end.y, id:(e.type==='mouseup'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: stroke + 'px', strokeDasharray: 1});
			maison.find('#main')[0].appendChild(line);
			if(e.type==='mouseup') {
				bool = false;
				end = null;
			}
		}
	});
};

var touchOpening = function(e) {
	maison.find('[id="tmp"]').remove();
	if(bool) {
		var width, height;
		var x = deb.x;
		var y = deb.y;
		if(e.type==='touchmove') {
			end = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
			}
			end = parseCoord(end);
		}
		if(end.x != deb.x || end.y != deb.y) {
			var Xb = deb.x;
			var Yb = deb.y;
			var Xa = deb.x;
			var Ya = deb.y + 100;
			if(e.type==='touchmove') {
				var Xc = e.touches[0].clientX;
				var Yc = e.touches[0].clientY;
			}
			else {
				Xc = end.x;
				Yc = end.y;
			}
			fA = Math.sqrt(Math.pow((Xc - Xb) , 2) + Math.pow((Yc - Yb) , 2)); 
			fB = Math.sqrt(Math.pow((Xc - Xa) , 2) + Math.pow((Yc - Ya) , 2));
			fC = Math.sqrt(Math.pow((Xb - Xa) , 2) + Math.pow((Yb - Ya) , 2)); 
			var fAngle = 180 * Math.acos((Math.pow(fA , 2) + Math.pow(fC , 2) - Math.pow(fB , 2)) / (2 * fA * fC)) / Math.PI; 
			var endX = end.x;
			var endY = end.y;
			if(fAngle < 45) {
				endX = deb.x;
			}
			else if(fAngle < 90) {
				endY = deb.y;
			}
			else if(fAngle < 135) {
				endY = deb.y;
			}
			else if(fAngle < 180) {
				endX = deb.x;
			}
			var L1 = (deb.x - stroke / 2) + ' ' + (deb.y  - stroke / 2);
			var L2 = ' L' + (endX - stroke / 2)  + ' ' + (endY  - stroke / 2);
			var L3 = ' L' + (endX + stroke / 2)  + ' ' + (endY + stroke / 2);
			var L4 = ' L'+(deb.x + stroke / 2) + ' ' + (deb.y  + stroke / 2);
			line = makeSVG('path', {d: 'M' + L1 + L2 + L3 + L4 + ' Z', id:(e.type==='touchend'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: '1px', fill:'white', strokeDasharray: 6});
			maison.find('#main')[0].appendChild(line);
		}
		if(e.type === 'touchend') {
			bool = false;
			end = null;
		}
	}
};

var initOpening = function() {
	maison.on('mousedown', function(e) {
		bool = true;
	});
	maison[0].addEventListener('touchstart', touchInitMur);
	maison[0].addEventListener('touchmove', touchOpening);
	maison[0].addEventListener('touchend', touchOpening);

	maison.on('mousemove mouseup', function(e) {
		maison.find('[id="tmp"]').remove();
		if(bool) {
			var width, height;
			var x = deb.x;
			var y = deb.y;
			if(!end) {
				end = deb;
			}
			if(end.x != deb.x || end.y != deb.y) {
				var Xb = deb.x;
				var Yb = deb.y;
				var Xa = deb.x;
				var Ya = deb.y + 100;
				var Xc = e.clientX;
				var Yc = e.clientY;
				fA = Math.sqrt(Math.pow((Xc - Xb) , 2) + Math.pow((Yc - Yb) , 2)); 
				fB = Math.sqrt(Math.pow((Xc - Xa) , 2) + Math.pow((Yc - Ya) , 2));
				fC = Math.sqrt(Math.pow((Xb - Xa) , 2) + Math.pow((Yb - Ya) , 2)); 
				var fAngle = 180 * Math.acos((Math.pow(fA , 2) + Math.pow(fC , 2) - Math.pow(fB , 2)) / (2 * fA * fC)) / Math.PI; 
				var endX = end.x;
				var endY = end.y;
				if(fAngle < 45) {
					endX = deb.x;
				}
				else if(fAngle < 90) {
					endY = deb.y;
				}
				else if(fAngle < 135) {
					endY = deb.y;
				}
				else if(fAngle < 180) {
					endX = deb.x;
				}
				var L1 = (deb.x - stroke / 2) + ' ' + (deb.y  - stroke / 2);
				var L2 = ' L' + (endX - stroke / 2)  + ' ' + (endY  - stroke / 2);
				var L3 = ' L' + (endX + stroke / 2)  + ' ' + (endY + stroke / 2);
				var L4 = ' L'+(deb.x + stroke / 2) + ' ' + (deb.y  + stroke / 2);
				line = makeSVG('path', {d: 'M' + L1 + L2 + L3 + L4 + ' Z', id:(e.type==='mouseup'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: '1px', fill:'white', strokeDasharray: 6});
				maison.find('#main')[0].appendChild(line);
			}
			if(e.type === 'mouseup') {
				bool = false;
				end = null;
			}
		}
	});
};


var touchPiece = function(e) {
	e.preventDefault();
	maison.find('[id="tmp"]').remove();
	if(bool) {
		if(e.type==='touchmove') {
			end = {
					x: e.touches[0].clientX,
					y: e.touches[0].clientY
			}
			end = parseCoord(end);
		}
		var width, height;
		var x = deb.x;
		var y = deb.y;
		if(deb.x > end.x) {
			width = deb.x - end.x;
			x = end.x;
		}
		else {
			width = end.x - deb.x;
		}
		if(deb.y > end.y) {
			height = deb.y - end.y;
			y = end.y;
		}
		else {
			height = end.y - deb.y;
		}
		line = makeSVG('rect', {x:x, y: y, width: width + 'px', height: height + 'px', id:(e.type==='touchend'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: stroke + 'px', fill:'none', strokeDasharray: 1});
		maison.find('#main')[0].appendChild(line);
		if(e.type === 'touchend') {
			bool = false;
			end = null;
		}
	}
};

var touchInitPiece = function(e) {
	e.preventDefault();
	bool = true;
	deb = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
	}
	deb = parseCoord(deb);
};

var initPiece = function() {
	maison.on('mousedown', function(e) {
		bool = true;
	});
	maison[0].addEventListener('touchstart', touchInitPiece);
	maison[0].addEventListener('touchmove', touchPiece);
	maison[0].addEventListener('touchend', touchPiece);

	maison.on('mousemove mouseup', function(e) {
		maison.find('[id="tmp"]').remove();
		if(bool) {
			var width, height;
			var x = deb.x;
			var y = deb.y;
			if(!end) {
				end = deb;
			}
			if(deb.x > end.x) {
				width = deb.x - end.x;
				x = end.x;
			}
			else {
				width = end.x - deb.x;
			}
			if(deb.y > end.y) {
				height = deb.y - end.y;
				y = end.y;
			}
			else {
				height = end.y - deb.y;
			}
			line = makeSVG('rect', {x:x, y: y, width: width + 'px', height: height + 'px', id:(e.type==='mouseup'?'':'tmp')}, {stroke: 'rgb(0,0,0)', strokeWidth: stroke + 'px', fill:'none', strokeDasharray: 1});
			maison.find('#main')[0].appendChild(line);
			if(e.type === 'mouseup') {
				bool = false;
				end = null;
			}
		}
	});
};
var initPal = function() {
	var id = $('.maison-button .filters-container:eq(0) input:checked').attr('id');
	if(id === 'display-suppr') {
		resetDraw();
		$('.maison-button .filters-container:not(:eq(0))').css('opacity', 0.6);
		maison.find('#main line:not([name*="line-"]), #main rect:not([id="principal"]), path').on('click', function(e) {
			if($(this).attr('id').indexOf('bbox') !== -1) {
				maison.find('[id="' + $(this).attr('id') + '"]').remove();
			}
			else {
				$(this).remove();
			}
		});
		maison.find('#main line:not([name*="line-"]), #main rect:not([id="principal"]), path').on('mouseover', function(e) {
			$(this).css('stroke', 'red');
		});
		maison.find('#main line:not([name*="line-"]), #main rect:not([id="principal"]), path').on('mouseout', function(e) {
			if($(this).attr('id').indexOf('bbox') !== -1) {
				$(this).css('stroke', '#00B5D8');
			}
			else {
				$(this).css('stroke', 'black');
			}
		});
	}
	else if(id === 'display-erase') {
		resetDraw();
		$('.maison-button .filters-container:not(:eq(0))').css('opacity', 0.6);
		maison.find('line:not([name*="line-"]), rect:not([id="principal"]), path, [id*="bbox"], text').remove();
	}
	else if(id === 'display-rssi24' || id === 'display-rssi5') {
		resetDraw();
		var type = id.substr('display-rssi'.length, id.length);
		$('.maison-button .filters-container:not(:eq(0))').css('opacity', 0.6);
		//maison.find('[name*="line-"]').hide();
		maison.find('[name*="rssi-"]').show();
		maison.find('[id*="text-' + type + '"]').show();
		maison.find('[name*="rssi-"]').on('mouseover', function(e) {
			$(this).attr('fill', 'black').attr('fill-opacity', '1');
		});
		maison.find('[name*="rssi-"]').on('mouseout', function(e) {
			$(this).attr('fill-opacity', '0');
		});
		maison.find('[id*="text-' + type + '-"]').on('click', function() {
			$(this).remove();
		});
		maison.find('[name*="rssi-"]').on('click', function(e) {
			var id = $(this).attr('name').substr('rssi-'.length, $(this).attr('name').length);
			var idClick = $(this).attr('name');
			if(idClick) {
				idClick = idClick.substr('rssi-'.length, $(this).attr('name').length)
			}
			if(maison.find('[id="text-' + type + '-' + idClick + '"]').length === 0) {
				var x = parseInt($(this).attr('cx'));
				var y = parseInt($(this).attr('cy'));
				$('#selectRSSI').remove();
				var onglet = parseInt($('[class*="onglet-"].active').attr('id'));
				var top = $('[data-id="longueur"]').eq(0).height() + $('.row.title-page').height() + $('.row .onglet').height();
				if($(window).width() < 990) {
					top += $('.container-maison-button').height();
				}
				var html = '<div id="selectRSSI" style="top:' + (y + top)+ 'px; left:' + (x + $('iframe').eq(onglet).offset().left) + 'px">';
				html += '<div class="container-select">';
				html += '<ul>';
				var l = devices[type].length;
				for(var i = 0; i < l; i++) {
					html += '<li class="liste-devices">' + (devices[type][i].hostname ? devices[type][i].hostname: devices[type][i].macaddress) + ' : ' + devices[type][i].wireless.rssi0;
					html += ' dbm<span style="display:none">' + devices[type][i].wireless.rssi0 + '</span></li>';
				}
				html += '<span class="spacer-hz"></span>';
				html += '<li>Ou Saisir : <input type="text" style="width: 50px;"/> dbm</li>';
				html += '<li id="saisir" style="display: none" class="alert-message">Le RSSI doit être compris entre -100 et 0.</li>';
				html += '</ul>';
				html += '<div class="actions">';
				html += '<div class="btn-container">';
				html += '<div class="cta-1">Confirmer';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				html += '</div>';
				$('.maison').append(html);
				$('#selectRSSI li.liste-devices').on('click', function() {
					var text = makeSVG('text', {id:'text-' + type + '-' + id, x: x, y: y, 'text-anchor':'middle', 'alignment-baseline': 'middle'}, {'font-size': '13px'});
					var t = document.createTextNode($(this).find('span').text());
					text.appendChild(t);
					$(text).on('click', function() {
						$(this).remove();
					});
					maison.find('#main')[0].appendChild(text);
					$('#selectRSSI').remove();
				});
				$('#selectRSSI input').on('keyup', function() {
					var val = $('#selectRSSI input[type="text"]').val();
					if(parseInt(val) <= 0 && parseInt(val) >= -100 || val === '-') {
						$('#selectRSSI #saisir').hide();
					}
					else {
						$('#selectRSSI #saisir').text('Le RSSI doit être compris entre -100 et 0.').show();
					}
				});
				$('#selectRSSI .cta-1').on('click', function() {
					var val = parseInt($('#selectRSSI input[type="text"]').val());
					if(val <= 0 && val >= -100) {
						var text = makeSVG('text', {id:'text-' + type + '-' + id, x: x, y: y, 'text-anchor':'middle', 'alignment-baseline': 'middle'}, {'font-size': '13px'});
						var t = document.createTextNode(val);
						$(text).on('click', function() {
							$(this).remove();
						});
						text.appendChild(t);
						maison.find('#main')[0].appendChild(text);
						$('#selectRSSI').remove();
					}
				});
			}
			else {
				maison.find('[id="text-' + idClick + '"]').remove();
			}
		});
	}
	else if(id === 'display-draw') {
		$('.maison-button .filters-container:not(:eq(0))').css('opacity', 1);
		initDraw();
	}
};
$('.maison-button .filters-container:eq(0) input').on('change', initPal);

var resetDraw = function() {
	$('#selectRSSI').remove();
	maison.off('mousedown');
	maison.off('mousemove');
	maison.off('mouseup');
	maison.off('click');
	maison.off('mouseover');
	maison.find('line, rect:not([id="principal"])').off('mouseover');
	maison.find('line, rect:not([id="principal"])').off('mouseout');
	maison.find('line, rect:not([id="principal"])').off('click');
	maison.find('[name*="line-"]').show();
	maison.find('[name*="rssi-"]').hide();
	maison.find('[name*="rssi-"]').off('mouseover');
	maison.find('[name*="rssi-"]').off('mouseout');
	maison.find('[name*="rssi-"]').off('click');
	maison.find('[id*="text-"]').off('click');
	maison.find('[id*="text-"]').hide();
	maison[0].removeEventListener('touchstart', touchInitMur);
	maison[0].removeEventListener('touchmove', touchMur);
	maison[0].removeEventListener('touchend', touchMur);
	maison[0].removeEventListener('touchstart', touchInitPiece);
	maison[0].removeEventListener('touchmove', touchPiece);
	maison[0].removeEventListener('touchend', touchPiece);
	maison[0].removeEventListener('touchmove', touchOpening);
	maison[0].removeEventListener('touchend', touchOpening);
}

var initDraw = function() {
	resetDraw();
	if($('.maison-button .filters-container:eq(0) input:checked').attr('id') === 'display-draw') {
		var id = $('.maison-button .filters-container:eq(1) input:checked').attr('id');
		if(id === 'display-mur') {
			initMur();
		}
		else if(id === 'display-room') {
			initPiece();
		}
		else if(id === 'display-opening') {
			initOpening();
		}
		else if(id === 'display-bbox') {
			var drawBbox = function(e, x, y, width, height, val) {
				var g = makeSVG('g', {id: (e.type === 'click'?'bbox_' + cptBbox:'tmp')});
				var path1 = makeSVG('path', {
					id: 'logo',
					fill:"none",
					stroke:"#454545",
					strokeWidth:"4",
					strokeLinecap:"round",
					strokeMiterlimit:"10", 
					'd': 'M' + (x + val - val / 4) + ',' + (y + 22) + ' q' + (-val / 4) + ' ' +  (- 12) + ' ' + (- val + 2 * val / 4) + ' ' +  (0)
				});
				var path2 = makeSVG('path', {
					id: 'logo',
					fill:"none",
					stroke:"#454545",
					strokeWidth:"4",
					strokeLinecap:"round",
					strokeMiterlimit:"10", 
					'd': 'M' + (x + val - val / 6) + ',' + (y + 17) + ' q' + (-val / 2 + val / 6) + ' ' +  (- 15) + ' ' + (- val + 2 * val / 6) + ' ' +  (0)
				});
				var path3 = makeSVG('path', {
					id: 'logo',
					fill:"none",
					stroke:"#454545",
					strokeWidth:"4",
					strokeLinecap:"round",
					strokeMiterlimit:"10", 
					'd': 'M' + (x + val - val / 3) + ',' + (y + 27) + ' q' + (-val / 6) + ' ' +  (- 9) + ' ' + (- val + 2 * val / 3) + ' ' +  (0)
				});
				g.appendChild(path1);
				g.appendChild(path2);
				g.appendChild(path3);
				var circle = makeSVG('circle', {
					id: 'logo',
					fill:"#454545",
					cx:(x + val / 2),
					cy:(y + 32),
					r:"2"
				});
				g.appendChild(circle);
				maison.find('#main')[0].appendChild(g);
				line = makeSVG('rect', {x:x, y: y, width: width + 'px', height: height + 'px', id:(e.type === 'click'?'bbox_' + cptBbox:'tmp')}, {stroke: '#00B5D8', strokeWidth: '2px', fill:'transparent'});
				maison.find('#main')[0].appendChild(line);
			}
			
			var initBbox = function(e) {
				maison.find('[id="tmp"]').remove();
				var val = 0.5 * widthHouse / 10;
				var width, height;
				if(e.type === 'click') {
					var deb = parseCoord({
						x: e.clientX,
						y: e.clientY
					});
					var x = deb.x;
					var y = deb.y;
					cptBbox++;
				}
				else {
					x = e.clientX + 5;
					y = e.clientY;
				}
				width = val;
				height = val;
				
				drawBbox(e, x, y, width, height, val);
			}
			maison.on('mouseover click', function(e) {
				initBbox(e);
			});
		}
	}
};

$('.maison-button .filters-container:eq(1) input').on('change', initDraw);
$('.maison-button .filters-container:eq(2) label').on('click', function() {
	if($(this).prev().attr('id') === 'display-extern') {
		stroke = 8;
	}
	else if($(this).prev().attr('id') === 'display-intern') {
		stroke = 4;
	}
});

var initDevices = function(response) {
	if(!response.error) {
		var list = response.data[0].hosts.list;
		var l = list.length;
		devices = {24: [], 5: []};
		for(var i = 0; i < l; i++) {
			if(list[i].link.toLowerCase().indexOf('wifi') !== -1 && list[i].active === 1) {
				if(list[i].link.indexOf('5') !== -1) {
					devices[5].push(list[i]);
				}
				else {
					devices[24].push(list[i]);
				}
			}
		}
		setTimeout(function() {
			Bbox.api.network_devices.get(initDevices);
		}, 10000);
	}
};

var init = function(id) {
	maison = $('[id="maison-' + id + '"]').contents().find('svg');
	widthHouse = 850;//Math.min(860, $('iframe').width()) - 10;
	$('iframe').css('height', widthHouse);
	maison.attr('height', widthHouse + 'px');
	maison.find('#principal').attr('height', widthHouse + 'px');

	$('.maison').css('width', widthHouse + 10);
	$('iframe').css('width', widthHouse);
	maison.attr('width', widthHouse + 'px');
	maison.find('#principal').attr('width', widthHouse + 'px');

	var val = 0.5 * widthHouse / 10;
	var g = makeSVG('g');
	for(var i = 0; i <= 20; i++) {
		for(var j = 0; j <= 20; j++) {
			var line = makeSVG('line', {name: 'line-' + i + '_' + j, x1: 20 + i * val, y1: 25 + j * val, x2: 30 + i * val, y2: 25 + j * val, fill:'lightgrey'}, {stroke: 'lightgrey', strokeWidth: 1});
			g.appendChild(line);
			line = makeSVG('line', {name: 'line-' + i + '_' + j, x1: 25 + i * val, y1: 20 + j * val, x2: 25 + i * val, y2: 30 + j * val, fill:'lightgrey'}, {stroke: 'lightgrey', strokeWidth: 1});
			g.appendChild(line);
			line = makeSVG('circle', {name: 'circle-' + i + '_' + j, cx: 25 + i * val, cy: 25 + j * val, r: 2, fill:'transparent'}, {stroke: 'transparent', strokeWidth: val-3});
			g.appendChild(line);
			line = makeSVG('circle', {name: 'rssi-' + i + '_' + j, cx: 25 + i * val + val / 2, cy: 25 + j * val + val / 2, r: 2, fill:'lightgrey', 'fill-opacity': '0'}, {stroke: 'transparent', strokeWidth: val, display: 'none'});
			g.appendChild(line);
		}
	}
	var l = maison.find('#main').length;
	for(var i = 0; i < l; i++) {
		maison.find('#main')[i].appendChild(g);
		g = $(g).clone()[0];
	}

	if(navigator.appVersion.indexOf('Mobile') === -1) {
		maison.find('circle').on('mouseover', function(e) {
			maison.find('[name*="line-"]').css('stroke', 'lightgrey');
			if($('.maison-button .filters-container:eq(0) input:checked').attr('id') !== 'display-suppr' && 
					$('.maison-button .filters-container:eq(0) input:checked').attr('id').indexOf('display-rssi') === -1) {
				var id = $(this).attr('name').substr('circle-'.length, $(this).attr('name').length);
				maison.find('[name="line-' + id + '"]').css('stroke', 'black');
				if(!bool) {
					deb = {x: parseInt($(this).attr('cx')), y: parseInt($(this).attr('cy'))};
				}
				else {
					end = {x: parseInt($(this).attr('cx')), y: parseInt($(this).attr('cy'))};
				}
			}
		});
	}
	$('iframe').on('mouseout', function() {
		maison.find('[name*="tmp"], [id*="tmp"]').remove();
	});
	
};

var initOnce = function() {
	var tout = localStorage.getItem('maison');
	if(tout) {
		tout = JSON.parse(tout);
		for(var j = 0; j < 3; j++) {
			var ls = tout[j];
			maison = $('#maison-' + j).contents().find('svg');
			var l = ls.length;
			for(var i = 0; i < l; i++) {
				var elem = makeSVG(ls[i]['tag'], ls[i]['attr'], ls[i]['style']);
				if(ls[i]['attr']['id'] && ls[i]['attr']['id'].indexOf('bbox_') !== -1 && ls[i]['tag'] === 'g') {
					var g = elem;
					cptBbox++;
					maison.find('#main')[0].appendChild(elem);			
				}
				else if(ls[i]['attr']['id'] && ls[i]['attr']['id'].indexOf('logo') !== -1 ||
						ls[i]['attr']['id'] && ls[i]['attr']['id'].indexOf('bbox_') !== -1) {
					if(g) {
						g.appendChild(elem);
					}
				}
				else {
					if(ls[i]['text']) {
						text = document.createTextNode(ls[i]['text']);
						elem.appendChild(text);
						elem.style.display = 'none';
					}
					maison.find('#main')[0].appendChild(elem);			
				}
			}
		}
	}
	initOnglet();
	if(tout && tout[2].length > 0) {
		$('#1').show();
		$('#2').show();
		$('[class*="onglet-plus"]').hide();
	}
	else if(tout && tout[1].length > 0) {
		$('#1').show();
	}
	$('[data-id="longueur"]').clone().appendTo('.maison').attr('data-id', 'largeur').css('transform', 'rotate(90deg) translate(-' + (widthHouse / 2 + 20) + 'px,-' + (widthHouse / 2 + 20) + 'px)')
	maison = $('#maison-0').contents().find('svg');
	$('.load').remove();
	Bbox.api.network_devices.get(initDevices);
	initPiece();
};

$('.btn-submit').on('click', function() {
	var tab = [[],[],[]];
	for(var j = 0; j < 3; j++) {
		maison = $('#maison-' + j).contents().find('svg');
		var list = maison.find('line:not([name*="line-"]), rect:not([id="principal"]), path, [id*="bbox"], text, circle[id="logo"], g[id*="bbox_"]');
		var l = list.length;
		for(var i = 0; i < l; i++) {
			if(list[i].tagName === 'line') {
				tab[j].push({
					tag: list[i].tagName,
					attr: {
						x1: list.eq(i).attr('x1'), 
						y1: list.eq(i).attr('y1'), 
						x2: list.eq(i).attr('x2'),
						y2: list.eq(i).attr('y2'),
						id: list.eq(i).attr('id')
					},
					style: {
						stroke: list[i].style['stroke'] || list.eq(i).css('stroke'),
						strokeWidth: list[i].style['stroke-width'] || list.eq(i).css('stroke-width'),
						strokeDasharray: list[i].style['stroke-dasharray'] || list.eq(i).css('stroke-dasharray')
					}
				});
			}
			else if(list[i].tagName === 'rect') {
				tab[j].push({
					tag: list[i].tagName,
					attr: {
						x: list.eq(i).attr('x'), 
						y: list.eq(i).attr('y'), 
						width: list.eq(i).attr('width'), 
						height: list.eq(i).attr('height'), 
						id: list.eq(i).attr('id')
					},
					style: {
						stroke: list[i].style['stroke'],
						'stroke-width': list[i].style['stroke-width'],
						fill: list[i].style.fill,
						'stroke-dasharray': list[i].style['stroke-dasharray']
					}
				});
			}
			else if(list[i].tagName === 'path') {
				tab[j].push({
					tag: list[i].tagName,
					attr: {
						d: list.eq(i).attr('d'), 
						id: list.eq(i).attr('id')
					},
					style: {
						stroke: 'rgb(0,0,0)', 
						'stroke-width': list[i].style['stroke-width'] || list.eq(i).css('stroke-width'), 
						fill: list[i].style['fill'] || list.eq(i).css('fill'), 
						'stroke-dasharray': list[i].style['stroke-dasharray'] || list.eq(i).css('stroke-dasharray')
					}		
				});
			}
			else if(list[i].tagName === 'text') {
				tab[j].push({
					tag: list[i].tagName,
					text: list.eq(i).text(),
					attr: {
						id: list.eq(i).attr('id'), 
						x: list.eq(i).attr('x'), 
						y: list.eq(i).attr('y'), 
						'text-anchor': list.eq(i).attr('text-anchor') || list.eq(i).css('text-anchor'), 
						'alignment-baseline': list.eq(i).attr('alignment-baseline') || list.eq(i).css('alignement-baseline')
					},
					style: {
						'font-size': list[i].style['font-size'] || list.eq(i).css('font-size')
					}
				});
			}
			else if(list[i].tagName === 'circle') {
				tab[j].push({
					tag: list[i].tagName,
					attr: {
						id: list.eq(i).attr('id'),
						fill:list.eq(i).attr('fill'),
						cx:list.eq(i).attr('cx'),
						cy:list.eq(i).attr('cy'),
						r:list.eq(i).attr('r')
					}
				});
			}
			else if(list[i].tagName === 'g') {
				tab[j].push({
					tag: list[i].tagName,
					attr: {
						id: list.eq(i).attr('id')
					}
				});
			}
		}
	}
	localStorage.setItem('maison', JSON.stringify(tab));
	maison = $('#maison-0').contents().find('svg');
});

var cptInit = 0;

$('iframe').eq(0).attr('src', '/medias/images/maison.svg').on('load', function() {
	if(!boolInit) {
		init(0);
		cptInit++;
		if(cptInit === 3) {
			initOnce();
		}
	}
});
$('iframe').eq(1).attr('src', '/medias/images/maison.svg').on('load', function() {
	if(!boolInit) {
		init(1);
		cptInit++;
		if(cptInit === 3) {
			initOnce();
		}
	}
});
$('iframe').eq(2).attr('src', '/medias/images/maison.svg').on('load', function() {
	if(!boolInit) {
		init(2);
		cptInit++;
		if(cptInit === 3) {
			initOnce();
		}
	}
});
