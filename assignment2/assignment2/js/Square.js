class Square extends Movable{

	constructor(x, y, vx, vy, l, c){
    super(x, y, vx, vy);
		this.length=l;
		this.color=c;
	}

  show(){
    noStroke();
    fill(this.color);
    square(this.x-this.length/2, this.y-this.length/2, this.length);
  }

}
