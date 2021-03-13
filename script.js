"use strict";
//Team -> JJ-Amran
//Screen settings
var vp_width = 920, vp_height = 690;

//Enable and configure the matter engine
var world, engine, body;
engine = Matter.Engine.create();
world = engine.world;
body = Matter.Body;

//Keeps track of the original click x and y position (used for aim)
var clickedX,clickedY; 
var mouselineFlag = false;  // Checks if we've started drawing
var releaseFlag = false;    // Checks if we've launched fuzz
var menuFlag = true;        //true means display menu
var launcherimg, launcherBody, launcher;
var ceiling ,ground, leftwall, rightwall,fuzzball; //Objects
var backgroundImg, crateimg, fuzimg, superFuzzImg,presentImg, metalimg, hitSound;;
//Stores objects for normal and metal crates of current level
var crates      = [];   
var metalCrates = [];    
var fuzzBallsRemaining = 7;
var fuzzBallsRemainingText, announceScore, scoreText;
var currentMetalArrangement, currentCrateArrangement; //chosen map
var present, currentPresentPlace; //location of present
var MAX_CRATES;

var randomNumber; //decides the level/map we play
//Physics settings for ground and crate
var groundOptions = { 
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
}
var crateOptions = {
 			restitution: 0.99,
 			friction: 0.030,
 			density: 0.99,
 			frictionAir: 0.032,
}


//Various maps with positions of crates, metal crates and presents.
var crateArrangement1 = [[vp_width-30,vp_height-88],[vp_width-90,vp_height-88],[vp_width-150,vp_height-88],[vp_width-60,vp_height-148],[vp_width-120,vp_height-148],[vp_width-90,vp_height-208],[vp_width-30,vp_height-360],[vp_width-90,vp_height-360],[vp_width-60,vp_height-420]];
var metalArrangement1 = [[vp_width-30,vp_height-300],[vp_width-90,vp_height-300],[vp_width-150,vp_height-300]];

var crateArrangement2 = [[vp_width-30,vp_height-88],[vp_width-30,vp_height-148],[vp_width-150,vp_height-148],[vp_width-210,vp_height-88],[vp_width-270,vp_height-88],[vp_width-330,vp_height-88],[vp_width-90,vp_height-208]];
var metalArrangement2 = [[vp_width-90,vp_height-88],[vp_width-150,vp_height-88],[vp_width-90,vp_height-148],[vp_width-390,vp_height-300]];

var crateArrangement3 = [[vp_width-30,vp_height-88],[vp_width-150,vp_height-88],[vp_width-90,vp_height-148],[vp_width-270,vp_height-208],[vp_width-30,vp_height-360],[vp_width-150,vp_height-360]];
var metalArrangement3 = [[vp_width-90,vp_height-88],[vp_width-270,vp_height-88],[vp_width-270,vp_height-148],[vp_width-30,vp_height-300],[vp_width-90,vp_height-300],[vp_width-150,vp_height-300],[vp_width-390,vp_height-300],[vp_width-450,vp_height-300]];

var presentArray =  [[vp_width-150,vp_height-360],[vp_width-390,vp_height-360],[vp_width-420,vp_height-360]]

var maps = [[crateArrangement1,metalArrangement1],[crateArrangement2,metalArrangement2],[crateArrangement3,metalArrangement3]];


// -- Add x and y velocity to an object using matter.js and update release flag 
function apply_velocity(xvel,yvel) {
  launcher.release()
	Matter.Body.setVelocity( fuzzball.body, {x: xvel, y: yvel});
};

// -- Get a random number between the given min and max number
function get_random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

// -- Load all game assets using p5 pre-defined function (preload)
function preload() {
  hitSound = loadSound('assets/Hit.mp3');
  backgroundImg = loadImage('assets/SlamBackground920x690.png');
  crateimg = loadImage('assets/Crate120x120.png');
  fuzimg = loadImage('assets/Fuzzball60x60.png');
  launcherimg = loadImage('assets/Launcher146x108.png');
  metalimg = loadImage('assets/metalbox_thumb.png');
  superFuzzImg = loadImage('assets/super_fuzz.png');
  presentImg   = loadImage('assets/present.png');
}


//Add all objects (fuzzball, launcher & crates) to the screen at the start of the game
function setup(isRestart = false) {

  fuzzBallsRemaining = 7;
  //resets the game to start
  Matter.World.clear(world);
  Matter.Engine.clear(engine);
  crates = [];     
  metalCrates= [];
  //if the game is restarted use previous map else new map
  if (isRestart  === false){randomNumber = get_random(0,maps.length)};
  // Choose map based on random number
  currentCrateArrangement = maps[randomNumber][0]; 
  currentMetalArrangement = maps[randomNumber][1];
  currentPresentPlace = presentArray[randomNumber]
  MAX_CRATES = currentCrateArrangement.length;

	var viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	frameRate(60);

  //Instantiate all classes into objects
	ground = new c_ground(vp_width/2, vp_height-48, vp_width, 20,groundOptions);
  leftwall = new c_ground(vp_width/2 - 465, vp_height/2, 20, vp_height,groundOptions);
  rightwall = new c_ground(vp_width/2 + 470, vp_height/2, 20, vp_height,groundOptions);
  ceiling = new c_ground(vp_width/2, 5, vp_width, 20,groundOptions);
  present = new c_crate(currentPresentPlace[0],currentPresentPlace[1],49,91,presentImg,crateOptions);
  fuzzball = new c_fuzzball(vp_width/2 -300,vp_height-90, 60,fuzimg,superFuzzImg);
  launcher = new c_launcher(vp_width/2 -300,vp_height-180,fuzzball.body);
  launcherBody = new c_ground(vp_width/2 -380,vp_height-90,100, 105,groundOptions);
  fuzzBallsRemainingText = new Text(10,50,'Fuzz Balls - '+fuzzBallsRemaining,30);
  scoreText              = new Text(vp_width/2+300,50,'Score - ',30);
  announceScore = new AnnounceScore('',60);

  // Creates crates and metal crates based on map
	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i] = new c_crate(currentCrateArrangement[i][0], currentCrateArrangement[i][1], 60, 60,crateimg,crateOptions);
	}
  for (let i = 0; i < currentMetalArrangement.length; i++) {
      metalCrates[i] = new c_crate(currentMetalArrangement[i][0],currentMetalArrangement[i][1], 60, 60,metalimg,crateOptions);
      metalCrates[i].makeStatic();
  }
}


//Setting up the background images for the game
function paint_background() {
  image(backgroundImg,0,0,vp_width,vp_height);
  image(launcherimg, vp_width/2 -450,vp_height-150,146, 108);
}

//Showing / updating all the objects (crates, fuzzball, etc.)
function paint_assets() {
	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i].show();
	}
  for(let i = 0; i < metalCrates.length; i++) {
		metalCrates[i].show()
	}
	fuzzball.show();
  showFuzzBalls();
  present.show();
}

//This P5 defined function runs every refresh cycle
function draw() {
  let menu = document.getElementById('menu');
  //Show menu when menuFlag is true
  if(menuFlag === true){
    paint_background();
    menu.style = 'display:block;';
  }else{
    //Update matter engine
    Matter.Engine.update(engine);
    menu.style = 'display:none;'; // Hide menu 
    paint_background();
    paint_assets();
    updateScore();               // Update score each refresh cycle
    fuzzBallStopped();           // Check if the fuzzBall has come to a halt
    collision();                 // Detect collision
    drawLine();                  // Draw a line to aim at the crates
    checkCrates();               // Check if all crates have been destroyed - Win condition
  }
}

//Detecting collision and deleting the crate the fuzzball collided with
function collision(){
  //Checks for collision between two objects using SAT 
  for(let i = 0; i < MAX_CRATES; i++) {
    if (Matter.SAT.collides(fuzzball.body, crates[i].body).collided){
      hitSound.play() ; 
      crates[i].remove()
      crates.splice(i,1)
      MAX_CRATES = MAX_CRATES - 1;
      //Announcing score
      announceScore.text = 10;   
      announceScore.show();
    }
	}
  //Checking if the fuzzball collides with the present 
  if (Matter.SAT.collides(fuzzball.body, present.body).collided){
      present.remove();
	    fuzzball.superFuzz();
  }
}

// -- Checking when the fuzzball comes to a halt, after launching it 
// -- Resetting the fuzzball back into launcher
function fuzzBallStopped(){
  if (abs(fuzzball.body.velocity.x) < 0.1 && abs(fuzzball.body.velocity.y) < 0.1 && releaseFlag==true){
    launcher.launch.bodyB = fuzzball.body //unrelease
    Matter.Body.setPosition(fuzzball.body, { x: vp_width/2 -300, y: vp_height-90}) 
    releaseFlag = false;
    //If fuzzBalls left is 0, bring the menu up - Game over
    if (fuzzBallsRemaining ==0){
      menuFlag = true;
      updateScore('Game Over \n Score : ');
    }
  }
}

//  Allowing the user to drag their mouse to draw a line and aim the fuzzball towards the crate / crates
function drawLine(){
  //Making sure the player hasn't already launched the FuzzBall
  if(releaseFlag === true){
    return;
  }
  //Draws line whilst mouse is pressed
  if (mouseIsPressed === true) {
    if (mouselineFlag==false){ //Saves the intial clickedX and clickedY position
        clickedX = mouseX;
        clickedY = mouseY;
        mouselineFlag=true;
    }
    stroke(255);
    strokeWeight(1);
    line(mouseX, mouseY, clickedX, clickedY);
  }
}

//On mouse release the FuzzBall is launched based on drawline 
function mouseReleased() {
    //Making sure that the player is only allowed to aim once per fuzzBall
    //Making sure you can't shoot when the menu is up / shown 
    if(releaseFlag === true || menuFlag == true){
      return;
    }
    //Resets mouslineflag
    mouselineFlag=false;  
    let widthline = mouseX - clickedX;
    let heightline = mouseY - clickedY;
    
    //Making sure we avoid zeros
    if (widthline ==0 && heightline ==0){ 
      return
    }
    var angle = Math.atan(heightline/widthline)
    // Use length of line to determine velocity
    var magnitude = eval(((widthline)**2+(heightline**2))**(1/2)) / 10; 
    // Restricting velocity
    if (magnitude > 20){
      magnitude = 20
    }
    //Applying velocity to the fuzzball using matter.js / launching the fuzzBall
    apply_velocity(magnitude*Math.cos(angle),magnitude*Math.sin(angle))
    releaseFlag = true;
    //Updating remaining fullBalls
    fuzzBallsRemaining -= 1;
}

//Updates & Displays the current score
function updateScore(txtPreset='Score : '){
  //Constantly updating the score and keeping track
  let score = document.getElementById('score');
  let totalScore  = (currentCrateArrangement.length - crates.length)*10;
  score.innerText = txtPreset + totalScore;
  //Updating the score shown on the screen.
  scoreText.text  = txtPreset + totalScore;
  scoreText.show();
}

// Update the text (label/widget) with how many fuzzballs are remaining
function showFuzzBalls(){ 
  fuzzBallsRemainingText.text = 'Fuzz Balls - ' + fuzzBallsRemaining;
  fuzzBallsRemainingText.show();
}

//Check if the player has destroyed all the crates
function checkCrates(){
  if(crates.length == 0){  //game finish
      fuzzBallsRemainingText.text = 'Fuzz Balls - 0';
      fuzzBallsRemainingText.show();
      menuFlag = true;       //bring up the menu
      updateScore("Congrats! You Win !!! \n Score : ");
  }
}

//Function is triggered when an user clicks on the menu -> start option
function start(){ 
  menuFlag = false;
  setup();
}

//Function is triggered when an user clicks on the menu -> restart option
function restart(){ 
  menuFlag = false;
  let restart = true;
  setup(restart);
}

//Function is triggered when an user clicks on the menu -> restart option
function closeMenu(){
  if(fuzzBallsRemaining === 0 || crates.length === 0){
    return;
  }
  menuFlag = false;
}

//Check if the 'P' key is pressed and show the menu
function keyPressed() {
  if (keyCode === 80) {
    menuFlag = true
   } 
}
