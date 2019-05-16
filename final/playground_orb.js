"use strict"
let SIN_ARRAY = [];
let COS_ARRAY = [];
let SINCOS_DETAIL = 1;
let p;
let pg;
let FROST;
let FIRE;
let MAX_ORBIT=50;

function setup(){
  FROST = color(50,120,180,100);
  FIRE = color(150,60,40,100);
  for (let a = 0; a < 360; a+= 1/SINCOS_DETAIL){
    SIN_ARRAY.push(sin( radians(a) ));
    COS_ARRAY.push(cos( radians(a) ));
  }
  createCanvas(640, 480);
  background(0);
  pg=createGraphics(width, height);
  p = new SpellOrb(width/2, height/2, 5, FROST);
}

function draw(){
  background(0);
  pg.background(0, 30);
  p.update();
  p.display(pg);
  p.setPos(mouseX, mouseY);
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
