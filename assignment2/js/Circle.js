class Circle extends Movable{

	constructor(x, y, vx, vy, r, c){
    super(x, y, vx, vy);
    this.radius=r;
		this.color=c;
	}

  show(){
    noStroke();
    fill(this.color);
    circle(this.x, this.y, this.radius);
  }

}
