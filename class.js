"use strict";


//Ground class -> used to create and position a rectangle in the form of the ground
class c_ground {
	constructor(x, y, width, height) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
		//this.body.isStatic = true;
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body;
	}

	show() {
		const pos = this.body.position;
		noStroke();
		fill('#ffffff');
    noFill()
		rectMode(CENTER); //switch centre to be centre rather than left, top
		rect(pos.x, pos.y, this.width, this.height);
	}
}


//Crate class -> used to create and position a rectangle in the form of a crate
class c_crate {
	constructor(x, y, width, height,img) {
		let options = {
			restitution: 0.99,
			friction: 0.030,
			density: 0.99,
			frictionAir: 0.032,
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
		this.img = img;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
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
			noStroke();
		  fill('#ffffff');
      //noStroke;
      
      image(this.img,-this.width/2,-this.height/2,this.width, this.height);
			 //switch centre to be centre rather than left, top
			//rect(0, 0, this.width, this.height);
		pop();
	}
}

//Fuzzball class -> used to create and position a circle in the form of a crate
class c_fuzzball {
	constructor(x, y, diameter) {
		let options = {
			restitution: 0.90,
			friction: 0.080,
			density: 0.95,
			frictionAir: 0.005,
		}
		this.body = Matter.Bodies.circle(x, y, diameter/2, options); //matter.js used radius rather than diameter
		Matter.World.add(world, this.body);
		
		this.x = x;
		this.y = y;
		this.diameter = diameter;
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
			//noStroke();
			//fill('#ffffff');
			//ellipseMode(CENTER); //switch centre to be centre rather than left, top
      image(fuzimg,-30,-30,this.width + 50, this.height + 50);
			//circle(0, 0, this.diameter);
		pop();
	}
}

//Launcher class -> used to create and position a circle in the form of a crate
class c_launcher{
  constructor(x, y, body) {
//see docs on https://brm.io/matter-js/docs/classes/Constraint.html#properties
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
  show() {
    //check to see if there is an active body
    if(this.launch.bodyB) {
      let posA = this.launch.pointA; //create an shortcut alias
      let posB = this.launch.bodyB.position;
      stroke("#00ff00"); //set a colour
      line(posA.x, posA.y, posB.x, posB.y); //draw a line between the two points
    }
  } 
}

class c_launcher_body{
  	constructor(x, y, width, height) {
		let options = {
			isStatic: true,
			restitution: 0.99,
			friction: 0.20,
			density: 0.99,
		}
		this.body = Matter.Bodies.rectangle(x, y, width, height, options);
		Matter.World.add(world, this.body);
		//this.body.isStatic = true;
		
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	body() {
		return this.body;
	}

	show() {
		const pos = this.body.position;
		noStroke();
		fill('#ffffff');
    noFill()
		rectMode(CENTER); //switch centre to be centre rather than left, top
		rect(pos.x, pos.y, this.width, this.height);
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
  	
  show(){
      fill(50);
      //Avoiding the white stroke from the aim_line to affect the text
      strokeWeight(0);
      stroke(0);
      textSize(this.size);
      text(this.text,this.x,this.y); 
  }
}

//Menu class - show menu when needed
class Menu{
  constructor(name){
    this.name = name;
  }
  show(){
    
  }
}

class MetalBox extends c_crate{
  	constructor(x, y, width, height,img) {
      super(x,y,width,height,img);
      this.body.isStatic = true;
    }
}

class Present extends c_crate{
  constructor(x,y,width,height,img){
    super(x,y,width,height,img);
  }
}

class super_fuzz extends fuzzball{

}

//collisionfilter{
//mask and category
//}
