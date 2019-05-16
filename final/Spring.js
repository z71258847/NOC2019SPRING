"use strict"

class Spring {
  constructor(o1, o2, len, c){
    this.o1 = o1;
    this.o2 = o2;
    this.len = len;
    this.k = 0.3;
    this.color = c;
  }

  update(){
    let vector = p5.Vector.sub(this.o1.pos, this.o2.pos);
    let distance = vector.mag();
    let direction = vector.copy().normalize();
    let stretch = distance - this.len;

    let force = direction.copy();
    force.mult(-1 * this.k * stretch);
    this.o1.applyForce(force);
    force.mult(-1);
    this.o2.applyForce(force);
    //force.mult(-1);
  }

  display(pg){
    pg.push();
    pg.blendMode(ADD);
    pg.strokeWeight(3);
    pg.stroke(this.color);
    pg.line(this.o1.pos.x, this.o1.pos.y, this.o2.pos.x, this.o2.pos.y);
    pg.pop();
  }
}
