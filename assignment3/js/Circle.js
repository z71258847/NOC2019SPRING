class Circle extends Movable{

	constructor(pos, vel, r, c){
		super(pos, vel);
		this.radius=r;
		this.color=c;
	}

	show(){
		push();
		noStroke();
		fill(this.color);
		circle(this.pos.x, this.pos.y, this.radius);
		pop();
	}

}
