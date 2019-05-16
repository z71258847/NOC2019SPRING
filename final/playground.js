"use strict"
let SIN_ARRAY = [];
let COS_ARRAY = [];
let SINCOS_DETAIL = 1;
let particles=[];
let springs=[];
let p0, p1;
let FROST;
let FIRE;
let MAX_ORBIT=50;
let wave;
let pg;

function setup(){
  FROST = color(50,120,180,100);
  FIRE = color(150,60,40,100);
  for (let a = 0; a < 360; a+= 1/SINCOS_DETAIL){
    SIN_ARRAY.push(sin( radians(a) ));
    COS_ARRAY.push(cos( radians(a) ));
  }
  createCanvas(640, 480);
  pg=createGraphics(width, height);
  background(0);
  wave=new Wave();
}

function draw(){
  background(0);
  pg.background(0,30);
  let p0 = createVector(mouseX, mouseY);
  let p1 = createVector(width-mouseX, height-mouseY);
  wave.update(p0, p1);
  wave.display(pg);
  push();
  blendMode(ADD);
  image(pg, 0, 0);
  pop();
}


function fastSin(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return SIN_ARRAY[index];
}

function fastCos(angle){
  let deg = degrees(angle) % 360;
  let index = int(deg);
  return COS_ARRAY[index];
}
