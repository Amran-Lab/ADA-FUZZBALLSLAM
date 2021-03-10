"use strict";


var vp_width = 920, vp_height = 690;
var world, engine, body;



//enable the matter engine
engine = Matter.Engine.create();
world = engine.world;
body = Matter.Body;
var x,y;
var mouselineFlag = false
var releaseFlag = false
var launcherimg;
var launcherBody;
var launcher;
var ceiling;
var rightwall;
var wall;
var ground;
var leftwall;
var rightwall;
var crates = [];
var fuzzball;
var back;
var hit
let img;
let crateimg;
let fuzimg;
var sampleIsLooping = false;
var crateArray = [[vp_width-60,vp_height-60],[vp_width-180,vp_height-60],[vp_width-120,vp_height-180]];
var MAX_CRATES = crateArray.length;

function apply_velocity(xvel,yvel) {
  launcher.release()
  releaseFlag = true
	Matter.Body.setVelocity( fuzzball.body, {x: xvel, y: yvel});
};


function apply_angularvelocity() {

	for(let i = 0; i < MAX_CRATES; i++) {
		Matter.Body.setAngularVelocity( crates[i].body, Math.PI/6);
	}

};

function apply_force() {

	for(let i = 0; i < MAX_CRATES; i++) {
    
		Matter.Body.applyForce( crates[i].body, {
			x: crates[i].body.position.x, 
			y: crates[i].body.position.y
		}, {
			x: 10.05, 
			y: -200.5
		});

	}
};


function get_random(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function preload() {
	//p5 defined function
  soundFormats('mp3');
  hit = loadSound('assets/Hit.mp3');
  back = loadSound('assets/AmbientLoop.mp3');
  img = loadImage('assets/SlamBackground920x690.png');
  crateimg = loadImage('assets/Crate120x120.png');
  fuzimg = loadImage('assets/Fuzzball60x60.png');
  launcherimg = loadImage('assets/Launcher146x108.png');
  
}


function setup() {
	//this p5 defined function runs automatically once the preload function is done
	var viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	frameRate(60);

	ground = new c_ground(vp_width/2, vp_height-48, vp_width, 20);
  wall = new c_ground(vp_width/2 - 465, vp_height/2, 20, vp_height);
  rightwall = new c_ground(vp_width/2 + 465, vp_height/2, 20, vp_height);
  ceiling = new c_ground(vp_width/2, 5, vp_width, 20);

	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i] = new c_crate(crateArray[i][0], crateArray[i][1], 60, 60);
	}


	fuzzball = new c_fuzzball(vp_width/2 -300,vp_height-90, 60);
  launcher = new c_launcher(vp_width/2 -300,vp_height-180,fuzzball.body)
  launcherBody = new c_launcher_body(vp_width/2 -380,vp_height-90,100, 105);
}


function paint_background() {
	//access the game object for the world, use this as a background image for the game
	background('#4c738b'); 
  image(img,0,0,vp_width,vp_height)

}


function paint_assets() {
	ground.show();

	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i].show();
	}
	image(launcherimg, vp_width/2 -450,vp_height-150,146, 108);
	fuzzball.show();
  wall.show()
  rightwall.show()
  ceiling.show()
  launcherBody.show()
 
  
}


function draw() {
  //this p5 defined function runs every refresh cycle
	paint_background();
	Matter.Engine.update(engine);
	paint_assets();
  fuzzBallStopped();
  collision();
  drawLine();
 
}

//Detecting collision and deleting the crate the fuzzball collided with
function collision(){
  //return fuzzball.body.position
  for(let i = 0; i < MAX_CRATES; i++) {
		//crates[i].show();
    //var fuzz = fuzzball.body()
    if (Matter.SAT.collides(fuzzball.body, crates[i].body).collided){
      console.log(i + "- fuzzball")    
      //hit.play()  
      Matter.World.remove(world, crates[i].body)
      crates.splice(i,1)
      MAX_CRATES = MAX_CRATES - 1  
    }
	}
  
  
}

// -- Checking when the fuzzball comes to a hault, after launching it 
// -- Resetting the fuzzball back into launcher
function fuzzBallStopped(){
  if (abs(fuzzball.body.velocity.x) < 0.1 && abs(fuzzball.body.velocity.y) < 0.1 && releaseFlag==true){
    console.log('stopped')
    launcher.launch.bodyB = fuzzball.body
    Matter.Body.setPosition(fuzzball.body, { x: vp_width/2 -300, y: vp_height-90})
    releaseFlag = false
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
  mouselineFlag=false
  var arr = [x, y, mouseX, mouseY]
  var widthline = mouseX - x
  var heightline = mouseY - y
  console.log(heightline + "h")
  console.log(widthline + "h")
  if (widthline ==0 && heightline ==0){ // diving by 0 bad
    return
  }
  var angle = Math.atan(heightline/widthline)
  //var theta = angle*180/ Math.PI
  // console.log(-theta)
  // Use length of line to determine velocity
  var magnitude = eval(((widthline)**2+(heightline**2))**(1/2)) / 10; //its too sensitive 
  // Restricting velocity
  if (magnitude > 20){
    magnitude = 20
  }

  apply_velocity(magnitude*Math.cos(angle),magnitude*Math.sin(angle))
}

//
function drawLine(){
  if (mouseIsPressed === true) {
    if (mouselineFlag==false){
        x = mouseX
        y = mouseY
        mouselineFlag=true
  }
  stroke(255)
  line(mouseX, mouseY, x, y);
  }
}