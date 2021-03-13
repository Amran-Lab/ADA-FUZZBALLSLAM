"use strict";

//Ground class -> used to create and position a rectangle in the form of the ground
class c_ground {
	constructor(x, y, width, height,options) {
		this.options = options;
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
	
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body;
	}
}

//Uses properties and methods from c_ground and adds more to it to make it a crate
class c_crate extends c_ground{
  constructor(x,y,width,height,img,options){
    super(x,y,width,height,options)
    this.enabledflag = true;
    this.img         = img;
  }
  remove(){
    Matter.World.remove(world,this.body); // Removes obj from engine / world
    this.enabledflag = false;             // Stops it from being shown / displayed
  }
  makeStatic(){
    this.body.isStatic = true;           //Sets the physics property for metal crates
  }
  //Grabs the position and angle of the body from matter and updates it on the canvas using P5.js
	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
    if (this.enabledflag == false){
    }
    else{
      push(); 
        translate(pos.x, pos.y);
        rotate(angle);
        noStroke();
        fill('#ffffff');
        image(this.img,-this.width/2,-this.height/2,this.width, this.height);
      pop();
    }
	}
}

//Fuzzball class -> used to create and position a circle in the form of a fuzzball
class c_fuzzball {
	constructor(x, y, diameter,fuzzBallImg,superFuzzImg) {
		let options = {
			restitution: 0.90,
			friction: 0.3,
			density: 0.95,
			frictionAir: 0.01,
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter     = diameter;
    this.fuzzBallImg  = fuzzBallImg;
    this.superFuzzImg = superFuzzImg; 
    this.currentImg   = this.fuzzBallImg;
	}

	body() {
		return this.body;
	}

	show() {
		const pos = this.body.position;
		const angle = this.body.angle;
		
		push(); //p5 translation 
			translate(pos.x, pos.y);
			rotate(angle);
      image(this.currentImg,-30,-30,this.width + 50, this.height + 50);
		pop();
	}

  //Changes the properties of the object in matter.js
  superFuzz(){
      this.body.friction    = 0.1;
      this.body.frictionAir = 0.005;
      this.currentImg       = this.superFuzzImg; // Changes the image of the fuzzball
  }
}


//Launcher class contraints fuzzball to launcher until the release method is executed
class c_launcher{
  constructor(x, y, body) {
  let options = {
    pointA: {
        x: x,
        y: y
      },
    bodyB: body,
    stiffness: 0.02,
    length: 80
  }
    //create the contraint
    this.launch = Matter.Constraint.create(options);
    Matter.World.add(world, this.launch); //add to the matter world
  }
  release() {
    //release the constrained body by setting it to null
    this.launch.bodyB = null;
  }

}

//Add text to the screen
class Text{
  constructor(x,y,text,size){
    this.x = x;
    this.y = y;
    this.text = text;
    this.size = size;
  }
  
  //Displays text on canvas at given position and size
  show(){
      fill(50);
      //Avoiding the white stroke from the aim_line to affect the text
      strokeWeight(0);
      stroke(0);
      //Configuring the text and adding it to the screen
      textSize(this.size);
      text(this.text,this.x,this.y); 
  }
}

//Class that will allow score to be announced
class AnnounceScore{
  constructor(text,size){
    this.text           = text;
    this.size           = size;
    this.scoreContainer = document.getElementById('score-announcement-container');
  }
  //Creates a popup with a score announcement that disappears after a fixed amount of time
  show(){
    this.h3             = document.createElement('h3');
    this.h3.className   = 'score-announcement';
    this.scoreContainer.appendChild(this.h3); 
    this.h3.style     = 'font-size:'+this.size+'px;display:block;animation:score-announcement-animation;animation-duration:0.4s;';
    this.h3.innerText = '+'+this.text;
  }
}
