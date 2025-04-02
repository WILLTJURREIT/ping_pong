// Get elements and store in variables these will be used as references to these html values later on. 
const ball = document.getElementById('ball');                  // Ball element
const leftPaddle = document.getElementById('left__paddle');      // Left paddle (player-controlled)
const rightPaddle = document.getElementById('right__paddle');    // Right paddle (computer-controlled)
const gameArea = document.getElementById('game__area');          // Game area (the container)
const startButton = document.getElementById('start__button');    // Start button
const endButton = document.getElementById('end__button');        // End button
const playerScore = document.getElementById('player__score');    // Player's score display
const computerScore = document.getElementById('computer__score');// Computer's score display
const gameMusic = document.getElementById('game__music');        // Audio element for background music

// GAME STATE VARIABLES
// Ball's speed in either direction
let ballSpeedX = 4;                    
let ballSpeedY = 4; 
// Ball's X positions starts at center        
let ballPositionX = 400;              
let ballPositionY = 200;               


 // Paddle's positions START AT CENTER
let leftPaddleY = 150;                
let rightPaddleY = 150;  

 // Height & Width of paddles
const paddleHeight = 100;              
const paddleWidth = 15; 

// Speed of paddles
const paddleSpeed = 15;  
// Speed of the computer
let computerSpeed = 2;               


// Set and store the score variables
let scorePlayer = 0;                  
let scoreComputer = 0;                



///////////////////////////////////// Will Study this more
// Game loop interval**
let gameInterval = null;  // call this into start game function to start at null value. 
 // For drag control of You paddle          
let isDragging = false; 
 // Offset for paddle dragging               
let offsetY = 0;                       
// Boolean flag to check if mouse control is active
let isMouseControlActive = false;     
///////////////////////////////////////////end


/////////////////////////////////////////////////////////////////////////// Study this more to make enhancements to game

// FUNCTION TO MOVE THE BALL 

function moveBall() {// call into start game to begin. 

    // Update the ball's positions based on its speed
    ballPositionX += ballSpeedX; 
    ballPositionY += ballSpeedY; 

    // Ball bouncing off top and bottom walls
    if (ballPositionY <= 0 || ballPositionY >= gameArea.offsetHeight - 25) {
        ballSpeedY = -ballSpeedY;  // Reverse the ball's vertical direction (bounce)
    }

    // Ball collision with left paddle (Player)
    if (
        ballPositionX <= paddleWidth + 10 && // Buffer zone before paddle
        ballPositionY >= leftPaddleY && 
        ballPositionY <= leftPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;  // Reverse the ball's X direction when it hits the left paddle
    }

    // Ball collision with right paddle (Computer)
    if (
        ballPositionX >= gameArea.offsetWidth - paddleWidth - 20 && // Buffer zone before paddle
        ballPositionY >= rightPaddleY && 
        ballPositionY <= rightPaddleY + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;  // Reverse the ball's X direction when it hits the right paddle
    }

    // Reset ball if it goes off screen (scoring)
    if (ballPositionX <= 0) {
        scoreComputer++;            // Computer scores
        updateScore();              // Update the displayed scores
        resetBall();                // Reset the ball to the center
    }
    if (ballPositionX >= gameArea.offsetWidth - 25) {
        scorePlayer++;              // Player scores
        updateScore();              // Update the displayed scores
        resetBall();                // Reset the ball to the center
    }

    // Update the ball's position on the screen based on its new position
    ball.style.left = ballPositionX + 'px';
    ball.style.top = ballPositionY + 'px';
}
//////////////////////////////////////////////////////////////////////////////////////end

// fUNCTIONS - UPDATE THE SCORES, RESET THE BALLS POSITION 

// Update the displayed scoreboard
function updateScore() {

    //html element, access text content = adds scorePlayer increment to the score board or computer depending on which functions called 
    playerScore.textContent = `Gamer: ${scorePlayer}`;          
    computerScore.textContent = `Computer: ${scoreComputer}`;  
}

// Resets the ball to the center of the screen and sends the ball in a random direction (Research the math of this more!)
function resetBall() {
    ballPositionX = 400;         
    ballPositionY = 200;           
    // Random the directions  for the ball
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4; 
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 4;  
}

// Function to move the paddles
function movePaddles() {
    // if the mouse is moving and dragging
    if (isMouseControlActive) {
        // Then center the paddle to the mouse position
        leftPaddleY = mouseY - offsetY; 
    }

    //To prevent the left paddle from going off the screen (got stuck here)
    leftPaddleY = Math.max(0, Math.min(gameArea.offsetHeight - paddleHeight, leftPaddleY));


    /////////////////////////////////////////////////////////////////////////////////////////////// COMPUTER CONTROLS 

    // Move the right paddle (computer-controlled)
    const moveTowardsBall = ballPositionY - (rightPaddleY + paddleHeight / 2); // Get distance to the ball's center
    const accuracy = Math.random() < 0.9;  // 90% chance to follow the ball (adds randomness)

    if (accuracy) {
        if (moveTowardsBall > 0) {
            rightPaddleY += computerSpeed; // Move down
        } else if (moveTowardsBall < 0) {
            rightPaddleY -= computerSpeed; // Move up
        }
    } else {
        // Add random behavior to make the computer less predictable
        const randomDirection = Math.random() > 0.5 ? 1 : -1;
        rightPaddleY += computerSpeed * randomDirection;
    }

    // Prevent the right paddle from going off the screen (GOT STUCK HERE)
    rightPaddleY = Math.max(0, Math.min(gameArea.offsetHeight - paddleHeight, rightPaddleY));

    // Update paddles' positions on screen by using the classes in 
    leftPaddle.style.top = leftPaddleY + 'px';
    rightPaddle.style.top = rightPaddleY + 'px';
}

// Handle mouse movement for "You" paddle (dragging functionality)
let mouseY = 0;
gameArea.addEventListener('mousemove', (event) => {
    if (!isMouseControlActive) return; // Only react to mouse movement if mouse control is active

    mouseY = event.clientY - gameArea.getBoundingClientRect().top; // Calculate the mouse's Y position
    if (mouseY >= 0 && mouseY <= gameArea.offsetHeight - paddleHeight) {  // Make sure paddle stays within bounds
        leftPaddleY = mouseY - offsetY;  // Update left paddle's Y position based on mouse movement
    }
});
//////////////////////////////////////////////////////////////end



// Start the game,  start the music,  if the gameInterval is not null and game starts when setFunction is called then call the needed functions, and  set the interval
function startGame() {
    if (gameInterval !== null) return;  // Prevent starting multiple intervals if this happens it can cause bug

    gameMusic.play();  // Start background music
    gameInterval = setInterval(() => { //setInterval() is a built-in function js 

//call these functions in at the start of the game 
        moveBall();  // Update ball position
        movePaddles();  // Update paddle positions
    }, 1000 / 60);  // 60 FPS (frames per second) how fast the game will play 

// buttons able or disable 
    startButton.disabled = true;  
    endButton.disabled = false;  
}

// Stop the game when the "End Game" button is clicked
function endGame() {
    clearInterval(gameInterval);  // Stop the game loop
    gameInterval = null;           // Reset the game loop interval
    gameMusic.pause();             // Pause the background music
    startButton.disabled = false; // Enable the "Start Game" button
    endButton.disabled = true;    // Disable the "End Game" button

    // Reset the scoreboard to 0
    scorePlayer = 0;
    scoreComputer = 0;
    updateScore();  // Update the displayed scores
}

// Mouse control on You paddle
startButton.addEventListener('click', () => {
    isMouseControlActive = true;  
    startGame();  
});

endButton.addEventListener('click', endGame);  // Handle "End Game" button click


//NEW ADDITIONS TO PROGRAM
/////////////////////////////////////////////////////////////////////////////////////// Add image to ball added April 1

const ballArray = [
    'robot_ball.png',
    'lightning_bolt_ball.png',
    'fire_ball_ball.png',
    'eyeBall.png',
    'dragon_ball.png',
    'electric_ball.png',
    'caden_ball.png'
];


const currentBall = document.getElementById('ball');// first must get the current ball & store it
const newBall = document.getElementById('image__sprite'); // selects from the list

image__sprite.addEventListener('change', (event)=>  {
const  newSelectedBall = event.target.value;
currentBall.src = newSelectedBall;

});
///////////////////////////////////////////////////////////end




///////////////////////////////////////////////////////////Swap Image for canvas
//image array for canvas
const canvas__array = [
    'skullImage.jpg','electric_canvas.jpg'
];

const currentCanvas = document.getElementById('game__area');


// Select the toggle switch from the html using  document.querySelector('place the id here') then stores in variable
const toggleSwitch = document.querySelector('#toggle__switch input');
currentCanvas.style.backgroundImage = `url('${canvas__array[0]}')`;//dynamically modify the html and then css as result.(start with original canvas image)

// Event listener for the toggle switch
//(Note that checked is a built in quality of the checkbox true false boolean)
toggleSwitch.addEventListener('change', () => {
    // if there has been a change and toggle is checked 'true', then 
    if (toggleSwitch.checked) {
       
        currentCanvas.style.backgroundImage = `url('${canvas__array[1]}')`; //dynamically modify the html and then css as result.
        
    } else {
      
        currentCanvas.style.backgroundImage = `url('${canvas__array[0]}')`;  //dynamically modify the html and then css as result.
    }
});
/////////////////////////////////////////////////////////end
