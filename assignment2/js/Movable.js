"use strict";

class Movable extends Thing{

		constructor(x, y, vx, vy){
			super(x,y);
			this.xSpd=vx;
			this.ySpd=vy;
		}

    move(){
			this.x += this.xSpd;
			this.y += this.ySpd;
		}

		checkBoundary(){
			if (this.x>width || this.x<0) this.xSpd*=-1;
			if (this.y>height || this.y<0) this.ySpd*=-1;
		}

		modifySpd(alpha){
			this.xSpd *= alpha;
			this.ySpd *= alpha;
		}

}
