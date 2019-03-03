let objs=[];
let MAXN=300;

function setup() {
    createCanvas(800, 600);
    background(0);
}

function draw() {
  background(0);
  if (mouseIsPressed){
    let temp=int(random(3));
    let c=color(random(255), random(255), random(255), 200);
    let o;
    if (temp==0){
      o=new Triangle(mouseX, mouseY, random(-1,1), random(-1,1), random(2,10), c);
    }
    else if (temp==1){
      o=new Circle(mouseX, mouseY, random(-1,1), random(-1,1), random(1,5), c);
    }
    else if (temp==2){
      o=new Square(mouseX, mouseY, random(-1,1), random(-1,1), random(2,10), c);
    }
    objs.push(o);
    if (objs.length>MAXN) objs.shift();
  }
  for (let i=0; i<objs.length; i++){
    push();
    objs[i].move();
    translate(objs[i].x, objs[i].y)
    rotate(frameCount*0.1);
    translate(-objs[i].x, -objs[i].y)
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
