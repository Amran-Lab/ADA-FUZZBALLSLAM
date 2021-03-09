"use strict";


var vp_width = 920, vp_height = 690;
var world, engine, body;

var MAX_CRATES = 10;


//enable the matter engine
engine = Matter.Engine.create();
world = engine.world;
body = Matter.Body;
var ceiling;
var rightwall;
var wall;
var ground;
var leftwall;
var rightwall;
var crates = [];
var fuzzball;
let img;
let crateimg;
let fuzimg;

function apply_velocity() {
	Matter.Body.setVelocity( fuzzball.body, {x: 10, y: -5});
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
			x: 0.05, 
			y: -20.5
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
  img = loadImage('assets/SlamBackground920x690.png');
  crateimg = loadImage('assets/Crate120x120.png');
  fuzimg = loadImage('assets/Fuzzball60x60.png');
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
		crates[i] = new c_crate(get_random(100, 700), get_random(0, 300), 120, 120);
	}


	fuzzball = new c_fuzzball(get_random(100, 600), 60, 60);

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
	
	fuzzball.show();
  wall.show()
  rightwall.show()
  ceiling.show()
}


function draw() {
	//this p5 defined function runs every refresh cycle
	paint_background();
	Matter.Engine.update(engine);
	paint_assets();
}
