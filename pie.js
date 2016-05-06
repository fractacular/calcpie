// By Scott Sutherland
/*
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
// object fix
if(typeof Object.create !== 'function'){
	Object.clreate = function(obj){
		function F(){};
		F.prototype = obj;
		return new F();
	}
}
// continue at ~20 min
(function($,window,document,undefined){

	var makePie = {
		init: function(options,elem){
			var self = this;
			self.elem = elem;
			self.$elem = $(elem);
			o = $.extend({},$.fn.pie.options,options);
			o.nSlices = o.start.split(',').length;
			self.$elem.on('built',function(){
				var options = o.start.split(','),
					c = 0;
				$.each(options,function(i,v){
					++i;
					c += eval(v);
					u = (o.defaultUnits == 'percent') ? c * 360 / 100 : c;

					makePie.move('calcpie-p'+i,u,o.defaultUnits)
				});
			})

			this.buildPie(elem,o);
			this.makeLegend(self.$elem,o);

			$('path.calc-pie').each(function(i,v){

				makePie.showText($(v))

			});

			if(o.interactive) {

				self.interactive();

			}
		},
		interactive: function(){
			$('#calcpie-mouseOverlay').on({
					mousedown:function(e){
						if(e.which == 1) makePie.startMouse.call(this,e);
					},mouseover:function(){
						makePie.showText($(this))
					},mouseout:function(){
						// $('text.calcpie-pitext[for='+this.id+']').text('')
					},click:function(e){
						e.preventDefault();
					}
				},'path')
		},
		buildPie: function(container,o){
			// creates the SVG elements and sticks them onto the container
			// diameter, height, width, container
			// primarily uses JavaScript SVG DOM methods as that is the only way possible despite it being such a lengthy process to do so.
			diam = eval(o.diameter);
			r = diam/2;
			tx = (diam > o.width) ? r : o.width/2;
			ty = (diam > o.height) ? r : o.height/2;
			var NS = 'http://www.w3.org/2000/svg',
				svgObj = document.createElementNS(NS,'svg'),
				gpi1 = document.createElementNS(NS,'g'),
				gpi2 = document.createElementNS(NS,'g'),
				gpi3 = document.createElementNS(NS,'g'),
				d = 'M0,0 L-'+r+',0 A'+r+','+r+',0,1,1,-'+r+',0 z',
				trans = 'translate('+tx+','+ty+')';
			
			// set up the svg wrapper
			svgObj.setAttribute('width',o.width);
			svgObj.setAttribute('height',o.height);
			svgObj.setAttribute('id','calc-pie-svg')

			// set up the group with the proper translation
			gpi1.setAttribute('transform',trans);
			gpi1.setAttribute('id','calc-pie');
			gpi2.setAttribute('transform',trans);
			gpi2.setAttribute('id','calcpie-text');
			gpi3.setAttribute('transform',trans);
			gpi3.setAttribute('id','calcpie-mouseOverlay');

			// append the objects to the container
			document.getElementById(container.id).appendChild(svgObj).appendChild(gpi1)
			document.getElementById('calc-pie-svg').appendChild(gpi2);
			document.getElementById('calc-pie-svg').appendChild(gpi3);

			// write the paths fill, text, mouseHandle
			for(n = o.nSlices; n > 0; n--){
				var path1 = document.createElementNS(NS,'path'),
					text = document.createElementNS(NS,'text'),
					path2 = document.createElementNS(NS,'path'),
					item = 'calcpie-p'+n;
					path1.setAttribute('for',item);
					path1.setAttribute('class','calc-pie');
					path2.setAttribute('id',item);
					path2.setAttribute('d',d);
					path2.setAttribute('class','calc-pieHandle')
					text.setAttribute('for',item);
					text.setAttribute('class','calcpie-pitext');
				document.getElementById('calc-pie').appendChild(path1);
				document.getElementById('calcpie-text').appendChild(text);
				document.getElementById('calcpie-mouseOverlay').appendChild(path2);
			}
			$(container).trigger('built');
		},
		move: function(slice,amt){
			// for amt in degrees (we'll convert to radians, r), move the slice
			// d and a are the corresponding path attributes split into arrays
			var r = amt*Math.PI/180, d = $('#'+slice).attr('d').split(' '), a = d[2].split(',');
			// find the coordinates
			radius = o.diameter/2;
			a[5] = 0-radius*Math.cos(r);
			a[6] = 0-radius*Math.sin(r);
			
			// we need to change the arc flags for paths over 180 degrees
			if(amt > 180) {	a[4] = 1; a[3] = 1 } else if(amt <= 180) { a[4] = 1; a[3] = 0 }
			
			// re-string it and apply these to both the mouse and the fill layers
			d[2] = a.join(',');	m = d.join(' ');
			$('#'+slice).attr('d',m).attr('amount',amt);
			$('path.calc-pie[for="'+slice+'"]').attr('d',m).attr('amount',amt);
			return amt;
		},
		startMouse: function(e){
			var xmove, ymove, xstart = e.clientX, ystart = e.clientY,
				p = this.id, v = parseFloat($(this).attr('amount')), s = o.sensitivity;
			$(this).on('mousemove',function(e){
				xend = e.clientX,
				yend = e.clientY,
				xmove = xend - xstart,
				ymove = yend - ystart;
				if(v < 90) {
					tmp = (Math.abs(xmove) > Math.abs(ymove)) ? xmove * s : 0-ymove * s;}
				if(90 <= v && v < 180) tmp = (Math.abs(xmove) > Math.abs(ymove)) ? xmove * s : ymove * s;
				if(180 <= v && v < 270) tmp = (Math.abs(xmove) > Math.abs(ymove)) ? xmove * -s : ymove * s;
				if(270 <= v) tmp = (Math.abs(xmove) > Math.abs(ymove)) ? xmove * -s : ymove * s;
				if(Math.abs(tmp) > s && Math.abs(tmp) <= 180) {
					tmp += v;
					if(0 < tmp && tmp < 360) { val = tmp } else { val = (tmp > 360) ? 360 : 0 }
					makePie.move(p,val,'y');
				}
				// makePie.amount($(this),'degrees')
				makePie.showText($(this))
				makePie.showText($(this).prev())
			});

			$(document).on('mouseup',function(){
				$('path').off('mousemove');
				$(document).off('mouseup');
			})
		},
		amount:function(elem,format){
			// format can be 'deg' for degrees, 'per' for percent
			amt = eval($(elem).attr('amount'));
			prev = (elem.next().length == 0) ? 0 : eval(elem.next().attr('amount'));
			amt = amt-prev;
			switch(format){
				case 'percent': return amt/360*100; break;
				case 'degrees': return amt; break;
				default: return amt; break;
			}
		},
		position:function(){
			r = {}
			$('path.calc-pie').map(function(i,v){
				r[$(v).attr('for')] = makePie.amount($(v),'percent');
			});
			return r;
		},
		showText:function(elem){
			var id = (elem.attr('id')) ? elem.attr('id') : elem.attr('for'),
				amt, prevamt,
				t = {'x':'','r':''}, prevamt,rmod = 0,
				prev = (elem.next().length == 0) ? 0 : eval(elem.next().attr('amount'));
				switch(o.labelPosition){
					case 'inner': rmod = 0.60; break;
					case 'outer': rmod = 1.35; break;
					default: rmod = 0.55; break;
				}
			amt = makePie.amount(elem,'degrees')
			t.r = (amt/2)+prev;
			if(90 < t.r && t.r < 270){
				t.r -= 180;
				t.x = o.diameter/2*rmod
			} else { 
				t.x = 0-o.diameter/2*rmod
			}
			amt = Math.round(amt/360*1000)/10;
			$('text.calcpie-pitext[for='+id+']').attr({
				'transform':'rotate('+t.r+')',
				'x':t.x,
			}).text(amt+'%');
			return true;
		},
		makeLegend:function(elem,o){
			var legLabels = o.legend.split(',');
			console.log(elem);
			if(legLabels.length === o.nSlices){
				elem.append('<div id="calcpie-legend"></div>');
				
			}
		}
	} 

	$.fn.pie = function(options){
		if(typeof options === 'string') {
			switch(options){
				case 'position': 
					return makePie.position();
				 	break;
			}
		} else {
			return this.each(function(){
				var pie = Object.create(makePie);
				pie.init(options,this);
			})
		}
	}
	// defaults
	$.fn.pie.options = {
		width: 130,
		height: 130,
		diameter: 120,
		defaultUnits: 'degrees',
		start: '60,60,60,60,60,60',
		showLabel: 'mouseover',
		interactive: 'yes',
		sensitivity: 1.5,
		labelPosition: 'inner',
		legend: '',
	}

})(jQuery,window,document)
