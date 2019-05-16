"use strict"

class Particle{
  constructor(x, y, s, c){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.s = s;
    this.color = c;
  }

  display(pg){
    pg.push();
    pg.blendMode(ADD);
    pg.translate(this.pos.x, this.pos.y);
    pg.noStroke();
    pg.scale(this.s)
    pg.fill(this.color);
    let angle, amp, x, y;
    for (let i=0; i<5; i++){
      amp = 0.5;
      angle = frameCount * 0.01 * i;
      x = fastCos(angle) * amp;
      y = fastSin(angle) * amp;
      pg.ellipse(x, y, i*2, i*2);
    }
    pg.pop();
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(20);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  applyForce(f){
    this.acc.add(f);
  }

  applyAttraction(other){
    let v = p5.Vector.sub(other.pos, this.pos);
    v.mult(0.005);
    this.applyForce(v);
  }

  setPos(x,y){
    this.pos.x=x;
    this.pos.y=y;
  }
}
