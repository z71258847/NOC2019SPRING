class Triangle extends Movable{

	constructor(pos, vel, l, c){
		super(pos, vel);
		this.length=l;
		this.color=c;
	}

	show(){
		push();
		noStroke();
		fill(this.color);
		let x1,x2,x3,y1,y2,y3;
		x1=this.pos.x;
		y1=this.pos.y-1/3*Math.sqrt(3)*this.length;
		x2=this.pos.x-0.5*this.length;
		y2=this.pos.y+1/6*Math.sqrt(3)*this.length;
		x3=this.pos.x+0.5*this.length;
		y3=this.pos.y+1/6*Math.sqrt(3)*this.length;
		triangle(x1,y1,x2,y2,x3,y3);
		pop();
	}

}
