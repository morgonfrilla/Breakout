$(document).ready(function(){
  /*
   * Written by Fredrik Dahlin
   * Data 2016-02-18
   * 
   * Heavely based on this great tutorial
   * https://developer.mozilla.org/en-US/docs/Games/Workflows/2D_Breakout_game_pure_JavaScript/Build_the_brick_field
   */

  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");


  // starting positions for movement
  var x = canvas.width / 2;
  var y = canvas.height - 30;

  // movement per frame
  var dx = 2;
  var dy = -2;

  // used for calculating collisions
  var ballRadius = 10;

  // paddle definition
  var paddleHeight = 10;
  var paddleWidth = 75;
  var paddleX = (canvas.width-paddleWidth) / 2;

  // keep track of keyboard presses
  var rightPressed = false;
  var leftPressed = false;

  // brick variables
  var brickRowCount = 3;
  var brickColumnCount = 5;
  var brickWidth = 75;
  var brickHeight = 20;
  var brickPadding = 10;
  var brickOffsetTop = 30;
  var brickOffsetLeft = 30;

  // track score and remaining lives
  var score = 0;
  var lives = 3;

  // create bricks
  var bricks = [];
  for(c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];

    for(r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }


  // draw bricks on the screen
  function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
      for(r=0; r<brickRowCount; r++) {
        if (bricks[c][r].status == 1) {
          var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
          var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#0095DD";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }


  // draw ball
  function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }


  // draws the paddle
  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }


  // print the score
  function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
  }


  // draw the reamining lives
  function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
  }


  // draw the reamining lives
  function drawGameStatus(text) {
    ctx.font = "38px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(text, canvas.width/4, canvas.height/2);
  }


  // function that produces the animation
  function draw() {
    // clear the canvas before repainting it
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    var won = collisionDetection();
    drawScore();
    drawLives();
    

    if (won) {
      drawGameStatus("VICTORY");
      return;
    }

    // update x and y
    x += dx;
    y += dy;

    // bounce logic and game over
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
      dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    } 
    else if(y + dy > canvas.height-ballRadius) {
      if(x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      }
      else {
        lives--;
        if(!lives) {
            drawGameStatus("GAME OVER");
            return;
        }
        else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
      }
    }

    // check for paddle movements
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
      paddleX -= 7;
    }

    requestAnimationFrame(draw);
  }

  // listen for key presses
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);


  // handle mouseevents
  document.addEventListener("mousemove", mouseMoveHandler, false);


  function keyDownHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = true;
    }
    else if(e.keyCode == 37) {
      leftPressed = true;
    }
  }


  function keyUpHandler(e) {
    if(e.keyCode == 39) {
      rightPressed = false;
    }
    else if(e.keyCode == 37) {
      leftPressed = false;
    }
  }


  function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
    }
  }


  // collisions with bricks
  function collisionDetection() {
    for(c = 0; c < brickColumnCount; c++) {
      for(r = 0; r < brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1) {
          if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
            dy = -dy;
            b.status = 0;
            score++;

            if(score == brickRowCount*brickColumnCount) {
              return true;
            }
          }
        }
      }
    }
  }



  // infinite function that draws the ball
  draw();

});