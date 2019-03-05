"use strict";

class Movable extends Thing{

	constructor(pos, vel){
		super(pos);
		this.vel = vel;
		this.acc = new p5.Vector(0, 0);
	}

	update(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	checkBoundary(){
		if (this.pos.x>width || this.pos.x<0) this.vel.x*=-1;
		if (this.pos.y>height || this.pos.y<0) this.vel.y*=-1;
	}

	modifySpd(alpha){
		this.vel.mult(alpha);
	}

	applyForce(f){
		this.acc.add(f);
	}

}
