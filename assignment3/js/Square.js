class Square extends Movable{

	constructor(pos, vel, l, c){
		super(pos, vel);
		this.length=l;
		this.color=c;
	}

	show(){
		push();
		noStroke();
		fill(this.color);
		rectMode(CENTER);
		square(this.pos.x, this.pos.y, this.length);
		pop();
	}

}
