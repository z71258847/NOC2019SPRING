"use strict";

class Movable extends Thing{

	constructor(pos, vel, acc){
		super(pos);
		this.vel = vel;
		if (typeof acc=='undefined'){
			this.acc = p5.Vector(0, 0);
		}
		else {
			this.acc = acc;
		}
	}

	move(){
		this.vel.add(this.acc);
		this.pos.add(this.vel);
	}

	checkBoundary(){
		if (this.pos.x>width || this.pos.x<0) this.vel.x*=-1;
		if (this.pos.y>height || this.pos.y<0) this.vel.y*=-1;
	}

	modifySpd(alpha){
		this.vel.mult(alpha);
	}

}
