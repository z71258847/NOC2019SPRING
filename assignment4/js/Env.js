class Env{
  constructor(x, y, w, h, color, coefficient){
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
    this.color=color;
    this.c=coefficient;
  }

  display(){
    push();
    translate(this.x, this.y);
    noStroke();
    fill(this.color);
    rect(0, 0, this.w, this.h);
    pop();
  }

  contains(obj){
    let x=obj.pos.x;
    let y=obj.pos.y;
    if (x>=this.x && x<=this.x+this.w && y>=this.y && y<=this.y+this.h) {
      return true;
    }
    return false;
  }
}
