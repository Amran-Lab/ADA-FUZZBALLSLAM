"use strict";


var vp_width = 920, vp_height = 690;
var world, engine, body;

var MAX_CRATES = 100;


//enable the matter engine
engine = Matter.Engine.create();
world = engine.world;
body = Matter.Body;

var ground;
var leftwall;
var rightwall;
var crates = [];
var fuzzball;



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
}


function setup() {
	//this p5 defined function runs automatically once the preload function is done
	var viewport = createCanvas(vp_width, vp_height); //set the viewport (canvas) size
	viewport.parent("viewport_container"); //move the canvas so it’s inside the target div
	
	frameRate(60);

	ground = new c_ground(vp_width/2, vp_height-10, vp_width-100, 20);
	
	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i] = new c_crate(get_random(100, 700), get_random(0, 300), get_random(15, 25), get_random(15, 25));
	}


	fuzzball = new c_fuzzball(get_random(100, 600), get_random(100, 300), 30);

}


function paint_background() {
	//access the game object for the world, use this as a background image for the game
	background('#4c738b'); 
}


function paint_assets() {
	ground.show();

	for(let i = 0; i < MAX_CRATES; i++) {
		crates[i].show();
	}
	
	fuzzball.show();
}


function draw() {
	//this p5 defined function runs every refresh cycle
	paint_background();
	Matter.Engine.update(engine);
	paint_assets();
}
