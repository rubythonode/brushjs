// Animation

//Code From Paul Irish.
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// Group
// SET/ GET
var Group = {
	layers : {},
	_set : function(layerName, canvas, option , type , active){
		this.layers[layerName] = {
			canvas : canvas,
			type: type,
			props : option,
			propsOrigin : brushProto.extend(true , {} , option),
			active : active
		}
	},
	set : function(canvas, option , type, active){
		option.forEach(function(ele, idx){
			var layerName = ele.id === undefined ? _generateLayerName() : ele.id;
			Group._set(layerName, canvas, ele , type , (active === undefined ? false : active) );
		})
	},
	_get : function(name){
		if(this.layers[name]){
			return this.layers[name]
		}
		else {
			return this.layers;
		}
	},
	get : function(name){
		return Group._get(name)
	}
};

function _generateLayerName(){
	return Math.random().toString(36).substring(7);
}

// Brush
var Brush = function(canvas) {
	this.canvasElem = document.getElementById(canvas);
	this.width = this.canvasElem.width;
	this.height = this.canvasElem.height;
	this.context = this.canvasElem.getContext('2d');
}
var brushProto = Brush.prototype = {};

brushProto.Clear = function(layer){
	var cavnas = layer['canvas'];
	var	context = cavnas['context'];
	context.clearRect(0,0, canvas.width, canvas.height)
}

brushProto.init = function(cavnas,option, type){
	Group.set( cavnas, option, type , false);
	drawing();
}

brushProto.Text =  function(option){
	brushProto.init(this , option , 'text')
	return this;
}
brushProto.Circle =  function(option){
	brushProto.init(this , option , 'circle')
	return this;
}
brushProto.Line =  function(option){
	brushProto.init(this , option , 'line')
	return this;
}
brushProto.ArcTo =  function(option){
	brushProto.init(this , option , 'arcto')
	return this;
}
brushProto.BezierCurve =  function(option){
	brushProto.init(this , option , 'bezier')
	return this;
}
brushProto.QuadraticCurve =  function(option){
	brushProto.init(this , option , 'quadratic')
	return this;
}
brushProto.Rectangle =  function(option){
	brushProto.init(this , option , 'rectangle')
	return this;
}


brushProto.drawingFn = {
	circle: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'], points = option['points'];

		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		_context.globalAlpha = option.opacity ? option.opacity : 1;

		points.forEach(function(elem){
			_context.beginPath();
			_context.arc(elem[0] , Helper.fixCoordinate(_canvas.height,elem[1]), elem[2], option.startAngle , option.endAngle,option.dir);
			if(option.isFill){
				if(option.fillColor){
					_context.fillStyle = option.fillColor;
				}
				_context.fill();
			}else{
				_context.stroke();
			}
		});
	},
	rectangle: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'], points = option['points'];

		_context.globalAlpha = option.opacity ? option.opacity : 1;

		points.forEach(function(elem){
			if(option.isFill){
				_context.fillStyle = option.fillColor;
				_context.fillRect(elem[0], Helper.fixCoordinate(_canvas.height,elem[1]), elem[2], elem[3]);

			}else{
				_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
				_context.strokeStyle =  option.strokeStyle ? option.strokeStyle : '#000';
				_context.strokeRect(elem[0], Helper.fixCoordinate(_canvas.height,elem[1]), elem[2], elem[3]);
			}
		})
	},
	text: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'];
		_context.font = option.font ? option.font : '14pt Arial';
		_context.fillStyle = option.fillStyle ? option.fillStyle : 'black';
		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		_context.textAlign = option.textAlign ? option.textAlign : 'center';
		_context.textBaseline = option.textBaseline ? option.textBaseline : 'middle';
		_context.fillText(option.text, option.x, Helper.fixCoordinate(_canvas.height, option.y));
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		if(option.strokeStyle){
			_context.strokeText(option.text, option.x, Helper.fixCoordinate(_canvas.height, option.y))
		}
	},
	line: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'], points = option.points;

		_context.beginPath();
		_context.moveTo(points[0][0] , Helper.fixCoordinate(_canvas.height, points[0][1]) );

		for(var point =1; point < points.length; point++){
			_context.lineTo(points[point][0] , Helper.fixCoordinate(_canvas.height, points[point][1]) );
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.lineCap = option.lineCap ? option.lineCap : 'butt';
		_context.lineJoin = option.lineJoin ? option.lineJoin : 'bevel';
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		if(option['isClose']){
			_context.closePath();
		}
		if(option['isFill']){
			_context.fillStyle = option.fillColor;
			_context.fill();
		}else{
			_context.stroke();
		}
	},
	arcto: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'];
		_context.beginPath();
		_context.moveTo(option.from[0] , Helper.fixCoordinate(_canvas.height, option.from[1]) );

		var points = option.points;
		for(var point =0; point < points.length; point++){
			_context.arcTo(
				points[point][0] , Helper.fixCoordinate(_canvas.height, points[point][1]) ,
				points[point][2] , Helper.fixCoordinate(_canvas.height, points[point][3]) ,
				points[point][4]
			);
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		_context.lineCap = option.lineCap ? option.lineCap : 'butt';
		_context.lineJoin = option.lineJoin ? option.lineJoin : 'bevel';

		if(option['isClose']){
			_context.closePath();
		}
		if(option['isFill']){
			_context.fillStyle = option.fillColor;
			_context.fill();
		}else{
			_context.stroke();
		}
	},
	bezierCurve: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'];
		_context.beginPath();
		_context.moveTo(option.from[0] , Helper.fixCoordinate(_canvas.height, option.from[1]) );
		var points = option.points;
		for(var point =0; point < points.length; point++){
			_context.bezierCurveTo(
				points[point][0] , Helper.fixCoordinate(_canvas.height, points[point][1]) ,
				points[point][2] , Helper.fixCoordinate(_canvas.height, points[point][3]) ,
				points[point][4] , Helper.fixCoordinate(_canvas.height, points[point][5])
			);
		}
		if(option.isClose){
			_context.closePath();
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		if(option['isFill']){
			_context.fillStyle = option.fillColor;
			_context.fill();
		}else{
			_context.stroke();
		}
	},
	quadraticCurve: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'];

		_context.beginPath();
		_context.moveTo(option.from[0] , Helper.fixCoordinate(_canvas.height, option.from[1]) );

		var points = option.points;
		for(var point =0; point < points.length; point++){
			_context.quadraticCurveTo(
				points[point][0] , Helper.fixCoordinate(_canvas.height, points[point][1]) ,
				points[point][2] , Helper.fixCoordinate(_canvas.height, points[point][3]) );
		}

		if(option.isClose){
			_context.closePath();
		}
		_context.lineWidth = option.lineWidth ? option.lineWidth : 1;
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		if(option.strokeStyle){
			_context.strokeStyle =  option.strokeStyle;
		}
		_context.lineCap = option.lineCap ? option.lineCap : 'butt'
		_context.stroke();
	},
	stroke: function(layer){
		var _canvas = layer['canvas'], _context = _canvas.context, option = layer['props'], points = option['drawPoints'], pointsLen = points.length, index = 0;
		if(option['index']){
			index = option['index'];
		}else{
			option['index'] = 0;

		}

		var startX = option['points'][0][0];
		var startY = option['points'][0][1];

		_context.beginPath();
		_context.moveTo(startX , Helper.fixCoordinate(_canvas.height, startY) );
		_context.globalAlpha = option.opacity ? option.opacity : 1;
		for(var step =0; step <= index; step++){
			_context.lineTo(points[step][0] , Helper.fixCoordinate(_canvas.height, points[step][1])  );
		}
		//
		option['index'] = option['index'] + 1;

		_context.stroke();
		if(option['index'] === pointsLen){
			option['index'] =0;
		}

	}
}


brushProto.Stroke =  function(option){

	brushProto.init(this , option , 'stroke')

	return canvas;
}

function drawing(){
	var layers = Group.get();
	for(var key in layers){
		(function(){
			var _layer = layers[key];
			switch(_layer['type']){
				case 'text':
					brushProto.drawingFn.text(_layer);
					break;
				case 'circle':
					brushProto.drawingFn.circle(_layer);
					break;
				case 'line':
					brushProto.drawingFn.line(_layer);
					break;
				case 'arcto':
					brushProto.drawingFn.arcto(_layer);
					break;
				case 'bezier':
					brushProto.drawingFn.bezierCurve(_layer);
					break;
				case 'quadratic':
					brushProto.drawingFn.quadraticCurve(_layer);
					break;
				case 'rectangle':
					brushProto.drawingFn.rectangle(_layer);
					break;
				case 'stroke':
					if(arguments[1] === 'animate'){
						brushProto.drawingFn.stroke(_layer);
					}
					break;
				default:
					return;
			}

		})(key, arguments[0])


	}

}

var AnimationGroup = {
	layers : [],
	set : function(info){
		this.layers.push(info);
	},
	get : function(name){
		if(this.layers[name]){
			return this.layers[name];
		}else{
			return this.layers;
		}
	}
};
brushProto.clear =  function(){
	var layers = Group.get();
	for(var key in layers){
		(function(key){
			var canvas = layers[key]['canvas'];
			var context = canvas.context;
			context.clearRect(0, 0, canvas.width, canvas.height);
		})(key)
	}
}

brushProto.Animation = function(info){
	var len = info.length;
	for(var cnt =0; cnt < len; cnt++){
		(function(cnt){
			AnimationGroup.set(info[cnt]);
		})(cnt);
	}
	_Animation()
}

function _Animation(){

	AnimationGroup.get().forEach(function(elm){
		var _id = elm['id'], type = elm['type'], layer = Group.get(_id);
		AnimationType[type](layer, elm);

	})
	brushProto.clear()
	drawing('animate');
	window.requestAnimationFrame(_Animation)
	//setTimeout(_Animation, 1000);
}

var AnimationType = {
	falling: function(layer, animationInfo){
		var cavnas = layer['canvas'], option = animationInfo;
		var points = layer['props']['points'];
		var pointsLen = points.length;
		points.forEach(function(elem){
			if(elem[1] < 0){
				pointsLen--;
				if(pointsLen === 0){
					layer['props'] = brushProto.extend(true , {} , layer['propsOrigin']);
				}
			}
			elem[1] = elem[1] - option['speed'];
		})
	},
	rising: function(layer, animationInfo){
		var cavnas = layer['canvas'], option = animationInfo;
		var points = layer['props']['points'];
		var pointsLen = points.length;
		points.forEach(function(elem){
			if(elem[1] > canvas.height){
				pointsLen--;
				if(pointsLen === 0){
					layer['props'] = brushProto.extend(true , {} , layer['propsOrigin']);
				}
			}
			elem[1] = elem[1] + option['speed'];
		})
	},
	blowing: function(layer, animationInfo){
		var cavnas = layer['canvas'], option = animationInfo;
		var originX = layer['propsOrigin']['x'];
		if(layer['props']['y'] < 0){
			layer['props'] = brushProto.extend({} , layer['propsOrigin']);
		}

		layer['props']['y'] = layer['props']['y'] - option['speed'];
		if(option['dir'] === 'left'){
			layer['props']['x'] = layer['props']['x'] - 1;
		}else{
			layer['props']['x'] = layer['props']['x'] + 1;
		}
	},
	bouncing: function(layer, animationInfo){
		var cavnas = layer['canvas'], option = animationInfo;
		layer['props']['x'] = layer['props']['x'] + option['speedX'];
		layer['props']['y'] = layer['props']['y'] + option['speedY'];

		if(layer['props']['y'] > canvas.height){
			option['speedY'] = -option['speedY'];
		}

		if(layer['props']['y'] < 0 ){
			option['speedY'] = -option['speedY'];
		}

		if(layer['props']['x'] < 0 ){
			option['speedX'] = -option['speedX'];
		}

		if(layer['props']['x'] > canvas.width ){
			option['speedX'] = -option['speedX'];
		}
	},
	stroking: function(layer, animationInfo){
		var option = layer['props'], points = option['points'], speed = animationInfo['speed'], drawPoints = [];
		option['drawPoints'] = drawPoints;
		var pointsLen = points.length;


		for(var pt =0; pt< pointsLen; pt++){
			(function(){
				var currentP = points[pt], nextP = points[pt + 1];
				if(nextP){
					var currentPX = currentP[0], currentPY = currentP[1], nextPX = nextP[0], nextPY = nextP[1], stepX, stepY, rangeX;

					for(var rx = currentPX+ speed; rx <= nextPX; rx= rx + speed){
						stepX = rx;
						stepY = ((nextPY -currentPY) * (stepX- currentPX) / (nextPX - currentPX) ) + currentPY;

						(function(stepX, stepY){
							var point = [stepX, stepY];
							drawPoints.push(point)
						})(stepX, stepY)

					}
				}

			})(pt)
		}
	}

}



// Code from jQuery
brushProto.extend = function(){

	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	if ( typeof target === "boolean" ) {
		deep = target;

		target = arguments[ i ] || {};
		i++;
	}

	if ( typeof target !== "object" && !Helper.isFunction( target ) ) {

		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( Helper.isPlainObject( copy ) ||
					( copyIsArray = Helper.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Helper.isArray( src ) ? src : [];

					} else {
						clone = src && Helper.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = brushProto.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	return target;
}


var Helper = brushProto.helper = {
	class2type : {},
	fnToString: ({}).hasOwnProperty.toString,
	ObjectFunctionString: ({}).hasOwnProperty.toString.call( Object ),
	hasOwn: ({}).hasOwnProperty,
	getProto: Object.getPrototypeOf,
	isFunction: function( obj ) {
		return this.type( obj ) === "function";
	},
	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android <=2.3 only (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			this.class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},
	isPlainObject: function( obj ) {
		var proto, Ctor;

		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}
		proto = this.getProto( obj );
		if ( !proto ) {
			return true;
		}
		Ctor = this.hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && this.fnToString.call( Ctor ) === this.ObjectFunctionString;
	},
	isArray: Array.isArray,
	fixCoordinate : function(ch, h){
		return ch - h;
	}
}