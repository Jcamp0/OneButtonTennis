var ballSpeed = 5;
var ballDefaultSpeed = 5;
var ballAcceleration = 1.05;
var ballMoving = false;
var scoreLimit = 5;
var somebodyWins = false;
var playersTurn = 1;
var p1Score = 0;
var p2Score = 0;

//Set up listeners
function setupListeners () {
    let sB = $("#startButton");
    sB.on("click", function () {
        //Get settings parameters
        scoreLimit = $("#winLimit").val();
        startPlaying();
    });
    sB.mouseover(function () {
        sB.css({
            "background-color": "white",
            "color": "black",
            "text-shadow": "1px 1px 0px #FFF, 2px 2px 0px #999"            
        });
    });
    sB.mouseout(function () {
        sB.css({
            "background-color": "black",
            "color": "white",
            "text-shadow": "1px 1px 0px #000, 2px 2px 0px #999"
        });
    });
}
//Initialize game
function initializeGame () {
    $("#settings").show();
    $("#gameSpace").hide();
    $("#scoreBoard").hide();
}

function startPlaying () {
    $("#settings").hide();
    $("#gameSpace").show();
    $("#scoreBoard").show();
    somebodyWins = false;
    resetBall();
    startBallListener();
    p1Score = 0;
    p2Score = 0;
    updateScores();
}
//Change the elements of the game area to conform to
//a fixed Aspect Ratio of 5:2
function fixRatio () {
    let gs = $("#gameSpace");
    let gs_width = gs.width();
    let gs_height = gs_width * 0.3;
    gs.height(gs_height);
    $("#player1Zone").height(gs_height);
    $("#player2Zone").height(gs_height);
    $("#scoreBoard").height(gs_height * 0.4);
    $("#lineContainer").height(gs_height);
    $("#ball").width($("#ball").height());
    $("#ballTrack").css({"padding-top": gs_height / 2 - $("#ballTrack").height()})
}
//Detect if the ball is being hit
function startBallListener () {
    $(document).keyup(function (event) {
        if (event.which === 90 || event.which === 122) {
            detectHit (1);
        }
        if (event.which === 77 || event.which === 109) {
            detectHit (2);
        }
    });
}
function detectHit (whichPlayer) {
    let ball = $("#ball");
    let pos_x = ball.css("margin-left").slice(0, -2);    
    let gs_width = $("#gameSpace").width();
    let zone_width = $("#player1Zone").width();
    if (somebodyWins) {
        return;
    }
    if (whichPlayer === 1) {
        if (pos_x <= zone_width && pos_x > 0) {
            hitBall (1);
            flashZone(1);
        }
    }
    if (whichPlayer === 2) {
        if (pos_x >= (gs_width - zone_width - ball.width()) && pos_x < gs_width) {
            hitBall (2);
            flashZone(2);
        }
    }
}
//Light up the hitzone of a player who has hit the ball
function flashZone (whichPlayer) {
    let p1zone = $("#player1Zone");
    let p2zone = $("#player2Zone");
    let flashTime = 100;
    if (whichPlayer === 1) {
        p1zone.css("background-color", "rgb(0, 0, 219)");
        setTimeout(stopFlash, flashTime, 1);
    }
    if (whichPlayer === 2) {
        p2zone.css("background-color", "rgb(219, 0, 0)");
        setTimeout(stopFlash, flashTime, 2);
    }
}
function stopFlash (whichPlayer) {
    let p1zone = $("#player1Zone");
    let p2zone = $("#player2Zone");    
    if (whichPlayer === 1) {
        p1zone.css("background-color", "rgb(0, 0, 119)");
    }
    if (whichPlayer === 2) {
        p2zone.css("background-color", "rgb(119, 0, 0)");
    }
}
//Hit the ball
function hitBall (whichPlayer) {
    ballMoving = true;
    if (whichPlayer === 1) {
        ballSpeed = Math.abs(ballSpeed) * 1;
        ballSpeed *= ballAcceleration;
    }
    if (whichPlayer === 2) {
        ballSpeed = Math.abs(ballSpeed) * -1;
        ballSpeed *= ballAcceleration;
    }
}
//Move the ball
function moveBall () {
    let ball = $("#ball");
    let pos_x = ball.css("margin-left").slice(0, -2);
    let gs_width = $("#gameSpace").width();
    let zone_width = $("#player1Zone").width();
    //Detect if the ball has missed
    if (pos_x <= 0) {
        p2Score++;
        playersTurn = 1;
        updateScores();
        resetBall();
        return;
    }
    if (pos_x > $("#gameSpace").width() - ball.width()) {
        p1Score++;
        playersTurn = 2;
        updateScores();
        resetBall();        
        return;
    }

    if (ballSpeed > 20) {
        ballSpeed = 20;
    }
    if (ballMoving && somebodyWins === false) {
        ball.css({"margin-left": (parseInt(pos_x) + ballSpeed * gs_width / 500) + "px"});
        $("#status").text("");
    } else if (!somebodyWins) {
        $("#status").text("Player " + playersTurn + " is serving!");
    }
}
//Reset the ball
function resetBall () {
    let ball = $("#ball");
    let gs_width = $("#gameSpace").width();
    let zone_width = $("#player1Zone").width();
    if (playersTurn === 0 || playersTurn === 1) {
        ballSpeed = ballDefaultSpeed;
        ballMoving = false;
        ball.css({"margin-left": (zone_width * 0.75) + "px"});
    } else if (playersTurn === 2) {
        ballSpeed = ballDefaultSpeed;
        ballMoving = false;
        ball.css({"margin-left": (gs_width - zone_width * 0.75 - ball.width()) + "px"});
    }
}
//Update Scoreboard
function updateScores () {
    $("#firstToText").text("First to " + scoreLimit);
    $("#player1Score").text(p1Score);
    $("#player2Score").text(p2Score);
    if (p1Score >= scoreLimit) {
        endGame (1);
    }
    if (p2Score >= scoreLimit) {
        endGame (2);
    }
}
//End the game when someone wins
function endGame (whichPlayer) {
    let status = $("#status");
    if (whichPlayer === 1) {
        somebodyWins = true;
        status.text("Player 1 Wins!!!");
    }
    if (whichPlayer === 2) {
        somebodyWins = true;
        status.text("Player 2 Wins!!!");
    }
    status.text(status.text() + "\nClick here to start a new game.");
    status.on("click", function () {
        initializeGame();
        status.off("click");
    });
}

$(document).ready(function () {
    setInterval(fixRatio, 16);
    setInterval(moveBall, 16);
    setupListeners();
    initializeGame();
});