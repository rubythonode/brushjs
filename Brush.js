// ***************************
// Brush Init
// ***************************
var Brush = function(canvas) {
  var _this = this;
  this.canvasElem = document.getElementById(canvas);
  this.width = this.canvasElem.width;
  this.height = this.canvasElem.height;
  this.context = this.canvasElem.getContext('2d');
  this.layers = {};

  this.set = function(option){
    var _this = this;
    var layerID = option.id;
    var _layers = this.layers;
    option.forEach(function(elem){
      elem['width'] = _this.width;
      elem['height'] = _this.height;
      elem['canvas'] = _this.canvasElem;
      _layers[elem.id] = elem;
    })
    return this
  }

  this.get = function(id){
    return this.layers[id]
  }

  this.getLayers = function(){
    return this.layers
  }

  this.delete = function(id){
    delete this.layers[id]
    return this
  }

  this.deleteAnimation = function(id){
    var existedIdIndex = this.animationIDs.indexOf(id);
    if(existedIdIndex > -1){
      this.animationIDs.splice(existedIdIndex, 1)
      delete this.layers[id].animation;
    }
    return this
  }

  this.clear = function(){
    this.context.clearRect(0,0,this.width,this.height);
  }


}

var brushProto = Brush.prototype;


// ***************************
// Brush Funtion
// ***************************

// ***************************
// Drwaing
// ***************************
brushProto.draw = function(){
  this.clear();
  var layers = this.layers;
  for(var key in layers){
    (function(key){
      var layer = layers[key];
      switch(layer['type']){
        case 'circle' :
          brushProto.drawingFn.circle(layer)
          break;
        case 'rectangle' :
          brushProto.drawingFn.rectangle(layer)
          break;
        case 'line' :
          brushProto.drawingFn.line(layer)
          break;
        case 'text' :
          brushProto.drawingFn.text(layer)
          break;
        case 'bezierCurve' :
          brushProto.drawingFn.bezierCurve(layer)
          break;
        case 'quadraticCurve' :
          brushProto.drawingFn.quadraticCurve(layer)
          break;
        case 'arcTo' :
          brushProto.drawingFn.arcTo(layer)
          break;
        case 'mutiLine':
          brushProto.drawingFn.mutiLine(layer)
          break;
        case 'stroke' :
          brushProto.drawingFn.stroke(layer)
          break;
        case 'shape' :
          brushProto.drawingFn.shape(layer)
          break;
        default:
          return;
      }
    })(key)
  }
  return this
}
brushProto.drawingFn = {
  commonDrawing: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d') , _fillStyle = layer.fillStyle ? layer.fillStyle : '#000';;

    context.strokeStyle = null;
    context.lineWidth = null;
    context.globalAlpha = null;
    context.lineCap = null;
    context.lineJoin = null;
    context.shadowColor = null;
    context.shadowBlur = null;
    context.shadowOffsetX = null;
    context.shadowOffsetY = null;

    if(layer.strokeStyle){
      context.strokeStyle =  layer.strokeStyle
    }

    context.lineWidth = layer.lineWidth ? layer.lineWidth : 1;
    context.globalAlpha = layer.opacity ? layer.opacity : 1;
    context.lineCap = layer.lineCap ? layer.lineCap : 'butt';
    context.lineJoin = layer.lineJoin ? layer.lineJoin : 'bevel';
    context.globalCompositeOperation =  layer.composite ? layer.composite : 'source-over';
    if(layer.gradient){
      var grad;
      var gradient = layer['gradient'],
      start = gradient['start'],
      end = gradient['end'],
      colorPosition = gradient['colorPosition'];
      if(gradient['type'] === 'linear'){
        grad = context.createLinearGradient(start[0], helper.fixCoordinate(layer.height,start[1]), end[0], helper.fixCoordinate(layer.height,end[1]));
      }else{
        grad = context.createRadialGradient(start[0], helper.fixCoordinate(layer.height,start[1]), start[2] ,end[0], helper.fixCoordinate(layer.height,end[1]), end[2]);
      }

      colorPosition.forEach(function(elem){
        grad.addColorStop(elem[0],elem[1]);
      })
      _fillStyle = grad;
      if(!!!layer.isFill){
        context.strokeStyle = grad;
      }

    }

    if(layer.shadow){
      var shadow = layer['shadow'];
      context.shadowColor = shadow['color'];
      context.shadowBlur = shadow['blur'] ? shadow['blur'] : 0;
      context.shadowOffsetX = shadow['offsetX'] ? shadow['offsetX'] : 0;
      context.shadowOffsetY = shadow['offsetY'] ? -shadow['offsetY'] : 0;
    }
    context.fillStyle = _fillStyle;

  },
  circle: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;
    this.commonDrawing(layer)

    points.forEach(function(elem){
      context.beginPath();
      context.arc(elem[0] , helper.fixCoordinate(layer.height,elem[1]), elem[2], layer.startAngle , layer.endAngle, layer.dir === undefined ? false : layer.dir);
      if(layer.isFill){
        context.fill();
      }
      if(layer.lineWidth && layer.strokeStyle){
        context.stroke();
      }

    });
  },
  rectangle: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;
    this.commonDrawing(layer)
    points.forEach(function(elem){
      if(layer.isFill){
        context.fillRect(elem[0], helper.fixCoordinate(layer.height,elem[1] + elem[3]), elem[2], elem[3]);
      }else{
        context.strokeRect(elem[0], helper.fixCoordinate(layer.height,elem[1] + elem[3]), elem[2], elem[3]);
      }
    })
  },
  line: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points,
    pointsLen = points.length;

    this.commonDrawing(layer)
    context.beginPath();
    context.moveTo(layer.from[0] , helper.fixCoordinate(layer.height, layer.from[1]) );

    for(var idx =0; idx < pointsLen; idx++){
      context.lineTo(points[idx][0] , helper.fixCoordinate(layer.height, points[idx][1]) );
    }
    if(layer['isClose']){
      context.closePath();
    }
    if(layer['isFill']){
      context.fill();
    }else{
      context.stroke();
    }
  },
  text: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;

    context.font = layer.font ? layer.font : '14pt Arial';
    context.textAlign = layer.textAlign ? layer.textAlign : 'center';
    context.textBaseline = layer.textBaseline ? layer.textBaseline : 'middle';
    this.commonDrawing(layer)

    points.forEach(function(elem){
      context.fillText(layer.text, elem[0], helper.fixCoordinate(layer.height, elem[1]));
      if(layer.strokeStyle){
        context.strokeText(layer.text, elem[0], helper.fixCoordinate(layer.height, elem[1]))
      }
    })

  },
  bezierCurve: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;

    this.commonDrawing(layer)
    context.beginPath();
    context.moveTo(layer.from[0] , helper.fixCoordinate(layer.height, layer.from[1]) );
    var points = layer.points;
    for(var point =0; point < points.length; point++){
      context.bezierCurveTo(
        points[point][0] , helper.fixCoordinate(layer.height, points[point][1]) ,
        points[point][2] , helper.fixCoordinate(layer.height, points[point][3]) ,
        points[point][4] , helper.fixCoordinate(layer.height, points[point][5])
      );
    }
    if(layer.isClose){
      context.closePath();
    }

    if(layer['isFill']){
      context.fill();
    }else{
      context.stroke();
    }
  },
  quadraticCurve: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;
    this.commonDrawing(layer)
    context.beginPath();
    context.moveTo(layer.from[0] , helper.fixCoordinate(layer.height, layer.from[1]) );

    var points = layer.points;
    for(var point =0; point < points.length; point++){
      context.quadraticCurveTo(
        points[point][0] , helper.fixCoordinate(layer.height, points[point][1]) ,
        points[point][2] , helper.fixCoordinate(layer.height, points[point][3]) );
    }

    if(layer.isClose){
      context.closePath();
    }
    context.stroke();
  },
  arcTo: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points;

    this.commonDrawing(layer)
    context.beginPath();
    context.moveTo(layer.from[0] , helper.fixCoordinate(layer.height, layer.from[1]) );

    var points = layer.points;
    for(var point =0; point < points.length; point++){
      context.arcTo(
        points[point][0] , helper.fixCoordinate(layer.height, points[point][1]) ,
        points[point][2] , helper.fixCoordinate(layer.height, points[point][3]) ,
        points[point][4]
      );
    }

    if(layer['isClose']){
      context.closePath();
    }
    if(layer['isFill']){
      context.fill();
    }else{
      context.stroke();
    }
  },
  stroke: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    points = layer.points,
    crumbs,
    index = 0;
    this.commonDrawing(layer);
    if(layer.crumbsIdx){
      index = layer.crumbsIdx;
    }else{
      layer['crumbsIdx'] = 0;
    }
    var startX = points[0][0];
    var startY = points[0][1];
    context.beginPath();
    context.moveTo(startX , helper.fixCoordinate(layer.height, startY) );

    if(layer.crumbs){
      crumbs = layer.crumbs;
      for(var step =0; step <= index; step++){
        (function(){
          var p1 = crumbs[step];
          var p2 = crumbs[step+1];
          if(p2){
            var mid = helper.midPointBtw(p1, p2);
            context.quadraticCurveTo(p1[0] ,helper.fixCoordinate(layer.height, p1[1]) ,mid['x'],helper.fixCoordinate(layer.height, mid['y']));
          }
        })(step)
      }
      layer['crumbsIdx']  = layer['crumbsIdx'] + 1;
      context.stroke();
    }
  },
  mutiLine: function(layer){
    var canvas = layer.canvas,
    context = canvas.getContext('2d'),
    lines = layer.lines;
    this.commonDrawing(layer)
    context.beginPath();
    context.moveTo(layer.from[0] , helper.fixCoordinate(layer.height, layer.from[1]) )
    lines.forEach(function(elem){
      var points , pointsLen, type = elem.type;
      points = elem.points,
      pointsLen = points.length;
      if(type === 'line'){
        for(var idx =0; idx < pointsLen; idx++){
          context.lineTo(points[idx][0] , helper.fixCoordinate(layer.height, points[idx][1]) );
        }
      }else if(type === 'bezierCurve'){
        for(var idx =0; idx < pointsLen; idx++){
         context.bezierCurveTo(
            points[idx][0] , helper.fixCoordinate(layer.height, points[idx][1]) ,
            points[idx][2] , helper.fixCoordinate(layer.height, points[idx][3]) ,
            points[idx][4] , helper.fixCoordinate(layer.height, points[idx][5])
          );
        }
      }else if(type === 'quadraticCurve'){
        for(var idx =0; idx < pointsLen; idx++){
          context.quadraticCurveTo(
            points[idx][0] , helper.fixCoordinate(layer.height, points[idx][1]) ,
            points[idx][2] , helper.fixCoordinate(layer.height, points[idx][3])
          );
        }
      }else if(type === 'arcTo'){
        for(var idx =0; idx < pointsLen; idx++){
          context.arcTo(
            points[idx][0] , helper.fixCoordinate(layer.height, points[idx][1]) ,
            points[idx][2] , helper.fixCoordinate(layer.height, points[idx][3]) ,
            points[idx][4]
          );
        }
      }
    })
    if(layer.isFill){
      context.fill();
    }
    if(layer.lineWidth && layer.strokeStyle){
      if(layer.isClose){
        context.closePath();
      }
      context.stroke();
    }

  }
}


// ***************************
// Event
// ***************************

brushProto.click = function(callback){
  var _this = this;
  brushProto.EventFn.click(_this , callback);
}

brushProto.mousemove = function(callback){
  var _this = this;
  brushProto.EventFn.mousemove(_this , callback);
}

brushProto.EventFn = {
  click: function(layer , callback){
    var _this = this;
    var canvas = layer.canvasElem;
    canvas.addEventListener('click', function(evt){
      callback(layer, _this.calculateMousePos(layer, evt))
    })
  },
  mousemove: function(layer , callback){
    var _this = this;
    var canvas = layer.canvasElem;
    canvas.addEventListener('mousemove', function(evt){
      callback(layer, _this.calculateMousePos(layer, evt))
    })
  },
  calculateMousePos: function(layer, evt){
    var canvas = layer.canvasElem;
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    mouseY = helper.fixCoordinate(canvas.width, mouseY);
    return{
      x: mouseX,
      y: mouseY
    }
  }
}

// ***************************
// Animation
// ***************************
brushProto.animate = function(option){
  var _this = this;
  option.forEach(function(elem){
    var layer ;

    layer = _this.get(elem.id);
    layer['origin'] = brushProto.extend(true , {} , layer);
    if(_this.animationIDs){
      _this['animationIDs'].push(elem.id);
    }else{
      _this['animationIDs'] =[];
      _this['animationIDs'].push(elem.id);
    }
    layer['animation'] = elem;

    if(elem.subShape){
      elem.subShape.forEach(function(subID){
        layer = _this.get(subID);
        layer['origin'] = brushProto.extend(true , {} , layer);
        if(_this.animationIDs){
          _this['animationIDs'].push(subID);
        }else{
          _this['animationIDs'] =[];
          _this['animationIDs'].push(subID);
        }
        layer['animation'] = elem;
      })
    }

  })
  return this

}

brushProto.start = function(){
  this.processing();
  return this
}


brushProto.processing = function(){
  var _this = this;
  var animation = _this.animation;
  _this.draw()
  if(_this.animationIDs === undefined || _this.animationIDs.length === 0){
    return
  }
  _this.animationIDs.forEach(function(id){
    var layer = _this.get(id);
    var type = layer.animation.type;
    switch(type){
      case 'moving' :
        brushProto.AnimationFn.moving(_this, layer);
        break;
      case 'stroking' :
        brushProto.AnimationFn.stroking(_this, layer);
        break;
      default:
        return;
    }
  })


  //setTimeout(_this.processing.bind(_this), 2000)
  window.requestAnimationFrame(_this.processing.bind(_this));

}

brushProto.AnimationFn = {
  moving: function(self ,layer){
    if(layer.type === 'circle' || layer.type === 'rectangle'){
      this._figureMoving(self, layer);
    }else if(layer.type === 'line'){
      this._lineMoving(self, layer);
    }else if(layer.type === 'mutiLine'){
      this._mutiLineMoving(self, layer);
    }
  },
  _figureMoving : function(self, layer){
    var animation = layer.animation,
    moveTo = animation.moveTo ,
    points =  layer.points ,
    origin = layer.origin,
    pointsLen = points.length,
    destinyX = moveTo[0],
    destinyY = moveTo[1],
    endFlag = 0,
    speed = animation.speed;

    for(var idx =0; idx < pointsLen; idx++){
      (function(idx){
        var x = points[idx][0];
        var y = points[idx][1];
        var radian = Math.atan2(destinyY-y, destinyX-x);
        var next = movingCoordinate(x, y , destinyX, destinyY , speed)

        if(isNaN(next.x) && isNaN(next.y)){
          endFlag = endFlag + 1
          if(animation.time){
            if(endFlag == pointsLen){
              if(animation.time > 1 ){
                animation.time--;
                layer.points = brushProto.extend(true ,   [] , origin.points)
              }else if(animation.time === 1){
                return self.deleteAnimation(layer.id);
              }else if(animation.time === -1){
                layer.points = brushProto.extend(true ,   [] , origin.points)
              }
            }
          }else{
            points[idx][0] = points[idx][0];
            points[idx][1] = points[idx][1];
            return self.deleteAnimation(layer.id);
          }

        }else{
          points[idx][0] = next.x;
          points[idx][1] = next.y;
        }
      })(idx)
    }
  },
  _lineMoving: function(self, layer){
    var animation = layer.animation,
    moveTo = animation.moveTo ,
    points =  layer.points ,
    origin = layer.origin,
    pointsLen = points.length,
    fromX = layer.from[0],
    fromY = layer.from[1],
    destinyX = moveTo[0],
    destinyY = moveTo[1],
    speed = animation.speed;
    var next = movingCoordinate(fromX, fromY , destinyX, destinyY , speed);
    if(isNaN(next.x) && isNaN(next.y)){
      if(animation.time){
        if(animation.time > 1 ){
          animation.time--;
          layer.points = brushProto.extend(true ,   [] , origin.points)
          layer.from = brushProto.extend(false ,   [] , origin.from)
        }else if(animation.time === 1){
          return self.deleteAnimation(layer.id);
        }else if(animation.time === -1){
          layer.points = brushProto.extend(true ,   [] , origin.points)
          layer.from = brushProto.extend(false ,   [] , origin.from)
        }
      }else{
        return self.deleteAnimation(layer.id);
      }
    }else{
      layer.from[0] = next.x;
      layer.from[1] = next.y;
      for(var idx =0; idx < pointsLen; idx++){
        (function(idx){
          points[idx][0] = points[idx][0] + next.stepX;
          points[idx][1] = points[idx][1] + next.stepY;

        })(idx);
      }
    }
  },
  _mutiLineMoving: function(self, layer){
    var animation = layer.animation,
    moveTo = animation.moveTo ,
    lines =  layer.lines ,
    origin = layer.origin,
    linesLen = lines.length,
    fromX = layer.from[0],
    fromY = layer.from[1],
    destinyX = moveTo[0],
    destinyY = moveTo[1],
    speed = animation.speed;
    var next = movingCoordinate(fromX, fromY , destinyX, destinyY , speed);
    if(isNaN(next.x) && isNaN(next.y)){
      if(animation.time){
        if(animation.time > 1 ){
          animation.time--;
          layer.lines = brushProto.extend(true ,   [] , origin.lines)
          layer.from = brushProto.extend(false ,   [] , origin.from)
        }else if(animation.time === 1){
          return self.deleteAnimation(layer.id);
        }else if(animation.time === -1){
          layer.lines = brushProto.extend(true ,   [] , origin.lines)
          layer.from = brushProto.extend(false ,   [] , origin.from)
        }
      }else{
        return self.deleteAnimation(layer.id);
      }
    }else{
      layer.from[0] = next.x;
      layer.from[1] = next.y;
      for(var idx =0; idx < linesLen; idx++){
        (function(idx){
          var _line = lines[idx];
          var _points = _line.points;
          var _pointsLen = _points.length;
            for(var idx =0; idx < _pointsLen; idx++){
              (function(idx){
                  _points[idx][0] = _points[idx][0] + next.stepX;
                  _points[idx][1] = _points[idx][1] + next.stepY;
                  if(_line.type === 'bezierCurve' || _line.type ===  'arcTo'){
                    _points[idx][2] = _points[idx][2] + next.stepX;
                    _points[idx][3] = _points[idx][3] + next.stepY;
                    _points[idx][4] = _points[idx][4] + next.stepX;
                    _points[idx][5] = _points[idx][5] + next.stepY;
                  }else if(_line.type === 'quadraticCurve'){
                    _points[idx][2] = _points[idx][2] + next.stepX;
                    _points[idx][3] = _points[idx][3] + next.stepY;
                  }
              })(idx);
            }
        })(idx);
      }
    }
  },
  stroking: function(self, layer){
    var animation = layer.animation,
    speed = animation.speed,
    points = layer.points;

    if(layer.crumbsIdx && layer.crumbs){
      if(layer.crumbsIdx > layer.crumbs.length){
        if(animation.time){
          if(animation.time > 1 ){
            layer.crumbsIdx = 0;
            animation.time--;
            layer['crumbs'] = [];
            layer.points = brushProto.extend(true ,   [] , layer.origin.points)

          }else if(animation.time === 1){
            return self.deleteAnimation(layer.id);
          }else if(animation.time === -1){
            layer.crumbsIdx = 0;
            layer['crumbs'] = [];
            layer.points = brushProto.extend(true ,   [] , layer.origin.points)
          }
        }else{
          return self.deleteAnimation(layer.id);
        }
      }

    }
    var crumbs = [];
    points.forEach(function(point, index){
      if(points[index + 1]){
        currentP = point;
        nextP = points[index + 1];
        crumbs = generateStrokeScrumbs(currentP , nextP, speed , crumbs);
      }
    });
    layer['crumbs'] = crumbs;
  }
}
function generateStrokeScrumbs (start, end , speed, crumbs) {

  var step = movingCoordinate(start[0], start[1], end[0], end[1] , speed)
  var stepObj = [step.x , step.y];
  crumbs.push(stepObj);
  if(step.x === end[0] && step.y === end[1]){
    return crumbs
  }
  return generateStrokeScrumbs(stepObj , end , speed , crumbs);
}

function movingCoordinate(x, y, destinyx, destinyy, speed){
  var speedX, speedY, stepX, stepY , tanTheta , finalX, finalY;
  var radian = Math.atan2(destinyy-y, destinyx-x);
  if(destinyy-y === 0 || destinyx-x === 0){
    if(destinyx-x > 0){
      stepX = speed;
      stepY = 0;
    }else if(destinyx-x < 0){
      stepX = -speed;
      stepY = 0;
    }
    if(destinyy-y > 0){
      stepX = 0;
      stepY = speed;
    }else if(destinyy-y < 0){
      stepX = 0;
      stepY = -speed;
    }
  }else{

    if( (destinyy > y && destinyx < x) || (destinyy < y && destinyx < x)){

      speed *= -1;
    }
    if(Math.abs(Math.tan(radian)) > 1){

      speed = speed / Math.abs(Math.tan(radian));
    }

    stepX = speed;
    stepY = (speed * (Math.tan(radian)));
  }
  finalX = x + stepX;
  finalY = y + stepY;
  if(Math.abs(finalX - destinyx) <= speed && Math.abs(finalY - destinyy) <= speed){
    finalX = destinyx;
    finalY = destinyy;
  }
  return{
    x : finalX,
    y : finalY,
    stepX : stepX,
    stepY : stepY
  }
}


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

  if ( typeof target !== "object" && !helper.isFunction( target ) ) {
    target = {};
  }

  if ( i === length ) {
    target = this;
    i--;
  }

  for ( ; i < length; i++ ) {
    if ( ( options = arguments[ i ] ) != null ) {
      for ( name in options ) {
        src = target[ name ];
        copy = options[ name ];
        if ( target === copy ) {
          continue;
        }
        if ( deep && copy && ( helper.isPlainObject( copy ) ||
          ( copyIsArray = helper.isArray( copy ) ) ) ) {
          if ( copyIsArray ) {
            copyIsArray = false;
            clone = src && helper.isArray( src ) ? src : [];
          } else {
            clone = src && helper.isPlainObject( src ) ? src : {};
          }
          target[ name ] = brushProto.extend( deep, clone, copy );
        } else if ( copy !== undefined ) {
          target[ name ] = copy;
        }
      }
    }
  }

  return target;
}
var helper = brushProto.helper = {
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
  },
  midPointBtw : function(p1, p2){
    return {
      x: p1[0] + (p2[0] - p1[0]) / 2,
      y: p1[1] + (p2[1] - p1[1]) / 2
    };
  }
}


