No animation

```javascript

var canvas = new Brush('canvas')
canvas.Circle(
  [
    {
      id : 'ball1',
      lineWidth : 1,
      strokeStyle : 'red',
      x : 100,
      y : 100,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : 20,
      isFill : false,
      fillColor : 'red'
    },
    {
      id : 'ball2',
      lineWidth : 1,
      strokeStyle : 'black',
      x : 320,
      y : 300,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : 40,
      isFill : true,
      fillColor : 'yellow'
    }
  ]
)

canvas.Line(
  [
    {
      id : 'line1',
      from : [0, 100],
      points : [
        [100, 200],
        [200, 180],
        [300, 300],
        [400, 200]
      ],
      lineWidth : 1,
      strokeStyle : 'gray',
      lineCap : 'round',
      lineJoin : 'round', //miter , round, bevel
      isClose : false,
      isFill : true,
      fillColor : 'green'
    }
  ]
);
canvas.QuadraticCurve(
  [
    {
      id : 'quadratic',
      from : [20, 20],
      points : [
        [90, 100, 200, 20]
      ],
      lineWidth : 10,
      strokeStyle : 'blue',
      lineCap : 'square',
      isClose : false
    }
  ]
);

canvas.BezierCurve(
  [
    {
      id : 'bazier1',
      from : [170, 80],
      points : [
        [130, 100, 130, 150, 230, 150],
        [250, 180, 320, 180, 340, 150],
        [420, 150, 420, 120, 390, 100],
        [430, 40, 370, 30, 340, 50],
        [320, 5, 250, 20, 250, 50],
        [200, 5, 150, 20, 170, 80]
      ],
      lineWidth : 1,
      strokeStyle : 'red',
      isClose : false,
      isFill : true,
      fillColor : 'red'
    }
  ]
)

canvas.Text(
  [
    {
      id : 'text1',
      font : '38pt Arial',
      fillStyle : 'cornflowerblue',
      lineWidth : 3,
      strokeStyle : 'blue',
      text : 'Hello World',
      textAlign : 'center',
      textBaseline : 'middle',
      x : 200,
      y : 50
    },
    {
      id : 'text2',
      font : '38pt Arial',
      fillStyle : 'cornflowerblue',
      lineWidth : 3,
      strokeStyle : 'blue',
      text : 'Hello World!!!!',
      textAlign : 'left',
      textBaseline : 'middle',
      x : 200,
      y : 150
    }
  ]
)

canvas.Line(
  [
    {
      id : 'arc1',
      from : [200, 200],
      points : [
        [300, 200]
      ],
      lineWidth : 1,
      strokeStyle : 'black',
      lineCap : 'round',
      lineJoin : 'round', //miter , round, bevel
      isClose : false,
      isFill : false,
      fillColor : 'green'
    }
  ]
);
canvas.ArcTo(
  [
    {
      id : 'arc2',
      from : [300, 200],
      points : [
        [350, 200 ,350, 250, 50]
      ],
      lineWidth : 1,
      strokeStyle : 'black',
      lineCap : 'round',
      lineJoin : 'round', //miter , round, bevel
      isClose : false,
      isFill : false,
      fillColor : 'green'
    }
  ]
);
```


animation

```javascript
var canvas = new Brush('canvas')
var balls = [];
var animation = [];
for(var i=0; i < 10; i++){
  (function(i){
    var ball = {
      id : 'ball' +i,
      lineWidth : 1,
      strokeStyle :  '#'+Math.floor(Math.random()*16777215).toString(16),
      x : Math.floor(Math.random() * 990) + 1,
      y : Math.floor(Math.random() * 800) + 400,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : Math.floor(Math.random() * 8) + 3,
      isFill : true,
      fillColor : '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    balls.push(ball);
    var fallingAnimation = {
       id : 'ball' +i,
       type : 'bouncing',
       speedX : Math.floor(Math.random() * 5) + 1,
       speedY : Math.floor(Math.random() * 2) + 1
     }
     animation.push(fallingAnimation)

  })(i)
}
for(var i=11; i < 20; i++){
  (function(i){
    var ball = {
      id : 'ball' +i,
      lineWidth : 1,
      strokeStyle :  '#'+Math.floor(Math.random()*16777215).toString(16),
      x : Math.floor(Math.random() * 990) + 1,
      y : Math.floor(Math.random() * 800) + 400,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : Math.floor(Math.random() * 8) + 3,
      isFill : true,
      fillColor : '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    balls.push(ball);
    var fallingAnimation = {
       id : 'ball' +i,
       type : 'falling',
       speed : Math.floor(Math.random() * 3) + 1
     }
     animation.push(fallingAnimation)

  })(i)
}
for(var i=20; i < 30; i++){
  (function(i){
    var ball = {
      id : 'ball' +i,
      lineWidth : 1,
      strokeStyle :  '#'+Math.floor(Math.random()*16777215).toString(16),
      x : Math.floor(Math.random() * 990) + 1,
      y : Math.floor(Math.random() * 300) + 1,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : Math.floor(Math.random() * 8) + 3,
      isFill : true,
      fillColor : '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    balls.push(ball);
    var fallingAnimation = {
       id : 'ball' +i,
       type : 'rising',
       speed: Math.floor(Math.random() * 2) + 1
     }
     animation.push(fallingAnimation)

  })(i)
}
for(var i=0; i < 100; i++){
  (function(i){
    var ball = {
      id : 'ball' +i,
      lineWidth : 1,
      strokeStyle :  '#'+Math.floor(Math.random()*16777215).toString(16),
      x : Math.floor(Math.random() * 1000) + 1,
      y : Math.floor(Math.random() * 575) + 500,
      startAngle : 0,
      endAngle : Math.PI*2,
      radius : Math.floor(Math.random() * 5) + 2,
      isFill : true,
      fillColor : '#'+Math.floor(Math.random()*16777215).toString(16)
    }
    balls.push(ball);
    var dir = ['left' ,'right'];
    var fallingAnimation = {
       id : 'ball' +i,
       type : 'blowing',
       dir : dir[ i % 2],
       speed: Math.floor(Math.random() * 2) + 1
     }
     animation.push(fallingAnimation)

  })(i)
}

canvas.Circle(balls)
canvas.Animation(animation)


```