"use strict"

const G=5;

class Particle{
  constructor(x, y, m, r, color, elasticity){
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.r = r;
    this.mass = m;
    this.color = color;
    this.c=elasticity;
  }

  update(){
    this.vel.add(this.acc);
    this.vel.limit(5);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display(){
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.color);
    ellipse(0, 0, this.r*2, this.r*2);
    pop();
  }

  applyForce(f){
    let force=f.copy();
    force.div(this.mass);
    this.acc.add(force);
  }

  checkCollision(o){
    let v=p5.Vector.sub(o.pos, this.pos)
    let d=v.mag();
    if (d<=this.r+o.r){
      let magnitude;
      v.normalize();
      magnitude = this.vel.mag() * this.c;
      v.mult(magnitude);
      o.applyForce(v);
      v.normalize();
      magnitude = o.vel.mag() * this.c;
      v.mult(-1);
      v.mult(magnitude);
      this.applyForce(v);
      //this.update()
      //o.update()
    }
  }

  applyGAttraction(source){
    let v = p5.Vector.sub(source.pos,this.pos);
    let d = v.mag();
    v.normalize();
    v.mult(G*source.mass*this.mass/d/d);
    this.applyForce(v);
  }

  applyRepulsion(source){
    let v = p5.Vector.sub(source.pos,this.pos);
    let d = v.mag();
    v.normalize();
    v.mult(-G*source.mass*this.mass/d/d);
    this.applyForce(v);
  }

  checkBoundary(){
    if (this.pos.x+this.r>width){
      this.vel.x *= -1;
      this.pos.x = width - this.r;
    }
    if (this.pos.x-this.r<0) {
      this.vel.x *= -1;
      this.pos.x=this.r;
    }
    if (this.pos.y+this.r>height){
      this.vel.y *= -1;
      this.pos.y=height-this.r;
    }
    if (this.pos.y-this.r<0){
      this.vel.y *= -1;
      this.pos.y=this.r;
    }
  }

  setPos(x, y){
    this.pos.x=x;
    this.pos.y=y;
  }

  setMass(m){
    this.mass=m;
  }
}
