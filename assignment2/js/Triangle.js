class Triangle extends Movable{

	constructor(x, y, vx, vy, l, c){
		super(x, y, vx, vy);
		this.length=l;
		this.color=c;
	}

    show(){
    	noStroke();
			fill(this.color);
			let x1,x2,x3,y1,y2,y3;
			x1=this.x;
			y1=this.y-1/3*Math.sqrt(3)*this.length;
			x2=this.x-0.5*this.length;
			y2=this.y+1/6*Math.sqrt(3)*this.length;
			x3=this.x+0.5*this.length;
			y3=this.y+1/6*Math.sqrt(3)*this.length;
			triangle(x1,y1,x2,y2,x3,y3);
		}

}
