let objs=[];
let MAXN=200;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0);
  if (mouseIsPressed){
    let temp=int(random(3));
    let c=color(random(255), random(255), random(255), 200);
    let o;
    let mousePos = new p5.Vector(mouseX, mouseY);
    let vel = new p5.Vector(random(-1,1), random(-1, 1));
    if (temp==0){
      o=new Triangle(mousePos, vel, random(3,10), c);
    }
    else if (temp==1){
      o=new Circle(mousePos, vel, random(3,6), c);
    }
    else if (temp==2){
      o=new Square(mousePos, vel, random(3,10), c);
    }
    objs.push(o);
    if (objs.length>MAXN) objs.shift();
  }
  for (let i=0; i<objs.length; i++){
    push();
    objs[i].move();
    translate(objs[i].pos.x, objs[i].pos.y)
    rotate(frameCount*0.1);
    translate(-objs[i].pos.x, -objs[i].pos.y)
    objs[i].checkBoundary();
    objs[i].show();
    pop();
  }
}

function mouseWheel(event){
  if (event.delta<0){
    for (let i=0; i<objs.length; i++){
      objs[i].modifySpd(1.10);
    }
  }
  else if (event.delta>0){
    for (let i=0; i<objs.length; i++){
      objs[i].modifySpd(0.9);
    }
  }

}
