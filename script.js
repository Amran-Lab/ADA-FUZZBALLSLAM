"use strict";

//Screen settings
var vp_width = 920, vp_height = 690;

//Enable matter engine
var world, engine, body;
engine = Matter.Engine.create();
world = engine.world;
body = Matter.Body;

//Game vars
var metalbox;
var metalimg;
var x,y;
//come back to this ->
var mouselineFlag = false;
var releaseFlag = false;
var sampleIsLooping = false;
var startflag = false;
var launcherimg;
var customFont
var launcherBody;
var launcher;
var ceiling;
var rightwall;
var wall;
var ground;
var leftwall;
var rightwall;
var fuzzball;
var back;
var hit
let img;
let crateimg;
let fuzimg;
var crateArray = [[vp_width-60,vp_height-60],[vp_width-180,vp_height-60],[vp_width-120,vp_height-180]];
var crates = [];
var MAX_CRATES = crateArray.length;
var fuzzBallsRemaining = 3;
var fuzzBallsRemainingText;

// -- Add x and y velocity to an object using matter.js
function apply_velocity(xvel,yvel) {
  launcher.release()
  releaseFlag = true
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
  soundFormats('mp3');
  hit = loadSound('assets/Hit.mp3');
  back = loadSound('assets/AmbientLoop.mp3');
  img = loadImage('assets/SlamBackground920x690.png');
  crateimg = loadImage('assets/Crate120x120.png');
  fuzimg = loadImage('assets/Fuzzball60x60.png');
  launcherimg = loadImage('assets/Launcher146x108.png');
  metalimg = loadImage('assets/metalbox_thumb.png')
}


//Add all objects (fuzzball, launcher & crates) to the screen at the start of the game
function setup() {
  MAX_CRATES = crateArray.length;

	//this p5 defined function runs automatically once the preload function is done
	var viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	frameRate(60);

	ground = new c_ground(vp_width/2, vp_height-48, vp_width, 20);
  wall = new c_ground(vp_width/2 - 465, vp_height/2, 20, vp_height);
  rightwall = new c_ground(vp_width/2 + 465, vp_height/2, 20, vp_height);
  ceiling = new c_ground(vp_width/2, 5, vp_width, 20);

	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i] = new c_crate(crateArray[i][0], crateArray[i][1], 60, 60,crateimg);
	}
  //I'll be back in 10 mins, the metal box works perfectly btw
  //metalbox = new MetalBox(crateArray[0][0],crateArray[0][1] - 150, 60, 60,metalimg);

	fuzzball = new c_fuzzball(vp_width/2 -300,vp_height-90, 60);
  launcher = new c_launcher(vp_width/2 -300,vp_height-180,fuzzball.body);
  launcherBody = new c_launcher_body(vp_width/2 -380,vp_height-90,100, 105);
  fuzzBallsRemainingText = new Text(10,50,'Fuzz Balls - '+fuzzBallsRemaining,30);
}


//Setting up the background image for the game
function paint_background() {
	background('#4c738b'); 
  image(img,0,0,vp_width,vp_height);
  fuzzBallsRemainingText.show();
}


//Showing / updating all the objects (crates, fuzzball, etc.)
function paint_assets() {
	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i].show();
	}
	ground.show(); 
  wall.show();
  rightwall.show();
  ceiling.show();
  image(launcherimg, vp_width/2 -450,vp_height-150,146, 108);
  launcherBody.show();
	fuzzball.show();
  //metalbox.show();
     
}


function draw() {
  //this p5 defined function runs every refresh cycle
  let menu = document.getElementById('menu');
	
  if(startflag === false){
    paint_background();
    menu.style = 'display:block;';
  }else{
    menu.style = 'display:none;';
    paint_background();
    Matter.Engine.update(engine);
    paint_assets();
    fuzzBallStopped();
    collision();
    drawLine();
    checkFuzzBalls();  
    checkCrates();
  }
}

//Detecting collision and deleting the crate the fuzzball collided with
function collision(){
  //return fuzzball.body.position
  for(let i = 0; i < MAX_CRATES; i++) {
		//crates[i].show();
    //var fuzz = fuzzball.body()
    if (Matter.SAT.collides(fuzzball.body, crates[i].body).collided){
      console.log(i + "- fuzzball")    
      hit.play()  
      Matter.World.remove(world, crates[i].body)
      crates.splice(i,1)
      MAX_CRATES = MAX_CRATES - 1; 
    }
	}
}

// -- Checking when the fuzzball comes to a hault, after launching it 
// -- Resetting the fuzzball back into launcher
function fuzzBallStopped(){
  if (abs(fuzzball.body.velocity.x) < 0.1 && abs(fuzzball.body.velocity.y) < 0.1 && releaseFlag==true){
    console.log('stopped')
    launcher.launch.bodyB = fuzzball.body //unrelease
    Matter.Body.setPosition(fuzzball.body, { x: vp_width/2 -300, y: vp_height-90}) //resets position
    releaseFlag = false;
    //Updating the number of Fuzzballs remaining
    if (fuzzBallsRemaining ==0){
      fuzzBallsRemaining -= 1;
    }
  }
}

//Start the background music when the user first clicks on the screen
function mouseClicked(){
    if (!sampleIsLooping) {
      //loop our sound element until we
      //call ele.stop() on it.
      //back.loop();
      sampleIsLooping = true;
    } 
}


function mouseReleased() {
    //Making sure that the player is only allowed to aim once per fuzzBall
    //Making sure the function doesn't interrupt with menu clicks
    if(releaseFlag === true || startflag == false){
      return;
    }
    
    mouselineFlag=false;  //resets mouslineflag
    //console.log(arr)
    var arr = [x, y, mouseX, mouseY];
    var widthline = mouseX - x;
    var heightline = mouseY - y;
    
    //Making sure we avoid zeros
    if (widthline ==0 && heightline ==0){ 
      return
    }
    var angle = Math.atan(heightline/widthline)
    //var theta = angle*180/ Math.PI
    // console.log(-theta)
    // Use length of line to determine velocity
    var magnitude = eval(((widthline)**2+(heightline**2))**(1/2)) / 10; 
    // Restricting velocity
    if (magnitude > 20){
      magnitude = 20
    }
    //Applying velocity to the fuzzball using matter.js
    apply_velocity(magnitude*Math.cos(angle),magnitude*Math.sin(angle))
    fuzzBallsRemaining -= 1;
}

// -- Allowing the user to drag their mouse to draw a line to aim the fuzzball towards the crate / crates
function drawLine(){
  //Making sure that the player is only allowed to aim once per fuzzBall
  if(releaseFlag === true){
    return;
  }
  if (mouseIsPressed === true) {
    if (mouselineFlag==false){
        x = mouseX
        y = mouseY
        mouselineFlag=true
  }
    stroke(255);
    strokeWeight(1);
    line(mouseX, mouseY, x, y);
  }
}

// -- Check if the player has ran out of fuzzBalls
// -- Update how many fuzzballs are remaining
function checkFuzzBalls(){
  //Constantly updating the score and keeping track
  let score = document.getElementById('score');
  let totalScore  = (crateArray.length - crates.length)*10;
  score.innerText = "Score : "+totalScore;
  // The text is updated if fuzzballs remaining = 0
  if(fuzzBallsRemaining < 0){
    startflag = false;
    //Updating the fuzzBallsRemainingText to 0
    fuzzBallsRemainingText.text = 'Fuzz Balls - 0'
    fuzzBallsRemainingText.show();
    return;
  }
  //Updating fuzzBallsRemaining text
  fuzzBallsRemainingText.text = 'Fuzz Balls - ' + fuzzBallsRemaining;
  fuzzBallsRemainingText.show();
}

//Check if the player has destroyed all the crates
function checkCrates(){
  if(crates.length == 0){
      fuzzBallsRemainingText.text = 'Fuzz Balls - 0';
      fuzzBallsRemainingText.show();
      startflag = false;
      let score = document.getElementById('score');
      let totalScore  = (fuzzBallsRemaining  + crateArray.length) * 10;
      score.innerText = "Congrats! You Win !!! \n Score : " + totalScore;
  }
}

//Function is triggered when an user clicks on the menu-> start option
function start(){
  startflag = true;
  Matter.World.clear(world);
  Matter.Engine.clear(engine);
  setup();
  fuzzBallsRemaining = 3;
}

//Close the menu down
function closeMenu(){
  startflag = true;
}

//Check if the 'P' key is pressed
function keyPressed() {
  if (keyCode === 80) {
    startflag = false
   } // prevent default
}
