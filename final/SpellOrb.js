class SpellOrb{
  constructor(x, y, s, c){
    this.color=c;
    this.pos=createVector(x, y);
    this.s=s;
    this.center = new Particle(this.pos.x, this.pos.y, this.s, this.color);
    this.orbit = [];
    for (let i=0; i<MAX_ORBIT; i++){
      let xoff = random(-1, 1)*this.s*20;
      let yoff = random(-1, 1)*this.s*20;
      this.orbit.push(new Particle(this.x+xoff, this.y+yoff, this.s/10, this.color));
    }
  }

  update(){
    for (let i=MAX_ORBIT-1; i>=0; i--){
      let p=this.orbit[i];
      p.applyAttraction(this.center);
      p.update();
      let dist = p5.Vector.sub(p.pos, this.center.pos).mag();
      if (dist<this.s*5 || dist > this.s*20){
        this.orbit.splice(i, 1);
      }
    }
    while (this.orbit.length<MAX_ORBIT){
      let xoff = random(-1, 1)*this.s*20;
      let yoff = random(-1, 1)*this.s*20;
      this.orbit.push(new Particle(this.pos.x+xoff, this.pos.y+yoff, this.s/10, this.color));
    }
    if (this.center.s<this.s*2) this.center.s+=0.01;
  }

  display(pg){
    for (let i=0; i<MAX_ORBIT; i++){
      this.orbit[i].display(pg);
    }
    this.center.display(pg);
  }

  setPos(x, y){
    this.pos.x=x;
    this.pos.y=y;
    this.center.setPos(x,y);
  }
}
